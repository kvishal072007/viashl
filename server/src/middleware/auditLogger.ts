import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { v4 as uuidv4 } from 'uuid';
import { mockAuditLogs } from '../data/mockData';
import { AuditLogModel } from '../models';
import { checkDbConnection } from '../config/db';

export const logAuditTrail = (action: string, module: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user?.name || 'System / Officer';
    const role = req.user?.role || 'ENVIRONMENTAL_OFFICER';
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const entityId = (req.params.id || req.body.id || req.body.projectId || 'N/A') as string;

    const logEntry = {
      id: `log-${uuidv4().substring(0, 8)}`,
      timestamp: new Date().toISOString(),
      user,
      role,
      action,
      module,
      entityId,
      ipAddress,
      status: 'SUCCESS' as const,
      details: `${req.method} ${req.originalUrl} executed with payload summary: ${JSON.stringify(req.body).substring(0, 120)}`,
    };

    // Store in in-memory logs
    mockAuditLogs.unshift(logEntry);
    if (mockAuditLogs.length > 500) mockAuditLogs.pop();

    // Asynchronously store in MongoDB if connected
    checkDbConnection().then((isUp) => {
      if (isUp) {
        AuditLogModel.create(logEntry).catch(() => {});
      }
    });

    next();
  };
};
