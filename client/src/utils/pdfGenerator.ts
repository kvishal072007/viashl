import { ComplianceDocument, RegulatoryApproval, EnvironmentalAssessment, Project } from '../types';

export const openPrintablePdf = (htmlContent: string, title: string) => {
  const printWindow = window.open('', '_blank', 'width=900,height=1000');
  if (!printWindow) {
    alert('Please allow popups to download and print the official PDF document.');
    return;
  }

  printWindow.document.open();
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
        <style>
          @page {
            size: A4;
            margin: 20mm 15mm 20mm 15mm;
          }
          body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #0f172a;
            background: #ffffff;
            margin: 0;
            padding: 24px;
            line-height: 1.5;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .header {
            border-bottom: 2px solid #059669;
            padding-bottom: 16px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .title-area h1 {
            font-size: 20px;
            font-weight: 800;
            color: #064e3b;
            margin: 0 0 4px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .title-area p {
            font-size: 11px;
            color: #475569;
            margin: 0;
          }
          .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            background: #ecfdf5;
            color: #047857;
            border: 1px solid #a7f3d0;
            font-family: 'JetBrains Mono', monospace;
          }
          .meta-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 14px;
            margin-bottom: 24px;
            font-size: 12px;
          }
          .meta-item strong {
            color: #334155;
            font-weight: 600;
          }
          .section-heading {
            font-size: 14px;
            font-weight: 700;
            color: #0f172a;
            border-left: 4px solid #059669;
            padding-left: 8px;
            margin: 20px 0 12px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 11px;
          }
          th {
            background: #f1f5f9;
            color: #1e293b;
            font-weight: 700;
            text-align: left;
            padding: 8px 10px;
            border: 1px solid #cbd5e1;
            font-family: 'JetBrains Mono', monospace;
          }
          td {
            padding: 8px 10px;
            border: 1px solid #e2e8f0;
            color: #334155;
          }
          tr:nth-child(even) {
            background: #f8fafc;
          }
          .status-tag {
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 10px;
          }
          .status-compliant {
            background: #dcfce7;
            color: #15803d;
          }
          .status-partial {
            background: #fef3c7;
            color: #b45309;
          }
          .footer {
            margin-top: 40px;
            padding-top: 16px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 10px;
            color: #64748b;
          }
          .signature-box {
            text-align: right;
          }
          .signature-box .line {
            width: 180px;
            border-bottom: 1px solid #0f172a;
            margin-bottom: 4px;
          }
          .print-toolbar {
            position: fixed;
            top: 12px;
            right: 12px;
            background: #0f172a;
            color: #ffffff;
            padding: 10px 18px;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            display: flex;
            gap: 12px;
            align-items: center;
            z-index: 9999;
          }
          .print-btn {
            background: #10b981;
            color: #0f172a;
            border: none;
            padding: 6px 14px;
            border-radius: 6px;
            font-weight: 700;
            font-size: 12px;
            cursor: pointer;
          }
          @media print {
            .print-toolbar {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-toolbar">
          <span style="font-size:12px; font-weight:600;">EnviroTrack PDF Document Viewer</span>
          <button class="print-btn" onclick="window.print()">📥 Save as PDF / Print</button>
        </div>
        ${htmlContent}
        <script>
          window.onload = function() {
            // Auto trigger print dialog after small render delay
            setTimeout(function() {
              window.print();
            }, 600);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

export const downloadComplianceDocPdf = (doc: ComplianceDocument) => {
  const html = `
    <div class="header">
      <div class="title-area">
        <h1>Ministry Statutory Compliance Record</h1>
        <p>Government of India • Ministry of Environment, Forest & Climate Change (MoEFCC)</p>
      </div>
      <div class="badge">OFFICIAL VERIFIED • SHA-256 SEALED</div>
    </div>

    <div class="meta-grid">
      <div class="meta-item"><strong>Document Title:</strong> ${doc.title}</div>
      <div class="meta-item"><strong>Document Type:</strong> ${doc.documentType}</div>
      <div class="meta-item"><strong>Target Project:</strong> ${doc.projectName || 'National Infrastructure Asset'}</div>
      <div class="meta-item"><strong>Submitted To:</strong> ${doc.submittedTo}</div>
      <div class="meta-item"><strong>Submission Date:</strong> ${doc.submissionDate}</div>
      <div class="meta-item"><strong>Reporting Period:</strong> ${doc.reportingPeriod || 'Annual Cycle'}</div>
      <div class="meta-item"><strong>Document Version:</strong> ${doc.version}</div>
      <div class="meta-item"><strong>File Size & Format:</strong> ${doc.fileSizeMb} MB (${doc.fileFormat})</div>
    </div>

    <div class="section-heading">1. Executive Summary & Verification Seal</div>
    <p style="font-size: 12px; color: #334155; line-height: 1.6;">
      This compliance report certifies that the environmental management plan (EMP), statutory clearance conditions, air quality particulate thresholds, and forest conservation parameters for the specified infrastructure stretch have been reviewed and audited in accordance with the <strong>Environment (Protection) Act, 1986</strong> and <strong>EIA Notification 2006</strong>.
    </p>

    <div class="section-heading">2. Environmental Audit Condition Status</div>
    <table>
      <thead>
        <tr>
          <th>S.NO</th>
          <th>CLEARANCE CONDITION REQUIREMENT</th>
          <th>RESPONSIBLE CELL</th>
          <th>COMPLIANCE STATUS</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1.01</td>
          <td>Establishment of Continuous Ambient Air Quality Monitoring Stations (CAAQMS)</td>
          <td>Environmental Cell</td>
          <td><span class="status-tag status-compliant">100% Complied</span></td>
        </tr>
        <tr>
          <td>1.02</td>
          <td>Deployment of High-Pressure Water Fogger Cannons at Batching Yards</td>
          <td>EPC Contractor</td>
          <td><span class="status-tag status-compliant">Complied</span></td>
        </tr>
        <tr>
          <td>1.03</td>
          <td>Compensatory Afforestation Plantation Survival Rate Audit (85%+ Target)</td>
          <td>State Forest Dept</td>
          <td><span class="status-tag status-partial">In Progress (78%)</span></td>
        </tr>
        <tr>
          <td>1.04</td>
          <td>Zero Liquid Discharge (ZLD) Effluent Treatment Plant Commissioning</td>
          <td>Site Utilities</td>
          <td><span class="status-tag status-compliant">Complied</span></td>
        </tr>
      </tbody>
    </table>

    <div class="section-heading">3. Cryptographic Tamper-Proof Seal</div>
    <div style="background:#0f172a; color:#10b981; padding:12px; border-radius:6px; font-family:'JetBrains Mono', monospace; font-size:10px;">
      SHA-256 Digest: ${doc.checksumSha256}<br/>
      Signer Authority: EnviroTrack Statutory Compliance Engine v2.6<br/>
      Timestamp: ${doc.createdAt} (UTC)
    </div>

    <div class="footer">
      <div>
        EnviroTrack Infra Governance System • ISO 14001:2015 Compliant<br/>
        Report Reference: ${doc.id}
      </div>
      <div class="signature-box">
        <div class="line"></div>
        <strong>Authorized Signatory / Environmental Officer</strong>
      </div>
    </div>
  `;

  openPrintablePdf(html, doc.title);
};

export const downloadApprovalLetterPdf = (approval: RegulatoryApproval) => {
  const html = `
    <div class="header">
      <div class="title-area">
        <h1>Statutory Regulatory Clearance Letter</h1>
        <p>${approval.issuingAuthority}</p>
      </div>
      <div class="badge">${approval.status.toUpperCase()}</div>
    </div>

    <div class="meta-grid">
      <div class="meta-item"><strong>Clearance Type:</strong> ${approval.clearanceType}</div>
      <div class="meta-item"><strong>Application Number:</strong> ${approval.applicationNumber}</div>
      <div class="meta-item"><strong>Target Project:</strong> ${approval.projectName || 'National Infrastructure Asset'}</div>
      <div class="meta-item"><strong>Issuing Authority:</strong> ${approval.issuingAuthority}</div>
      <div class="meta-item"><strong>Application Date:</strong> ${approval.applicationDate}</div>
      <div class="meta-item"><strong>Approval Date:</strong> ${approval.approvalDate || 'Under Scrutiny'}</div>
      <div class="meta-item"><strong>Valid Until:</strong> ${approval.validUntil || 'Lifetime of Project'}</div>
      <div class="meta-item"><strong>SLA Target Deadline:</strong> ${approval.slaDeadline}</div>
    </div>

    <div class="section-heading">Statutory Terms & Specific Conditions</div>
    <table>
      <thead>
        <tr>
          <th>COND ID</th>
          <th>CONDITION TYPE</th>
          <th>STATUTORY STIPULATION</th>
          <th>STATUS</th>
        </tr>
      </thead>
      <tbody>
        ${approval.keyConditions
          .map(
            (c) => `
          <tr>
            <td style="font-family:'JetBrains Mono', monospace; font-weight:bold;">${c.id}</td>
            <td>${c.type}</td>
            <td><strong>${c.conditionText}</strong><br/><span style="color:#64748b; font-size:10px;">Action: ${c.actionRequired}</span></td>
            <td><span class="status-tag ${c.status === 'Compliant' ? 'status-compliant' : 'status-partial'}">${c.status}</span></td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>

    <div class="footer">
      <div>
        Government of India • Ministry of Environment, Forest and Climate Change<br/>
        Record Ref: ${approval.id}
      </div>
      <div class="signature-box">
        <div class="line"></div>
        <strong>Member Secretary / Competent Authority</strong>
      </div>
    </div>
  `;

  openPrintablePdf(html, `${approval.clearanceType} - ${approval.applicationNumber}`);
};

export const downloadEiaStudyPdf = (assessment: EnvironmentalAssessment) => {
  const html = `
    <div class="header">
      <div class="title-area">
        <h1>Environmental & Social Impact Assessment (EIA)</h1>
        <p>Comprehensive Baseline Ecology & Leopold Mitigation Report</p>
      </div>
      <div class="badge">${assessment.status.toUpperCase()}</div>
    </div>

    <div class="meta-grid">
      <div class="meta-item"><strong>Assessment Type:</strong> ${assessment.assessmentType}</div>
      <div class="meta-item"><strong>Lead EIA Consultant:</strong> ${assessment.leadConsultant}</div>
      <div class="meta-item"><strong>Project Name:</strong> ${assessment.projectName}</div>
      <div class="meta-item"><strong>Submission Date:</strong> ${assessment.submissionDate}</div>
      <div class="meta-item"><strong>ToR Approval Date:</strong> ${assessment.torApprovalDate || 'N/A'}</div>
      <div class="meta-item"><strong>Public Consultation Date:</strong> ${assessment.publicHearingDate || 'N/A'}</div>
    </div>

    <div class="section-heading">1. Baseline Environmental Parameters Recorded</div>
    <table>
      <thead>
        <tr>
          <th>PARAMETER</th>
          <th>RECORDED VALUE</th>
          <th>PERMISSIBLE STANDARD</th>
          <th>SAMPLE LOCATION</th>
        </tr>
      </thead>
      <tbody>
        ${assessment.baselineData
          .map(
            (b) => `
          <tr>
            <td><strong>${b.parameter}</strong></td>
            <td style="font-family:'JetBrains Mono'; color:#047857; font-weight:bold;">${b.baselineValue} ${b.unit}</td>
            <td style="font-family:'JetBrains Mono'; font-size:10px;">${b.permissibleStandard}</td>
            <td>${b.sampleLocation}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>

    <div class="section-heading">2. Leopold Impact Significance & Mitigation Matrix</div>
    <table>
      <thead>
        <tr>
          <th>DOMAIN</th>
          <th>SEVERITY</th>
          <th>REVERSIBILITY</th>
          <th>MITIGATION STRATEGY</th>
          <th>SCORE</th>
        </tr>
      </thead>
      <tbody>
        ${assessment.keyImpacts
          .map(
            (i) => `
          <tr>
            <td><strong>${i.domain}</strong></td>
            <td>${i.severity}</td>
            <td>${i.reversibility}</td>
            <td>${i.mitigationStrategy}</td>
            <td style="font-family:'JetBrains Mono'; font-weight:bold; color:${i.riskScore >= 18 ? '#e11d48' : '#047857'};">${i.riskScore}/25</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>

    <div class="footer">
      <div>
        NABET / QCI Accredited Environmental Impact Assessment Report<br/>
        Reference ID: ${assessment.id}
      </div>
      <div class="signature-box">
        <div class="line"></div>
        <strong>EIA Team Coordinator / Lead Assessor</strong>
      </div>
    </div>
  `;

  openPrintablePdf(html, `EIA Report - ${assessment.projectName}`);
};
