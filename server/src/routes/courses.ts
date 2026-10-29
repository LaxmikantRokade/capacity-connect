import { Router } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

type CourseWithInstructorAndDept = Prisma.CourseGetPayload<{
  include: {
    instructor: { select: { id: true; name: true; role: true } };
    department: { select: { id: true; name: true } };
    _count: { select: { enrollments: true; modules: true } };
  };
}>;

// GET /api/courses
router.get('/', async (req, res) => {
  try {
    const { category, level, search } = req.query;

    const where: Prisma.CourseWhereInput = { isPublished: true };
    if (category && category !== 'All') {
      where.category = String(category);
    }
    if (level && level !== 'All') {
      where.level = String(level);
    }
    if (search) {
      const q = String(search);
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { code: { contains: q } },
      ];
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        instructor: { select: { id: true, name: true, role: true } },
        department: { select: { id: true, name: true } },
        _count: { select: { enrollments: true, modules: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = courses.map((c: CourseWithInstructorAndDept) => ({
      ...c,
      learningObjectives: JSON.parse(c.learningObjectives || '[]'),
      instructorName: c.instructor?.name || 'Lead Instructor',
      departmentName: c.department?.name,
      enrollmentCount: c._count.enrollments,
      moduleCount: c._count.modules,
    }));

    return res.json(formatted);
  } catch (err: any) {
    console.error('Error fetching courses:', err);
    return res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// GET /api/courses/:id
router.get('/:id', async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: {
        instructor: { select: { id: true, name: true, bio: true, avatarUrl: true } },
        department: true,
        modules: { orderBy: { orderIndex: 'asc' } },
        assessments: { select: { id: true, title: true, passPercentage: true, timeLimitMinutes: true } },
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    return res.json({
      ...course,
      learningObjectives: JSON.parse(course.learningObjectives || '[]'),
      instructorName: course.instructor?.name || 'Lead Instructor',
      departmentName: course.department?.name,
      assessmentId: course.assessments[0]?.id,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch course details' });
  }
});

// POST /api/courses/:id/enroll
router.post('/:id/enroll', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user!.id;

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (existing) {
      return res.json({ success: true, enrollment: existing, message: 'Already enrolled' });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        status: 'ENROLLED',
        progressPercent: 0,
      },
    });

    // Create In-App Notification
    await prisma.notification.create({
      data: {
        userId,
        title: 'Course Enrollment Confirmed',
        message: `You are enrolled in "${course.title}". Start with Module 1!`,
        type: 'SUCCESS',
        link: `/learning/${courseId}`,
      },
    });

    return res.status(201).json({ success: true, enrollment });
  } catch (err: any) {
    console.error('Enrollment error:', err);
    return res.status(500).json({ error: 'Failed to enroll in course' });
  }
});

// POST /api/courses/:id/modules/:moduleId/complete
router.post('/:id/modules/:moduleId/complete', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id: courseId, moduleId } = req.params;
    const userId = req.user!.id;

    let enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (!enrollment) {
      enrollment = await prisma.enrollment.create({
        data: {
          userId,
          courseId,
          status: 'IN_PROGRESS',
        },
      });
    }

    // Mark module completed in ModuleProgress
    await prisma.moduleProgress.upsert({
      where: {
        enrollmentId_moduleId: {
          enrollmentId: enrollment.id,
          moduleId,
        },
      },
      update: { completed: true, completedAt: new Date() },
      create: {
        enrollmentId: enrollment.id,
        moduleId,
        completed: true,
        completedAt: new Date(),
      },
    });

    const totalModules = await prisma.courseModule.count({ where: { courseId } });
    const completedCount = await prisma.moduleProgress.count({
      where: { enrollmentId: enrollment.id, completed: true },
    });

    const progressPercent = totalModules > 0 ? Math.min(100, Math.round((completedCount / totalModules) * 100)) : 100;
    const isFinished = progressPercent === 100;

    const updated = await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progressPercent,
        status: isFinished ? 'COMPLETED' : 'IN_PROGRESS',
        completedAt: isFinished ? new Date() : null,
      },
    });

    return res.json({ success: true, progressPercent, status: updated.status });
  } catch (err: any) {
    console.error('Module completion error:', err);
    return res.status(500).json({ error: 'Failed to update module progress' });
  }
});

export default router;
