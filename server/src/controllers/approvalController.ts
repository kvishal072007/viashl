import { Request, Response, NextFunction } from 'express';
import { ApprovalService } from '../services/approvalService';

export class ApprovalController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId, status } = req.query;
      const data = await ApprovalService.getAll(projectId as string, status as string);
      res.json({ success: true, count: data.length, data });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await ApprovalService.getById(req.params.id);
      if (!item) return res.status(404).json({ success: false, error: 'Regulatory Approval record not found' });
      res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await ApprovalService.create(req.body);
      res.status(201).json({ success: true, message: 'Regulatory Approval registered', data: item });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await ApprovalService.update(req.params.id, req.body);
      if (!item) return res.status(404).json({ success: false, error: 'Approval record not found' });
      res.json({ success: true, message: 'Approval record updated', data: item });
    } catch (err) {
      next(err);
    }
  }

  static async updateCondition(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, conditionId } = req.params;
      const { status } = req.body;
      const item = await ApprovalService.updateConditionStatus(id, conditionId, status);
      if (!item) return res.status(404).json({ success: false, error: 'Approval or condition not found' });
      res.json({ success: true, message: 'Condition status updated', data: item });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await ApprovalService.delete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, error: 'Approval not found' });
      res.json({ success: true, message: 'Approval deleted' });
    } catch (err) {
      next(err);
    }
  }
}
