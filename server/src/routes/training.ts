import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// GET /api/training/sessions
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await prisma.trainingSession.findMany({
      include: {
        instructor: { select: { id: true, name: true, jobRole: true, avatarUrl: true } },
        _count: { select: { registrations: true } },
      },
      orderBy: { startTime: 'asc' },
    });

    const formatted = sessions.map((s) => ({
      ...s,
      instructorName: s.instructor?.name || 'Faculty Lead',
      enrolledCount: s._count.registrations,
    }));

    return res.json(formatted);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch training sessions' });
  }
});

// POST /api/training/sessions/:id/register
router.post('/sessions/:id/register', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user!.id;

    const session = await prisma.trainingSession.findUnique({
      where: { id: sessionId },
      include: {
        _count: { select: { registrations: true } },
      },
    });

    if (!session) {
      return res.status(404).json({ error: 'Training session not found' });
    }

    if (session._count.registrations >= session.capacity) {
      return res.status(400).json({ error: 'This training session is at maximum capacity' });
    }

    const existing = await prisma.sessionRegistration.findUnique({
      where: { sessionId_userId: { sessionId, userId } },
    });

    if (existing) {
      return res.status(409).json({ error: 'You are already registered for this workshop' });
    }

    const registration = await prisma.sessionRegistration.create({
      data: {
        sessionId,
        userId,
      },
    });

    await prisma.notification.create({
      data: {
        userId,
        title: 'Training Workshop Registration Confirmed',
        message: `Your seat in "${session.title}" (${session.modality}) is confirmed.`,
        type: 'SUCCESS',
        link: '/training',
      },
    });

    return res.status(201).json({ success: true, registration });
  } catch (err: any) {
    console.error('Session registration error:', err);
    return res.status(500).json({ error: 'Failed to register for training session' });
  }
});

// POST /api/training/sessions - Create session (Trainer, Admin, Manager)
router.post('/sessions', authenticateToken, requireRole(['TRAINER', 'ADMIN', 'MANAGER']), async (req: AuthRequest, res) => {
  try {
    const { title, description, modality, locationOrUrl, startTime, endTime, capacity } = req.body;
    if (!title || !description || !locationOrUrl || !startTime || !endTime) {
      return res.status(400).json({ error: 'Missing required session parameters' });
    }

    const newSession = await prisma.trainingSession.create({
      data: {
        title,
        description,
        modality: modality || 'ONLINE',
        locationOrUrl,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        capacity: Number(capacity) || 30,
        instructorId: req.user!.id,
      },
    });

    return res.status(201).json({ success: true, session: newSession });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create training session' });
  }
});

export default router;
