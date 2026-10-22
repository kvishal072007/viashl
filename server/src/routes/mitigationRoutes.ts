import { Router } from 'express';
import { MitigationController } from '../controllers/mitigationController';
import { authenticateJwt, requireRole } from '../middleware/auth';
import { logAuditTrail } from '../middleware/auditLogger';

const router = Router();

router.use(authenticateJwt);

router.get('/', MitigationController.getAll);
router.get('/:id', MitigationController.getById);

router.post(
  '/',
  requireRole(['ADMIN', 'ENVIRONMENTAL_OFFICER', 'PROJECT_MANAGER']),
  logAuditTrail('MITIGATION_CREATED', 'Mitigation Measures & EMP'),
  MitigationController.create
);

router.put(
  '/:id',
  requireRole(['ADMIN', 'ENVIRONMENTAL_OFFICER', 'PROJECT_MANAGER']),
  logAuditTrail('MITIGATION_UPDATED', 'Mitigation Measures & EMP'),
  MitigationController.update
);

router.delete(
  '/:id',
  requireRole(['ADMIN']),
  logAuditTrail('MITIGATION_DELETED', 'Mitigation Measures & EMP'),
  MitigationController.delete
);

export default router;
