export type ProjectSector =
  | 'Highways & Expressways'
  | 'Rail & Metro Transit'
  | 'Hydroelectric & Water Resources'
  | 'Renewable Energy (Solar/Wind)'
  | 'Ports & Maritime'
  | 'Urban Infrastructure & Airports';

export type ProjectPhase =
  | 'Planning & Scoping'
  | 'Pre-Construction & Clearances'
  | 'Active Construction'
  | 'Commissioning & Trial Run'
  | 'Operational & Maintenance';

export type ImpactSeverity = 'Low' | 'Moderate' | 'High' | 'Critical';
export type ApprovalStatus = 'Draft' | 'Submitted' | 'Under Review' | 'Queries Raised' | 'Approved' | 'Rejected' | 'Expired';
export type MitigationStatus = 'Pending' | 'In Progress' | 'Under Review' | 'Completed' | 'Delayed';
export type ComplianceStatus = 'Compliant' | 'Partially Compliant' | 'Non-Compliant' | 'Not Applicable';
export type NCRSeverity = 'Minor' | 'Major' | 'Critical';
export type NCRStatus = 'Open' | 'CAP Submitted' | 'Verification Pending' | 'Closed';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'ENVIRONMENTAL_OFFICER' | 'COMPLIANCE_AUDITOR' | 'PROJECT_MANAGER' | 'REGULATORY_AUTHORITY';
  department: string;
  organization: string;
  avatarUrl?: string;
}

export interface GeoLocation {
  lat: number;
  lng: number;
  address: string;
  state: string;
  country: string;
  ecoSensitiveZoneProximityKm?: number;
  protectedForestDistanceKm?: number;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  description: string;
  sector: ProjectSector;
  phase: ProjectPhase;
  location: GeoLocation;
  estimatedCostUsdMillion: number;
  allocatedEmpBudgetUsdMillion: number;
  spentEmpBudgetUsdMillion: number;
  startDate: string;
  targetCompletionDate: string;
  projectHead: string;
  complianceOfficer: string;
  overallComplianceScore: number; // 0 - 100
  riskTier: 'Low Risk (Category B2)' | 'Moderate Risk (Category B1)' | 'High Risk (Category A)';
  createdAt: string;
  updatedAt: string;
}

export interface BaselineMetric {
  parameter: string;
  baselineValue: number;
  unit: string;
  permissibleStandard: string;
  sampleLocation: string;
}

export interface EnvironmentalAssessment {
  id: string;
  projectId: string;
  projectName?: string;
  assessmentType: 'EIA' | 'SIA' | 'Biodiversity Assessment' | 'Hydrological Study' | 'Air Dispersion Model';
  leadConsultant: string;
  submissionDate: string;
  torApprovalDate?: string;
  publicHearingDate?: string;
  status: 'In Preparation' | 'ToR Approved' | 'Public Hearing Completed' | 'EIA Finalized' | 'Appraised by EAC';
  keyImpacts: {
    domain: 'Air Quality' | 'Water Resources' | 'Flora & Fauna' | 'Noise & Vibration' | 'Soil & Land' | 'Socio-Economic';
    severity: ImpactSeverity;
    reversibility: 'Reversible' | 'Partially Reversible' | 'Irreversible';
    mitigationStrategy: string;
    riskScore: number; // 1-25
  }[];
  baselineData: BaselineMetric[];
  reportDocumentUrl?: string;
  createdAt: string;
}

export interface RegulatoryApproval {
  id: string;
  projectId: string;
  projectName?: string;
  clearanceType:
    | 'Environmental Clearance (EC - MoEFCC)'
    | 'Forest Clearance (FC Stage 1)'
    | 'Forest Clearance (FC Stage 2)'
    | 'Wildlife Clearance (NBWL)'
    | 'Coastal Regulation Zone (CRZ)'
    | 'Consent to Establish (CTE - SPCB)'
    | 'Consent to Operate (CTO - SPCB)'
    | 'Groundwater Extraction NOC (CGWA)';
  issuingAuthority: string;
  applicationNumber: string;
  applicationDate: string;
  approvalDate?: string;
  validUntil?: string;
  slaDeadline: string;
  status: ApprovalStatus;
  conditionsCount: {
    total: number;
    complied: number;
    pending: number;
  };
  keyConditions: {
    id: string;
    conditionText: string;
    type: 'Specific Condition' | 'General Condition';
    status: ComplianceStatus;
    actionRequired: string;
  }[];
  approvalLetterUrl?: string;
  createdAt: string;
}

export interface MitigationMeasure {
  id: string;
  projectId: string;
  projectName?: string;
  title: string;
  description: string;
  category:
    | 'Compensatory Afforestation'
    | 'Air Quality & Dust Suppression'
    | 'Noise Barriers & Silencers'
    | 'Effluent & Wastewater Treatment'
    | 'Wildlife Passes & Eco-Ducts'
    | 'Soil Conservation & Slope Stabilization'
    | 'Solid & Hazardous Waste Management';
  assignedContractor: string;
  supervisingOfficer: string;
  allocatedBudgetUsd: number;
  spentBudgetUsd: number;
  targetCompletionDate: string;
  status: MitigationStatus;
  progressPercentage: number;
  lastInspectionDate: string;
  verificationEvidence?: string;
  createdAt: string;
}

export interface ComplianceDocument {
  id: string;
  projectId: string;
  projectName?: string;
  title: string;
  documentType:
    | 'Six-Monthly Compliance Report'
    | 'Environmental Clearance Letter'
    | 'Quarterly Ambient Monitoring Report'
    | 'Greenbelt Development Certificate'
    | 'Effluent Discharge Test Results'
    | 'Public Hearing Minutes'
    | 'Third-Party Environmental Audit';
  reportingPeriod?: string;
  submittedTo: string;
  submissionDate: string;
  fileSizeMb: number;
  fileFormat: string;
  version: string;
  status: 'Approved' | 'Submitted' | 'Draft' | 'Needs Revision';
  fileUrl: string;
  checksumSha256: string;
  createdAt: string;
}

export interface SensorTelemetry {
  id: string;
  projectId: string;
  stationName: string;
  location: { lat: number; lng: number };
  timestamp: string;
  aqi: number;
  pm25: number; // ug/m3
  pm10: number; // ug/m3
  so2: number; // ug/m3
  nox: number; // ug/m3
  noiseLevelDb: number;
  waterPh?: number;
  waterBod?: number; // mg/L
  waterCod?: number; // mg/L
  status: 'Normal' | 'Advisory' | 'Critical Threshold Exceeded';
}

export interface NonComplianceReport {
  id: string;
  projectId: string;
  projectName?: string;
  code: string;
  title: string;
  severity: NCRSeverity;
  identifiedBy: string;
  dateIssued: string;
  description: string;
  violatedRegulation: string;
  correctiveActionPlan?: string;
  assignedTo: string;
  dueDate: string;
  resolutionDate?: string;
  status: NCRStatus;
  evidencePhotoUrl?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  module: string;
  entityId: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  details: string;
}

export interface DashboardMetrics {
  totalProjects: number;
  activeProjects: number;
  overallComplianceRate: number; // %
  pendingClearancesCount: number;
  urgentClearancesSlaRisk: number;
  activeMitigationTasks: number;
  totalEmpBudgetUsdMillion: number;
  spentEmpBudgetUsdMillion: number;
  openNcrCount: number;
  criticalSensorAlerts: number;
  sectorDistribution: { name: string; value: number }[];
  complianceTrends: { month: string; score: number; incidents: number }[];
  projectRiskMatrix: { id: string; name: string; complianceScore: number; riskTier: string; pendingApprovals: number }[];
}
