import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { PageHeader } from '../components/layout/PageHeader';
import { ApprovalStatus, ApprovalItem } from '../data/centralData';
import {
  FileCheck,
  Plus,
  Search,
  Filter,
  Calendar,
  FileText,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
} from 'lucide-react';
import { downloadApprovalLetterPdf } from '../utils/pdfGenerator';
import { RegulatoryApproval } from '../types';

export const ApprovalsView: React.FC = () => {
  const { projects, approvals, addApproval } = useData();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [approvalName, setApprovalName] = useState('');
  const [approvalType, setApprovalType] = useState('Environmental Clearance');
  const [authority, setAuthority] = useState('');
  const [applicationDate, setApplicationDate] = useState(new Date().toISOString().split('T')[0]);
  const [approvalDate, setApprovalDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [status, setStatus] = useState<ApprovalStatus>('Pending');
  const [document, setDocument] = useState('Approval_Letter.pdf');
  const [remarks, setRemarks] = useState('');
  const [formProjectId, setFormProjectId] = useState(projects[0]?.id || 'PRJ-001');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvalName || !authority) return;

    addApproval({
      projectId: formProjectId,
      approvalName,
      approvalType,
      authority,
      applicationDate,
      approvalDate,
      expiryDate,
      status,
      document: document || `${approvalName.replace(/\s+/g, '_')}.pdf`,
      remarks,
    });

    setIsModalOpen(false);
    setApprovalName('');
    setAuthority('');
    setApprovalDate('');
    setExpiryDate('');
    setRemarks('');
  };

  const filteredApprovals = approvals.filter((app) => {
    const matchesProject = selectedProjectId === 'All' || app.projectId === selectedProjectId;
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesProject && matchesStatus;
  });

  const getStatusBadge = (st: ApprovalStatus) => {
    switch (st) {
      case 'Approved':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'Under Review':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'Pending':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'Expired':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const handleDownloadLetter = (app: ApprovalItem) => {
    const regApp: RegulatoryApproval = {
      id: app.id,
      projectId: app.projectId,
      projectName: projects.find((p) => p.id === app.projectId)?.name || 'Project Asset',
      clearanceType: 'Environmental Clearance (EC - MoEFCC)',
      issuingAuthority: app.authority,
      applicationNumber: app.id,
      applicationDate: app.applicationDate,
      approvalDate: app.approvalDate || 'Under Review',
      validUntil: app.expiryDate || 'N/A',
      slaDeadline: app.expiryDate || '2028-12-31',
      status: app.status === 'Approved' ? 'Approved' : 'Under Review',
      conditionsCount: { total: 12, complied: 10, pending: 2 },
      keyConditions: [
        {
          id: 'C-01',
          conditionText: 'Mandatory compensatory afforestation and continuous monitoring.',
          type: 'Specific Condition',
          status: 'Compliant',
          actionRequired: 'Quarterly compliance filing.',
        },
      ],
      approvalLetterUrl: '/docs/approval.pdf',
      createdAt: app.applicationDate,
    };
    downloadApprovalLetterPdf(regApp);
  };

  return (
    <div className="space-y-7 pb-16">
      <PageHeader
        title="05. Approval Management"
        subtitle="Purpose: Project-ku required environmental approvals track panna (Environmental Clearance, CTE/CTO, Forest Clearance, CRZ)."
        badge="Statutory Regulatory Vault"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Environmental Approval</span>
          </button>
        }
      />

      {/* Filter and Project Selector */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
          <Filter className="w-4 h-4 text-emerald-400" />
          <span>Project:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 font-bold"
          >
            <option value="All">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} — {p.name.split('(')[0]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
          <span>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
          >
            <option value="All">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Under Review">Under Review</option>
            <option value="Pending">Pending</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Approvals Table */}
      <div className="glass-panel rounded-3xl p-6 space-y-4 border border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-100">
              Statutory Clearances & Approvals Tracker ({filteredApprovals.length})
            </h3>
            <p className="text-xs text-slate-400">
              Complete regulatory trail with authorities, validity deadlines & letters
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                <th className="pb-3">Approval ID</th>
                <th className="pb-3">Project</th>
                <th className="pb-3">Approval Name</th>
                <th className="pb-3">Authority</th>
                <th className="pb-3">Application Date</th>
                <th className="pb-3">Approval Date</th>
                <th className="pb-3">Expiry Date</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Document</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredApprovals.map((app) => {
                const proj = projects.find((p) => p.id === app.projectId);
                return (
                  <tr key={app.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 pr-2 font-mono font-bold text-emerald-400">{app.id}</td>

                    <td className="py-3.5 pr-3">
                      <span className="font-bold text-slate-200 block">{proj?.name.split('(')[0] || app.projectId}</span>
                      <span className="text-[10px] font-mono text-slate-500">{app.projectId}</span>
                    </td>

                    <td className="py-3.5 pr-3">
                      <span className="font-extrabold text-slate-100 block">{app.approvalName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{app.approvalType}</span>
                    </td>

                    <td className="py-3.5 pr-3 text-slate-300 max-w-xs">{app.authority}</td>

                    <td className="py-3.5 pr-3 font-mono text-slate-400">{app.applicationDate}</td>

                    <td className="py-3.5 pr-3 font-mono text-emerald-400 font-bold">
                      {app.approvalDate || 'Pending'}
                    </td>

                    <td className="py-3.5 pr-3 font-mono text-amber-400 font-bold">
                      {app.expiryDate || 'N/A'}
                    </td>

                    <td className="py-3.5 pr-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase border ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </td>

                    <td className="py-3.5 pr-3">
                      <span className="text-emerald-400 text-[11px] font-mono flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[120px]">{app.document}</span>
                      </span>
                    </td>

                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleDownloadLetter(app)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        View PDF
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD APPROVAL MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-slate-700 bg-slate-950 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-extrabold text-slate-100">Add Project Environmental Approval</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Project</label>
                <select
                  value={formProjectId}
                  onChange={(e) => setFormProjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500 font-bold"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} — {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Approval Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Environmental Clearance (EC)"
                  value={approvalName}
                  onChange={(e) => setApprovalName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Approval Type</label>
                  <input
                    type="text"
                    placeholder="e.g. Environmental Clearance"
                    value={approvalType}
                    onChange={(e) => setApprovalType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ApprovalStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Competent Authority</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. State Environmental Impact Assessment Authority (SEIAA-TN)"
                  value={authority}
                  onChange={(e) => setAuthority(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Application Date</label>
                  <input
                    type="date"
                    value={applicationDate}
                    onChange={(e) => setApplicationDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Approval Date</label>
                  <input
                    type="date"
                    value={approvalDate}
                    onChange={(e) => setApprovalDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Attached Document Name</label>
                <input
                  type="text"
                  placeholder="e.g. EC_Order_Signed.pdf"
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Remarks</label>
                <textarea
                  rows={2}
                  placeholder="Clearance conditions or special stipulations..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black"
                >
                  Save Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
