import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import coursesRoutes from './routes/courses.js';
import assessmentsRoutes from './routes/assessments.js';
import skillsRoutes from './routes/skills.js';
import trainingRoutes from './routes/training.js';
import knowledgeRoutes from './routes/knowledge.js';
import certificatesRoutes from './routes/certificates.js';
import notificationsRoutes from './routes/notifications.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5001;
const HOST = process.env.HOST || '0.0.0.0';

// CORS configuration supporting configured URLs and standard Vercel/Render deployments
const isOriginAllowed = (origin?: string): boolean => {
  if (!origin) return true; // Allow non-browser requests (curl, server-to-server, health checks)
  const clientUrl = process.env.CLIENT_URL?.trim();
  if (!clientUrl || clientUrl === '*') return true;
  const configured = clientUrl.split(',').map((url) => url.trim().replace(/\/$/, ''));
  if (configured.includes(origin) || configured.includes('*')) return true;
  // Allow Vercel deployments (including preview branches) and Render origins
  if (/^https:\/\/[a-zA-Z0-9_-]+\.vercel\.app$/.test(origin)) return true;
  if (/^https:\/\/[a-zA-Z0-9_-]+\.onrender\.com$/.test(origin)) return true;
  // Local development origins
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  return false;
};

app.use(cors({
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS not allowed for origin: ${origin}`));
    }
  },
  credentials: true,
}));

app.use(express.json());

// Request logging for audit trail
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    }
  });
  next();
});

// Root & API Health check endpoints (for load balancers, Vercel proxies & Render web service health checks)
const healthHandler = (req: express.Request, res: express.Response) => {
  res.json({
    status: 'ok',
    success: true,
    project: 'CAPACITY CONNECT',
    problemStatementId: 'SIH26075',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    data: {
      status: 'ok',
      service: 'capacity-connect-api',
      version: 'v1',
    },
  });
};

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);
app.get('/api/v1/health', healthHandler);

// Mount modular API routers on both /api and /api/v1 for complete backward/forward compatibility
const mountRouters = (prefix: string) => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/courses`, coursesRoutes);
  app.use(`${prefix}/assessments`, assessmentsRoutes);
  app.use(`${prefix}/skills`, skillsRoutes);
  app.use(`${prefix}/training`, trainingRoutes);
  app.use(`${prefix}/knowledge`, knowledgeRoutes);
  app.use(`${prefix}/certificates`, certificatesRoutes);
  app.use(`${prefix}/notifications`, notificationsRoutes);
  app.use(`${prefix}/admin`, adminRoutes);
};

mountRouters('/api');
mountRouters('/api/v1');

// 404 Handler for API
app.use(['/api/*', '/api/v1/*'], (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Requested API endpoint not found',
    },
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Only listen if not imported by test suite
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, HOST, () => {
    console.log(`🚀 Capacity Connect Server running on http://${HOST}:${PORT}`);
    console.log(`💡 SIH26075 Digital Capacity Building & LMS backend active`);
  });
}

export default app;
