import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import {
  AlertTriangle,
  Plus,
  CheckCircle2,
  Calendar,
  UserCheck,
  Camera,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { api } from '../services/api';
import { NonComplianceReport, Project } from '../types';

export const NCRResolutionView: React.FC = () => {
  const [ncrs, setNcrs] = useState<NonComplianceReport[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeNcr, setActiveNcr] = useState<NonComplianceReport | null>(null);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [capText, setCapText] = useState('');

  const loadData = async () => {
    try {
      const [ncrList, projList] = await Promise.all([
        api.getNCRs({
          projectId: selectedProjectId || undefined,
          status: statusFilter || undefined,
        }),
        api.getProjects(),
      ]);
      setNcrs(ncrList);
      setProjects(projList);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedProjectId, statusFilter]);

  const handleUpdateStatus = async (ncr: NonComplianceReport, nextStatus: NonComplianceReport['status']) => {
    try {
      const updated = await api.updateNCR(ncr.id, {
        status: nextStatus,
        correctiveActionPlan: capText || ncr.correctiveActionPlan,
        resolutionDate: nextStatus === 'Closed' ? new Date().toISOString().split('T')[0] : undefined,
      });
      setNcrs((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      setIsResolveModalOpen(false);
      setCapText('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Non-Compliance Reporting (NCR) & Corrective Action Plans"
        subtitle="Formal statutory non-conformance tracking, breach notices, root cause analysis, and CAP verification workflows."
        badge={`${ncrs.filter((n) => n.status !== 'Closed').length} Action Items Open`}
        actions={
          <button
            onClick={() => setIsIssueModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-rose-500 hover:bg-rose-600 text-white flex items-center gap-1.5 transition-all shadow-lg shadow-rose-500/20"
          >
            <AlertTriangle className="w-4 h-4" />
            Issue NCR Notice
          </button>
        }
      />

      {/* Filters */}
      <div className="glass-panel p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:outline-none text-slate-200"
          >
            <option value="">All Infrastructure Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} - {p.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:outline-none text-slate-300"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="CAP Submitted">CAP Submitted</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="text-xs text-slate-400">
          Showing <span className="font-bold text-slate-200">{ncrs.length}</span> notices
        </div>
      </div>

      {/* NCR Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ncrs.map((ncr) => (
          <div
            key={ncr.id}
            className={`glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-4 border ${
              ncr.status === 'Closed'
                ? 'border-slate-800/80 opacity-80'
                : ncr.severity === 'Critical' || ncr.severity === 'Major'
                ? 'border-rose-500/40 bg-rose-950/10'
                : 'border-amber-500/40 bg-amber-950/10'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                      {ncr.code}
                    </span>
                    <StatusBadge status={ncr.severity} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 mt-2">{ncr.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-1">{ncr.projectName}</p>
                </div>
                <StatusBadge status={ncr.status} />
              </div>

              <p className="text-xs text-slate-300 mt-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                {ncr.description}
              </p>

              <div className="mt-3 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] space-y-1 text-slate-400">
                <p>
                  ⚖️ <strong className="text-slate-300">Violated Standard:</strong>{' '}
                  {ncr.violatedRegulation}
                </p>
                <p>
                  🔍 <strong className="text-slate-300">Identified By:</strong> {ncr.identifiedBy}
                </p>
                <p>
                  👤 <strong className="text-slate-300">Assigned To:</strong> {ncr.assignedTo}
                </p>
              </div>

              {ncr.correctiveActionPlan && (
                <div className="mt-3 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300">
                  <strong className="text-emerald-400">Corrective Action Plan (CAP):</strong>
                  <p className="mt-1 text-slate-300">{ncr.correctiveActionPlan}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">
                Due Date: <strong className="text-amber-400">{ncr.dueDate}</strong>
              </span>

              {ncr.status === 'Open' && (
                <button
                  onClick={() => {
                    setActiveNcr(ncr);
                    setIsResolveModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-semibold"
                >
                  Submit CAP Plan
                </button>
              )}

              {ncr.status === 'CAP Submitted' && (
                <button
                  onClick={() => handleUpdateStatus(ncr, 'Closed')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verify & Close NCR
                </button>
              )}

              {ncr.status === 'Closed' && (
                <span className="text-emerald-400 font-semibold flex items-center gap-1 text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  Resolved on {ncr.resolutionDate}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CAP Plan Modal */}
      {isResolveModalOpen && activeNcr && (
        <Modal
          isOpen={isResolveModalOpen}
          onClose={() => setIsResolveModalOpen(false)}
          title={`Corrective Action Plan: ${activeNcr.code}`}
          subtitle="Formulate immediate mitigation and root-cause remedy"
        >
          <div className="space-y-4 text-xs">
            <div>
              <p className="text-slate-400 font-semibold mb-1">Issue Description</p>
              <p className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                {activeNcr.description}
              </p>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Corrective Action Plan Details
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe engineering controls deployed, water sprinkler schedule, netting..."
                value={capText}
                onChange={(e) => setCapText(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsResolveModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(activeNcr, 'CAP Submitted')}
                className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold"
              >
                Submit CAP for Verification
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Issue NCR Modal */}
      {isIssueModalOpen && (
        <Modal
          isOpen={isIssueModalOpen}
          onClose={() => setIsIssueModalOpen(false)}
          title="Issue Non-Compliance Report Notice"
          subtitle="Statutory breach notification issued to project contractor"
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Target Project</label>
              <select className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100">
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">NCR Title</label>
              <input
                type="text"
                placeholder="e.g. Unsprayed Aggregate Stockpile During High Winds"
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Severity</label>
                <select className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100">
                  <option value="Minor">Minor Non-Conformance</option>
                  <option value="Major">Major Breach</option>
                  <option value="Critical">Critical Stop-Work Severity</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Remediation Due Date</label>
                <input
                  type="date"
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setIsIssueModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('NCR Notice Issued.');
                  setIsIssueModalOpen(false);
                }}
                className="px-5 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold"
              >
                Issue Notice
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
