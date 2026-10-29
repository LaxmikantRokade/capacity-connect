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

// CORS configuration supporting single or multiple comma-separated URLs
const parseAllowedOrigins = () => {
  const clientUrl = process.env.CLIENT_URL?.trim();
  if (!clientUrl) {
    return ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5001', 'http://localhost:4173'];
  }
  if (clientUrl === '*') return true;
  return clientUrl.split(',').map((url) => url.trim().replace(/\/$/, ''));
};

app.use(cors({
  origin: parseAllowedOrigins(),
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

// Root & API Health check endpoints (for load balancers & Render web service health checks)
const healthHandler = (req: express.Request, res: express.Response) => {
  res.json({
    status: 'ok',
    project: 'CAPACITY CONNECT',
    problemStatementId: 'SIH26075',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
};

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// Mount modular API routers
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/assessments', assessmentsRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler for API
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Requested API endpoint not found' });
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
