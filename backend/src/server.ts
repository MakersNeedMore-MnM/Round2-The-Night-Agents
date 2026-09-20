import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { patientsRouter } from './routes/patients';
import { intakeRouter } from './routes/intake';
import { documentsRouter } from './routes/documents';
import { timelineRouter } from './routes/timeline';
import { physicianRouter } from './routes/physician';
import { triageRouter } from './routes/triage';
import { ayushRouter } from './routes/ayush';
import { adminRouter } from './routes/admin';
import { privacyRouter } from './routes/privacy';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/intake', intakeRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/timeline', timelineRouter);
app.use('/api/physician', physicianRouter);
app.use('/api/triage', triageRouter);
app.use('/api/ayush', ayushRouter);
app.use('/api/admin', adminRouter);
app.use('/api/privacy', privacyRouter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'CHIKITSABODHA Clinical Backend API',
    tagline: 'From Patient Voice to Clinical Understanding',
    architecture: 'ABDM / FHIR-ready',
    timestamp: new Date().toISOString(),
    demoMode: true,
  });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error in clinical intelligence engine',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  CHIKITSABODHA API Server running on port ${PORT}`);
  console.log(`  "From Patient Voice to Clinical Understanding"`);
  console.log(`  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
