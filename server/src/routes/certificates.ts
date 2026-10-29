import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// GET /api/certificates/my
router.get('/my', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const certificates = await prisma.certificate.findMany({
      where: { userId: req.user!.id },
      include: {
        course: { select: { title: true, code: true } },
        user: { select: { name: true } },
      },
      orderBy: { issueDate: 'desc' },
    });

    const formatted = certificates.map((c) => ({
      id: c.id,
      certificateNumber: c.certificateNumber,
      userId: c.userId,
      userName: c.user.name,
      courseId: c.courseId,
      courseTitle: c.course.title,
      issueDate: c.issueDate,
      grade: c.grade,
      verificationHash: c.verificationHash,
    }));

    return res.json(formatted);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// GET /api/certificates/verify/:certNumber - Public verification endpoint
router.get('/verify/:certNumber', async (req, res) => {
  try {
    const cert = await prisma.certificate.findFirst({
      where: { certificateNumber: req.params.certNumber },
      include: {
        course: { select: { title: true, code: true, durationMinutes: true } },
        user: { select: { name: true, jobRole: true, department: { select: { name: true } } } },
      },
    });

    if (!cert) {
      return res.status(404).json({ valid: false, error: 'Certificate record not found or unverified' });
    }

    return res.json({
      valid: true,
      certificate: {
        certificateNumber: cert.certificateNumber,
        userName: cert.user.name,
        department: cert.user.department?.name,
        courseTitle: cert.course.title,
        courseCode: cert.course.code,
        issueDate: cert.issueDate,
        grade: cert.grade,
        verificationHash: cert.verificationHash,
        issuer: 'Capacity Connect National Capability Accreditation Cell',
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to verify certificate' });
  }
});

export default router;
