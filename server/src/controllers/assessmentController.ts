import { Request, Response, NextFunction } from 'express';
import { AssessmentService } from '../services/assessmentService';

export class AssessmentController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.query;
      const data = await AssessmentService.getAll(projectId as string);
      res.json({ success: true, count: data.length, data });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await AssessmentService.getById(req.params.id);
      if (!item) return res.status(404).json({ success: false, error: 'Assessment not found' });
      res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await AssessmentService.create(req.body);
      res.status(201).json({ success: true, message: 'Environmental Assessment created', data: item });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await AssessmentService.update(req.params.id, req.body);
      if (!item) return res.status(404).json({ success: false, error: 'Assessment not found' });
      res.json({ success: true, message: 'Assessment updated', data: item });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await AssessmentService.delete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, error: 'Assessment not found' });
      res.json({ success: true, message: 'Assessment deleted' });
    } catch (err) {
      next(err);
    }
  }
}
