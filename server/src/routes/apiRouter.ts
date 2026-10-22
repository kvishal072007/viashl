import { Router } from 'express';
import projectRoutes from './projectRoutes';
import assessmentRoutes from './assessmentRoutes';
import approvalRoutes from './approvalRoutes';
import mitigationRoutes from './mitigationRoutes';
import complianceRoutes from './complianceRoutes';
import sensorRoutes from './sensorRoutes';
import analyticsRoutes from './analyticsRoutes';
import authRoutes from './authRoutes';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/projects', projectRoutes);
apiRouter.use('/assessments', assessmentRoutes);
apiRouter.use('/approvals', approvalRoutes);
apiRouter.use('/mitigations', mitigationRoutes);
apiRouter.use('/compliance', complianceRoutes);
apiRouter.use('/sensors', sensorRoutes);
apiRouter.use('/analytics', analyticsRoutes);

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'EnviroTrack Infrastructure Compliance Backend',
    version: '1.0.0',
    uptime: process.uptime(),
  });
});

export default apiRouter;
