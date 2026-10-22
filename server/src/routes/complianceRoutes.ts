import { Router } from 'express';
import { ComplianceController } from '../controllers/complianceController';
import { authenticateJwt, requireRole } from '../middleware/auth';
import { logAuditTrail } from '../middleware/auditLogger';

const router = Router();

router.use(authenticateJwt);

// Document Repository routes
router.get('/documents', ComplianceController.getDocuments);
router.post(
  '/documents',
  requireRole(['ADMIN', 'ENVIRONMENTAL_OFFICER', 'PROJECT_MANAGER', 'COMPLIANCE_AUDITOR']),
  logAuditTrail('DOCUMENT_UPLOADED', 'Compliance Repository'),
  ComplianceController.uploadDocument
);
router.put(
  '/documents/:id',
  requireRole(['ADMIN', 'ENVIRONMENTAL_OFFICER']),
  logAuditTrail('DOCUMENT_UPDATED', 'Compliance Repository'),
  ComplianceController.updateDocument
);
router.delete(
  '/documents/:id',
  requireRole(['ADMIN']),
  logAuditTrail('DOCUMENT_DELETED', 'Compliance Repository'),
  ComplianceController.deleteDocument
);

// Non-Compliance Reports (NCR) routes
router.get('/ncrs', ComplianceController.getNCRs);
router.post(
  '/ncrs',
  requireRole(['ADMIN', 'ENVIRONMENTAL_OFFICER', 'COMPLIANCE_AUDITOR']),
  logAuditTrail('NCR_ISSUED', 'Compliance NCR'),
  ComplianceController.createNCR
);
router.put(
  '/ncrs/:id',
  requireRole(['ADMIN', 'ENVIRONMENTAL_OFFICER', 'PROJECT_MANAGER', 'COMPLIANCE_AUDITOR']),
  logAuditTrail('NCR_UPDATED', 'Compliance NCR'),
  ComplianceController.updateNCR
);

// Six-Monthly Compliance Report Compilation
router.post(
  '/generate-report',
  requireRole(['ADMIN', 'ENVIRONMENTAL_OFFICER', 'COMPLIANCE_AUDITOR']),
  logAuditTrail('REPORT_GENERATED', 'Compliance Reporting'),
  ComplianceController.generateReport
);

export default router;
