import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ProjectItem,
  AssessmentItem,
  RiskItem,
  ApprovalItem,
  MitigationItem,
  MonitoringItem,
  ComplianceItem,
  DocumentItem,
  DeadlineItem,
  AuditItem,
  initialProjects,
  initialAssessments,
  initialRisks,
  initialApprovals,
  initialMitigations,
  initialMonitoring,
  initialCompliance,
  initialDocuments,
  initialDeadlines,
  initialAudits,
} from '../data/centralData';

interface DataContextType {
  projects: ProjectItem[];
  assessments: AssessmentItem[];
  risks: RiskItem[];
  approvals: ApprovalItem[];
  mitigations: MitigationItem[];
  monitoring: MonitoringItem[];
  monitorings: MonitoringItem[];
  complianceRecords: ComplianceItem[];
  compliances: ComplianceItem[];
  documents: DocumentItem[];
  deadlines: DeadlineItem[];
  audits: AuditItem[];
  addProject: (p: Omit<ProjectItem, 'id'>) => void;
  addAssessment: (a: Omit<AssessmentItem, 'id'>) => void;
  addRisk: (r: Omit<RiskItem, 'id'>) => void;
  updateRiskStatus: (id: string, status: RiskItem['status']) => void;
  addApproval: (app: Omit<ApprovalItem, 'id'>) => void;
  addMitigation: (m: Omit<MitigationItem, 'id'>) => void;
  updateMitigationStatus: (id: string, status: MitigationItem['status']) => void;
  addMonitoring: (mon: Omit<MonitoringItem, 'id'>) => void;
  addCompliance: (comp: Omit<ComplianceItem, 'id'>) => void;
  updateComplianceStatus: (id: string, status: ComplianceItem['status']) => void;
  addDocument: (doc: Omit<DocumentItem, 'id'>) => void;
  deleteDocument: (id: string) => void;
  addDeadline: (d: Omit<DeadlineItem, 'id'>) => void;
  addAuditLog: (action: string, module: string, description: string) => void;
  logAudit: (action: string, module: string, description: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    const saved = localStorage.getItem('et_projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [assessments, setAssessments] = useState<AssessmentItem[]>(() => {
    const saved = localStorage.getItem('et_assessments');
    return saved ? JSON.parse(saved) : initialAssessments;
  });

  const [risks, setRisks] = useState<RiskItem[]>(() => {
    const saved = localStorage.getItem('et_risks');
    return saved ? JSON.parse(saved) : initialRisks;
  });

  const [approvals, setApprovals] = useState<ApprovalItem[]>(() => {
    const saved = localStorage.getItem('et_approvals');
    return saved ? JSON.parse(saved) : initialApprovals;
  });

  const [mitigations, setMitigations] = useState<MitigationItem[]>(() => {
    const saved = localStorage.getItem('et_mitigations');
    return saved ? JSON.parse(saved) : initialMitigations;
  });

  const [monitorings, setMonitorings] = useState<MonitoringItem[]>(() => {
    const saved = localStorage.getItem('et_monitorings');
    return saved ? JSON.parse(saved) : initialMonitoring;
  });

  const [compliances, setCompliances] = useState<ComplianceItem[]>(() => {
    const saved = localStorage.getItem('et_compliances_v2');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('et_compliances_v2', JSON.stringify(initialCompliance));
    return initialCompliance;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem('et_documents');
    return saved ? JSON.parse(saved) : initialDocuments;
  });

  const [deadlines, setDeadlines] = useState<DeadlineItem[]>(() => {
    const saved = localStorage.getItem('et_deadlines');
    return saved ? JSON.parse(saved) : initialDeadlines;
  });

  const [audits, setAudits] = useState<AuditItem[]>(() => {
    const saved = localStorage.getItem('et_audits');
    return saved ? JSON.parse(saved) : initialAudits;
  });

  const addAuditLog = (action: string, module: string, description: string) => {
    const now = new Date();
    const newAudit: AuditItem = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      user: 'Vishal (Admin)',
      action,
      module,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0],
      description,
    };
    setAudits((prev) => {
      const updated = [newAudit, ...prev];
      localStorage.setItem('et_audits', JSON.stringify(updated));
      return updated;
    });
  };

  const logAudit = addAuditLog;

  const addProject = (p: Omit<ProjectItem, 'id'>) => {
    const newProj: ProjectItem = {
      ...p,
      id: `PRJ-${String(projects.length + 1).padStart(3, '0')}`,
    };
    const updated = [newProj, ...projects];
    setProjects(updated);
    localStorage.setItem('et_projects', JSON.stringify(updated));
    addAuditLog('Admin added project', 'Project Management', `Created project: ${newProj.name} (${newProj.id})`);
  };

  const addAssessment = (a: Omit<AssessmentItem, 'id'>) => {
    const newAss: AssessmentItem = {
      ...a,
      id: `ASM-${Date.now().toString().slice(-4)}`,
    };
    const updated = [newAss, ...assessments];
    setAssessments(updated);
    localStorage.setItem('et_assessments', JSON.stringify(updated));
    addAuditLog('Officer created environmental assessment', 'Environmental Assessment', `Assessed ${newAss.category} impact for project ${newAss.projectId}`);
  };

  const addRisk = (r: Omit<RiskItem, 'id'>) => {
    const newRisk: RiskItem = {
      ...r,
      id: `RSK-${Date.now().toString().slice(-4)}`,
    };
    const updated = [newRisk, ...risks];
    setRisks(updated);
    localStorage.setItem('et_risks', JSON.stringify(updated));
    addAuditLog('Officer added high-risk item', 'Environmental Risks', `Added ${newRisk.riskLevel} risk: ${newRisk.riskName}`);
  };

  const updateRiskStatus = (id: string, status: RiskItem['status']) => {
    const updated = risks.map((r) => (r.id === id ? { ...r, status } : r));
    setRisks(updated);
    localStorage.setItem('et_risks', JSON.stringify(updated));
    addAuditLog('Officer updated risk status', 'Environmental Risks', `Updated risk ${id} to ${status}`);
  };

  const addApproval = (app: Omit<ApprovalItem, 'id'>) => {
    const newApp: ApprovalItem = {
      ...app,
      id: `APP-${Date.now().toString().slice(-4)}`,
    };
    const updated = [newApp, ...approvals];
    setApprovals(updated);
    localStorage.setItem('et_approvals', JSON.stringify(updated));
    addAuditLog('Officer uploaded approval', 'Approval Management', `Recorded approval: ${newApp.approvalName}`);
  };

  const addMitigation = (m: Omit<MitigationItem, 'id'>) => {
    const newMit: MitigationItem = {
      ...m,
      id: `MIT-${Date.now().toString().slice(-4)}`,
    };
    const updated = [newMit, ...mitigations];
    setMitigations(updated);
    localStorage.setItem('et_mitigations', JSON.stringify(updated));
    addAuditLog('Officer assigned mitigation action', 'Mitigation Measures', `Assigned action for ${newMit.relatedRisk}`);
  };

  const updateMitigationStatus = (id: string, status: MitigationItem['status']) => {
    const updated = mitigations.map((m) =>
      m.id === id ? { ...m, status, completionDate: status === 'Completed' ? new Date().toISOString().split('T')[0] : undefined } : m
    );
    setMitigations(updated);
    localStorage.setItem('et_mitigations', JSON.stringify(updated));
    addAuditLog('Officer updated mitigation progress', 'Mitigation Measures', `Set mitigation ${id} to ${status}`);
  };

  const addMonitoring = (mon: Omit<MonitoringItem, 'id'>) => {
    const newMon: MonitoringItem = {
      ...mon,
      id: `MON-${Date.now().toString().slice(-4)}`,
    };
    const updated = [newMon, ...monitorings];
    setMonitorings(updated);
    localStorage.setItem('et_monitorings', JSON.stringify(updated));
    addAuditLog('Officer recorded environmental monitoring', 'Environmental Monitoring', `Logged ${newMon.parameter}: ${newMon.measuredValue}`);
  };

  const addCompliance = (comp: Omit<ComplianceItem, 'id'>) => {
    const newComp: ComplianceItem = {
      ...comp,
      id: `CMP-${Date.now().toString().slice(-4)}`,
    };
    const updated = [newComp, ...compliances];
    setCompliances(updated);
    localStorage.setItem('et_compliances_v2', JSON.stringify(updated));
    addAuditLog('Officer updated compliance', 'Compliance Management', `Added condition requirement: ${newComp.requirement}`);
  };

  const updateComplianceStatus = (id: string, status: ComplianceItem['status']) => {
    const updated = compliances.map((c) => (c.id === id ? { ...c, status } : c));
    setCompliances(updated);
    localStorage.setItem('et_compliances_v2', JSON.stringify(updated));
    addAuditLog('Officer updated compliance', 'Compliance Management', `Updated compliance item ${id} to ${status}`);
  };

  const addDocument = (doc: Omit<DocumentItem, 'id'>) => {
    const newDoc: DocumentItem = {
      ...doc,
      id: `DOC-${Date.now().toString().slice(-4)}`,
    };
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    localStorage.setItem('et_documents', JSON.stringify(updated));
    addAuditLog('Officer uploaded approval', 'Document Management', `Uploaded ${newDoc.name} (${newDoc.documentType})`);
  };

  const deleteDocument = (id: string) => {
    const updated = documents.filter((d) => d.id !== id);
    setDocuments(updated);
    localStorage.setItem('et_documents', JSON.stringify(updated));
    addAuditLog('Officer deleted document', 'Document Management', `Removed document ${id}`);
  };

  const addDeadline = (d: Omit<DeadlineItem, 'id'>) => {
    const newDl: DeadlineItem = {
      ...d,
      id: `DL-${Date.now().toString().slice(-4)}`,
    };
    const updated = [newDl, ...deadlines];
    setDeadlines(updated);
    localStorage.setItem('et_deadlines', JSON.stringify(updated));
    addAuditLog('Officer created deadline notification', 'Deadline + Notifications', `Created deadline: ${newDl.title} (${newDl.dueDate})`);
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        assessments,
        risks,
        approvals,
        mitigations,
        monitoring: monitorings,
        monitorings,
        complianceRecords: compliances,
        compliances,
        documents,
        deadlines,
        audits,
        addProject,
        addAssessment,
        addRisk,
        updateRiskStatus,
        addApproval,
        addMitigation,
        updateMitigationStatus,
        addMonitoring,
        addCompliance,
        updateComplianceStatus,
        addDocument,
        deleteDocument,
        addDeadline,
        addAuditLog,
        logAudit,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
