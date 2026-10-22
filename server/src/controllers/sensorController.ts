import { Request, Response, NextFunction } from 'express';
import { SensorService } from '../services/sensorService';

export class SensorController {
  static async getLiveTelemetry(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.query;
      const data = await SensorService.getLiveTelemetry(projectId as string);
      res.json({ success: true, count: data.length, data });
    } catch (err) {
      next(err);
    }
  }

  static async recordReading(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await SensorService.recordReading(req.body);
      res.status(201).json({ success: true, message: 'Sensor reading ingested', data });
    } catch (err) {
      next(err);
    }
  }
}
