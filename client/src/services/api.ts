import axios from 'axios';
import {
  Project,
  EnvironmentalAssessment,
  RegulatoryApproval,
  MitigationMeasure,
  ComplianceDocument,
  SensorTelemetry,
  NonComplianceReport,
  DashboardMetrics,
  AuditLogItem,
  User,
} from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set default auth token
let currentToken = localStorage.getItem('envirotrack_token') || '';
if (currentToken) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
}

export const setAuthToken = (token: string) => {
  currentToken = token;
  localStorage.setItem('envirotrack_token', token);
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const api = {
  // Auth
  login: async (email: string, password?: string) => {
    const res = await apiClient.post('/auth/login', { email, password });
    if (res.data.token) {
      setAuthToken(res.data.token);
    }
    return res.data;
  },
  updateProfile: async (data: Partial<User>) => {
    const res = await apiClient.put('/auth/profile', data);
    return res.data;
  },
  getDemoUsers: async (): Promise<User[]> => {
    const res = await apiClient.get('/auth/demo-users');
    return res.data.data;
  },

  // Projects
  getProjects: async (params?: { sector?: string; phase?: string; search?: string }): Promise<Project[]> => {
    const res = await apiClient.get('/projects', { params });
    return res.data.data;
  },
  getProjectById: async (id: string): Promise<Project> => {
    const res = await apiClient.get(`/projects/${id}`);
    return res.data.data;
  },
  createProject: async (data: Partial<Project>): Promise<Project> => {
    const res = await apiClient.post('/projects', data);
    return res.data.data;
  },
  updateProject: async (id: string, data: Partial<Project>): Promise<Project> => {
    const res = await apiClient.put(`/projects/${id}`, data);
    return res.data.data;
  },
  deleteProject: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },

  // Assessments
  getAssessments: async (projectId?: string): Promise<EnvironmentalAssessment[]> => {
    const res = await apiClient.get('/assessments', { params: { projectId } });
    return res.data.data;
  },
  createAssessment: async (data: Partial<EnvironmentalAssessment>): Promise<EnvironmentalAssessment> => {
    const res = await apiClient.post('/assessments', data);
    return res.data.data;
  },
  updateAssessment: async (id: string, data: Partial<EnvironmentalAssessment>): Promise<EnvironmentalAssessment> => {
    const res = await apiClient.put(`/assessments/${id}`, data);
    return res.data.data;
  },

  // Approvals
  getApprovals: async (params?: { projectId?: string; status?: string }): Promise<RegulatoryApproval[]> => {
    const res = await apiClient.get('/approvals', { params });
    return res.data.data;
  },
  createApproval: async (data: Partial<RegulatoryApproval>): Promise<RegulatoryApproval> => {
    const res = await apiClient.post('/approvals', data);
    return res.data.data;
  },
  updateApproval: async (id: string, data: Partial<RegulatoryApproval>): Promise<RegulatoryApproval> => {
    const res = await apiClient.put(`/approvals/${id}`, data);
    return res.data.data;
  },
  updateApprovalCondition: async (id: string, conditionId: string, status: string): Promise<RegulatoryApproval> => {
    const res = await apiClient.patch(`/approvals/${id}/conditions/${conditionId}`, { status });
    return res.data.data;
  },

  // Mitigations (EMP)
  getMitigations: async (params?: { projectId?: string; category?: string }): Promise<MitigationMeasure[]> => {
    const res = await apiClient.get('/mitigations', { params });
    return res.data.data;
  },
  createMitigation: async (data: Partial<MitigationMeasure>): Promise<MitigationMeasure> => {
    const res = await apiClient.post('/mitigations', data);
    return res.data.data;
  },
  updateMitigation: async (id: string, data: Partial<MitigationMeasure>): Promise<MitigationMeasure> => {
    const res = await apiClient.put(`/mitigations/${id}`, data);
    return res.data.data;
  },

  // Compliance Documents & NCRs
  getDocuments: async (projectId?: string): Promise<ComplianceDocument[]> => {
    const res = await apiClient.get('/compliance/documents', { params: { projectId } });
    return res.data.data;
  },
  uploadDocument: async (data: Partial<ComplianceDocument>): Promise<ComplianceDocument> => {
    const res = await apiClient.post('/compliance/documents', data);
    return res.data.data;
  },
  getNCRs: async (params?: { projectId?: string; status?: string }): Promise<NonComplianceReport[]> => {
    const res = await apiClient.get('/compliance/ncrs', { params });
    return res.data.data;
  },
  createNCR: async (data: Partial<NonComplianceReport>): Promise<NonComplianceReport> => {
    const res = await apiClient.post('/compliance/ncrs', data);
    return res.data.data;
  },
  updateNCR: async (id: string, data: Partial<NonComplianceReport>): Promise<NonComplianceReport> => {
    const res = await apiClient.put(`/compliance/ncrs/${id}`, data);
    return res.data.data;
  },
  generateReport: async (projectId: string, period: string) => {
    const res = await apiClient.post('/compliance/generate-report', { projectId, period });
    return res.data.data;
  },

  // Sensor Telemetry
  getSensorTelemetry: async (projectId?: string): Promise<SensorTelemetry[]> => {
    const res = await apiClient.get('/sensors/telemetry', { params: { projectId } });
    return res.data.data;
  },

  // Analytics & Audit Logs
  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    const res = await apiClient.get('/analytics/dashboard');
    return res.data.data;
  },
  getAuditLogs: async (limit: number = 50): Promise<AuditLogItem[]> => {
    const res = await apiClient.get('/analytics/audit-logs', { params: { limit } });
    return res.data.data;
  },
};
