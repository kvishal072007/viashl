import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { PageHeader } from '../components/layout/PageHeader';
import { MitigationStatus, MitigationItem } from '../data/centralData';
import {
  ShieldAlert,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  Trees,
  Wind,
  Volume2,
  Droplets,
  Calendar,
  UserCheck,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const MitigationEMPView: React.FC = () => {
  const { projects, risks, mitigations, addMitigation, updateMitigationStatus } = useData();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [relatedRisk, setRelatedRisk] = useState('');
  const [problem, setProblem] = useState('');
  const [mitigationAction, setMitigationAction] = useState('');
  const [responsiblePerson, setResponsiblePerson] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<MitigationStatus>('In Progress');
  const [remarks, setRemarks] = useState('');
  const [formProjectId, setFormProjectId] = useState(projects[0]?.id || 'PRJ-001');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem || !mitigationAction) return;

    addMitigation({
      projectId: formProjectId,
      relatedRisk: relatedRisk || 'Environmental Risk',
      problem,
      mitigationAction,
      responsiblePerson: responsiblePerson || 'Site Environmental Officer',
      startDate,
      dueDate: dueDate || '2027-06-30',
      status,
      remarks,
    });

    setIsModalOpen(false);
    setProblem('');
    setMitigationAction('');
    setResponsiblePerson('');
    setRemarks('');
  };

  const filteredMitigations = mitigations.filter((m) => {
    const matchesProj = selectedProjectId === 'All' || m.projectId === selectedProjectId;
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesProj && matchesStatus;
  });

  return (
    <div className="space-y-7 pb-16">
      <PageHeader
        title="06. Mitigation Measures 🛡️"
        subtitle="Purpose: Risk-ah reduce panna enna action edukkanum-nu track panna (Main connection: RISK → MITIGATION → ACTION)."
        badge="Environmental Management Plan (EMP)"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Mitigation Action</span>
          </button>
        }
      />

      {/* Connection Flow Banner */}
      <div className="glass-panel p-5 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-950 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
            CORE MITIGATION WORKFLOW PIPELINE:
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-rose-500/30">
            <span className="text-rose-400 text-[10px] block font-bold">1. IDENTIFIED RISK</span>
            <p className="font-bold text-slate-200 mt-1">Air Pollution – High</p>
            <p className="text-[10px] text-slate-400">Tree Loss (150 Cut)</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30">
            <span className="text-amber-400 text-[10px] block font-bold">2. MITIGATION STRATEGY</span>
            <p className="font-bold text-slate-200 mt-1">Regular Water Spraying</p>
            <p className="text-[10px] text-slate-400">Compensatory Tree Plantation</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/30">
            <span className="text-emerald-400 text-[10px] block font-bold">3. ENFORCED ACTION</span>
            <p className="font-bold text-slate-200 mt-1">14 Mobile Foggers every 2 hrs</p>
            <p className="text-[10px] text-slate-400">300 Saplings Planted at 1:2</p>
          </div>
        </div>
      </div>

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
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Mitigations Records Table */}
      <div className="glass-panel rounded-3xl p-6 space-y-4 border border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-100">
              Mitigation Actions Ledger ({filteredMitigations.length})
            </h3>
            <p className="text-xs text-slate-400">
              Assigned actions to reduce environmental hazards, due dates & completion status
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                <th className="pb-3">Mitigation ID</th>
                <th className="pb-3">Project</th>
                <th className="pb-3">Related Risk & Problem</th>
                <th className="pb-3">Mitigation Action</th>
                <th className="pb-3">Responsible Person</th>
                <th className="pb-3">Due Date</th>
                <th className="pb-3">Completion Date</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredMitigations.map((m) => {
                const proj = projects.find((p) => p.id === m.projectId);
                return (
                  <tr key={m.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 pr-2 font-mono font-bold text-emerald-400">{m.id}</td>

                    <td className="py-3.5 pr-3">
                      <span className="font-bold text-slate-200 block">{proj?.name.split('(')[0] || m.projectId}</span>
                      <span className="text-[10px] font-mono text-slate-500">{m.projectId}</span>
                    </td>

                    <td className="py-3.5 pr-3 max-w-xs">
                      <span className="font-bold text-rose-400 block">{m.relatedRisk}</span>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{m.problem}</p>
                    </td>

                    <td className="py-3.5 pr-3 max-w-xs">
                      <p className="font-bold text-emerald-300 leading-relaxed">{m.mitigationAction}</p>
                      {m.remarks && <p className="text-[10px] text-slate-400 mt-0.5">{m.remarks}</p>}
                    </td>

                    <td className="py-3.5 pr-3 text-slate-300 text-[11px]">
                      {m.responsiblePerson}
                    </td>

                    <td className="py-3.5 pr-3 font-mono text-slate-400">{m.dueDate}</td>

                    <td className="py-3.5 pr-3 font-mono text-emerald-400 font-bold">
                      {m.completionDate || 'In Progress'}
                    </td>

                    <td className="py-3.5 text-right">
                      <select
                        value={m.status}
                        onChange={(e) => updateMitigationStatus(m.id, e.target.value as MitigationStatus)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border focus:outline-none ${
                          m.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : m.status === 'In Progress'
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MITIGATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-slate-700 bg-slate-950 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-extrabold text-slate-100">Add Mitigation Action Record</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Target Project</label>
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
                <label className="block text-slate-300 font-bold mb-1">Related Environmental Risk</label>
                <select
                  value={relatedRisk}
                  onChange={(e) => setRelatedRisk(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Select Related Risk</option>
                  {risks
                    .filter((r) => r.projectId === formProjectId)
                    .map((r) => (
                      <option key={r.id} value={r.riskName}>{r.riskName} ({r.riskLevel})</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Problem / Hazard Identified</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Felling of 150 mature trees along corridor stretch"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Mitigation Action to Execute</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Compensatory tree plantation of 300 saplings at 1:2 ratio with drip irrigation"
                  value={mitigationAction}
                  onChange={(e) => setMitigationAction(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Responsible Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Horticultural Officer"
                    value={responsiblePerson}
                    onChange={(e) => setResponsiblePerson(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as MitigationStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. 185 planted to date with 94% survival rate"
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
                  Save Mitigation Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
