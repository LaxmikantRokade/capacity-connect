import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// GET /api/knowledge/articles
router.get('/articles', async (req, res) => {
  try {
    const { search, category } = req.query;
    const where: any = { isPublished: true };

    if (category && category !== 'All') {
      where.category = String(category);
    }

    if (search) {
      const q = String(search);
      where.OR = [
        { title: { contains: q } },
        { summary: { contains: q } },
        { content: { contains: q } },
        { tags: { contains: q } },
      ];
    }

    const articles = await prisma.knowledgeArticle.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, jobRole: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = articles.map((a) => ({
      ...a,
      authorName: a.author.name,
      tags: a.tags ? a.tags.split(',').map((t) => t.trim()) : [],
    }));

    return res.json(formatted);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch knowledge articles' });
  }
});

// GET /api/knowledge/articles/:slug
router.get('/articles/:slug', async (req, res) => {
  try {
    const article = await prisma.knowledgeArticle.findUnique({
      where: { slug: req.params.slug },
      include: {
        author: { select: { id: true, name: true, jobRole: true, role: true } },
        comments: {
          include: { user: { select: { name: true, role: true, avatarUrl: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Increment view count
    await prisma.knowledgeArticle.update({
      where: { id: article.id },
      data: { viewsCount: { increment: 1 } },
    });

    return res.json({
      ...article,
      authorName: article.author.name,
      tags: article.tags ? article.tags.split(',').map((t) => t.trim()) : [],
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// POST /api/knowledge/articles
router.post('/articles', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title, summary, content, category, tags } = req.body;
    if (!title || !summary || !content || !category) {
      return res.status(400).json({ error: 'Title, summary, content, and category are required' });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;

    const tagsString = Array.isArray(tags) ? tags.join(', ') : (tags || '');

    const newArticle = await prisma.knowledgeArticle.create({
      data: {
        title,
        slug,
        summary,
        content,
        category,
        tags: tagsString,
        authorId: req.user!.id,
      },
      include: {
        author: { select: { name: true } },
      },
    });

    return res.status(201).json({
      ...newArticle,
      authorName: newArticle.author.name,
      tags: tagsString.split(',').map((t: string) => t.trim()),
    });
  } catch (err: any) {
    console.error('Error creating article:', err);
    return res.status(500).json({ error: 'Failed to publish knowledge article' });
  }
});

export default router;
