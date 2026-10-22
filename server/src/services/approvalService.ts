import { RegulatoryApproval } from '../types';
import { mockApprovals } from '../data/mockData';
import { getCache, setCache, deleteCache } from '../config/redis';
import { v4 as uuidv4 } from 'uuid';

let approvalsStore: RegulatoryApproval[] = [...mockApprovals];

export class ApprovalService {
  private static CACHE_KEY_ALL = 'approvals:all';

  static async getAll(projectId?: string, status?: string): Promise<RegulatoryApproval[]> {
    const cacheKey = `${this.CACHE_KEY_ALL}:${projectId || 'all'}:${status || 'all'}`;
    const cached = await getCache<RegulatoryApproval[]>(cacheKey);
    if (cached) return cached;

    let res = [...approvalsStore];
    if (projectId) {
      res = res.filter((a) => a.projectId === projectId);
    }
    if (status) {
      res = res.filter((a) => a.status.toLowerCase() === status.toLowerCase());
    }

    await setCache(cacheKey, res, 180);
    return res;
  }

  static async getById(id: string): Promise<RegulatoryApproval | null> {
    return approvalsStore.find((a) => a.id === id) || null;
  }

  static async create(data: Omit<RegulatoryApproval, 'id' | 'createdAt'>): Promise<RegulatoryApproval> {
    const newApp: RegulatoryApproval = {
      ...data,
      id: `app-${uuidv4().substring(0, 8)}`,
      createdAt: new Date().toISOString(),
    };
    approvalsStore.unshift(newApp);
    await deleteCache('approvals:*');
    await deleteCache('analytics:*');
    return newApp;
  }

  static async update(id: string, data: Partial<RegulatoryApproval>): Promise<RegulatoryApproval | null> {
    const idx = approvalsStore.findIndex((a) => a.id === id);
    if (idx === -1) return null;

    approvalsStore[idx] = {
      ...approvalsStore[idx],
      ...data,
    };
    await deleteCache('approvals:*');
    await deleteCache('analytics:*');
    return approvalsStore[idx];
  }

  static async updateConditionStatus(
    approvalId: string,
    conditionId: string,
    status: 'Compliant' | 'Partially Compliant' | 'Non-Compliant' | 'Not Applicable'
  ): Promise<RegulatoryApproval | null> {
    const app = approvalsStore.find((a) => a.id === approvalId);
    if (!app) return null;

    const cond = app.keyConditions.find((c) => c.id === conditionId);
    if (cond) {
      cond.status = status;
      // recalculate conditions count
      const complied = app.keyConditions.filter((c) => c.status === 'Compliant').length;
      app.conditionsCount = {
        total: app.keyConditions.length,
        complied,
        pending: app.keyConditions.length - complied,
      };
      await deleteCache('approvals:*');
    }
    return app;
  }

  static async delete(id: string): Promise<boolean> {
    const len = approvalsStore.length;
    approvalsStore = approvalsStore.filter((a) => a.id !== id);
    await deleteCache('approvals:*');
    await deleteCache('analytics:*');
    return approvalsStore.length < len;
  }
}
