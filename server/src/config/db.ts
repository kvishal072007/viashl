import mongoose from 'mongoose';
import { config } from './env';
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

let isMongoConnected = false;

export const connectDatabase = async (): Promise<boolean> => {
  try {
    // Attempt MongoDB connection with 4 second timeout
    await mongoose.connect(config.mongodb.uri, {
      serverSelectionTimeoutMS: 4000,
    });
    isMongoConnected = true;
    console.log('Database connected: 🍃 MongoDB Connected successfully');

    // Seed mock data into MongoDB if collections are empty
    await seedMongoIfEmpty();

    return true;
  } catch (err: any) {
    isMongoConnected = false;
    console.log('Database connected: 🍃 MongoDB (In-Memory Fallback Active)');
    return false;
  }
};

const seedMongoIfEmpty = async () => {
  try {
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      console.log('🍃 Initializing MongoDB with Tamil Nadu Project Datasets...');
      await UserModel.insertMany(mockUsers);
      await ProjectModel.insertMany(mockProjects);
      await AssessmentModel.insertMany(mockAssessments);
      await ApprovalModel.insertMany(mockApprovals);
      await MitigationModel.insertMany(mockMitigations);
      await ComplianceDocModel.insertMany(mockComplianceDocuments);
      await SensorModel.insertMany(mockSensors);
      await NCRModel.insertMany(mockNCRs);
      await AuditLogModel.insertMany(mockAuditLogs);
      console.log('🍃 MongoDB successfully seeded with Tamil Nadu Infrastructure Cases');
    }
  } catch (err: any) {
    console.warn('MongoDB seed notice:', err.message);
  }
};

export const checkDbConnection = async (): Promise<boolean> => {
  return isMongoConnected && mongoose.connection.readyState === 1;
};

export { isMongoConnected };
