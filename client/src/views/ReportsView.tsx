import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { PageHeader } from '../components/layout/PageHeader';
import { openPrintablePdf } from '../utils/pdfGenerator';
import {
  FileText,
  Download,
  Printer,
  Building,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles,
  ChevronRight,
  Eye,
  Calendar,
  User,
  ArrowRight,
} from 'lucide-react';

const REPORT_TYPES = [
  'Comprehensive Environmental Dossier (All Modules)',
  'Project Report',
  'Environmental Assessment Report',
  'Environmental Risk Report',
  'Approval Report',
  'Mitigation Report',
  'Monitoring Report',
  'Compliance Report',
] as const;

export const ReportsView: React.FC = () => {
  const {
    projects,
    assessments,
    risks,
    approvals,
    mitigations,
    monitoring,
    complianceRecords,
    documents,
    logAudit,
  } = useData();

  const [selectedProjectId, setSelectedProjectId] = useState<string>('PRJ-001');
  const [selectedReportType, setSelectedReportType] = useState<string>('Comprehensive Environmental Dossier (All Modules)');
  const [isGenerated, setIsGenerated] = useState<boolean>(true);

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Filter linked data for selected project
  const projectAssessments = assessments.filter((a) => a.projectId === selectedProjectId);
  const projectRisks = risks.filter((r) => r.projectId === selectedProjectId);
  const projectApprovals = approvals.filter((a) => a.projectId === selectedProjectId);
  const projectMitigations = mitigations.filter((m) => m.projectId === selectedProjectId);
  const projectMonitoring = monitoring.filter((m) => m.projectId === selectedProjectId);
  const projectCompliance = complianceRecords.filter((c) => c.projectId === selectedProjectId);
  const projectDocs = documents.filter((d) => d.projectId === selectedProjectId);

  const handleGenerate = () => {
    setIsGenerated(true);
    logAudit('Admin generated report', 'Reports', `Generated ${selectedReportType} for ${currentProject.name} (${currentProject.id})`);
  };

  const handleExportPDF = () => {
    logAudit('Admin downloaded PDF report', 'Reports', `Exported PDF for ${currentProject.name}`);

    const htmlContent = `
      <div class="header">
        <div class="title-area">
          <p style="font-weight:700; color:#059669; font-size:12px; letter-spacing:1px; margin-bottom:4px;">GOVERNMENT OF TAMIL NADU • STATE ENVIRONMENT AUDIT</p>
          <h1>${selectedReportType}</h1>
          <p>Asset: <strong>${currentProject.name} (${currentProject.id})</strong> | Generated on: ${new Date().toLocaleDateString('en-GB')}</p>
        </div>
        <div class="badge">STATUTORY REPORT</div>
      </div>

      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px; margin-bottom:20px;">
        <h3 style="margin:0 0 10px 0; color:#0f172a; font-size:14px; font-weight:700;">1. 🏗️ Project Details</h3>
        <p style="margin:4px 0; font-size:12px;"><strong>Project Name:</strong> ${currentProject.name}</p>
        <p style="margin:4px 0; font-size:12px;"><strong>Project Type:</strong> ${currentProject.type} | <strong>Status:</strong> ${currentProject.status}</p>
        <p style="margin:4px 0; font-size:12px;"><strong>Location:</strong> ${currentProject.location}</p>
        <p style="margin:4px 0; font-size:12px;"><strong>Department / Owner:</strong> ${currentProject.owner}</p>
        <p style="margin:4px 0; font-size:12px;"><strong>Timeline:</strong> ${currentProject.startDate} to ${currentProject.expectedEndDate}</p>
        <p style="margin:4px 0; font-size:12px;"><strong>Description:</strong> ${currentProject.description}</p>
      </div>

      <div style="margin-bottom:20px;">
        <h3 style="margin:0 0 8px 0; color:#0f172a; font-size:14px; font-weight:700;">2. 🌱 Environmental Assessment</h3>
        <table style="width:100%; border-collapse:collapse; font-size:11px;">
          <thead>
            <tr style="background:#f1f5f9; text-align:left;">
              <th style="padding:6px; border:1px solid #cbd5e1;">Category</th>
              <th style="padding:6px; border:1px solid #cbd5e1;">Impact</th>
              <th style="padding:6px; border:1px solid #cbd5e1;">Severity</th>
              <th style="padding:6px; border:1px solid #cbd5e1;">Affected Area</th>
            </tr>
          </thead>
          <tbody>
            ${projectAssessments.map((a) => `
              <tr>
                <td style="padding:6px; border:1px solid #cbd5e1;">${a.category}</td>
                <td style="padding:6px; border:1px solid #cbd5e1;"><strong>${a.impact}</strong></td>
                <td style="padding:6px; border:1px solid #cbd5e1; color:${a.severity === 'High' ? '#dc2626' : '#d97706'}; font-weight:bold;">${a.severity}</td>
                <td style="padding:6px; border:1px solid #cbd5e1;">${a.affectedArea}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div style="margin-bottom:20px;">
        <h3 style="margin:0 0 8px 0; color:#0f172a; font-size:14px; font-weight:700;">3. ⚠️ Environmental Risks</h3>
        <table style="width:100%; border-collapse:collapse; font-size:11px;">
          <thead>
            <tr style="background:#f1f5f9; text-align:left;">
              <th style="padding:6px; border:1px solid #cbd5e1;">Risk ID</th>
              <th style="padding:6px; border:1px solid #cbd5e1;">Risk Name</th>
              <th style="padding:6px; border:1px solid #cbd5e1;">Category</th>
              <th style="padding:6px; border:1px solid #cbd5e1;">Risk Level</th>
              <th style="padding:6px; border:1px solid #cbd5e1;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${projectRisks.map((r) => `
              <tr>
                <td style="padding:6px; border:1px solid #cbd5e1; font-family:monospace;">${r.id}</td>
                <td style="padding:6px; border:1px solid #cbd5e1;">${r.riskName}</td>
                <td style="padding:6px; border:1px solid #cbd5e1;">${r.riskCategory}</td>
                <td style="padding:6px; border:1px solid #cbd5e1; font-weight:bold; color:${r.riskLevel === 'High' || r.riskLevel === 'Critical' ? '#dc2626' : '#2563eb'}">${r.riskLevel}</td>
                <td style="padding:6px; border:1px solid #cbd5e1;">${r.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div style="margin-bottom:20px;">
        <h3 style="margin:0 0 8px 0; color:#0f172a; font-size:14px; font-weight:700;">4. 📋 Statutory Approvals</h3>
        <table style="width:100%; border-collapse:collapse; font-size:11px;">
          <thead>
            <tr style="background:#f1f5f9; text-align:left;">
              <th style="padding:6px; border:1px solid #cbd5e1;">Approval</th>
              <th style="padding:6px; border:1px solid #cbd5e1;">Authority</th>
              <th style="padding:6px; border:1px solid #cbd5e1;">Status</th>
              <th style="padding:6px; border:1px solid #cbd5e1;">Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            ${projectApprovals.map((app) => `
              <tr>
                <td style="padding:6px; border:1px solid #cbd5e1;"><strong>${app.approvalName}</strong></td>
                <td style="padding:6px; border:1px solid #cbd5e1;">${app.authority}</td>
                <td style="padding:6px; border:1px solid #cbd5e1; color:#059669; font-weight:bold;">${app.status}</td>
                <td style="padding:6px; border:1px solid #cbd5e1; font-family:monospace;">${app.expiryDate || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div style="margin-bottom:20px;">
        <h3 style="margin:0 0 8px 0; color:#0f172a; font-size:14px; font-weight:700;">5. 🛡️ Mitigation Measures (Risk → Mitigation → Action)</h3>
        <table style="width:100%; border-collapse:collapse; font-size:11px;">
          <thead>
            <tr style="background:#f1f5f9; text-align:left;">
              <th style="padding:6px; border:1px solid #cbd5e1;">Related Risk</th>
              <th style="padding:6px; border:1px solid #cbd5e1;">Action Taken</th>
              <th style="padding:6px; border:1px solid #cbd5e1;">Officer</th>
              <th style="padding:6px; border:1px solid #cbd5e1;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${projectMitigations.map((m) => `
              <tr>
                <td style="padding:6px; border:1px solid #cbd5e1;">${m.relatedRisk}</td>
                <td style="padding:6px; border:1px solid #cbd5e1;"><strong>${m.mitigationAction}</strong></td>
                <td style="padding:6px; border:1px solid #cbd5e1;">${m.responsiblePerson}</td>
                <td style="padding:6px; border:1px solid #cbd5e1;">${m.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div style="margin-bottom:20px;">
        <h3 style="margin:0 0 8px 0; color:#0f172a; font-size:14px; font-weight:700;">6. 📈 Environmental Monitoring (Telemetry & Field Tests)</h3>
        <table style="width:100%; border-collapse:collapse; font-size:11px;">
          <thead>
            <tr style="background:#f1f5f9; text-align:left;">
              <th style="padding:6px; border:1px solid #cbd5e1;">Parameter</th>
              <th style="padding:6px; border:1px solid #cbd5e1;">Measured Value</th>
              <th style="padding:6px; border:1px solid #cbd5e1;">Allowed Limit</th>
              <th style="padding:6px; border:1px solid #cbd5e1;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${projectMonitoring.map((mon) => `
              <tr>
                <td style="padding:6px; border:1px solid #cbd5e1;">${mon.parameter}</td>
                <td style="padding:6px; border:1px solid #cbd5e1; font-weight:bold;">${mon.measuredValue}</td>
                <td style="padding:6px; border:1px solid #cbd5e1;">${mon.allowedLimit}</td>
                <td style="padding:6px; border:1px solid #cbd5e1;">${mon.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div style="margin-bottom:20px;">
        <h3 style="margin:0 0 8px 0; color:#0f172a; font-size:14px; font-weight:700;">7. ✅ Compliance Conditions Ledger</h3>
        <table style="width:100%; border-collapse:collapse; font-size:11px;">
          <thead>
            <tr style="background:#f1f5f9; text-align:left;">
              <th style="padding:6px; border:1px solid #cbd5e1;">Requirement</th>
              <th style="padding:6px; border:1px solid #cbd5e1;">Due Date</th>
              <th style="padding:6px; border:1px solid #cbd5e1;">Status</th>
              <th style="padding:6px; border:1px solid #cbd5e1;">Evidence</th>
            </tr>
          </thead>
          <tbody>
            ${projectCompliance.map((c) => `
              <tr>
                <td style="padding:6px; border:1px solid #cbd5e1;">${c.requirement}</td>
                <td style="padding:6px; border:1px solid #cbd5e1; font-family:monospace;">${c.dueDate}</td>
                <td style="padding:6px; border:1px solid #cbd5e1; font-weight:bold;">${c.status}</td>
                <td style="padding:6px; border:1px solid #cbd5e1; font-family:monospace;">${c.evidenceDocument || 'None'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div style="margin-bottom:20px;">
        <h3 style="margin:0 0 8px 0; color:#0f172a; font-size:14px; font-weight:700;">8. 📄 Associated Statutory Documents</h3>
        <ul style="font-size:11px; padding-left:20px;">
          ${projectDocs.map((d) => `
            <li><strong>${d.name}</strong> (${d.documentType}) - Version: ${d.version} | Uploaded by: ${d.uploadedBy} on ${d.uploadDate}</li>
          `).join('')}
        </ul>
      </div>

      <div style="border-top:2px solid #cbd5e1; padding-top:16px; margin-top:30px; font-size:10px; color:#64748b; display:flex; justify-content:space-between;">
        <span>State Environmental Monitoring & Impact Assessment Portal (SEMIAP)</span>
        <span>Cryptographic Verification Seal: SHA-256 Validated</span>
      </div>
    `;

    openPrintablePdf(htmlContent, `${currentProject.name}_Environmental_Report`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="11. 📑 Reports"
        description="Compile and generate comprehensive statutory environmental reports for Government Officers and Regulatory Authorities."
        badge="Report Generator"
        action={{
          label: 'Export PDF Report',
          icon: Download,
          onClick: handleExportPDF,
        }}
      />

      {/* Generator Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Generate Official Environmental Dossier</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              1. Select Project
            </label>
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white">
              <Building className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="bg-transparent text-white outline-none w-full cursor-pointer"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                    {p.name} ({p.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              2. Select Report Type
            </label>
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white">
              <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className="bg-transparent text-white outline-none w-full cursor-pointer"
              >
                {REPORT_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-slate-900 text-white">
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Generate Report Preview
            </button>
          </div>
        </div>

        {/* Pipeline sequence visualizer */}
        <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Automated Generation Pipeline:
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
            <span className="px-2.5 py-1 rounded bg-slate-900 text-emerald-400 border border-emerald-500/30 font-semibold">
              Project Details
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="px-2.5 py-1 rounded bg-slate-900 text-teal-400 border border-teal-500/30 font-semibold">
              Assessment
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="px-2.5 py-1 rounded bg-slate-900 text-amber-400 border border-amber-500/30 font-semibold">
              Risks
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="px-2.5 py-1 rounded bg-slate-900 text-blue-400 border border-blue-500/30 font-semibold">
              Approvals
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="px-2.5 py-1 rounded bg-slate-900 text-indigo-400 border border-indigo-500/30 font-semibold">
              Mitigation
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="px-2.5 py-1 rounded bg-slate-900 text-cyan-400 border border-cyan-500/30 font-semibold">
              Monitoring
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="px-2.5 py-1 rounded bg-slate-900 text-green-400 border border-green-500/30 font-semibold">
              Compliance
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="px-2.5 py-1 rounded bg-slate-900 text-purple-400 border border-purple-500/30 font-semibold">
              Documents
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="px-3 py-1 rounded bg-emerald-500 text-slate-950 font-bold">
              PDF Export
            </span>
          </div>
        </div>
      </div>

      {/* Generated Report Dossier Preview */}
      {isGenerated && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold tracking-widest text-emerald-400 uppercase">
                Official Regulatory Record • State Government of Tamil Nadu
              </span>
              <h2 className="text-xl font-extrabold text-white mt-1">
                {currentProject.name}
              </h2>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Asset ID: {currentProject.id} • Type: {currentProject.type} • Status: {currentProject.status}
              </p>
            </div>
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download Official PDF
            </button>
          </div>

          <div className="p-6 space-y-6 text-xs text-slate-300">
            {/* 1. Project Details */}
            <section className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-400" />
                1. 🏗️ Project Management Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <p><span className="text-slate-500">Project Owner:</span> {currentProject.owner}</p>
                <p><span className="text-slate-500">Location:</span> {currentProject.location}</p>
                <p><span className="text-slate-500">Timeline:</span> {currentProject.startDate} to {currentProject.expectedEndDate}</p>
                <p><span className="text-slate-500">Capital Budget:</span> ₹{currentProject.budgetMillion} Million</p>
                <p className="md:col-span-2"><span className="text-slate-500">Description:</span> {currentProject.description}</p>
              </div>
            </section>

            {/* 2. Environmental Assessment */}
            <section className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                2. 🌱 Environmental Assessment ({projectAssessments.length} categories evaluated)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {projectAssessments.map((a) => (
                  <div key={a.id} className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">{a.category}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        a.severity === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {a.severity}
                      </span>
                    </div>
                    <p className="font-medium text-slate-200">{a.impact}</p>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{a.affectedArea}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Environmental Risks */}
            <section className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                3. ⚠️ Identified Environmental Risks ({projectRisks.length} recorded)
              </h4>
              <div className="space-y-2">
                {projectRisks.map((r) => (
                  <div key={r.id} className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-emerald-400">{r.id}</span>
                        <span className="font-bold text-white">{r.riskName}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Category: {r.riskCategory} • Lead: {r.responsiblePerson}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-amber-400">{r.riskLevel} Risk</span>
                      <p className="text-[11px] text-slate-400">{r.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Approvals */}
            <section className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                4. 📋 Statutory Approvals & Clearances
              </h4>
              <div className="space-y-2">
                {projectApprovals.map((app) => (
                  <div key={app.id} className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">{app.approvalName}</span>
                      <p className="text-[11px] text-slate-400">Authority: {app.authority}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-bold">{app.status}</span>
                      <p className="text-[11px] text-slate-400 font-mono">Expiry: {app.expiryDate || 'N/A'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Mitigation */}
            <section className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                5. 🛡️ Mitigation Measures & EMP Execution
              </h4>
              <div className="space-y-2">
                {projectMitigations.map((m) => (
                  <div key={m.id} className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <p className="font-bold text-white">Action: {m.mitigationAction}</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Problem: {m.problem} • Lead: {m.responsiblePerson} • Status: <strong className="text-emerald-400">{m.status}</strong>
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. Monitoring & Telemetry */}
            <section className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                6. 📈 Environmental Monitoring (Telemetry & Field Test Records)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {projectMonitoring.map((mon) => (
                  <div key={mon.id} className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-400">{mon.parameter}</span>
                    <p className="text-lg font-bold text-white mt-0.5">{mon.measuredValue}</p>
                    <p className="text-[11px] text-emerald-400">Limit: {mon.allowedLimit}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 7. Compliance */}
            <section className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                7. ✅ Compliance Conditions & Evidence Records
              </h4>
              <div className="space-y-2">
                {projectCompliance.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">{c.requirement}</span>
                      <p className="text-[11px] text-slate-400">Evidence: {c.evidenceDocument}</p>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold ${c.status === 'Completed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {c.status}
                      </span>
                      <p className="text-[11px] text-slate-400 font-mono">Due: {c.dueDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 8. Documents */}
            <section className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                8. 📄 Associated Statutory Documents ({projectDocs.length})
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                {projectDocs.map((d) => (
                  <li key={d.id}>
                    <strong className="text-slate-200">{d.name}</strong> ({d.documentType}) - Version {d.version}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};
