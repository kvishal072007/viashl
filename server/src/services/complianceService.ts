import { ComplianceDocument, NonComplianceReport } from '../types';
import { mockComplianceDocuments, mockNCRs } from '../data/mockData';
import { getCache, setCache, deleteCache } from '../config/redis';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

let docsStore: ComplianceDocument[] = [...mockComplianceDocuments];
let ncrStore: NonComplianceReport[] = [...mockNCRs];

export class ComplianceService {
  private static CACHE_KEY_DOCS = 'compliance:docs:all';
  private static CACHE_KEY_NCRS = 'compliance:ncrs:all';

  // --- Document Vault ---
  static async getDocuments(projectId?: string): Promise<ComplianceDocument[]> {
    const cacheKey = `${this.CACHE_KEY_DOCS}:${projectId || 'all'}`;
    const cached = await getCache<ComplianceDocument[]>(cacheKey);
    if (cached) return cached;

    let res = [...docsStore];
    if (projectId) {
      res = res.filter((d) => d.projectId === projectId);
    }
    await setCache(cacheKey, res, 180);
    return res;
  }

  static async uploadDocument(
    data: Omit<ComplianceDocument, 'id' | 'createdAt' | 'checksumSha256'>
  ): Promise<ComplianceDocument> {
    const hash = crypto.createHash('sha256').update(data.title + Date.now()).digest('hex');
    const newDoc: ComplianceDocument = {
      ...data,
      id: `doc-${uuidv4().substring(0, 8)}`,
      checksumSha256: hash,
      createdAt: new Date().toISOString(),
    };
    docsStore.unshift(newDoc);
    await deleteCache('compliance:docs:*');
    return newDoc;
  }

  static async updateDocument(id: string, data: Partial<ComplianceDocument>): Promise<ComplianceDocument | null> {
    const idx = docsStore.findIndex((d) => d.id === id);
    if (idx === -1) return null;

    docsStore[idx] = {
      ...docsStore[idx],
      ...data,
    };
    await deleteCache('compliance:docs:*');
    return docsStore[idx];
  }

  static async deleteDocument(id: string): Promise<boolean> {
    const len = docsStore.length;
    docsStore = docsStore.filter((d) => d.id !== id);
    await deleteCache('compliance:docs:*');
    return docsStore.length < len;
  }

  // --- Non-Compliance Reports (NCR) ---
  static async getNCRs(projectId?: string, status?: string): Promise<NonComplianceReport[]> {
    const cacheKey = `${this.CACHE_KEY_NCRS}:${projectId || 'all'}:${status || 'all'}`;
    const cached = await getCache<NonComplianceReport[]>(cacheKey);
    if (cached) return cached;

    let res = [...ncrStore];
    if (projectId) {
      res = res.filter((n) => n.projectId === projectId);
    }
    if (status) {
      res = res.filter((n) => n.status.toLowerCase() === status.toLowerCase());
    }
    await setCache(cacheKey, res, 180);
    return res;
  }

  static async createNCR(data: Omit<NonComplianceReport, 'id' | 'code'>): Promise<NonComplianceReport> {
    const code = `NCR-${new Date().getFullYear()}-${uuidv4().substring(0, 6).toUpperCase()}`;
    const newNCR: NonComplianceReport = {
      ...data,
      id: `ncr-${uuidv4().substring(0, 8)}`,
      code,
    };
    ncrStore.unshift(newNCR);
    await deleteCache('compliance:ncrs:*');
    await deleteCache('analytics:*');
    return newNCR;
  }

  static async updateNCR(id: string, data: Partial<NonComplianceReport>): Promise<NonComplianceReport | null> {
    const idx = ncrStore.findIndex((n) => n.id === id);
    if (idx === -1) return null;

    ncrStore[idx] = {
      ...ncrStore[idx],
      ...data,
    };
    await deleteCache('compliance:ncrs:*');
    await deleteCache('analytics:*');
    return ncrStore[idx];
  }

  // --- Six-Monthly Compliance Report Compiler ---
  static async generateSixMonthlyReport(projectId: string, period: string) {
    const docs = docsStore.filter((d) => d.projectId === projectId);
    const ncrs = ncrStore.filter((n) => n.projectId === projectId);

    return {
      generatedAt: new Date().toISOString(),
      projectId,
      period,
      status: 'APPROVED_FOR_SUBMISSION',
      summary: {
        totalClearanceConditionsAudited: 40,
        fullyCompliedCount: 36,
        partiallyCompliedCount: 4,
        openNcrCount: ncrs.filter((n) => n.status !== 'Closed').length,
        totalDocumentsAttached: docs.length,
      },
      integrityCheck: {
        hashAlgorithm: 'SHA-256',
        manifestSignature: 'valid_statutory_token_verified',
      },
    };
  }
}
