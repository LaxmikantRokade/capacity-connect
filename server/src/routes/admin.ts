import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// GET /api/admin/metrics - Analytics summary based on real database records
router.get('/metrics', authenticateToken, requireRole(['ADMIN', 'MANAGER']), async (req: AuthRequest, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalLearners = await prisma.user.count({ where: { role: 'LEARNER' } });
    const totalCourses = await prisma.course.count();
    const totalEnrollments = await prisma.enrollment.count();
    const completedEnrollments = await prisma.enrollment.count({ where: { status: 'COMPLETED' } });
    const totalCertificates = await prisma.certificate.count();
    const totalSessions = await prisma.trainingSession.count();

    const completionRate = totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0;

    // Department-wise distribution
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: { users: true, courses: true },
        },
      },
    });

    const departmentStats = departments.map((d) => ({
      id: d.id,
      name: d.name,
      code: d.code,
      userCount: d._count.users,
      courseCount: d._count.courses,
    }));

    // Skill gaps analysis
    const userSkills = await prisma.userSkill.findMany({
      include: { skill: true },
    });

    const skillGapMap: Record<string, { totalTarget: number; totalCurrent: number; count: number; name: string }> = {};
    userSkills.forEach((us) => {
      const current = us.verifiedProficiency || us.selfProficiency;
      if (!skillGapMap[us.skillId]) {
        skillGapMap[us.skillId] = {
          name: us.skill.name,
          totalTarget: 0,
          totalCurrent: 0,
          count: 0,
        };
      }
      skillGapMap[us.skillId].totalTarget += us.targetProficiency;
      skillGapMap[us.skillId].totalCurrent += current;
      skillGapMap[us.skillId].count += 1;
    });

    const skillGapSummary = Object.values(skillGapMap).map((item) => ({
      skill: item.name,
      avgCurrent: Number((item.totalCurrent / item.count).toFixed(1)),
      avgTarget: Number((item.totalTarget / item.count).toFixed(1)),
      gap: Number(((item.totalTarget - item.totalCurrent) / item.count).toFixed(1)),
    }));

    return res.json({
      totalUsers,
      totalLearners,
      totalCourses,
      totalEnrollments,
      completedEnrollments,
      completionRate,
      totalCertificates,
      totalSessions,
      departmentStats,
      skillGapSummary,
    });
  } catch (err: any) {
    console.error('Error fetching admin metrics:', err);
    return res.status(500).json({ error: 'Failed to fetch administrative metrics' });
  }
});

// GET /api/admin/users
router.get('/users', authenticateToken, requireRole(['ADMIN', 'MANAGER']), async (req: AuthRequest, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        jobRole: true,
        department: { select: { id: true, name: true, code: true } },
        _count: { select: { enrollments: true, certificates: true, skills: true } },
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(users);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST /api/admin/assign-course - Assign course to learner or entire department
router.post('/assign-course', authenticateToken, requireRole(['ADMIN', 'MANAGER']), async (req: AuthRequest, res) => {
  try {
    const { courseId, userId, departmentId } = req.body;
    if (!courseId || (!userId && !departmentId)) {
      return res.status(400).json({ error: 'Course and either userId or departmentId are required' });
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return res.status(404).json({ error: 'Course not found' });

    let targetUserIds: string[] = [];
    if (userId) {
      targetUserIds = [userId];
    } else if (departmentId) {
      const deptUsers = await prisma.user.findMany({
        where: { departmentId },
        select: { id: true },
      });
      targetUserIds = deptUsers.map((u) => u.id);
    }

    let assignedCount = 0;
    for (const uid of targetUserIds) {
      const existing = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: uid, courseId } },
      });
      if (!existing) {
        await prisma.enrollment.create({
          data: {
            userId: uid,
            courseId,
            status: 'ENROLLED',
            progressPercent: 0,
          },
        });
        await prisma.notification.create({
          data: {
            userId: uid,
            title: 'Course Assigned by Management',
            message: `You have been officially assigned to complete "${course.title}".`,
            type: 'INFO',
            link: `/learning/${courseId}`,
          },
        });
        assignedCount++;
      }
    }

    return res.json({
      success: true,
      assignedCount,
      message: `Course assigned to ${assignedCount} learner(s).`,
    });
  } catch (err: any) {
    console.error('Course assignment error:', err);
    return res.status(500).json({ error: 'Failed to assign course' });
  }
});

export default router;
