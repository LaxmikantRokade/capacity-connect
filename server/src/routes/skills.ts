import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// GET /api/skills - All master skills
router.get('/', async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { category: 'asc' },
    });
    return res.json(skills);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch skills directory' });
  }
});

// GET /api/skills/user/:userId
router.get('/user/:userId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.params.userId === 'me' ? req.user!.id : req.params.userId;
    const userSkills = await prisma.userSkill.findMany({
      where: { userId },
      include: {
        skill: true,
      },
    });

    const formatted = userSkills.map((us) => ({
      id: us.id,
      userId: us.userId,
      skillId: us.skillId,
      skillName: us.skill.name,
      category: us.skill.category,
      selfProficiency: us.selfProficiency,
      verifiedProficiency: us.verifiedProficiency,
      verifiedBy: us.verifiedBy,
      verifiedAt: us.verifiedAt,
      targetProficiency: us.targetProficiency,
      notes: us.notes,
      updatedAt: us.updatedAt,
    }));

    return res.json(formatted);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch user skills' });
  }
});

// PUT /api/skills/user/:skillId - Self-assessment update
router.put('/user/:skillId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const skillId = req.params.skillId;
    const userId = req.user!.id;
    const { selfProficiency, targetProficiency, notes } = req.body;

    const selfLevel = Math.max(1, Math.min(5, Number(selfProficiency) || 1));
    const targetLevel = Math.max(1, Math.min(5, Number(targetProficiency) || 3));

    const updated = await prisma.userSkill.upsert({
      where: { userId_skillId: { userId, skillId } },
      update: {
        selfProficiency: selfLevel,
        targetProficiency: targetLevel,
        notes: notes || undefined,
      },
      create: {
        userId,
        skillId,
        selfProficiency: selfLevel,
        targetProficiency: targetLevel,
        notes: notes || null,
      },
      include: { skill: true },
    });

    return res.json({
      id: updated.id,
      userId: updated.userId,
      skillId: updated.skillId,
      skillName: updated.skill.name,
      category: updated.skill.category,
      selfProficiency: updated.selfProficiency,
      verifiedProficiency: updated.verifiedProficiency,
      verifiedBy: updated.verifiedBy,
      targetProficiency: updated.targetProficiency,
      notes: updated.notes,
      updatedAt: updated.updatedAt,
    });
  } catch (err: any) {
    console.error('Self-assessment update error:', err);
    return res.status(500).json({ error: 'Failed to update self-assessment' });
  }
});

// POST /api/skills/verify/:userSkillId - Manager / Trainer verification
router.post('/verify/:userSkillId', authenticateToken, requireRole(['MANAGER', 'TRAINER', 'ADMIN']), async (req: AuthRequest, res) => {
  try {
    const { userSkillId } = req.params;
    const { verifiedProficiency, notes } = req.body;

    const verifiedLevel = Math.max(1, Math.min(5, Number(verifiedProficiency)));
    const verifierName = `${req.user!.name} (${req.user!.role})`;

    const record = await prisma.userSkill.update({
      where: { id: userSkillId },
      data: {
        verifiedProficiency: verifiedLevel,
        verifiedBy: verifierName,
        verifiedAt: new Date(),
        notes: notes || undefined,
      },
      include: { skill: true, user: true },
    });

    // Notify learner of verified rating
    await prisma.notification.create({
      data: {
        userId: record.userId,
        title: 'Competency Assessment Verified',
        message: `${verifierName} officially evaluated your proficiency in "${record.skill.name}" at Level ${verifiedLevel}/5.`,
        type: 'INFO',
        link: '/skills',
      },
    });

    return res.json({
      success: true,
      userSkill: {
        id: record.id,
        userId: record.userId,
        skillId: record.skillId,
        skillName: record.skill.name,
        category: record.skill.category,
        selfProficiency: record.selfProficiency,
        verifiedProficiency: record.verifiedProficiency,
        verifiedBy: record.verifiedBy,
        verifiedAt: record.verifiedAt,
        targetProficiency: record.targetProficiency,
        notes: record.notes,
        updatedAt: record.updatedAt,
      },
    });
  } catch (err: any) {
    console.error('Skill verification error:', err);
    return res.status(500).json({ error: 'Failed to verify skill proficiency' });
  }
});

export default router;
