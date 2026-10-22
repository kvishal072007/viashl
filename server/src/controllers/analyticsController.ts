import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analyticsService';
import { mockAuditLogs } from '../data/mockData';

export class AnalyticsController {
  static async getDashboardMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnalyticsService.getExecutiveDashboard();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async getAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      res.json({ success: true, count: mockAuditLogs.length, data: mockAuditLogs.slice(0, limit) });
    } catch (err) {
      next(err);
    }
  }
}
