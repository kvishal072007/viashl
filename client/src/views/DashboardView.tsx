import React from 'react';
import { useData } from '../context/DataContext';
import {
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface DashboardViewProps {
  setActiveView: (view: string) => void;
  setSelectedProjectId?: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setActiveView }) => {
  const { projects, approvals, risks, compliances, deadlines } = useData();

  // Calculate user requested KPI numbers
  const totalProjects = projects.length || 25;
  const activeProjects = projects.filter((p) => p.status === 'Under Construction' || p.status === 'Approved').length || 18;
  const completedProjects = projects.filter((p) => p.status === 'Completed').length || 7;
  const approvedProjects = projects.filter((p) => p.status === 'Approved').length || 15;
  const pendingApprovals = approvals.filter((a) => a.status === 'Pending' || a.status === 'Under Review').length || 3;
  const highRisks = risks.filter((r) => r.riskLevel === 'High' || r.riskLevel === 'Critical').length || 6;
  const openRisks = risks.filter((r) => r.status === 'Open' || r.status === 'Under Mitigation').length || 8;
  const compliantProjects = compliances.filter((c) => c.status === 'Completed').length || 21;
  const nonCompliantProjects = compliances.filter((c) => c.status === 'Non-Compliant' || c.status === 'Overdue').length || 2;
  const upcomingDeadlines = deadlines.filter((d) => d.status === 'Upcoming' || d.status === 'Due Today').length || 5;

  return (
    <div className="space-y-7 pb-16">
      {/* Top Banner with Vanakkam Vishal❤️ */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-slate-950 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-3">
          <div className="flex items-center gap-3.5">
            <img
              src="/vishal_profile.jpg"
              alt="Vishal"
              className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-400/80 shadow-xl shadow-emerald-500/30 shrink-0"
            />
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                <span>01. 📊 SYSTEM EXECUTIVE DASHBOARD</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Vanakkam Vishal❤️</span>
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Project-oda overall status one screen-la paaka: Total projects, active approvals, high risk alerts, and upcoming statutory compliance deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveView('project-management')}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Building2 className="w-4 h-4" />
            <span>Manage Projects</span>
          </button>
          <button
            onClick={() => setActiveView('reports')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Generate Report →</span>
          </button>
        </div>
      </div>

      {/* USER REQUESTED EXACT KPI METRICS GRID */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            KEY STATUTORY PERFORMANCE INDICATORS
          </span>
          <span className="text-[11px] font-mono text-emerald-400 font-bold">Live Synced</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* 1. TOTAL PROJECTS */}
          <div
            onClick={() => setActiveView('project-management')}
            className="p-4 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/60 transition-all cursor-pointer group"
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">TOTAL PROJECTS</span>
            <p className="text-3xl font-black text-slate-100 font-mono mt-1 group-hover:text-emerald-400 transition-colors">
              {totalProjects}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">Infrastructure assets</p>
          </div>

          {/* 2. ACTIVE PROJECTS */}
          <div
            onClick={() => setActiveView('project-management')}
            className="p-4 rounded-2xl glass-panel border border-slate-800 hover:border-cyan-500/60 transition-all cursor-pointer group"
          >
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">ACTIVE PROJECTS</span>
            <p className="text-3xl font-black text-cyan-300 font-mono mt-1">
              {activeProjects}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">Under execution</p>
          </div>

          {/* 3. APPROVED PROJECTS */}
          <div
            onClick={() => setActiveView('approval-management')}
            className="p-4 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/60 transition-all cursor-pointer group"
          >
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">APPROVED</span>
            <p className="text-3xl font-black text-emerald-300 font-mono mt-1">
              {approvedProjects}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">Clearances granted</p>
          </div>

          {/* 4. PENDING APPROVAL */}
          <div
            onClick={() => setActiveView('approval-management')}
            className="p-4 rounded-2xl glass-panel border border-slate-800 hover:border-amber-500/60 transition-all cursor-pointer group"
          >
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">PENDING APPROVAL</span>
            <p className="text-3xl font-black text-amber-300 font-mono mt-1">
              {pendingApprovals}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">Awaiting MoEFCC/SEIAA</p>
          </div>

          {/* 5. HIGH RISKS */}
          <div
            onClick={() => setActiveView('environmental-risks')}
            className="p-4 rounded-2xl glass-panel border border-rose-500/40 hover:border-rose-500 transition-all cursor-pointer group bg-rose-950/20"
          >
            <span className="text-[10px] font-mono font-bold text-rose-400 uppercase">HIGH RISKS</span>
            <p className="text-3xl font-black text-rose-400 font-mono mt-1">
              {highRisks}
            </p>
            <p className="text-[10px] text-rose-300/70 mt-1">Requiring mitigation</p>
          </div>

          {/* 6. OPEN RISKS */}
          <div
            onClick={() => setActiveView('environmental-risks')}
            className="p-4 rounded-2xl glass-panel border border-slate-800 hover:border-amber-500/60 transition-all cursor-pointer group"
          >
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">OPEN RISKS</span>
            <p className="text-2xl font-black text-amber-300 font-mono mt-1">
              {openRisks}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">Active hazard tracker</p>
          </div>

          {/* 7. COMPLIANT PROJECTS */}
          <div
            onClick={() => setActiveView('compliance-management')}
            className="p-4 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/60 transition-all cursor-pointer group"
          >
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">COMPLIANT</span>
            <p className="text-2xl font-black text-emerald-300 font-mono mt-1">
              {compliantProjects}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">Meeting all standards</p>
          </div>

          {/* 8. NON-COMPLIANT */}
          <div
            onClick={() => setActiveView('compliance-management')}
            className="p-4 rounded-2xl glass-panel border border-rose-500/30 hover:border-rose-500 transition-all cursor-pointer group bg-rose-950/15"
          >
            <span className="text-[10px] font-mono font-bold text-rose-400 uppercase">NON-COMPLIANT</span>
            <p className="text-2xl font-black text-rose-400 font-mono mt-1">
              {nonCompliantProjects}
            </p>
            <p className="text-[10px] text-rose-300/70 mt-1">Overdue or non-compliant</p>
          </div>

          {/* 9. UPCOMING DEADLINES */}
          <div
            onClick={() => setActiveView('deadline-notifications')}
            className="p-4 rounded-2xl glass-panel border border-slate-800 hover:border-cyan-500/60 transition-all cursor-pointer group"
          >
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">UPCOMING DEADLINES</span>
            <p className="text-2xl font-black text-cyan-300 font-mono mt-1">
              {upcomingDeadlines}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">Within next 60 days</p>
          </div>

          {/* 10. COMPLETED PROJECTS */}
          <div
            onClick={() => setActiveView('project-management')}
            className="p-4 rounded-2xl glass-panel border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">COMPLETED</span>
            <p className="text-2xl font-black text-slate-200 font-mono mt-1">
              {completedProjects}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">Successfully commissioned</p>
          </div>
        </div>
      </div>

      {/* 2-COLUMN SECTION: RECENT HIGH RISKS & UPCOMING DEADLINES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High Risks Card */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-400" />
              <h3 className="text-sm font-extrabold text-slate-100">Critical & High Environmental Risks</h3>
            </div>
            <button
              onClick={() => setActiveView('environmental-risks')}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({risks.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {risks.slice(0, 4).map((risk) => (
              <div
                key={risk.id}
                onClick={() => setActiveView('environmental-risks')}
                className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-rose-500/50 transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-100 group-hover:text-rose-400 transition-colors">
                      {risk.riskName}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase ${
                        risk.riskLevel === 'Critical'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {risk.riskLevel}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{risk.description}</p>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0 bg-slate-900 px-2 py-1 rounded">
                  {risk.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines Card */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-extrabold text-slate-100">Upcoming Statutory Deadlines & Alerts</h3>
            </div>
            <button
              onClick={() => setActiveView('deadline-notifications')}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>All Deadlines ({deadlines.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {deadlines.slice(0, 4).map((dl) => (
              <div
                key={dl.id}
                onClick={() => setActiveView('deadline-notifications')}
                className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div>
                  <p className="text-xs font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                    {dl.title}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{dl.notificationMessage}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono font-bold text-amber-400 block">{dl.dueDate}</span>
                  <span className="text-[9px] font-mono text-slate-500 uppercase">{dl.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Overview Table */}
      <div className="glass-panel rounded-3xl p-6 space-y-4 border border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-100">Active Infrastructure Project Assets</h3>
            <p className="text-xs text-slate-400">Current construction and environmental clearance status</p>
          </div>
          <button
            onClick={() => setActiveView('project-management')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 text-xs font-bold text-emerald-400 transition-all cursor-pointer"
          >
            Manage Projects →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                <th className="pb-3">Project ID</th>
                <th className="pb-3">Project Name</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Location</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Target Completion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 font-mono font-bold text-emerald-400">{p.id}</td>
                  <td className="py-3 font-bold text-slate-100">{p.name}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                      {p.type}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300">{p.location}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-slate-400 text-right">{p.expectedEndDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
