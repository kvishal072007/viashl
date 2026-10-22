import { Request, Response, NextFunction } from 'express';
import { MitigationService } from '../services/mitigationService';

export class MitigationController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId, category } = req.query;
      const data = await MitigationService.getAll(projectId as string, category as string);
      res.json({ success: true, count: data.length, data });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await MitigationService.getById(req.params.id);
      if (!item) return res.status(404).json({ success: false, error: 'Mitigation measure not found' });
      res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await MitigationService.create(req.body);
      res.status(201).json({ success: true, message: 'EMP Mitigation task logged', data: item });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await MitigationService.update(req.params.id, req.body);
      if (!item) return res.status(404).json({ success: false, error: 'Mitigation measure not found' });
      res.json({ success: true, message: 'Mitigation measure updated', data: item });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await MitigationService.delete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, error: 'Mitigation measure not found' });
      res.json({ success: true, message: 'Mitigation measure deleted' });
    } catch (err) {
      next(err);
    }
  }
}
