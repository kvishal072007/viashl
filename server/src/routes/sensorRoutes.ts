import { Router } from 'express';
import { SensorController } from '../controllers/sensorController';
import { authenticateJwt, requireRole } from '../middleware/auth';
import { logAuditTrail } from '../middleware/auditLogger';

const router = Router();

router.use(authenticateJwt);

router.get('/telemetry', SensorController.getLiveTelemetry);

router.post(
  '/telemetry',
  requireRole(['ADMIN', 'ENVIRONMENTAL_OFFICER']),
  logAuditTrail('SENSOR_DATA_INGESTED', 'IoT Sensor Network'),
  SensorController.recordReading
);

export default router;
