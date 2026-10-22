-- PostgreSQL Schema for EnviroTrack Infra
-- Infrastructure Environmental Impact Assessment & Compliance Management System

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    department VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    sector VARCHAR(100) NOT NULL,
    phase VARCHAR(100) NOT NULL,
    location_lat DECIMAL(10, 7) NOT NULL,
    location_lng DECIMAL(10, 7) NOT NULL,
    location_address TEXT NOT NULL,
    location_state VARCHAR(100) NOT NULL,
    location_country VARCHAR(100) NOT NULL,
    eco_sensitive_zone_proximity_km DECIMAL(6, 2),
    protected_forest_distance_km DECIMAL(6, 2),
    estimated_cost_usd_million DECIMAL(12, 2) NOT NULL,
    allocated_emp_budget_usd_million DECIMAL(12, 2) NOT NULL,
    spent_emp_budget_usd_million DECIMAL(12, 2) DEFAULT 0,
    start_date DATE NOT NULL,
    target_completion_date DATE NOT NULL,
    project_head VARCHAR(255) NOT NULL,
    compliance_officer VARCHAR(255) NOT NULL,
    overall_compliance_score DECIMAL(5, 2) DEFAULT 85.0,
    risk_tier VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Environmental Impact Assessments
CREATE TABLE IF NOT EXISTS environmental_assessments (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
    assessment_type VARCHAR(100) NOT NULL,
    lead_consultant VARCHAR(255) NOT NULL,
    submission_date DATE NOT NULL,
    tor_approval_date DATE,
    public_hearing_date DATE,
    status VARCHAR(100) NOT NULL,
    key_impacts JSONB NOT NULL,
    baseline_data JSONB NOT NULL,
    report_document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Regulatory Approvals & Clearances
CREATE TABLE IF NOT EXISTS regulatory_approvals (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
    clearance_type VARCHAR(150) NOT NULL,
    issuing_authority VARCHAR(255) NOT NULL,
    application_number VARCHAR(100) NOT NULL,
    application_date DATE NOT NULL,
    approval_date DATE,
    valid_until DATE,
    sla_deadline DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    conditions_count JSONB NOT NULL,
    key_conditions JSONB NOT NULL,
    approval_letter_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Mitigation Measures & EMP
CREATE TABLE IF NOT EXISTS mitigation_measures (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(150) NOT NULL,
    assigned_contractor VARCHAR(255) NOT NULL,
    supervising_officer VARCHAR(255) NOT NULL,
    allocated_budget_usd DECIMAL(12, 2) NOT NULL,
    spent_budget_usd DECIMAL(12, 2) DEFAULT 0,
    target_completion_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    progress_percentage INTEGER DEFAULT 0,
    last_inspection_date DATE,
    verification_evidence TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Compliance Documents & Repository
CREATE TABLE IF NOT EXISTS compliance_documents (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    document_type VARCHAR(150) NOT NULL,
    reporting_period VARCHAR(100),
    submitted_to VARCHAR(255) NOT NULL,
    submission_date DATE NOT NULL,
    file_size_mb DECIMAL(6, 2) NOT NULL,
    file_format VARCHAR(20) NOT NULL,
    version VARCHAR(20) NOT NULL,
    status VARCHAR(50) NOT NULL,
    file_url TEXT NOT NULL,
    checksum_sha256 VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. IoT Sensor Telemetries
CREATE TABLE IF NOT EXISTS sensor_telemetries (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
    station_name VARCHAR(150) NOT NULL,
    location_lat DECIMAL(10, 7) NOT NULL,
    location_lng DECIMAL(10, 7) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    aqi INTEGER NOT NULL,
    pm25 DECIMAL(6, 2) NOT NULL,
    pm10 DECIMAL(6, 2) NOT NULL,
    so2 DECIMAL(6, 2) NOT NULL,
    nox DECIMAL(6, 2) NOT NULL,
    noise_level_db DECIMAL(5, 2) NOT NULL,
    water_ph DECIMAL(4, 2),
    water_bod DECIMAL(6, 2),
    water_cod DECIMAL(6, 2),
    status VARCHAR(50) NOT NULL
);

-- 8. Non-Compliance Reports (NCR)
CREATE TABLE IF NOT EXISTS non_compliance_reports (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    identified_by VARCHAR(255) NOT NULL,
    date_issued DATE NOT NULL,
    description TEXT NOT NULL,
    violated_regulation VARCHAR(255) NOT NULL,
    corrective_action_plan TEXT,
    assigned_to VARCHAR(255) NOT NULL,
    due_date DATE NOT NULL,
    resolution_date DATE,
    status VARCHAR(50) NOT NULL,
    evidence_photo_url TEXT
);

-- 9. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    module VARCHAR(100) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    ip_address VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    details TEXT NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_sector ON projects(sector);
CREATE INDEX IF NOT EXISTS idx_projects_phase ON projects(phase);
CREATE INDEX IF NOT EXISTS idx_approvals_project ON regulatory_approvals(project_id);
CREATE INDEX IF NOT EXISTS idx_approvals_status ON regulatory_approvals(status);
CREATE INDEX IF NOT EXISTS idx_mitigations_project ON mitigation_measures(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_project ON compliance_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_sensors_project ON sensor_telemetries(project_id);
CREATE INDEX IF NOT EXISTS idx_ncr_project ON non_compliance_reports(project_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp DESC);
