import { Request, Response, NextFunction } from 'express';
import { ComplianceService } from '../services/complianceService';

export class ComplianceController {
  // Documents
  static async getDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.query;
      const data = await ComplianceService.getDocuments(projectId as string);
      res.json({ success: true, count: data.length, data });
    } catch (err) {
      next(err);
    }
  }

  static async uploadDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await ComplianceService.uploadDocument(req.body);
      res.status(201).json({ success: true, message: 'Document added to compliance repository', data: doc });
    } catch (err) {
      next(err);
    }
  }

  static async updateDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await ComplianceService.updateDocument(req.params.id, req.body);
      if (!doc) return res.status(404).json({ success: false, error: 'Document not found' });
      res.json({ success: true, message: 'Document record updated', data: doc });
    } catch (err) {
      next(err);
    }
  }

  static async deleteDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await ComplianceService.deleteDocument(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, error: 'Document not found' });
      res.json({ success: true, message: 'Document deleted from vault' });
    } catch (err) {
      next(err);
    }
  }

  // NCRs
  static async getNCRs(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId, status } = req.query;
      const data = await ComplianceService.getNCRs(projectId as string, status as string);
      res.json({ success: true, count: data.length, data });
    } catch (err) {
      next(err);
    }
  }

  static async createNCR(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await ComplianceService.createNCR(req.body);
      res.status(201).json({ success: true, message: 'Non-Compliance Report issued', data: item });
    } catch (err) {
      next(err);
    }
  }

  static async updateNCR(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await ComplianceService.updateNCR(req.params.id, req.body);
      if (!item) return res.status(404).json({ success: false, error: 'NCR not found' });
      res.json({ success: true, message: 'NCR updated', data: item });
    } catch (err) {
      next(err);
    }
  }

  // Six-monthly report
  static async generateReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId, period } = req.body;
      const report = await ComplianceService.generateSixMonthlyReport(projectId, period || 'Current Cycle');
      res.json({ success: true, message: 'Six-Monthly Compliance Package Compiled', data: report });
    } catch (err) {
      next(err);
    }
  }
}
