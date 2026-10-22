import { Router } from 'express';
import { ApprovalController } from '../controllers/approvalController';
import { authenticateJwt, requireRole } from '../middleware/auth';
import { logAuditTrail } from '../middleware/auditLogger';

const router = Router();

router.use(authenticateJwt);

router.get('/', ApprovalController.getAll);
router.get('/:id', ApprovalController.getById);

router.post(
  '/',
  requireRole(['ADMIN', 'ENVIRONMENTAL_OFFICER', 'PROJECT_MANAGER']),
  logAuditTrail('APPROVAL_SUBMITTED', 'Regulatory Approvals'),
  ApprovalController.create
);

router.put(
  '/:id',
  requireRole(['ADMIN', 'ENVIRONMENTAL_OFFICER', 'REGULATORY_AUTHORITY']),
  logAuditTrail('APPROVAL_UPDATED', 'Regulatory Approvals'),
  ApprovalController.update
);

router.patch(
  '/:id/conditions/:conditionId',
  requireRole(['ADMIN', 'ENVIRONMENTAL_OFFICER', 'COMPLIANCE_AUDITOR']),
  logAuditTrail('APPROVAL_CONDITION_UPDATED', 'Regulatory Approvals'),
  ApprovalController.updateCondition
);

router.delete(
  '/:id',
  requireRole(['ADMIN']),
  logAuditTrail('APPROVAL_DELETED', 'Regulatory Approvals'),
  ApprovalController.delete
);

export default router;
