import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/projectService';
import { z } from 'zod';

export const projectSchema = z.object({
  body: z.object({
    code: z.string().min(3),
    name: z.string().min(3),
    description: z.string().min(10),
    sector: z.string(),
    phase: z.string(),
    location: z.object({
      lat: z.number(),
      lng: z.number(),
      address: z.string(),
      state: z.string(),
      country: z.string(),
      ecoSensitiveZoneProximityKm: z.number().optional(),
      protectedForestDistanceKm: z.number().optional(),
    }),
    estimatedCostUsdMillion: z.number().positive(),
    allocatedEmpBudgetUsdMillion: z.number().positive(),
    spentEmpBudgetUsdMillion: z.number().nonnegative().optional().default(0),
    startDate: z.string(),
    targetCompletionDate: z.string(),
    projectHead: z.string().min(2),
    complianceOfficer: z.string().min(2),
    overallComplianceScore: z.number().min(0).max(100).optional().default(85),
    riskTier: z.string(),
  }),
});

export class ProjectController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { sector, phase, search } = req.query;
      const projects = await ProjectService.getAllProjects({
        sector: sector as string,
        phase: phase as string,
        search: search as string,
      });
      res.json({ success: true, count: projects.length, data: projects });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.getProjectById(req.params.id);
      if (!project) {
        return res.status(404).json({ success: false, error: 'Infrastructure Project not found' });
      }
      res.json({ success: true, data: project });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const newProject = await ProjectService.createProject(req.body);
      res.status(201).json({ success: true, message: 'Infrastructure Project registered', data: newProject });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await ProjectService.updateProject(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Infrastructure Project not found' });
      }
      res.json({ success: true, message: 'Project details updated', data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await ProjectService.deleteProject(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Project not found or already deleted' });
      }
      res.json({ success: true, message: 'Project deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}
