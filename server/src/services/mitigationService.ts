import { MitigationMeasure } from '../types';
import { mockMitigations } from '../data/mockData';
import { getCache, setCache, deleteCache } from '../config/redis';
import { v4 as uuidv4 } from 'uuid';

let mitigationsStore: MitigationMeasure[] = [...mockMitigations];

export class MitigationService {
  private static CACHE_KEY_ALL = 'mitigations:all';

  static async getAll(projectId?: string, category?: string): Promise<MitigationMeasure[]> {
    const cacheKey = `${this.CACHE_KEY_ALL}:${projectId || 'all'}:${category || 'all'}`;
    const cached = await getCache<MitigationMeasure[]>(cacheKey);
    if (cached) return cached;

    let res = [...mitigationsStore];
    if (projectId) {
      res = res.filter((m) => m.projectId === projectId);
    }
    if (category) {
      res = res.filter((m) => m.category.toLowerCase() === category.toLowerCase());
    }

    await setCache(cacheKey, res, 180);
    return res;
  }

  static async getById(id: string): Promise<MitigationMeasure | null> {
    return mitigationsStore.find((m) => m.id === id) || null;
  }

  static async create(data: Omit<MitigationMeasure, 'id' | 'createdAt'>): Promise<MitigationMeasure> {
    const newMit: MitigationMeasure = {
      ...data,
      id: `mit-${uuidv4().substring(0, 8)}`,
      createdAt: new Date().toISOString(),
    };
    mitigationsStore.unshift(newMit);
    await deleteCache('mitigations:*');
    await deleteCache('analytics:*');
    return newMit;
  }

  static async update(id: string, data: Partial<MitigationMeasure>): Promise<MitigationMeasure | null> {
    const idx = mitigationsStore.findIndex((m) => m.id === id);
    if (idx === -1) return null;

    mitigationsStore[idx] = {
      ...mitigationsStore[idx],
      ...data,
    };
    await deleteCache('mitigations:*');
    await deleteCache('analytics:*');
    return mitigationsStore[idx];
  }

  static async delete(id: string): Promise<boolean> {
    const len = mitigationsStore.length;
    mitigationsStore = mitigationsStore.filter((m) => m.id !== id);
    await deleteCache('mitigations:*');
    await deleteCache('analytics:*');
    return mitigationsStore.length < len;
  }
}
