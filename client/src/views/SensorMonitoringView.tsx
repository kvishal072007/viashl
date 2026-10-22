import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { PageHeader } from '../components/layout/PageHeader';
import { MonitoringStatus, MonitoringItem } from '../data/centralData';
import {
  Activity,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Wind,
  Droplets,
  Volume2,
  Globe2,
  Trash2,
  Calendar,
  MapPin,
  X,
  Sparkles,
} from 'lucide-react';

export const SensorMonitoringView: React.FC = () => {
  const { projects, monitorings, addMonitoring } = useData();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [parameter, setParameter] = useState('Air Quality (PM10)');
  const [location, setLocation] = useState('');
  const [measuredValue, setMeasuredValue] = useState('');
  const [allowedLimit, setAllowedLimit] = useState('');
  const [monitoringDate, setMonitoringDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<MonitoringStatus>('Normal');
  const [remarks, setRemarks] = useState('');
  const [formProjectId, setFormProjectId] = useState(projects[0]?.id || 'PRJ-001');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parameter || !measuredValue) return;

    addMonitoring({
      projectId: formProjectId,
      parameter,
      location: location || 'Project Site Perimeter',
      measuredValue,
      allowedLimit: allowedLimit || 'Standard Permissible Limit',
      monitoringDate,
      status,
      remarks,
    });

    setIsModalOpen(false);
    setMeasuredValue('');
    setAllowedLimit('');
    setLocation('');
    setRemarks('');
  };

  const filteredMonitorings = monitorings.filter((mon) => {
    const matchesProj = selectedProjectId === 'All' || mon.projectId === selectedProjectId;
    const matchesStatus = statusFilter === 'All' || mon.status === statusFilter;
    return matchesProj && matchesStatus;
  });

  const getStatusBadge = (st: MonitoringStatus) => {
    switch (st) {
      case 'Normal':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'Alert':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'Critical':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-7 pb-16">
      <PageHeader
        title="07. Environmental Monitoring 📈"
        subtitle="Purpose: Assessment-la identify pannina environmental impacts actual-ah eppadi irukku-nu regular-ah check panna."
        badge="Actual vs Allowed Real-Time Monitoring"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Monitoring Reading</span>
          </button>
        }
      />

      {/* IMPORTANT DIFFERENCE BANNER */}
      <div className="glass-panel p-5 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-slate-950 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
            IMPORTANT STATUTORY DISTINCTION:
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-amber-400 font-bold block text-sm mb-1">🌱 ASSESSMENT</span>
            <blockquote className="text-slate-300 italic">
              "What impact can happen?" (Prediction before project starts)
            </blockquote>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40">
            <span className="text-cyan-400 font-bold block text-sm mb-1">📈 MONITORING</span>
            <blockquote className="text-slate-300 italic">
              "What is actually happening now?" (Actual field measurement vs allowed limit)
            </blockquote>
          </div>
        </div>
      </div>

      {/* 5 Monitoring Areas Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
        <div className="p-3.5 rounded-2xl glass-panel border border-slate-800 flex items-center gap-2.5">
          <Wind className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold text-slate-200 block">Air Quality</span>
            <span className="text-[10px] text-slate-400">PM10 / PM2.5 / SO2</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl glass-panel border border-slate-800 flex items-center gap-2.5">
          <Droplets className="w-5 h-5 text-blue-400 shrink-0" />
          <div>
            <span className="font-bold text-slate-200 block">Water Quality</span>
            <span className="text-[10px] text-slate-400">pH / DO / Turbidity</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl glass-panel border border-slate-800 flex items-center gap-2.5">
          <Volume2 className="w-5 h-5 text-rose-400 shrink-0" />
          <div>
            <span className="font-bold text-slate-200 block">Noise Level</span>
            <span className="text-[10px] text-slate-400">Leq dB(A) Day/Night</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl glass-panel border border-slate-800 flex items-center gap-2.5">
          <Globe2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold text-slate-200 block">Soil Condition</span>
            <span className="text-[10px] text-slate-400">Heavy metals / Oil</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl glass-panel border border-slate-800 flex items-center gap-2.5">
          <Trash2 className="w-5 h-5 text-orange-400 shrink-0" />
          <div>
            <span className="font-bold text-slate-200 block">Waste Disposal</span>
            <span className="text-[10px] text-slate-400">C&D Recycling rate</span>
          </div>
        </div>
      </div>

      {/* Filter and Project Selector */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
          <Filter className="w-4 h-4 text-cyan-400" />
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
            <option value="Normal">Normal ✅</option>
            <option value="Alert">Alert ⚠️</option>
            <option value="Critical">Critical ❌</option>
          </select>
        </div>
      </div>

      {/* Monitoring Records Table */}
      <div className="glass-panel rounded-3xl p-6 space-y-4 border border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-100">
              Environmental Monitoring Field Readings ({filteredMonitorings.length})
            </h3>
            <p className="text-xs text-slate-400">
              Measured Value vs Allowed Standard Limit with live threshold check
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                <th className="pb-3">Monitoring ID</th>
                <th className="pb-3">Project</th>
                <th className="pb-3">Parameter</th>
                <th className="pb-3">Location</th>
                <th className="pb-3">Measured Value</th>
                <th className="pb-3">Allowed Limit</th>
                <th className="pb-3">Monitoring Date</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredMonitorings.map((mon) => {
                const proj = projects.find((p) => p.id === mon.projectId);
                return (
                  <tr key={mon.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 pr-2 font-mono font-bold text-cyan-400">{mon.id}</td>

                    <td className="py-3.5 pr-3">
                      <span className="font-bold text-slate-200 block">{proj?.name.split('(')[0] || mon.projectId}</span>
                      <span className="text-[10px] font-mono text-slate-500">{mon.projectId}</span>
                    </td>

                    <td className="py-3.5 pr-3 font-extrabold text-slate-100">{mon.parameter}</td>

                    <td className="py-3.5 pr-3 text-slate-300 text-[11px]">{mon.location}</td>

                    <td className="py-3.5 pr-3 font-mono font-bold text-sm text-cyan-300">
                      {mon.measuredValue}
                    </td>

                    <td className="py-3.5 pr-3 font-mono text-slate-400 text-[11px]">
                      {mon.allowedLimit}
                    </td>

                    <td className="py-3.5 pr-3 font-mono text-slate-400">{mon.monitoringDate}</td>

                    <td className="py-3.5 pr-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase border ${getStatusBadge(mon.status)}`}>
                        {mon.status === 'Normal' ? 'Normal ✅' : mon.status === 'Alert' ? 'Alert ⚠️' : 'Critical ❌'}
                      </span>
                    </td>

                    <td className="py-3.5 text-right text-slate-300 text-[11px] max-w-xs">{mon.remarks}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MONITORING MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-slate-700 bg-slate-950 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-extrabold text-slate-100">Log Environmental Monitoring Reading</h3>
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
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500 font-bold"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} — {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Parameter</label>
                  <select
                    value={parameter}
                    onChange={(e) => setParameter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Air Quality (PM10)">Air Quality (PM10)</option>
                    <option value="Air Quality (PM2.5)">Air Quality (PM2.5)</option>
                    <option value="Air Quality (SO2)">Air Quality (SO2)</option>
                    <option value="Noise Level (Leq Day)">Noise Level (Leq Day)</option>
                    <option value="Water Quality (pH)">Water Quality (pH)</option>
                    <option value="Water Quality (Turbidity)">Water Quality (Turbidity)</option>
                    <option value="Water Quality (DO)">Water Quality (DO)</option>
                    <option value="Soil Condition (Contamination)">Soil Condition (Contamination)</option>
                    <option value="Waste (C&D Debris Recycling)">Waste (C&D Debris Recycling)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as MonitoringStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Normal">Normal ✅</option>
                    <option value="Alert">Alert ⚠️</option>
                    <option value="Critical">Critical ❌</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Location / Chainage</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Porur Toll Plaza (Chainage 14+200)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Measured Value</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. 65 dB or 86 µg/m³"
                    value={measuredValue}
                    onChange={(e) => setMeasuredValue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Allowed Limit</label>
                  <input
                    type="text"
                    placeholder="e.g. 75 dB or 100 µg/m³"
                    value={allowedLimit}
                    onChange={(e) => setAllowedLimit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Monitoring Date</label>
                <input
                  type="date"
                  value={monitoringDate}
                  onChange={(e) => setMonitoringDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Remarks & Observations</label>
                <input
                  type="text"
                  placeholder="e.g. Normal ✅ Within prescribed standards"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
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
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-black"
                >
                  Save Reading
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
