import { Router } from 'express';
import { AssessmentController } from '../controllers/assessmentController';
import { authenticateJwt, requireRole } from '../middleware/auth';
import { logAuditTrail } from '../middleware/auditLogger';

const router = Router();

router.use(authenticateJwt);

router.get('/', AssessmentController.getAll);
router.get('/:id', AssessmentController.getById);

router.post(
  '/',
  requireRole(['ADMIN', 'ENVIRONMENTAL_OFFICER']),
  logAuditTrail('ASSESSMENT_CREATED', 'Environmental Impact Assessment'),
  AssessmentController.create
);

router.put(
  '/:id',
  requireRole(['ADMIN', 'ENVIRONMENTAL_OFFICER']),
  logAuditTrail('ASSESSMENT_UPDATED', 'Environmental Impact Assessment'),
  AssessmentController.update
);

router.delete(
  '/:id',
  requireRole(['ADMIN']),
  logAuditTrail('ASSESSMENT_DELETED', 'Environmental Impact Assessment'),
  AssessmentController.delete
);

export default router;
