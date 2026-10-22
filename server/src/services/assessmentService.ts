import { EnvironmentalAssessment } from '../types';
import { mockAssessments } from '../data/mockData';
import { getCache, setCache, deleteCache } from '../config/redis';
import { v4 as uuidv4 } from 'uuid';

let assessmentsStore: EnvironmentalAssessment[] = [...mockAssessments];

export class AssessmentService {
  private static CACHE_KEY_ALL = 'assessments:all';

  static async getAll(projectId?: string): Promise<EnvironmentalAssessment[]> {
    const cacheKey = `${this.CACHE_KEY_ALL}:${projectId || 'all'}`;
    const cached = await getCache<EnvironmentalAssessment[]>(cacheKey);
    if (cached) return cached;

    let res = [...assessmentsStore];
    if (projectId) {
      res = res.filter((a) => a.projectId === projectId);
    }

    await setCache(cacheKey, res, 180);
    return res;
  }

  static async getById(id: string): Promise<EnvironmentalAssessment | null> {
    return assessmentsStore.find((a) => a.id === id) || null;
  }

  static async create(data: Omit<EnvironmentalAssessment, 'id' | 'createdAt'>): Promise<EnvironmentalAssessment> {
    const newAss: EnvironmentalAssessment = {
      ...data,
      id: `ass-${uuidv4().substring(0, 8)}`,
      createdAt: new Date().toISOString(),
    };
    assessmentsStore.unshift(newAss);
    await deleteCache('assessments:*');
    return newAss;
  }

  static async update(id: string, data: Partial<EnvironmentalAssessment>): Promise<EnvironmentalAssessment | null> {
    const idx = assessmentsStore.findIndex((a) => a.id === id);
    if (idx === -1) return null;

    assessmentsStore[idx] = {
      ...assessmentsStore[idx],
      ...data,
    };
    await deleteCache('assessments:*');
    return assessmentsStore[idx];
  }

  static async delete(id: string): Promise<boolean> {
    const len = assessmentsStore.length;
    assessmentsStore = assessmentsStore.filter((a) => a.id !== id);
    await deleteCache('assessments:*');
    return assessmentsStore.length < len;
  }
}
