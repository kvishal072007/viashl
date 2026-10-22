import { SensorTelemetry } from '../types';
import { mockSensors } from '../data/mockData';
import { getCache, setCache } from '../config/redis';
import { v4 as uuidv4 } from 'uuid';

let sensorsStore: SensorTelemetry[] = [...mockSensors];

export class SensorService {
  private static CACHE_KEY = 'sensors:telemetry:all';

  static async getLiveTelemetry(projectId?: string): Promise<SensorTelemetry[]> {
    let list = [...sensorsStore];
    if (projectId) {
      list = list.filter((s) => s.projectId === projectId);
    }

    // Dynamic slight oscillation to simulate live live stream
    return list.map((s) => {
      const jitter = (Math.random() - 0.5) * 2;
      const pm25 = Math.max(5, Math.round((s.pm25 + jitter) * 10) / 10);
      const pm10 = Math.max(10, Math.round((s.pm10 + jitter * 2) * 10) / 10);
      const aqi = Math.round(pm25 * 2.2 + pm10 * 0.4);
      const noiseLevelDb = Math.round((s.noiseLevelDb + (Math.random() - 0.5)) * 10) / 10;
      const status: SensorTelemetry['status'] =
        aqi > 200 || noiseLevelDb > 75
          ? 'Critical Threshold Exceeded'
          : aqi > 100 || noiseLevelDb > 65
          ? 'Advisory'
          : 'Normal';

      return {
        ...s,
        timestamp: new Date().toISOString(),
        pm25,
        pm10,
        aqi,
        noiseLevelDb,
        status,
      };
    });
  }

  static async recordReading(data: Omit<SensorTelemetry, 'id' | 'timestamp'>): Promise<SensorTelemetry> {
    const reading: SensorTelemetry = {
      ...data,
      id: `sens-${uuidv4().substring(0, 8)}`,
      timestamp: new Date().toISOString(),
    };
    sensorsStore.unshift(reading);
    return reading;
  }
}
