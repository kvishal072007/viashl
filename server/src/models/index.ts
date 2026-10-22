import mongoose, { Schema, Document } from 'mongoose';
import {
  Project,
  EnvironmentalAssessment,
  RegulatoryApproval,
  MitigationMeasure,
  ComplianceDocument,
  SensorTelemetry,
  NonComplianceReport,
  AuditLogItem,
  User,
} from '../types';

// ==================== USER SCHEMA ====================
export interface IUserDocument extends Omit<User, 'id'>, Document {
  id: string;
}

const UserSchema = new Schema<IUserDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['ADMIN', 'ENVIRONMENTAL_OFFICER', 'COMPLIANCE_AUDITOR', 'PROJECT_MANAGER', 'REGULATORY_AUTHORITY'],
      required: true,
    },
    department: { type: String, required: true },
    organization: { type: String, required: true },
    avatarUrl: { type: String },
  },
  { timestamps: true }
);

// ==================== PROJECT SCHEMA ====================
export interface IProjectDocument extends Omit<Project, 'id'>, Document {
  id: string;
}

const ProjectSchema = new Schema<IProjectDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    code: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    sector: { type: String, required: true },
    phase: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      ecoSensitiveZoneProximityKm: { type: Number, required: true },
      protectedForestDistanceKm: { type: Number, required: true },
    },
    estimatedCostUsdMillion: { type: Number, required: true },
    allocatedEmpBudgetUsdMillion: { type: Number, required: true },
    spentEmpBudgetUsdMillion: { type: Number, required: true },
    startDate: { type: String, required: true },
    targetCompletionDate: { type: String, required: true },
    projectHead: { type: String, required: true },
    complianceOfficer: { type: String, required: true },
    overallComplianceScore: { type: Number, required: true },
    riskTier: { type: String, required: true },
  },
  { timestamps: true }
);

// ==================== ASSESSMENT SCHEMA ====================
export interface IAssessmentDocument extends Omit<EnvironmentalAssessment, 'id'>, Document {
  id: string;
}

const AssessmentSchema = new Schema<IAssessmentDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    projectId: { type: String, required: true, index: true },
    projectName: { type: String, required: true },
    assessmentType: { type: String, required: true },
    leadConsultant: { type: String, required: true },
    submissionDate: { type: String, required: true },
    torApprovalDate: { type: String },
    publicHearingDate: { type: String },
    status: { type: String, required: true },
    keyImpacts: [
      {
        domain: { type: String, required: true },
        severity: { type: String, required: true },
        reversibility: { type: String, required: true },
        mitigationStrategy: { type: String, required: true },
        riskScore: { type: Number, required: true },
      },
    ],
    baselineData: [
      {
        parameter: { type: String, required: true },
        baselineValue: { type: Number, required: true },
        unit: { type: String, required: true },
        permissibleStandard: { type: String, required: true },
        sampleLocation: { type: String, required: true },
      },
    ],
    reportDocumentUrl: { type: String },
  },
  { timestamps: true }
);

// ==================== APPROVAL SCHEMA ====================
export interface IApprovalDocument extends Omit<RegulatoryApproval, 'id'>, Document {
  id: string;
}

const ApprovalSchema = new Schema<IApprovalDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    projectId: { type: String, required: true, index: true },
    projectName: { type: String, required: true },
    clearanceType: { type: String, required: true },
    issuingAuthority: { type: String, required: true },
    applicationNumber: { type: String, required: true },
    applicationDate: { type: String, required: true },
    approvalDate: { type: String },
    validUntil: { type: String },
    slaDeadline: { type: String, required: true },
    status: { type: String, required: true },
    conditionsCount: {
      total: { type: Number, required: true },
      complied: { type: Number, required: true },
      pending: { type: Number, required: true },
    },
    keyConditions: [
      {
        id: { type: String, required: true },
        conditionText: { type: String, required: true },
        type: { type: String, required: true },
        status: { type: String, required: true },
        actionRequired: { type: String, required: true },
      },
    ],
    approvalLetterUrl: { type: String },
  },
  { timestamps: true }
);

// ==================== MITIGATION SCHEMA ====================
export interface IMitigationDocument extends Omit<MitigationMeasure, 'id'>, Document {
  id: string;
}

const MitigationSchema = new Schema<IMitigationDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    projectId: { type: String, required: true, index: true },
    projectName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    assignedContractor: { type: String, required: true },
    supervisingOfficer: { type: String, required: true },
    allocatedBudgetUsd: { type: Number, required: true },
    spentBudgetUsd: { type: Number, required: true },
    targetCompletionDate: { type: String, required: true },
    status: { type: String, required: true },
    progressPercentage: { type: Number, required: true },
    lastInspectionDate: { type: String, required: true },
    verificationEvidence: { type: String },
  },
  { timestamps: true }
);

// ==================== COMPLIANCE DOC SCHEMA ====================
export interface IComplianceDocDocument extends Omit<ComplianceDocument, 'id'>, Document {
  id: string;
}

const ComplianceDocSchema = new Schema<IComplianceDocDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    projectId: { type: String, required: true, index: true },
    projectName: { type: String },
    title: { type: String, required: true },
    documentType: { type: String, required: true },
    reportingPeriod: { type: String },
    submittedTo: { type: String, required: true },
    submissionDate: { type: String, required: true },
    fileSizeMb: { type: Number, required: true },
    fileFormat: { type: String, required: true },
    version: { type: String, required: true },
    status: { type: String, required: true },
    fileUrl: { type: String, required: true },
    checksumSha256: { type: String, required: true },
  },
  { timestamps: true }
);

// ==================== SENSOR SCHEMA ====================
export interface ISensorDocument extends Omit<SensorTelemetry, 'id'>, Document {
  id: string;
}

const SensorSchema = new Schema<ISensorDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    projectId: { type: String, required: true, index: true },
    stationName: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    timestamp: { type: String, required: true },
    aqi: { type: Number, required: true },
    pm25: { type: Number, required: true },
    pm10: { type: Number, required: true },
    so2: { type: Number, required: true },
    nox: { type: Number, required: true },
    noiseLevelDb: { type: Number, required: true },
    waterPh: { type: Number },
    waterBod: { type: Number },
    waterCod: { type: Number },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

// ==================== NCR SCHEMA ====================
export interface INCRDocument extends Omit<NonComplianceReport, 'id'>, Document {
  id: string;
}

const NCRSchema = new Schema<INCRDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    projectId: { type: String, required: true, index: true },
    projectName: { type: String },
    code: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    severity: { type: String, required: true },
    identifiedBy: { type: String, required: true },
    dateIssued: { type: String, required: true },
    description: { type: String, required: true },
    violatedRegulation: { type: String, required: true },
    correctiveActionPlan: { type: String },
    assignedTo: { type: String, required: true },
    dueDate: { type: String, required: true },
    resolutionDate: { type: String },
    status: { type: String, required: true },
    evidencePhotoUrl: { type: String },
  },
  { timestamps: true }
);

// ==================== AUDIT LOG SCHEMA ====================
export interface IAuditLogDocument extends Omit<AuditLogItem, 'id'>, Document {
  id: string;
}

const AuditLogSchema = new Schema<IAuditLogDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    timestamp: { type: String, required: true },
    user: { type: String, required: true },
    role: { type: String, required: true },
    action: { type: String, required: true },
    module: { type: String, required: true },
    entityId: { type: String, required: true },
    ipAddress: { type: String, required: true },
    status: { type: String, required: true },
    details: { type: String, required: true },
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
export const ProjectModel = mongoose.models.Project || mongoose.model<IProjectDocument>('Project', ProjectSchema);
export const AssessmentModel = mongoose.models.Assessment || mongoose.model<IAssessmentDocument>('Assessment', AssessmentSchema);
export const ApprovalModel = mongoose.models.Approval || mongoose.model<IApprovalDocument>('Approval', ApprovalSchema);
export const MitigationModel = mongoose.models.Mitigation || mongoose.model<IMitigationDocument>('Mitigation', MitigationSchema);
export const ComplianceDocModel = mongoose.models.ComplianceDoc || mongoose.model<IComplianceDocDocument>('ComplianceDoc', ComplianceDocSchema);
export const SensorModel = mongoose.models.Sensor || mongoose.model<ISensorDocument>('Sensor', SensorSchema);
export const NCRModel = mongoose.models.NCR || mongoose.model<INCRDocument>('NCR', NCRSchema);
export const AuditLogModel = mongoose.models.AuditLog || mongoose.model<IAuditLogDocument>('AuditLog', AuditLogSchema);
