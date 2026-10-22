import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { PageHeader } from '../components/layout/PageHeader';
import { SeverityLevel, AssessmentItem } from '../data/centralData';
import {
  FileSpreadsheet,
  Plus,
  Wind,
  Droplets,
  Volume2,
  Globe2,
  Trees,
  Bird,
  Trash2,
  AlertTriangle,
  Calendar,
  MapPin,
  ArrowRight,
  X,
  CheckCircle2,
} from 'lucide-react';

export const AssessmentsView: React.FC = () => {
  const { projects, assessments, addAssessment } = useData();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || 'PRJ-001');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [category, setCategory] = useState<AssessmentItem['category']>('Air');
  const [impact, setImpact] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel>('High');
  const [affectedArea, setAffectedArea] = useState('');
  const [assessmentDate, setAssessmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [remarks, setRemarks] = useState('');

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const projectAssessments = assessments.filter((a) => a.projectId === selectedProjectId);

  const categories = [
    { name: 'Air', icon: Wind, color: 'text-amber-400', sub: 'Dust, Vehicle emissions, Construction emissions' },
    { name: 'Water', icon: Droplets, color: 'text-blue-400', sub: 'Water pollution, Groundwater impact, Surface water impact' },
    { name: 'Noise', icon: Volume2, color: 'text-rose-400', sub: 'Construction noise, Traffic noise' },
    { name: 'Soil/Land', icon: Globe2, color: 'text-emerald-400', sub: 'Soil erosion, Land disturbance, Soil contamination' },
    { name: 'Vegetation', icon: Trees, color: 'text-teal-400', sub: 'Tree cutting, Vegetation loss' },
    { name: 'Biodiversity', icon: Bird, color: 'text-purple-400', sub: 'Wildlife disturbance, Habitat disturbance' },
    { name: 'Waste', icon: Trash2, color: 'text-orange-400', sub: 'Construction waste, Hazardous waste, Waste disposal' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!impact || !description) return;

    addAssessment({
      projectId: selectedProjectId,
      category,
      impact,
      description,
      severity,
      affectedArea: affectedArea || activeProject.location,
      assessmentDate,
      remarks,
    });

    setIsModalOpen(false);
    setImpact('');
    setDescription('');
    setAffectedArea('');
    setRemarks('');
  };

  const getSeverityClass = (sev: SeverityLevel) => {
    switch (sev) {
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

  return (
    <div className="space-y-7 pb-16">
      <PageHeader
        title="03. Environmental Assessment ⭐"
        subtitle="Purpose: Andha particular project environment-ku enna impact create pannum nu identify panna."
        badge="Impact Identification Engine"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record New Assessment</span>
          </button>
        }
      />

      {/* Project Selector Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">TARGET PROJECT:</span>
        </div>
        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="w-full sm:w-96 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-bold"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.id} — {p.name} ({p.type})
            </option>
          ))}
        </select>
      </div>

      {/* Example Summary Scorecard matching user's exact specification */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 bg-slate-950/80 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
              <span>Project: {activeProject.name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300">
                {activeProject.type}
              </span>
            </h3>
            <p className="text-xs text-slate-400">Environmental Impact Identification Summary Scorecard</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            {projectAssessments.length} Impact Domains Evaluated
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Air Impact</span>
            <span className="text-amber-400 font-bold text-sm">→ High</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Water Impact</span>
            <span className="text-blue-400 font-bold text-sm">→ Medium</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Noise Impact</span>
            <span className="text-amber-400 font-bold text-sm">→ High</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Tree Impact</span>
            <span className="text-amber-400 font-bold text-sm">→ High</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Soil Impact</span>
            <span className="text-emerald-400 font-bold text-sm">→ Medium</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Waste Impact</span>
            <span className="text-blue-400 font-bold text-sm">→ Medium</span>
          </div>
        </div>
      </div>

      {/* 7 Assessment Categories Overview */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 px-1">
          ASSESSMENT CATEGORIES & SUB-IMPACT CHECKLIST
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.name} className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${cat.color}`} />
                  <span className="font-extrabold text-slate-100 text-xs">{cat.name}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{cat.sub}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assessments Records Table */}
      <div className="glass-panel rounded-3xl p-6 space-y-4 border border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-100">
              Identified Environmental Impacts ({projectAssessments.length})
            </h3>
            <p className="text-xs text-slate-400">
              Recorded impacts ready to link into Environmental Risks module
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                <th className="pb-3">Category</th>
                <th className="pb-3">Impact</th>
                <th className="pb-3">Description</th>
                <th className="pb-3">Severity</th>
                <th className="pb-3">Affected Area</th>
                <th className="pb-3">Date</th>
                <th className="pb-3 text-right">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {projectAssessments.map((a) => (
                <tr key={a.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 pr-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                      {a.category}
                    </span>
                  </td>
                  <td className="py-3.5 pr-3 font-bold text-slate-100">{a.impact}</td>
                  <td className="py-3.5 pr-3 text-slate-300 max-w-xs">{a.description}</td>
                  <td className="py-3.5 pr-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase border ${getSeverityClass(a.severity)}`}>
                      {a.severity}
                    </span>
                  </td>
                  <td className="py-3.5 pr-3 text-slate-400">{a.affectedArea}</td>
                  <td className="py-3.5 pr-3 font-mono text-slate-400">{a.assessmentDate}</td>
                  <td className="py-3.5 text-slate-300 text-right text-[11px] max-w-xs">{a.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD ASSESSMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-slate-700 bg-slate-950 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-extrabold text-slate-100">Record New Environmental Assessment</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Assessment Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AssessmentItem['category'])}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Air">Air (Dust, vehicle, construction)</option>
                    <option value="Water">Water (Water pollution, ground/surface)</option>
                    <option value="Noise">Noise (Construction noise, traffic)</option>
                    <option value="Soil/Land">Soil/Land (Erosion, disturbance)</option>
                    <option value="Vegetation">Vegetation (Tree cutting, loss)</option>
                    <option value="Biodiversity">Biodiversity (Wildlife disturbance)</option>
                    <option value="Waste">Waste (Construction waste, hazardous)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Severity</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Impact Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Tree Cutting & Loss of Canopy"
                  value={impact}
                  onChange={(e) => setImpact(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Specific impact details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Affected Area</label>
                  <input
                    type="text"
                    placeholder="e.g. 20 km stretch / Coromandel coastline"
                    value={affectedArea}
                    onChange={(e) => setAffectedArea(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Assessment Date</label>
                  <input
                    type="date"
                    value={assessmentDate}
                    onChange={(e) => setAssessmentDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Remarks & Mitigation Requirement</label>
                <input
                  type="text"
                  placeholder="e.g. Compensatory 1:2 planting required"
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
                  Save Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
