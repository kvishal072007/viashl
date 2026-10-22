// Central Data Store strictly adhering to the user's 12-Module specifications

export type ProjectType =
  | 'Highway'
  | 'Railway'
  | 'Bridge'
  | 'Dam'
  | 'Building'
  | 'Airport'
  | 'Industrial Project'
  | 'Water Project';

export type ProjectStatus =
  | 'Planning'
  | 'Under Review'
  | 'Approved'
  | 'Under Construction'
  | 'Completed'
  | 'On Hold';

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type RiskStatus = 'Open' | 'Under Mitigation' | 'Resolved' | 'Closed';
export type ApprovalStatus = 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Expired';
export type MitigationStatus = 'Pending' | 'In Progress' | 'Completed';
export type MonitoringStatus = 'Normal' | 'Alert' | 'Critical';
export type ComplianceStatus = 'Pending' | 'In Progress' | 'Completed' | 'Overdue' | 'Non-Compliant';
export type DeadlineStatus = 'Upcoming' | 'Due Today' | 'Overdue' | 'Completed';

// 02. Project Model
export interface ProjectItem {
  id: string; // Project ID
  name: string;
  type: ProjectType;
  location: string;
  description: string;
  owner: string; // Department / Project Owner
  startDate: string;
  expectedEndDate: string;
  status: ProjectStatus;
  budgetMillion?: number;
}

// 03. Environmental Assessment Model
export interface AssessmentItem {
  id: string;
  projectId: string;
  category: 'Air' | 'Water' | 'Noise' | 'Soil/Land' | 'Vegetation' | 'Biodiversity' | 'Waste';
  impact: string;
  description: string;
  severity: SeverityLevel;
  affectedArea: string;
  assessmentDate: string;
  remarks: string;
}

// 04. Environmental Risk Model (Connected to Assessment)
export interface RiskItem {
  id: string; // Risk ID
  projectId: string;
  riskName: string;
  riskCategory: string;
  description: string;
  severity: SeverityLevel;
  probability: 'Low' | 'Medium' | 'High';
  riskLevel: RiskLevel;
  status: RiskStatus;
  identifiedDate: string;
  responsiblePerson: string;
  relatedAssessmentImpact?: string; // Direct Assessment link
}

// 05. Approval Management Model
export interface ApprovalItem {
  id: string; // Approval ID
  projectId: string;
  approvalName: string;
  approvalType: string;
  authority: string;
  applicationDate: string;
  approvalDate: string;
  expiryDate: string;
  status: ApprovalStatus;
  document: string;
  remarks: string;
}

// 06. Mitigation Measures Model (Connected to Risk)
export interface MitigationItem {
  id: string; // Mitigation ID
  projectId: string;
  relatedRisk: string; // RISK -> MITIGATION -> ACTION
  problem: string;
  mitigationAction: string;
  responsiblePerson: string;
  startDate: string;
  dueDate: string;
  status: MitigationStatus;
  completionDate?: string;
  remarks: string;
}

// 07. Environmental Monitoring Model (Actual vs Allowed)
export interface MonitoringItem {
  id: string; // Monitoring ID
  projectId: string;
  parameter: string; // Air, Water, Noise, Soil, Waste
  location: string;
  measuredValue: string;
  allowedLimit: string;
  monitoringDate: string;
  status: MonitoringStatus;
  remarks: string;
}

// 08. Compliance Management Model
export interface ComplianceItem {
  id: string; // Compliance ID
  projectId: string;
  requirement: string;
  relatedApproval: string;
  dueDate: string;
  responsiblePerson: string;
  status: ComplianceStatus;
  evidenceDocument: string;
  remarks: string;
}

// 09. Document Management Model
export interface DocumentItem {
  id: string;
  name: string;
  projectId: string;
  documentType:
    | 'Environmental Assessment Report'
    | 'Environmental Approval'
    | 'Risk Assessment'
    | 'Mitigation Report'
    | 'Monitoring Report'
    | 'Compliance Report'
    | 'Government Certificate';
  uploadedBy: string;
  uploadDate: string;
  version: string;
  fileSize: string;
  fileUrl: string;
}

// 10. Deadline + Notification Model
export interface DeadlineItem {
  id: string;
  title: string;
  projectId: string;
  dueDate: string;
  status: DeadlineStatus;
  notificationMessage: string;
  responsiblePerson: string;
  category: 'Compliance' | 'Approval' | 'Monitoring' | 'Mitigation';
}

// 12. Audit Log Model
export interface AuditItem {
  id: string;
  user: string;
  action: string;
  module: string;
  date: string;
  time: string;
  description: string;
}

// Initial Shared Datasets
export const initialProjects: ProjectItem[] = [
  {
    id: 'PRJ-001',
    name: 'Chennai Highway Expansion (Madhavaram - SIPCOT)',
    type: 'Highway',
    location: 'Chennai & Kanchipuram, Tamil Nadu',
    description: '6-lane highway expansion with grade separators, wildlife underpasses, and greenbelt development.',
    owner: 'Highways & Minor Ports Department, Govt of Tamil Nadu',
    startDate: '2024-03-01',
    expectedEndDate: '2027-06-30',
    status: 'Under Construction',
    budgetMillion: 240,
  },
  {
    id: 'PRJ-002',
    name: 'Mettur Secondary Dam & Irrigation Canal',
    type: 'Dam',
    location: 'Salem & Erode Districts, Tamil Nadu',
    description: 'Storage reservoir and 48km concrete lining canal network for flood mitigation and irrigation.',
    owner: 'Water Resources Department (WRD), Govt of Tamil Nadu',
    startDate: '2023-11-15',
    expectedEndDate: '2028-12-31',
    status: 'Under Review',
    budgetMillion: 410,
  },
  {
    id: 'PRJ-003',
    name: 'Madhavaram Metro Rail Transit Hub',
    type: 'Railway',
    location: 'Madhavaram, North Chennai',
    description: 'Intermodal terminal with elevated viaducts, metro maintenance depot, and multi-tier parking.',
    owner: 'Chennai Metro Rail Limited (CMRL)',
    startDate: '2024-01-10',
    expectedEndDate: '2027-12-31',
    status: 'Under Construction',
    budgetMillion: 320,
  },
  {
    id: 'PRJ-004',
    name: 'Greenfield Chennai International Airport, Parandur',
    type: 'Airport',
    location: 'Parandur, Kanchipuram District',
    description: 'Greenfield international airport with dual code-F runways, passenger terminals, and cargo apron.',
    owner: 'TIDCO (Tamil Nadu Industrial Development Corporation)',
    startDate: '2024-06-15',
    expectedEndDate: '2029-12-31',
    status: 'Approved',
    budgetMillion: 1800,
  },
  {
    id: 'PRJ-005',
    name: 'Kosasthalaiyar River & Ennore Creek Restoration',
    type: 'Water Project',
    location: 'Ennore, Chennai',
    description: 'River mouth ecological dredging, industrial oil sludge removal, and mangrove replantation.',
    owner: 'Environment, Climate Change and Forests Dept, Tamil Nadu',
    startDate: '2024-02-01',
    expectedEndDate: '2026-11-30',
    status: 'Under Construction',
    budgetMillion: 85,
  },
  {
    id: 'PRJ-006',
    name: 'Coimbatore-Mettupalayam Eco-Transit Corridor',
    type: 'Highway',
    location: 'Coimbatore District, Western Ghats',
    description: '4-lane bypass with 3 dedicated elephant overpasses and acoustic sensory fencing.',
    owner: 'National Highways Authority of India (NHAI)',
    startDate: '2024-04-01',
    expectedEndDate: '2027-08-31',
    status: 'Planning',
    budgetMillion: 175,
  },
];

export const initialAssessments: AssessmentItem[] = [
  // PRJ-001 Highway
  {
    id: 'ASM-101',
    projectId: 'PRJ-001',
    category: 'Air',
    impact: 'Dust & Vehicle Emissions',
    description: 'Excavation dust, heavy tipper truck exhaust, and bitumen smoke during asphalt paving.',
    severity: 'High',
    affectedArea: 'Madhavaram and Porur corridor villages (20 km stretch)',
    assessmentDate: '2024-04-12',
    remarks: 'Requires regular mobile fogger cannons and covered aggregate haulage.',
  },
  {
    id: 'ASM-102',
    projectId: 'PRJ-001',
    category: 'Water',
    impact: 'Drainage & Surface Water Runoff',
    description: 'Silt washout into Otteri Nullah canal and nearby irrigation tanks.',
    severity: 'Medium',
    affectedArea: 'Roadside canal crossings and downstream ponds',
    assessmentDate: '2024-04-14',
    remarks: 'Silt traps and temporary retention basins required prior to earthwork.',
  },
  {
    id: 'ASM-103',
    projectId: 'PRJ-001',
    category: 'Noise',
    impact: 'Construction & Traffic Noise',
    description: 'Excavators, hydraulic rock breakers, and vibratory road rollers exceeding residential limits.',
    severity: 'High',
    affectedArea: 'Residential settlements along Highway Right-of-Way',
    assessmentDate: '2024-04-15',
    remarks: 'Acoustic sound damping barriers (4m height) near schools and hospitals.',
  },
  {
    id: 'ASM-104',
    projectId: 'PRJ-001',
    category: 'Vegetation',
    impact: 'Tree Cutting & Loss of Canopy',
    description: '150 mature roadside trees (Neem, Tamarind, Banyan) identified for felling.',
    severity: 'High',
    affectedArea: 'Corridor median and shoulders (Chainage 0+000 to 20+000)',
    assessmentDate: '2024-04-16',
    remarks: 'Mandatory 1:2 compensatory tree plantation (300 saplings) by contractor.',
  },
  {
    id: 'ASM-105',
    projectId: 'PRJ-001',
    category: 'Soil/Land',
    impact: 'Soil Erosion & Slope Disturbance',
    description: 'Stripping of agricultural topsoil and erosion on embankment cuts.',
    severity: 'Medium',
    affectedArea: 'Embankment slopes and borrow pits',
    assessmentDate: '2024-04-18',
    remarks: 'Topsoil preservation banks and geotextile slope turfing required.',
  },
  {
    id: 'ASM-106',
    projectId: 'PRJ-001',
    category: 'Waste',
    impact: 'Construction Demolition Debris',
    description: 'Milled pavement bituminous waste, concrete rubble, and empty asphalt containers.',
    severity: 'Medium',
    affectedArea: 'Contractor yards and transit stock areas',
    assessmentDate: '2024-04-20',
    remarks: 'Recycling of milled asphalt and disposal to TNPCB authorized facility.',
  },

  // PRJ-002 Dam
  {
    id: 'ASM-201',
    projectId: 'PRJ-002',
    category: 'Water',
    impact: 'Downstream Water Flow & Quality',
    description: 'River sediment trapping behind dam wall and downstream water temperature shifts.',
    severity: 'High',
    affectedArea: 'Kaveri downstream riverbed (45 km)',
    assessmentDate: '2024-02-10',
    remarks: 'Mandatory minimum ecological environmental flow (e-flow) must be released.',
  },
  {
    id: 'ASM-202',
    projectId: 'PRJ-002',
    category: 'Biodiversity',
    impact: 'Aquatic Life & Fish Migration',
    description: 'Disruption of native freshwater fish breeding routes and riverine biodiversity.',
    severity: 'High',
    affectedArea: 'Reservoir submergence basin',
    assessmentDate: '2024-02-12',
    remarks: 'Fish ladder bypass channel incorporated into civil engineering design.',
  },
  {
    id: 'ASM-203',
    projectId: 'PRJ-002',
    category: 'Vegetation',
    impact: 'Forest Submergence & Vegetation Loss',
    description: 'Submergence of 340 hectares of scrub jungle and riparian tree cover.',
    severity: 'Critical',
    affectedArea: 'Reservoir storage basin (340 hectares)',
    assessmentDate: '2024-02-14',
    remarks: 'Stage-II Forest Clearance and compensatory afforestation of 680 hectares.',
  },

  // PRJ-003 Building / Metro
  {
    id: 'ASM-301',
    projectId: 'PRJ-003',
    category: 'Air',
    impact: 'Dust & Subsurface Particulate Spikes',
    description: 'Tunnel excavation muck handling and batching plant dust in dense city zone.',
    severity: 'High',
    affectedArea: 'Madhavaram Junction (500m radius)',
    assessmentDate: '2024-03-05',
    remarks: 'Enclosed conveyor systems and wet mist sprays at muck pits.',
  },
  {
    id: 'ASM-302',
    projectId: 'PRJ-003',
    category: 'Noise',
    impact: 'Tunnel Boring & Pile Rig Noise',
    description: 'Continuous low-frequency vibration and heavy compressor noise.',
    severity: 'High',
    affectedArea: 'Surrounding residential complexes',
    assessmentDate: '2024-03-08',
    remarks: 'Continuous seismic vibration monitors and nocturnal acoustic mufflers.',
  },
];

export const initialRisks: RiskItem[] = [
  // PRJ-001 Highway Risks (Directly linked from Assessment)
  {
    id: 'RSK-101',
    projectId: 'PRJ-001',
    riskName: 'Air Pollution Spikes (PM10 > 150 µg/m³)',
    riskCategory: 'Air Pollution',
    description: 'Excessive ambient dust from dry excavation and truck transit affecting roadside residential communities.',
    severity: 'High',
    probability: 'High',
    riskLevel: 'High',
    status: 'Under Mitigation',
    identifiedDate: '2024-04-13',
    responsiblePerson: 'Er. K. Ramesh (Project Director, Highways)',
    relatedAssessmentImpact: 'Dust & Vehicle Emissions',
  },
  {
    id: 'RSK-102',
    projectId: 'PRJ-001',
    riskName: 'Tree & Vegetation Loss (150 Roadside Trees)',
    riskCategory: 'Tree / Vegetation Loss',
    description: 'Loss of mature green cover leading to micro-climate heat island effect and habitat disruption.',
    severity: 'High',
    probability: 'High',
    riskLevel: 'High',
    status: 'Under Mitigation',
    identifiedDate: '2024-04-17',
    responsiblePerson: 'District Forest Officer & Project Horticulturist',
    relatedAssessmentImpact: 'Tree Cutting & Loss of Canopy',
  },
  {
    id: 'RSK-103',
    projectId: 'PRJ-001',
    riskName: 'Water Siltation in Irrigation Canals',
    riskCategory: 'Water Pollution',
    description: 'Unfiltered muddy construction runoff clogging local agriculture irrigation feeder channels.',
    severity: 'Medium',
    probability: 'Medium',
    riskLevel: 'Medium',
    status: 'Open',
    identifiedDate: '2024-04-15',
    responsiblePerson: 'Site Environmental Engineer',
    relatedAssessmentImpact: 'Drainage & Surface Water Runoff',
  },
  {
    id: 'RSK-104',
    projectId: 'PRJ-001',
    riskName: 'Construction Equipment Noise Exceedance',
    riskCategory: 'Noise Pollution',
    description: 'Continuous drilling and pavement breakers generating 82 dB noise exceeding 65 dB day limit.',
    severity: 'High',
    probability: 'High',
    riskLevel: 'High',
    status: 'Under Mitigation',
    identifiedDate: '2024-04-16',
    responsiblePerson: 'EPC Safety Officer',
    relatedAssessmentImpact: 'Construction & Traffic Noise',
  },
  {
    id: 'RSK-105',
    projectId: 'PRJ-001',
    riskName: 'Embankment Slope Washout & Topsoil Loss',
    riskCategory: 'Soil Erosion',
    description: 'Monsoonal heavy rainfall washing down unprotected highway cutting slopes.',
    severity: 'Medium',
    probability: 'Medium',
    riskLevel: 'Medium',
    status: 'Resolved',
    identifiedDate: '2024-04-19',
    responsiblePerson: 'Senior Geotechnical Engineer',
    relatedAssessmentImpact: 'Soil Erosion & Slope Disturbance',
  },
  {
    id: 'RSK-106',
    projectId: 'PRJ-001',
    riskName: 'Uncontrolled Construction Bitumen Debris',
    riskCategory: 'Construction Waste',
    description: 'Illegal dumping of milled asphalt and bitumen residue into nearby open vacant lands.',
    severity: 'Medium',
    probability: 'Low',
    riskLevel: 'Low',
    status: 'Resolved',
    identifiedDate: '2024-04-21',
    responsiblePerson: 'Waste Logistics Manager',
    relatedAssessmentImpact: 'Construction Demolition Debris',
  },

  // PRJ-002 Dam Risks
  {
    id: 'RSK-201',
    projectId: 'PRJ-002',
    riskName: 'Reservoir Submergence Forest Loss',
    riskCategory: 'Forest / Vegetation Loss',
    description: 'Loss of 340 hectares of indigenous flora requiring equivalent compensatory non-forest land.',
    severity: 'Critical',
    probability: 'High',
    riskLevel: 'Critical',
    status: 'Under Mitigation',
    identifiedDate: '2024-02-15',
    responsiblePerson: 'Conservator of Forests, Salem',
    relatedAssessmentImpact: 'Forest Submergence & Vegetation Loss',
  },
  {
    id: 'RSK-202',
    projectId: 'PRJ-002',
    riskName: 'Native Fish Migration Obstruction',
    riskCategory: 'Aquatic Life Impact',
    description: 'Total dam obstruction to endemic freshwater fish breeding runs upriver.',
    severity: 'High',
    probability: 'High',
    riskLevel: 'High',
    status: 'Open',
    identifiedDate: '2024-02-13',
    responsiblePerson: 'State Fisheries Consultant',
    relatedAssessmentImpact: 'Aquatic Life & Fish Migration',
  },
  {
    id: 'RSK-203',
    projectId: 'PRJ-002',
    riskName: 'Downstream Low Ecological Flow',
    riskCategory: 'Water Quality Impact',
    description: 'Excessive water impoundment drying out downstream river ecosystems.',
    severity: 'Critical',
    probability: 'Medium',
    riskLevel: 'Critical',
    status: 'Under Mitigation',
    identifiedDate: '2024-02-11',
    responsiblePerson: 'Chief Engineer, Water Resources Dept',
    relatedAssessmentImpact: 'Downstream Water Flow & Quality',
  },

  // PRJ-003 Metro Hub Risks
  {
    id: 'RSK-301',
    projectId: 'PRJ-003',
    riskName: 'Dense Urban Dust Spikes (PM2.5 > 80 µg/m³)',
    riskCategory: 'Dust Pollution',
    description: 'Tunnel excavation muck transport creating severe dust on busy urban roads.',
    severity: 'High',
    probability: 'High',
    riskLevel: 'High',
    status: 'Under Mitigation',
    identifiedDate: '2024-03-06',
    responsiblePerson: 'Environmental Specialist, CMRL',
    relatedAssessmentImpact: 'Dust & Subsurface Particulate Spikes',
  },
];

export const initialApprovals: ApprovalItem[] = [
  {
    id: 'APP-001',
    projectId: 'PRJ-001',
    approvalName: 'Environmental Clearance (EC)',
    approvalType: 'Environmental Clearance',
    authority: 'State Level Environment Impact Assessment Authority (SEIAA-TN)',
    applicationDate: '2023-08-10',
    approvalDate: '2024-01-20',
    expiryDate: '2031-01-19',
    status: 'Approved',
    document: 'EC_Chennai_Highway_SEIAA_2024.pdf',
    remarks: 'Approved with 24 specific conditions including 1:2 tree replantation and ambient air monitoring.',
  },
  {
    id: 'APP-002',
    projectId: 'PRJ-001',
    approvalName: 'Consent to Establish (CTE - Air & Water)',
    approvalType: 'Pollution Control Consent',
    authority: 'Tamil Nadu Pollution Control Board (TNPCB)',
    applicationDate: '2023-10-05',
    approvalDate: '2024-02-15',
    expiryDate: '2029-02-14',
    status: 'Approved',
    document: 'CTE_TNPCB_Highway_2024.pdf',
    remarks: 'Requires wet scrubbers on batching plants and continuous noise shields.',
  },
  {
    id: 'APP-003',
    projectId: 'PRJ-002',
    approvalName: 'Forest Clearance (FC Stage II)',
    approvalType: 'Forest Clearance',
    authority: 'MoEFCC Forest Conservation Division, New Delhi',
    applicationDate: '2023-05-12',
    approvalDate: '2024-03-30',
    expiryDate: '2054-03-29',
    status: 'Approved',
    document: 'FC_Stage2_Mettur_Dam_MoEFCC.pdf',
    remarks: '680 hectares compensatory afforestation deposited in CAMPA fund.',
  },
  {
    id: 'APP-004',
    projectId: 'PRJ-002',
    approvalName: 'Environmental Clearance for Dam & Irrigation',
    approvalType: 'Environmental Clearance',
    authority: 'MoEFCC Expert Appraisal Committee (EAC River Valley)',
    applicationDate: '2023-09-20',
    approvalDate: '',
    expiryDate: '',
    status: 'Under Review',
    document: 'EAC_Scrutiny_Dam_2024.pdf',
    remarks: 'Clarifications sought regarding minimum e-flow during non-monsoon months.',
  },
  {
    id: 'APP-005',
    projectId: 'PRJ-004',
    approvalName: 'Environmental Clearance for Parandur Airport',
    approvalType: 'Environmental Clearance',
    authority: 'Ministry of Environment, Forest and Climate Change (MoEFCC)',
    applicationDate: '2023-12-01',
    approvalDate: '2024-06-15',
    expiryDate: '2034-06-14',
    status: 'Approved',
    document: 'MoEFCC_EC_Parandur_Airport_2024.pdf',
    remarks: 'Approved with condition to maintain 3,200 acres natural flood retention marshlands.',
  },
  {
    id: 'APP-006',
    projectId: 'PRJ-005',
    approvalName: 'CRZ Clearance for Ennore Creek Dredging',
    approvalType: 'Coastal Regulation Zone',
    authority: 'Tamil Nadu State Coastal Zone Management Authority (TNCZMA)',
    applicationDate: '2023-11-18',
    approvalDate: '2024-02-28',
    expiryDate: '2029-02-27',
    status: 'Approved',
    document: 'TNCZMA_CRZ_Clearance_Ennore.pdf',
    remarks: 'Mandates zero liquid discharge of petrochemical slurry into tidal water.',
  },
];

export const initialMitigations: MitigationItem[] = [
  // PRJ-001 Highway Mitigations
  {
    id: 'MIT-001',
    projectId: 'PRJ-001',
    relatedRisk: 'Air Pollution Spikes (PM10 > 150 µg/m³)',
    problem: 'Dry earth excavation and heavy vehicle transit causing high particulate air pollution.',
    mitigationAction: 'Regular high-pressure water spraying using 14 mobile fogger cannons every 2 hours.',
    responsiblePerson: 'Site Environmental Engineer (L&T Infra)',
    startDate: '2024-04-15',
    dueDate: '2027-06-30',
    status: 'In Progress',
    remarks: 'Daily water spray logs maintained; particulate dust reduced by 64% in residential zones.',
  },
  {
    id: 'MIT-002',
    projectId: 'PRJ-001',
    relatedRisk: 'Tree & Vegetation Loss (150 Roadside Trees)',
    problem: 'Felling of 150 mature roadside trees along corridor widening stretch.',
    mitigationAction: 'Compensatory Tree Plantation of 300 native saplings (Neem, Pungan, Tamarind) at 1:2 ratio.',
    responsiblePerson: 'District Forest Officer & EPC Horticultural Team',
    startDate: '2024-05-01',
    dueDate: '2025-05-01',
    status: 'In Progress',
    remarks: '185 saplings planted to date with drip irrigation; survival rate verified at 94%.',
  },
  {
    id: 'MIT-003',
    projectId: 'PRJ-001',
    relatedRisk: 'Construction Equipment Noise Exceedance',
    problem: 'Pneumatic breakers generating 82 dB noise near residential colonies.',
    mitigationAction: 'Noise control acoustic barriers (4m height) and restricted working hours (no night drilling).',
    responsiblePerson: 'Safety & Environment Officer',
    startDate: '2024-04-20',
    dueDate: '2026-12-31',
    status: 'In Progress',
    remarks: 'Acoustic dampers installed on all stationary compressors; night shifts restricted to silent tasks.',
  },
  {
    id: 'MIT-004',
    projectId: 'PRJ-001',
    relatedRisk: 'Water Siltation in Irrigation Canals',
    problem: 'Construction mud runoff entering roadside Otteri Nullah canal.',
    mitigationAction: 'Construct temporary sediment retention catch basins and straw-bale silt barriers.',
    responsiblePerson: 'Civil Drainage Supervisor',
    startDate: '2024-04-22',
    dueDate: '2024-06-15',
    status: 'Completed',
    completionDate: '2024-06-10',
    remarks: '6 sedimentation basins completed; clear discharge observed during pre-monsoon showers.',
  },

  // PRJ-002 Dam Mitigations
  {
    id: 'MIT-005',
    projectId: 'PRJ-002',
    relatedRisk: 'Reservoir Submergence Forest Loss',
    problem: '340 hectares of reserved forest land submerged under reservoir.',
    mitigationAction: 'Compensatory Afforestation on 680 hectares non-forest government land with native species.',
    responsiblePerson: 'State CAMPA Authority & Forest Dept',
    startDate: '2024-04-01',
    dueDate: '2027-03-31',
    status: 'In Progress',
    remarks: 'Budget allocated; nursery preparation for 450,000 indigenous saplings completed.',
  },
];

export const initialMonitoring: MonitoringItem[] = [
  {
    id: 'MON-001',
    projectId: 'PRJ-001',
    parameter: 'Air Quality (PM10)',
    location: 'Madhavaram Junction (Chainage 2+400)',
    measuredValue: '86 µg/m³',
    allowedLimit: '100 µg/m³',
    monitoringDate: '2026-10-05',
    status: 'Normal',
    remarks: 'Normal ✅ Within prescribed National Ambient Air Quality Standards (NAAQS).',
  },
  {
    id: 'MON-002',
    projectId: 'PRJ-001',
    parameter: 'Air Quality (PM2.5)',
    location: 'Porur Toll Plaza (Chainage 14+200)',
    measuredValue: '72 µg/m³',
    allowedLimit: '60 µg/m³',
    monitoringDate: '2026-10-06',
    status: 'Alert',
    remarks: 'Alert ⚠️ Particulate spike due to asphalt paving; increased water misting dispatched.',
  },
  {
    id: 'MON-003',
    projectId: 'PRJ-001',
    parameter: 'Noise Level (Leq Day)',
    location: 'Nearby Residential School (Chainage 6+800)',
    measuredValue: '62 dB',
    allowedLimit: '65 dB',
    monitoringDate: '2026-10-04',
    status: 'Normal',
    remarks: 'Normal ✅ Acoustic barriers effectively dampening excavator noise.',
  },
  {
    id: 'MON-004',
    projectId: 'PRJ-001',
    parameter: 'Water Quality (Turbidity)',
    location: 'Otteri Nullah Canal Crossing',
    measuredValue: '8.4 NTU',
    allowedLimit: '10.0 NTU',
    monitoringDate: '2026-10-03',
    status: 'Normal',
    remarks: 'Normal ✅ Silt trap functional; no excessive sediment washout.',
  },
  {
    id: 'MON-005',
    projectId: 'PRJ-001',
    parameter: 'Soil Condition (Oil Contamination)',
    location: 'Equipment Maintenance Yard',
    measuredValue: '0.02 mg/kg',
    allowedLimit: '0.10 mg/kg',
    monitoringDate: '2026-09-28',
    status: 'Normal',
    remarks: 'Normal ✅ Impervious concrete floor and oil-water separator functional.',
  },
  {
    id: 'MON-006',
    projectId: 'PRJ-001',
    parameter: 'Waste (C&D Debris Recycling)',
    location: 'Material Recovery Yard',
    measuredValue: '92% recycled',
    allowedLimit: 'Min 80% recycled',
    monitoringDate: '2026-10-01',
    status: 'Normal',
    remarks: 'Normal ✅ 1,400 tonnes milled bitumen reused in sub-base laying.',
  },
  {
    id: 'MON-007',
    projectId: 'PRJ-005',
    parameter: 'Water Quality (Total Hydrocarbons)',
    location: 'Ennore Creek Mouth',
    measuredValue: '14.8 mg/L',
    allowedLimit: '5.0 mg/L',
    monitoringDate: '2026-10-06',
    status: 'Critical',
    remarks: 'Critical ❌ Hydrocarbon contamination spike; emergency boom deployment ordered.',
  },
];

export const initialCompliance: ComplianceItem[] = [
  {
    id: 'CMP-001',
    projectId: 'PRJ-001',
    requirement: 'Monthly water quality test must be done',
    relatedApproval: 'Environmental Clearance → Water Quality Monitoring Condition',
    dueDate: '2026-10-15',
    responsiblePerson: 'Environmental Officer',
    status: 'Completed',
    evidenceDocument: 'Water_Test_October.pdf',
    remarks: 'Monthly water sample analysis from 4 testing wells submitted and approved.',
  },
  {
    id: 'CMP-002',
    projectId: 'PRJ-001',
    requirement: 'Construction dust control must be maintained',
    relatedApproval: 'Environmental Clearance → Dust control condition',
    dueDate: '2026-10-25',
    responsiblePerson: 'Site Environmental Engineer',
    status: 'In Progress',
    evidenceDocument: 'Water_Spraying_Log_Oct2026.pdf',
    remarks: '14 mobile fogger cannons active every 2 hours; PM10 maintained within limit.',
  },
  {
    id: 'CMP-003',
    projectId: 'PRJ-001',
    requirement: 'Waste must be properly disposed',
    relatedApproval: 'TNPCB Consent to Establish → Hazardous & C&D Waste Disposal',
    dueDate: '2026-10-30',
    responsiblePerson: 'Waste Management Officer',
    status: 'Pending',
    evidenceDocument: 'C&D_Waste_Manifest_Draft.pdf',
    remarks: 'Recycling vendor agreement renewed; pending quarterly disposal manifest submission.',
  },
  {
    id: 'CMP-004',
    projectId: 'PRJ-001',
    requirement: 'Approved environmental conditions must be followed',
    relatedApproval: 'MoEFCC Clearance → General & Specific Conditions Schedule',
    dueDate: '2026-12-01',
    responsiblePerson: 'Compliance Officer',
    status: 'In Progress',
    evidenceDocument: 'Six_Monthly_Condition_Audit.pdf',
    remarks: 'Draft dossier compiled for statutory half-yearly submission to State Authorities.',
  },
  {
    id: 'CMP-005',
    projectId: 'PRJ-001',
    requirement: 'Required tree plantation must be completed',
    relatedApproval: 'Forest Clearance → Compensatory Afforestation (300 Trees)',
    dueDate: '2026-11-15',
    responsiblePerson: 'District Forest Officer',
    status: 'Pending',
    evidenceDocument: 'Sapling_Survival_Report.pdf',
    remarks: '185 native saplings planted with drip irrigation; survival audit scheduled.',
  },
  {
    id: 'CMP-006',
    projectId: 'PRJ-005',
    requirement: 'Continuous Online TOC / COD Effluent Water Telemetry link to Care Air Centre',
    relatedApproval: 'TNCZMA CRZ Clearance → Online Effluent Telemetry Condition',
    dueDate: '2026-09-15',
    responsiblePerson: 'Industrial Remediation Head',
    status: 'Non-Compliant',
    evidenceDocument: 'TNPCB_ShowCause_Notice.pdf',
    remarks: 'Non-compliant: Sensor telemetry interrupted for 4 days; urgent rectification ordered.',
  },
  {
    id: 'CMP-007',
    projectId: 'PRJ-001',
    requirement: 'Acoustic Sound Barrier installation near sensitive school zone',
    relatedApproval: 'Environmental Clearance → Specific Noise Barrier Condition IV',
    dueDate: '2026-10-01',
    responsiblePerson: 'Safety & Environment Officer',
    status: 'Overdue',
    evidenceDocument: 'Noise_Barrier_Inspection_Delay.pdf',
    remarks: 'Overdue: Construction delayed by rain; acoustic damping panels pending completion.',
  },
];

export const initialDocuments: DocumentItem[] = [
  {
    id: 'DOC-001',
    name: 'Comprehensive Environmental Impact Assessment (EIA) Report',
    projectId: 'PRJ-001',
    documentType: 'Environmental Assessment Report',
    uploadedBy: 'NEERI Environmental Consultant',
    uploadDate: '2024-01-15',
    version: 'v2.4',
    fileSize: '18.4 MB',
    fileUrl: '/docs/EIA_Chennai_Highway.pdf',
  },
  {
    id: 'DOC-002',
    name: 'SEIAA Statutory Environmental Clearance Order',
    projectId: 'PRJ-001',
    documentType: 'Environmental Approval',
    uploadedBy: 'Member Secretary, SEIAA-TN',
    uploadDate: '2024-01-22',
    version: 'v1.0 (Official)',
    fileSize: '4.6 MB',
    fileUrl: '/docs/EC_SEIAA_Order.pdf',
  },
  {
    id: 'DOC-003',
    name: 'Environmental Risk Assessment & Leopold Matrix Document',
    projectId: 'PRJ-001',
    documentType: 'Risk Assessment',
    uploadedBy: 'Vishal (Admin)',
    uploadDate: '2024-04-20',
    version: 'v1.2',
    fileSize: '6.8 MB',
    fileUrl: '/docs/Risk_Assessment_Highway.pdf',
  },
  {
    id: 'DOC-004',
    name: 'Quarterly CAAQMS Air & Noise Telemetry Monitoring Report',
    projectId: 'PRJ-001',
    documentType: 'Monitoring Report',
    uploadedBy: 'Air Quality Lab Technician',
    uploadDate: '2026-10-02',
    version: 'v1.0',
    fileSize: '3.2 MB',
    fileUrl: '/docs/Quarterly_Air_Monitoring_Oct2026.pdf',
  },
  {
    id: 'DOC-005',
    name: 'Six-Monthly Environmental Compliance Dossier (April - Sept 2026)',
    projectId: 'PRJ-001',
    documentType: 'Compliance Report',
    uploadedBy: 'Vishal (Admin)',
    uploadDate: '2026-10-04',
    version: 'v2.0 (SHA-256 Sealed)',
    fileSize: '12.8 MB',
    fileUrl: '/docs/Six_Monthly_Dossier_2026.pdf',
  },
  {
    id: 'DOC-006',
    name: 'Compensatory Afforestation Verification Certificate',
    projectId: 'PRJ-001',
    documentType: 'Government Certificate',
    uploadedBy: 'District Forest Officer, Kanchipuram',
    uploadDate: '2026-08-18',
    version: 'v1.0',
    fileSize: '2.1 MB',
    fileUrl: '/docs/Forest_Certificate_300Trees.pdf',
  },
];

export const initialDeadlines: DeadlineItem[] = [
  {
    id: 'DL-001',
    title: 'Monthly Ambient Air & Noise Quality Test Submission',
    projectId: 'PRJ-001',
    dueDate: '2026-10-15',
    status: 'Upcoming',
    notificationMessage: '⚠️ Compliance deadline in 7 days: Monthly air quality test report due for TNPCB submission.',
    responsiblePerson: 'Er. K. Ramesh',
    category: 'Monitoring',
  },
  {
    id: 'DL-002',
    title: 'Third-Party Survival Audit of 300 Compensatory Planted Trees',
    projectId: 'PRJ-001',
    dueDate: '2026-11-15',
    status: 'Upcoming',
    notificationMessage: '⚠️ Environmental audit in 38 days: Joint forest verification of 300 saplings.',
    responsiblePerson: 'Forest Auditor',
    category: 'Mitigation',
  },
  {
    id: 'DL-003',
    title: 'Six-Monthly Compliance Dossier Upload to MoEFCC Parivesh',
    projectId: 'PRJ-001',
    dueDate: '2026-12-01',
    status: 'Upcoming',
    notificationMessage: '⚠️ Mandatory statutory filing in 54 days: MoEFCC Six-Monthly Compliance Dossier.',
    responsiblePerson: 'Vishal (State Admin)',
    category: 'Compliance',
  },
  {
    id: 'DL-004',
    title: 'Ennore Creek Water Effluent Telemetry Re-connection',
    projectId: 'PRJ-005',
    dueDate: '2026-10-08',
    status: 'Due Today',
    notificationMessage: '❌ Requirement is overdue / due today: Re-establish 24/7 online TOC/COD data link.',
    responsiblePerson: 'Remediation Head',
    category: 'Compliance',
  },
  {
    id: 'DL-005',
    title: 'Consent to Operate (CTO) Renewal Filing',
    projectId: 'PRJ-005',
    dueDate: '2026-12-31',
    status: 'Upcoming',
    notificationMessage: '⚠️ Approval expires in 84 days: Submit CTO Air & Water renewal forms.',
    responsiblePerson: 'Environmental Officer',
    category: 'Approval',
  },
];

export const initialAudits: AuditItem[] = [
  {
    id: 'AUD-001',
    user: 'Vishal (Admin)',
    action: 'Admin added project',
    module: 'Project Management',
    date: '2026-10-08',
    time: '10:15:22',
    description: 'Added new infrastructure asset: Chennai Highway Expansion (PRJ-001).',
  },
  {
    id: 'AUD-002',
    user: 'Officer Meenakshi',
    action: 'Officer created environmental assessment',
    module: 'Environmental Assessment',
    date: '2026-10-08',
    time: '10:22:45',
    description: 'Recorded baseline air & vegetation impact study for Chennai Highway (PRJ-001).',
  },
  {
    id: 'AUD-003',
    user: 'Officer Meenakshi',
    action: 'Officer added high-risk item',
    module: 'Environmental Risks',
    date: '2026-10-08',
    time: '10:28:10',
    description: 'Logged High Risk: Tree & Vegetation Loss (150 Roadside Trees) linked to assessment.',
  },
  {
    id: 'AUD-004',
    user: 'Auditor Soundararajan',
    action: 'Officer uploaded approval',
    module: 'Approval Management',
    date: '2026-10-08',
    time: '10:35:04',
    description: 'Uploaded and verified SEIAA Environmental Clearance Order (APP-001).',
  },
  {
    id: 'AUD-005',
    user: 'Officer Meenakshi',
    action: 'Officer updated compliance',
    module: 'Compliance Management',
    date: '2026-10-08',
    time: '10:41:18',
    description: 'Updated condition status to Completed: Oil-Water Separator installation (CMP-003).',
  },
  {
    id: 'AUD-006',
    user: 'Vishal (Admin)',
    action: 'Admin generated report',
    module: 'Reports',
    date: '2026-10-08',
    time: '10:48:50',
    description: 'Generated and cryptographically stamped Six-Monthly Compliance Dossier PDF.',
  },
];
