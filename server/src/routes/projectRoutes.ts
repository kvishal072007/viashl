import { Router } from 'express';
import { ProjectController, projectSchema } from '../controllers/projectController';
import { authenticateJwt, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { logAuditTrail } from '../middleware/auditLogger';

const router = Router();

router.use(authenticateJwt);

router.get('/', ProjectController.getAll);
router.get('/:id', ProjectController.getById);

router.post(
  '/',
  requireRole(['ADMIN', 'ENVIRONMENTAL_OFFICER', 'PROJECT_MANAGER']),
  validateRequest(projectSchema),
  logAuditTrail('PROJECT_CREATED', 'Projects'),
  ProjectController.create
);

router.put(
  '/:id',
  requireRole(['ADMIN', 'ENVIRONMENTAL_OFFICER', 'PROJECT_MANAGER']),
  logAuditTrail('PROJECT_UPDATED', 'Projects'),
  ProjectController.update
);

router.delete(
  '/:id',
  requireRole(['ADMIN']),
  logAuditTrail('PROJECT_DELETED', 'Projects'),
  ProjectController.delete
);

export default router;
