import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

router.use(authenticateJwt);

router.get('/dashboard', AnalyticsController.getDashboardMetrics);
router.get('/audit-logs', AnalyticsController.getAuditLogs);

export default router;
