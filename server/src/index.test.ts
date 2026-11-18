import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './index.js';

describe('Capacity Connect Server Health & API Endpoints', () => {
  it('GET /health should return ok with SIH26075 metadata', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.project).toBe('CAPACITY CONNECT');
    expect(res.body.problemStatementId).toBe('SIH26075');
  });

  it('GET /api/health should return ok with SIH26075 metadata', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.project).toBe('CAPACITY CONNECT');
    expect(res.body.problemStatementId).toBe('SIH26075');
  });

  it('GET /api/courses should return published courses', async () => {
    const res = await request(app).get('/api/courses');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(9);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('title');
      expect(res.body[0]).toHaveProperty('code');
    }
  });

  it('GET /api/courses/course-5 should return Python Programming Basics with 6 modules and verified videos', async () => {
    const res = await request(app).get('/api/courses/course-5');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('course-5');
    expect(res.body.title).toBe('Python Programming Basics');
    expect(res.body.modules).toBeDefined();
    expect(res.body.modules.length).toBe(6);
    const videoModules = res.body.modules.filter((m: any) => m.contentType === 'VIDEO');
    expect(videoModules.length).toBeGreaterThan(0);
    videoModules.forEach((m: any) => {
      expect(m.videoUrl).toMatch(/^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]{11}/);
      expect(m.videoUrl).not.toContain('dQw4w9WgXcQ');
    });
  });

  it('GET /api/assessments/course/course-5 should return Python assessment with questions', async () => {
    const res = await request(app).get('/api/assessments/course/course-5');
    expect(res.status).toBe(200);
    expect(res.body.title).toContain('Python');
    expect(Array.isArray(res.body.questions)).toBe(true);
    expect(res.body.questions.length).toBeGreaterThan(0);
  });

  it('GET /api/courses/course-2 should return course with valid modules and verified educational video URLs', async () => {
    const res = await request(app).get('/api/courses/course-2');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('course-2');
    expect(res.body.modules).toBeDefined();
    expect(Array.isArray(res.body.modules)).toBe(true);
    expect(res.body.modules.length).toBe(4);
    const videoModules = res.body.modules.filter((m: any) => m.contentType === 'VIDEO');
    expect(videoModules.length).toBeGreaterThan(0);
    videoModules.forEach((m: any) => {
      expect(m.videoUrl).toMatch(/^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]{11}/);
      expect(m.videoUrl).not.toContain('dQw4w9WgXcQ'); // Not a Rickroll
    });
  });

  it('GET /api/courses/course-1 should not contain random or placeholder video URLs', async () => {
    const res = await request(app).get('/api/courses/course-1');
    expect(res.status).toBe(200);
    expect(res.body.modules.length).toBe(4);
    const videoModules = res.body.modules.filter((m: any) => m.contentType === 'VIDEO');
    videoModules.forEach((m: any) => {
      expect(m.videoUrl).not.toContain('dQw4w9WgXcQ'); // Rickroll removed
      expect(m.videoUrl).toMatch(/^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]{11}/);
    });
  });

  it('GET /api/assessments/course/course-2 should return assessment with questions', async () => {
    const res = await request(app).get('/api/assessments/course/course-2');
    expect(res.status).toBe(200);
    expect(res.body.title).toContain('CERT-In');
    expect(Array.isArray(res.body.questions)).toBe(true);
    expect(res.body.questions.length).toBeGreaterThan(0);
  });

  it('GET /api/skills should return master skills directory', async () => {
    const res = await request(app).get('/api/skills');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/certificates/verify/:certNumber should verify seeded certificate', async () => {
    const res = await request(app).get('/api/certificates/verify/CC-2026-DPI-00891');
    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
    expect(res.body.certificate.userName).toBe('Rahul Sharma');
  });

  it('GET /api/nonexistent should return 404', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
  });
});
