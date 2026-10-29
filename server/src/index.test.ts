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
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('title');
      expect(res.body[0]).toHaveProperty('code');
    }
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
