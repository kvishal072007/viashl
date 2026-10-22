import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { PageHeader } from '../components/layout/PageHeader';
import { SeverityLevel, RiskLevel, RiskStatus, RiskItem } from '../data/centralData';
import {
  AlertTriangle,
  Flame,
  Plus,
  Filter,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  UserCheck,
  Layers,
  X,
  Sparkles,
} from 'lucide-react';

export const EnvironmentalRisksView: React.FC = () => {
  const { projects, assessments, risks, addRisk, updateRiskStatus } = useData();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || 'PRJ-001');
  const [levelFilter, setLevelFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Risk Form State
  const [riskName, setRiskName] = useState('');
  const [riskCategory, setRiskCategory] = useState('Air Pollution');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel>('High');
  const [probability, setProbability] = useState<'Low' | 'Medium' | 'High'>('High');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('High');
  const [status, setStatus] = useState<RiskStatus>('Open');
  const [responsiblePerson, setResponsiblePerson] = useState('');
  const [relatedAssessmentImpact, setRelatedAssessmentImpact] = useState('');

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const projectRisks = risks.filter((r) => r.projectId === selectedProjectId);
  const projectAssessments = assessments.filter((a) => a.projectId === selectedProjectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!riskName || !description) return;

    addRisk({
      projectId: selectedProjectId,
      riskName,
      riskCategory,
      description,
      severity,
      probability,
      riskLevel,
      status,
      identifiedDate: new Date().toISOString().split('T')[0],
      responsiblePerson: responsiblePerson || 'Project Environmental Officer',
      relatedAssessmentImpact,
    });

    setIsModalOpen(false);
    setRiskName('');
    setDescription('');
    setResponsiblePerson('');
  };

  const getRiskLevelBadge = (lvl: RiskLevel) => {
    switch (lvl) {
      case 'Critical':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'High':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'Medium':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  const filteredRisks = projectRisks.filter((r) => {
    const matchesLevel = levelFilter === 'All' || r.riskLevel === levelFilter;
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesLevel && matchesStatus;
  });

  return (
    <div className="space-y-7 pb-16">
      <PageHeader
        title="04. Environmental Risks ⭐⭐⭐"
        subtitle="Dynamic risk generation linked directly from Environmental Assessment: Project → Assessment → Identified Impacts → Relevant Risks."
        badge="ISO 31000 Risk Governance"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-500 hover:bg-rose-600 text-white flex items-center gap-1.5 shadow-lg shadow-rose-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Environmental Risk</span>
          </button>
        }
      />

      {/* Project Selector Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 border border-slate-800">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase">SELECT PROJECT:</span>
        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="w-full sm:w-96 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-bold"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.id} — {p.name} ({p.type})
            </option>
          ))}
        </select>
      </div>

      {/* IMPORTANT CONNECTION BANNER: Assessment -> Risk Directly Connected */}
      <div className="glass-panel p-5 rounded-3xl border border-rose-500/30 bg-gradient-to-r from-rose-950/30 via-slate-900 to-slate-950 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-300">
            SYSTEM IMPACT TO RISK DIRECT PIPELINE:
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-mono items-center">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-slate-500 text-[10px] block">1. PROJECT</span>
            <span className="text-emerald-400 font-bold">{activeProject.name.split('(')[0]}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-slate-500 text-[10px] block">2. ASSESSMENT</span>
            <span className="text-cyan-400 font-bold">{projectAssessments.length} Impacts Identified</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-slate-500 text-[10px] block">3. EXAMPLE LINKAGE</span>
            <span className="text-amber-300 font-bold">"Tree impact irukku"</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-rose-500/40 text-center">
            <span className="text-slate-500 text-[10px] block">4. RISK RESULT</span>
            <span className="text-rose-400 font-bold">"Tree Loss – High Risk"</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 border border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
          <Filter className="w-4 h-4 text-rose-400" />
          <span>Filter Risk Level:</span>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
          >
            <option value="All">All Levels</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
          <span>Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Under Mitigation">Under Mitigation</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Environmental Risks Table matching all user fields */}
      <div className="glass-panel rounded-3xl p-6 space-y-4 border border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-100">
              Active Environmental Risks ({filteredRisks.length})
            </h3>
            <p className="text-xs text-slate-400">
              Risk records connected from assessment impacts with probability, severity & mitigation status
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                <th className="pb-3">Risk ID</th>
                <th className="pb-3">Risk Name & Category</th>
                <th className="pb-3">Assessment Link</th>
                <th className="pb-3">Severity</th>
                <th className="pb-3">Probability</th>
                <th className="pb-3">Risk Level</th>
                <th className="pb-3">Responsible Person</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredRisks.map((risk) => (
                <tr key={risk.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 pr-3 font-mono font-bold text-rose-400">{risk.id}</td>

                  <td className="py-3.5 pr-3">
                    <p className="font-bold text-slate-100">{risk.riskName}</p>
                    <span className="text-[10px] font-mono text-slate-400">{risk.riskCategory}</span>
                  </td>

                  <td className="py-3.5 pr-3 text-emerald-400 font-mono text-[11px]">
                    {risk.relatedAssessmentImpact || 'Baseline Assessment'}
                  </td>

                  <td className="py-3.5 pr-3">
                    <span className="text-slate-300 font-mono">{risk.severity}</span>
                  </td>

                  <td className="py-3.5 pr-3">
                    <span className="text-slate-400 font-mono">{risk.probability}</span>
                  </td>

                  <td className="py-3.5 pr-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase border ${getRiskLevelBadge(risk.riskLevel)}`}>
                      {risk.riskLevel}
                    </span>
                  </td>

                  <td className="py-3.5 pr-3 text-slate-300 text-[11px]">
                    {risk.responsiblePerson}
                  </td>

                  <td className="py-3.5 text-right">
                    <select
                      value={risk.status}
                      onChange={(e) => updateRiskStatus(risk.id, e.target.value as RiskStatus)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[11px] font-mono font-bold text-slate-200 focus:outline-none"
                    >
                      <option value="Open">Open</option>
                      <option value="Under Mitigation">Under Mitigation</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD RISK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-slate-700 bg-slate-950 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-extrabold text-slate-100">Add New Environmental Risk</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Risk Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Tree/Vegetation Loss – High Risk"
                  value={riskName}
                  onChange={(e) => setRiskName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Risk Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Tree / Vegetation Loss"
                    value={riskCategory}
                    onChange={(e) => setRiskCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Linked Assessment Impact</label>
                  <select
                    value={relatedAssessmentImpact}
                    onChange={(e) => setRelatedAssessmentImpact(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-rose-500"
                  >
                    <option value="">Select Impact</option>
                    {projectAssessments.map((a) => (
                      <option key={a.id} value={a.impact}>{a.impact}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Detailed hazard and damage potential..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Severity</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-rose-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Probability</label>
                  <select
                    value={probability}
                    onChange={(e) => setProbability(e.target.value as 'Low' | 'Medium' | 'High')}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-rose-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Risk Level</label>
                  <select
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-rose-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as RiskStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-rose-500"
                  >
                    <option value="Open">Open</option>
                    <option value="Under Mitigation">Under Mitigation</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Responsible Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Er. K. Ramesh (Project Director)"
                    value={responsiblePerson}
                    onChange={(e) => setResponsiblePerson(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>
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
                  className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black"
                >
                  Save Environmental Risk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
