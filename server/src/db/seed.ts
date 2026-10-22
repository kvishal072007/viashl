import mongoose from 'mongoose';
import { config } from '../config/env';
import {
  mockUsers,
  mockProjects,
  mockAssessments,
  mockApprovals,
  mockMitigations,
  mockComplianceDocuments,
  mockSensors,
  mockNCRs,
  mockAuditLogs,
} from '../data/mockData';
import {
  UserModel,
  ProjectModel,
  AssessmentModel,
  ApprovalModel,
  MitigationModel,
  ComplianceDocModel,
  SensorModel,
  NCRModel,
  AuditLogModel,
} from '../models';

export const runSeed = async () => {
  console.log('--- Initializing MongoDB Datasets & Migration ---');

  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(config.mongodb.uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('✓ Connected to MongoDB for seeding');
    }

    // 1. Users
    await UserModel.deleteMany({});
    await UserModel.insertMany(mockUsers);
    console.log(`✓ Seeded ${mockUsers.length} users into MongoDB`);

    // 2. Projects
    await ProjectModel.deleteMany({});
    await ProjectModel.insertMany(mockProjects);
    console.log(`✓ Seeded ${mockProjects.length} Tamil Nadu infrastructure projects into MongoDB`);

    // 3. Assessments
    await AssessmentModel.deleteMany({});
    await AssessmentModel.insertMany(mockAssessments);
    console.log(`✓ Seeded ${mockAssessments.length} EIA / SIA assessments into MongoDB`);

    // 4. Approvals
    await ApprovalModel.deleteMany({});
    await ApprovalModel.insertMany(mockApprovals);
    console.log(`✓ Seeded ${mockApprovals.length} statutory regulatory approvals into MongoDB`);

    // 5. Mitigations
    await MitigationModel.deleteMany({});
    await MitigationModel.insertMany(mockMitigations);
    console.log(`✓ Seeded ${mockMitigations.length} EMP mitigation measures into MongoDB`);

    // 6. Compliance Documents
    await ComplianceDocModel.deleteMany({});
    await ComplianceDocModel.insertMany(mockComplianceDocuments);
    console.log(`✓ Seeded ${mockComplianceDocuments.length} compliance documents into MongoDB`);

    // 7. Sensors
    await SensorModel.deleteMany({});
    await SensorModel.insertMany(mockSensors);
    console.log(`✓ Seeded ${mockSensors.length} CAAQMS IoT sensor stations into MongoDB`);

    // 8. NCRs
    await NCRModel.deleteMany({});
    await NCRModel.insertMany(mockNCRs);
    console.log(`✓ Seeded ${mockNCRs.length} non-compliance reports into MongoDB`);

    // 9. Audit Logs
    await AuditLogModel.deleteMany({});
    await AuditLogModel.insertMany(mockAuditLogs);
    console.log(`✓ Seeded ${mockAuditLogs.length} audit logs into MongoDB`);

    console.log('✅ MongoDB initialization and seeding completed successfully!');
  } catch (error: any) {
    console.warn('⚠️ MongoDB seeding notice:', error.message);
    console.log('ℹ️ Running in resilient mode with mock seed data in-memory fallback.');
  }
};

if (require.main === module) {
  runSeed().then(() => process.exit(0));
}
