import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// GET /api/assessments/course/:courseId
router.get('/course/:courseId', async (req, res) => {
  try {
    const assessment = await prisma.assessment.findFirst({
      where: { courseId: req.params.courseId },
      include: {
        course: { select: { id: true, title: true, code: true } },
        questions: {
          orderBy: { orderIndex: 'asc' },
          select: {
            id: true,
            assessmentId: true,
            questionText: true,
            orderIndex: true,
            options: true,
            // Do not expose correctOptionIndex during quiz taking
            explanation: true,
          },
        },
      },
    });

    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found for this course' });
    }

    const formatted = {
      ...assessment,
      courseTitle: assessment.course.title,
      questions: assessment.questions.map((q) => ({
        ...q,
        options: JSON.parse(q.options || '[]'),
      })),
    };

    return res.json(formatted);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch assessment' });
  }
});

// POST /api/assessments/:id/submit
router.post('/:id/submit', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const assessmentId = req.params.id;
    const userId = req.user!.id;
    const { answers } = req.body; // array of { questionId, selectedOption }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers must be provided as an array' });
    }

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        course: true,
        questions: true,
      },
    });

    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    let correctCount = 0;
    const totalQuestions = assessment.questions.length;

    const detailedAnswers = assessment.questions.map((q) => {
      const userAns = answers.find((a: any) => a.questionId === q.id);
      const selectedOption = userAns ? Number(userAns.selectedOption) : -1;
      const isCorrect = selectedOption === q.correctOptionIndex;
      if (isCorrect) correctCount++;

      return {
        questionId: q.id,
        questionText: q.questionText,
        options: JSON.parse(q.options || '[]'),
        selectedOption,
        correctOptionIndex: q.correctOptionIndex,
        explanation: q.explanation,
        isCorrect,
      };
    });

    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = percentage >= assessment.passPercentage;

    // Save attempt
    const attempt = await prisma.assessmentAttempt.create({
      data: {
        assessmentId,
        userId,
        score: correctCount,
        maxScore: totalQuestions,
        percentage,
        passed,
        answersJson: JSON.stringify(detailedAnswers),
      },
    });

    // If passed, issue verifiable certificate if not already issued
    let certificateIssued = false;
    let certificate = null;

    if (passed) {
      const existingCert = await prisma.certificate.findUnique({
        where: { userId_courseId: { userId, courseId: assessment.courseId } },
      });

      if (!existingCert) {
        const certNumber = `CC-2026-${assessment.course.code.replace(/[^A-Za-z0-9]/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
        const verificationHash = crypto
          .createHash('sha256')
          .update(`${certNumber}-${userId}-${Date.now()}`)
          .digest('hex');

        certificate = await prisma.certificate.create({
          data: {
            certificateNumber: certNumber,
            userId,
            courseId: assessment.courseId,
            grade: `Passed with Honors (${percentage}%)`,
            verificationHash,
          },
        });
        certificateIssued = true;

        await prisma.notification.create({
          data: {
            userId,
            title: 'Verifiable Certificate Issued!',
            message: `You passed "${assessment.title}" with ${percentage}%. Your credential (${certNumber}) is ready to download!`,
            type: 'SUCCESS',
            link: '/certificates',
          },
        });
      }
    }

    return res.json({
      attemptId: attempt.id,
      score: correctCount,
      maxScore: totalQuestions,
      percentage,
      passed,
      passPercentage: assessment.passPercentage,
      detailedAnswers,
      certificateIssued,
      certificate,
    });
  } catch (err: any) {
    console.error('Assessment submission error:', err);
    return res.status(500).json({ error: 'Failed to process assessment submission' });
  }
});

// GET /api/assessments/attempts/my
router.get('/attempts/my', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const attempts = await prisma.assessmentAttempt.findMany({
      where: { userId: req.user!.id },
      include: {
        assessment: { select: { title: true, passPercentage: true, courseId: true } },
      },
      orderBy: { submittedAt: 'desc' },
    });

    return res.json(attempts);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch assessment attempts' });
  }
});

export default router;
