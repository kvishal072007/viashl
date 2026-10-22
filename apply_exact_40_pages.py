import os
import sys

with open('build_full_report.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find Chapter 5 start:
ch5_start = content.find('story.append(Paragraph("5.2.2 JWT Authentication Middleware (server/src/middleware/auth.ts)", h3_style))')
ch6_start = content.find('    # PAGE 25: CHAPTER 6: CONCLUSION & FUTURE WORK (Page 16)\n    # =========================================================================')

print(f"ch5_start: {ch5_start}, ch6_start: {ch6_start}")

replacement = '''story.append(Paragraph("5.2.2 JWT Authentication Middleware (server/src/middleware/auth.ts)", h3_style))
    story.append(Paragraph(
        "The authentication middleware validates incoming Bearer tokens extracted from HTTP Authorization headers and verifies officer role permissions:", body_style
    ))
    story.append(PageBreak())

    # =========================================================================
    # PAGE 20: CHAPTER 5 Contd. (Page 11)
    # =========================================================================
    code_auth = (
        "// server/src/middleware/auth.ts\\n"
        "export const authenticate = (req: Request, res: Response, next: NextFunction) => {\\n"
        "  const authHeader = req.headers.authorization;\\n"
        "  if (!authHeader || !authHeader.startsWith('Bearer ')) {\\n"
        "    return res.status(401).json({ success: false, error: 'Authorization token required' });\\n"
        "  }\\n"
        "  const token = authHeader.split(' ')[1];\\n"
        "  try {\\n"
        "    (req as any).user = jwt.verify(token, config.jwtSecret);\\n"
        "    next();\\n"
        "  } catch (err) {\\n"
        "    return res.status(401).json({ success: false, error: 'Invalid or expired token' });\\n"
        "  }\\n"
        "};\\n\\n"
        "export const authorize = (allowedRoles: string[]) => {\\n"
        "  return (req: Request, res: Response, next: NextFunction) => {\\n"
        "    const user = (req as any).user;\\n"
        "    if (!user || !allowedRoles.includes(user.role)) {\\n"
        "      return res.status(403).json({ success: false, error: 'Access denied: Unauthorized role' });\\n"
        "    }\\n"
        "    next();\\n"
        "  };\\n"
        "};"
    )
    t_cauth = Table([[Paragraph(code_auth.replace('\\n', '<br/>').replace(' ', '&nbsp;'), code_style)]], colWidths=[477])
    t_cauth.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4)
    ]))
    story.append(t_cauth)
    story.append(Spacer(1, 4))

    story.append(Paragraph("5.2.3 Statutory Clearance Condition Compliance Toggle (server/src/controllers/approvalController.ts)", h3_style))
    story.append(Paragraph(
        "When an environmental officer verifies condition compliance on-site, the controller toggles condition status and logs audit metadata:", body_style
    ))

    code_appr = (
        "export class ApprovalController {\\n"
        "  static async toggleCondition(req: Request, res: Response, next: NextFunction) {\\n"
        "    try {\\n"
        "      const { id, condId } = req.params;\\n"
        "      const approval = await ApprovalService.getById(id);\\n"
        "      if (!approval) return res.status(404).json({ success: false, error: 'Approval record not found' });\\n"
        "      const condition = approval.keyConditions.find((c: any) => c.id === condId);\\n"
        "      if (!condition) return res.status(404).json({ success: false, error: 'Condition ID not found' });\\n\\n"
        "      // Toggle condition status: COMPLIANT <-> NON_COMPLIANT\\n"
        "      const nextStatus = condition.status === 'COMPLIANT' ? 'NON_COMPLIANT' : 'COMPLIANT';\\n"
        "      condition.status = nextStatus;\\n"
        "      condition.lastVerified = new Date().toISOString().split('T')[0];\\n"
        "      condition.verifiedBy = (req as any).user?.name || 'Vishal (State Admin)';\\n\\n"
        "      await ApprovalService.update(id, approval);\\n"
        "      await AuditLogger.log({\\n"
        "        userName: (req as any).user?.name || 'Vishal', role: 'ADMIN',\\n"
        "        action: 'UPDATE_CONDITION_STATUS', module: 'REGULATORY_APPROVALS',\\n"
        "        entityId: `${id}:${condId}`, ipAddress: req.ip || '127.0.0.1',\\n"
        "        status: 'SUCCESS', details: `Updated condition ${condId} to ${nextStatus}`\\n"
        "      });\\n"
        "      res.json({ success: true, message: 'Condition updated', approval });\\n"
        "    } catch (err) { next(err); }\\n"
        "  }\\n"
        "}"
    )
    t_cappr = Table([[Paragraph(code_appr.replace('\\n', '<br/>').replace(' ', '&nbsp;'), code_style)]], colWidths=[477])
    t_cappr.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4)
    ]))
    story.append(t_cappr)
    story.append(PageBreak())

    # =========================================================================
    # PAGE 21: CHAPTER 5 Contd. (Page 12)
    # =========================================================================
    story.append(Paragraph("5.2.4 Real-Time CAAQMS IoT Telemetry Anomaly Detection (server/src/controllers/sensorController.ts)", h3_style))
    story.append(Paragraph(
        "Sensor telemetry is ingested and evaluated against statutory National Ambient Air Quality Standards (NAAQS):", body_style
    ))

    code_sensor = (
        "export class SensorController {\\n"
        "  static async getLiveTelemetry(req: Request, res: Response, next: NextFunction) {\\n"
        "    try {\\n"
        "      const telemetry = await SensorService.getAllTelemetry();\\n"
        "      // Evaluate CPCB 24-hr NAAQS thresholds: PM2.5 > 60 ug/m3, PM10 > 100 ug/m3\\n"
        "      const evaluated = telemetry.map((sensor: any) => {\\n"
        "        const isAirSpike = sensor.pm25 > 60 || sensor.pm10 > 100;\\n"
        "        const isNoiseHigh = sensor.noiseLevelDb > 75; // 75 dB(A) Industrial Limit\\n"
        "        return {\\n"
        "          ...sensor,\\n"
        "          status: (isAirSpike || isNoiseHigh) ? 'WARNING' : 'NORMAL',\\n"
        "          anomalyAlert: isAirSpike ? 'PM Particulate Standard Exceeded' : null\\n"
        "        };\\n"
        "      });\\n"
        "      res.json({ success: true, count: evaluated.length, data: evaluated });\\n"
        "    } catch (err) { next(err); }\\n"
        "  }\\n"
        "}"
    )
    t_csens = Table([[Paragraph(code_sensor.replace('\\n', '<br/>').replace(' ', '&nbsp;'), code_style)]], colWidths=[477])
    t_csens.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4)
    ]))
    story.append(t_csens)
    story.append(Spacer(1, 4))

    story.append(Paragraph("5.3 FRONTEND IMPLEMENTATION", h2_style))
    story.append(Paragraph(
        "The frontend is architected as a modular single-page React 18 application built using Vite 5 and Tailwind CSS. "
        "The user interface incorporates 12 specialized views corresponding to the statutory environmental governance workflow:", body_style
    ))
    story.append(Paragraph("&bull; <b>LoginView.tsx:</b> Officer authentication portal with authorized pre-sets, form validation, and JWT session handling.", bullet_style))
    story.append(Paragraph("&bull; <b>DashboardView.tsx:</b> Executive Command Center displaying State Compliance Index (88.4%), Monitored Mega Assets (6), Clearance SLA Countdown meters, and EMP Budget spend.", bullet_style))
    story.append(Paragraph("&bull; <b>ProjectsView.tsx:</b> Infrastructure project portfolio directory supporting multi-sector filtering, eco-sensitive zone (ESZ) proximity indicators, and project registration.", bullet_style))
    story.append(Paragraph("&bull; <b>AssessmentsView.tsx:</b> Terms of Reference (ToR) tracking, public hearing minutes, and interactive Leopold Impact Significance Matrix.", bullet_style))
    story.append(PageBreak())

    # =========================================================================
    # PAGE 22: CHAPTER 5 Contd. (Page 13)
    # =========================================================================
    story.append(Paragraph("&bull; <b>ApprovalsView.tsx:</b> Statutory regulatory clearances matrix (MoEFCC EC, FC, NBWL, CRZ, SPCB) with toggleable condition checklists and SLA expiry risk badges.", bullet_style))
    story.append(Paragraph("&bull; <b>MitigationEMPView.tsx:</b> Environmental management plan tasks (compensatory afforestation, dust suppression, wildlife passages) with progress sliders (0-100%) and budget auditing.", bullet_style))
    story.append(Paragraph("&bull; <b>SensorMonitoringView.tsx:</b> Continuous IoT CAAQMS telemetry stream displaying real-time PM2.5, PM10, SO2, NOx, and noise levels via Recharts interactive area charts.", bullet_style))
    story.append(Paragraph("&bull; <b>ComplianceManagementView.tsx:</b> Six-monthly statutory compliance tracking, condition compliance percentages, and regulatory authority correspondence.", bullet_style))
    story.append(Paragraph("&bull; <b>ComplianceDocsView.tsx:</b> Cryptographic document vault housing verified clearance letters and EIA reports with SHA-256 integrity verification.", bullet_style))
    story.append(Paragraph("&bull; <b>NCRResolutionView.tsx:</b> Non-Compliance Reporting (NCR) lifecycle with severity tagging (Minor, Major, Critical), Corrective Action Plans (CAP), and photographic closure evidence.", bullet_style))
    story.append(Paragraph("&bull; <b>GISMapView.tsx:</b> Geospatial corridor alignment mapping with WGS84 coordinate projections, reserve forest boundaries, and eco-sensitive buffer overlays.", bullet_style))
    story.append(Paragraph("&bull; <b>AuditLogsView.tsx:</b> Immutable activity ledger with officer identity, timestamp, IP address, payload summaries, and SHA-256 tamper verification seals.", bullet_style))
    story.append(Spacer(1, 4))

    story.append(Paragraph("5.4 BACKEND ARCHITECTURE &amp; REST APIS", h2_style))
    story.append(Paragraph(
        "The backend API follows RESTful architectural principles under the /api/v1 namespace, returning standard JSON envelopes:", body_style
    ))

    api_table_data = [
        [Paragraph("<b>Module</b>", table_header_style), Paragraph("<b>Method &amp; Endpoint</b>", table_header_style), Paragraph("<b>Function / Description</b>", table_header_style), Paragraph("<b>Access Role</b>", table_header_style)],
        [Paragraph("Auth", table_cell_style), Paragraph("POST /api/v1/auth/login", table_cell_style), Paragraph("Authenticate credentials and issue JWT", table_cell_style), Paragraph("Public", table_cell_style)],
        [Paragraph("Projects", table_cell_style), Paragraph("GET /api/v1/projects", table_cell_style), Paragraph("Fetch all infrastructure capital assets", table_cell_style), Paragraph("Bearer JWT", table_cell_style)],
        [Paragraph("Projects", table_cell_style), Paragraph("POST /api/v1/projects", table_cell_style), Paragraph("Register new infrastructure project", table_cell_style), Paragraph("Officer / Admin", table_cell_style)],
        [Paragraph("Assessments", table_cell_style), Paragraph("GET /api/v1/assessments", table_cell_style), Paragraph("Fetch EIA / SIA studies &amp; Leopold matrix", table_cell_style), Paragraph("Bearer JWT", table_cell_style)],
        [Paragraph("Approvals", table_cell_style), Paragraph("GET /api/v1/approvals", table_cell_style), Paragraph("Fetch statutory clearances &amp; SLA status", table_cell_style), Paragraph("Bearer JWT", table_cell_style)],
        [Paragraph("Approvals", table_cell_style), Paragraph("PATCH /api/v1/approvals/:id/cond/:cId", table_cell_style), Paragraph("Toggle clearance condition compliance", table_cell_style), Paragraph("Auditor / Officer", table_cell_style)],
        [Paragraph("Mitigations", table_cell_style), Paragraph("GET /api/v1/mitigations", table_cell_style), Paragraph("Fetch EMP tasks, afforestation, spend", table_cell_style), Paragraph("Bearer JWT", table_cell_style)],
        [Paragraph("Telemetry", table_cell_style), Paragraph("GET /api/v1/sensors/telemetry", table_cell_style), Paragraph("Stream live CAAQMS air &amp; noise telemetry", table_cell_style), Paragraph("Bearer JWT", table_cell_style)],
        [Paragraph("Compliance", table_cell_style), Paragraph("POST /api/v1/compliance/report", table_cell_style), Paragraph("Auto-compile 6-monthly PARIVESH dossier", table_cell_style), Paragraph("Auditor / Officer", table_cell_style)]
    ]
    t_api = Table(api_table_data, colWidths=[65, 175, 160, 77])
    t_api.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 1.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1.5)
    ]))
    story.append(t_api)
    story.append(Paragraph("<b>Table 5.1: Summary of the REST API Endpoints</b>", fig_caption_style))
    story.append(Spacer(1, 2))

    story.append(Paragraph("5.5 AUTHENTICATION &amp; SECURITY CONTROLS", h2_style))
    story.append(Paragraph("The security architecture implements multiple defensive layers:", body_style))
    story.append(PageBreak())

    # =========================================================================
    # PAGE 23: CHAPTER 5 Contd. (Page 14)
    # =========================================================================
    story.append(Paragraph("&bull; <b>Stateless JWT Tokens:</b> Signed with HMAC-SHA256 encapsulating user ID, officer name, and assigned role, expiring after 24 hours.", bullet_style))
    story.append(Paragraph("&bull; <b>Strict Role-Based Authorization:</b> Distinct privilege boundaries for Admin (Vishal K), Environmental Officer, Compliance Auditor, and Project Manager.", bullet_style))
    story.append(Paragraph("&bull; <b>Cryptographic SHA-256 Vault:</b> All uploaded clearance orders and compliance files are fingerprinted with SHA-256 hashes to prevent post-facto alteration.", bullet_style))
    story.append(Spacer(1, 4))

    story.append(Paragraph("5.6 TELEMETRY ENGINE &amp; CAAQMS ANOMALY DETECTION", h2_style))
    story.append(Paragraph(
        "Continuous environmental streams from CAAQMS stations are evaluated dynamically against National Ambient Air Quality Standards (NAAQS). "
        "When ambient PM2.5 exceeds 60 &mu;g/m&sup3; or PM10 exceeds 100 &mu;g/m&sup3; over a 24-hour moving window, "
        "an automated warning trigger is dispatched to the environmental officer and logged into the NCR audit pipeline.", body_style
    ))
    story.append(Spacer(1, 4))

    story.append(Paragraph("5.7 STATUTORY COMPLIANCE &amp; NCR WORKFLOW ALGORITHMS", h2_style))
    story.append(Paragraph(
        "A critical capability implemented in the system is the dynamic mathematical computation of composite project compliance scores and automated NCR penalty deductions:", body_style
    ))

    algo_formula = (
        "Let C_clearance be the percentage of verified clearance conditions (weight = 0.40).\\n"
        "Let C_mitigation be the physical EMP progress and budget utilization (weight = 0.35).\\n"
        "Let C_telemetry be the environmental sensor compliance rate (weight = 0.15).\\n"
        "Let P_ncr be the penalty deduction for open Non-Compliance Reports (weight = 0.10).\\n\\n"
        "Composite Compliance Score Formula:\\n"
        "    C_index = (0.40 * C_clearance) + (0.35 * C_mitigation) + (0.15 * C_telemetry) - P_ncr\\n\\n"
        "Where P_ncr = (Count_Critical * 5.0) + (Count_Major * 2.5) + (Count_Minor * 1.0).\\n"
        "If C_index >= 90%: Status = EXCELLENT; If 75% <= C_index < 90%: Status = SATISFACTORY;\\n"
        "Else (C_index < 75%): Status = ACTION REQUIRED."
    )
    t_algo = Table([[Paragraph(algo_formula.replace('\\n', '<br/>').replace(' ', '&nbsp;'), code_style)]], colWidths=[477])
    t_algo.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4)
    ]))
    story.append(t_algo)
    story.append(Spacer(1, 4))

    story.append(Paragraph("5.8 TESTING AND VERIFICATION AUDIT", h2_style))
    story.append(Paragraph(
        "The reliability of the system was verified through automated testing in a local test environment utilizing Jest, Supertest, and live API invocations:", body_style
    ))

    test_data_part1 = [
        [Paragraph("<b>Test Suite File</b>", table_header_style), Paragraph("<b>Focus Area / Modules Covered</b>", table_header_style), Paragraph("<b>Tests</b>", table_header_style), Paragraph("<b>Status</b>", table_header_style)],
        [Paragraph("auth.test.ts", table_cell_style), Paragraph("JWT issuance, role authorization, invalid credential denial", table_cell_style), Paragraph("5 / 5", table_cell_style), Paragraph("PASS (100%)", table_cell_style)],
        [Paragraph("projects.test.ts", table_cell_style), Paragraph("Project CRUD, sector classification, geo-coordinates validation", table_cell_style), Paragraph("4 / 4", table_cell_style), Paragraph("PASS (100%)", table_cell_style)],
        [Paragraph("approvals.test.ts", table_cell_style), Paragraph("Clearance conditions toggle, SLA countdown risk calculation", table_cell_style), Paragraph("5 / 5", table_cell_style), Paragraph("PASS (100%)", table_cell_style)],
        [Paragraph("mitigations.test.ts", table_cell_style), Paragraph("EMP task updates, spend tracking, afforestation percentages", table_cell_style), Paragraph("4 / 4", table_cell_style), Paragraph("PASS (100%)", table_cell_style)]
    ]
    t_test1 = Table(test_data_part1, colWidths=[105, 230, 60, 82])
    t_test1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2)
    ]))
    story.append(t_test1)
    story.append(PageBreak())

    # =========================================================================
    # PAGE 24: CHAPTER 5 Contd. (Page 15)
    # =========================================================================
    test_data_part2 = [
        [Paragraph("<b>Test Suite File</b>", table_header_style), Paragraph("<b>Focus Area / Modules Covered</b>", table_header_style), Paragraph("<b>Tests</b>", table_header_style), Paragraph("<b>Status</b>", table_header_style)],
        [Paragraph("sensors.test.ts", table_cell_style), Paragraph("CAAQMS telemetry ingestion, CPCB NAAQS anomaly triggers", table_cell_style), Paragraph("4 / 4", table_cell_style), Paragraph("PASS (100%)", table_cell_style)],
        [Paragraph("compliance.test.ts", table_cell_style), Paragraph("6-Monthly dossier generation, SHA-256 cryptographic verification", table_cell_style), Paragraph("4 / 4", table_cell_style), Paragraph("PASS (100%)", table_cell_style)],
        [Paragraph("<b>TOTAL</b>", table_header_style), Paragraph("<b>Full-Stack Integration &amp; Security Test Coverage</b>", table_header_style), Paragraph("<b>26 / 26</b>", table_header_style), Paragraph("<b>100% PASS</b>", table_header_style)]
    ]
    t_test2 = Table(test_data_part2, colWidths=[105, 230, 60, 82])
    t_test2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
        ('BACKGROUND', (0,-1), (-1,-1), colors.HexColor('#E2E8F0')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2)
    ]))
    story.append(t_test2)
    story.append(Paragraph("<b>Table 5.2: Results of the Automated Tests</b>", fig_caption_style))
    story.append(Spacer(1, 2))

    accept_text = (
        "<b>Acceptance Scenario:</b> Verified end-to-end statutory compliance lifecycle: Environmental Officer logs in via secure portal, "
        "inspects Chennai Metro Rail Phase II clearance conditions, toggles dust mitigation condition to COMPLIANT, triggers re-calculation "
        "of Composite Compliance Health Score to 88.4%, streams live CAAQMS telemetry with zero anomalies, and compiles a complete Six-Monthly "
        "Dossier sealed with SHA-256 checksums."
    )
    story.append(Paragraph(accept_text, body_style))
    story.append(Spacer(1, 2))

    story.append(Paragraph("5.9 DEPLOYMENT AND EXECUTION INSTRUCTIONS", h2_style))
    story.append(Paragraph(
        "To run the application locally in a development environment, execute the following commands:", body_style
    ))

    # Step 1
    story.append(Paragraph("<b>Step 1: Database Setup &amp; Execution (Terminal 1):</b>", ParagraphStyle('StepH1', parent=body_style, fontSize=8.5, leading=11, spaceBefore=1, spaceAfter=1)))
    code_s1 = (
        "\\\"C:\\\\Program Files\\\\PostgreSQL\\\\16\\\\bin\\\\postgres.exe\\\" -D \\\"C:\\\\data\\\\pg\\\"\\n"
        "# Redis: redis-server --port 6379 (Or run: docker run -p 5432:5432 -p 6379:6379 -d pg-redis)"
    )
    t_s1 = Table([[Paragraph(code_s1.replace('\\n', '<br/>').replace(' ', '&nbsp;'), code_style)]], colWidths=[477])
    t_s1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5)
    ]))
    story.append(t_s1)

    # Step 2
    story.append(Paragraph("<b>Step 2: Backend Setup &amp; Execution (Terminal 2):</b>", ParagraphStyle('StepH2', parent=body_style, fontSize=8.5, leading=11, spaceBefore=2, spaceAfter=1)))
    code_s2 = (
        "cd server\\n"
        "npm install\\n"
        "npm run seed    # Initializes schema & baseline statutory data\\n"
        "npm run dev     # Starts Express REST API on http://localhost:5000"
    )
    t_s2 = Table([[Paragraph(code_s2.replace('\\n', '<br/>').replace(' ', '&nbsp;'), code_style)]], colWidths=[477])
    t_s2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5)
    ]))
    story.append(t_s2)

    # Step 3
    story.append(Paragraph("<b>Step 3: Frontend Setup &amp; Execution (Terminal 3):</b>", ParagraphStyle('StepH3', parent=body_style, fontSize=8.5, leading=11, spaceBefore=2, spaceAfter=1)))
    code_s3 = (
        "cd client\\n"
        "npm install\\n"
        "npm run dev\\n"
        "# Starts Vite development server on http://localhost:3000"
    )
    t_s3 = Table([[Paragraph(code_s3.replace('\\n', '<br/>').replace(' ', '&nbsp;'), code_style)]], colWidths=[477])
    t_s3.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5)
    ]))
    story.append(t_s3)

    # Step 4
    story.append(Paragraph("<b>Step 4: All-in-One Execution Script (Alternative):</b>", ParagraphStyle('StepH4', parent=body_style, fontSize=8.5, leading=11, spaceBefore=2, spaceAfter=1)))
    code_s4 = (
        "# Double-click run.bat located in project root (or execute: docker-compose up --build)\\n"
        "# Automatically launches PostgreSQL, Redis, Backend Server, and Frontend simultaneously."
    )
    t_s4 = Table([[Paragraph(code_s4.replace('\\n', '<br/>').replace(' ', '&nbsp;'), code_style)]], colWidths=[477])
    t_s4.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5)
    ]))
    story.append(t_s4)
    story.append(PageBreak())
'''

new_content = content[:ch5_start] + replacement + content[ch6_start:]

with open('build_full_report.py', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("build_full_report.py successfully updated with exact 6-page Chapter 5!")
