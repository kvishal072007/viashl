import React from 'react';
import {
  LayoutDashboard,
  Building2,
  FileSpreadsheet,
  ShieldAlert,
  FileCheck,
  Trees,
  Activity,
  ShieldCheck,
  FolderLock,
  Bell,
  FileText,
  History,
  Lock,
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  // EXACT module hierarchy specified by user
  const modules = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard, step: '01' },
    { id: 'project-management', label: 'PROJECT MANAGEMENT', icon: Building2, step: '02' },
    { id: 'environmental-assessment', label: 'ENVIRONMENTAL ASSESSMENT', icon: FileSpreadsheet, step: '03' },
    { id: 'environmental-risks', label: 'ENVIRONMENTAL RISKS', icon: ShieldAlert, step: '04' },
    { id: 'approval-management', label: 'APPROVAL MANAGEMENT', icon: FileCheck, step: '05' },
    { id: 'mitigation-measures', label: 'MITIGATION MEASURES', icon: Trees, step: '06' },
    { id: 'environmental-monitoring', label: 'ENVIRONMENTAL MONITORING', icon: Activity, step: '07' },
    { id: 'compliance-management', label: 'COMPLIANCE MANAGEMENT', icon: ShieldCheck, step: '08' },
    { id: 'document-management', label: 'DOCUMENT MANAGEMENT', icon: FolderLock, step: '09' },
    { id: 'deadline-notifications', label: 'DEADLINE + NOTIFICATIONS', icon: Bell, step: '10' },
    { id: 'reports', label: 'REPORTS', icon: FileText, step: '11' },
    { id: 'audit-log', label: 'AUDIT LOG', icon: History, step: '12' },
  ];

  return (
    <aside className="w-72 glass-panel border-r border-slate-800 bg-slate-950/85 flex flex-col justify-between p-3.5 shrink-0 min-h-[calc(100vh-101px)] transition-colors duration-300 overflow-y-auto">
      <div className="space-y-3">
        <div className="px-3 pt-1 pb-2 border-b border-slate-800/80 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
            SYSTEM WORKFLOW SEQUENCE
          </span>
          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            12 Modules
          </span>
        </div>

        <nav className="space-y-1">
          {modules.map((m) => {
            const Icon = m.icon;
            const isActive = activeView === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveView(m.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer group ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/25 via-teal-500/15 to-transparent text-emerald-300 border-l-4 border-emerald-400 pl-2.5 shadow-md shadow-emerald-950/40'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-400'
                    }`}
                  />
                  <span className="truncate tracking-wide">{m.label}</span>
                </div>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded transition-colors ${
                    isActive
                      ? 'bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/40'
                      : 'text-slate-600 group-hover:text-slate-400'
                  }`}
                >
                  {m.step}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ISO & MoEFCC Certified Footer */}
      <div className="mt-4 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 space-y-1.5 shadow-lg">
        <div className="flex items-center justify-between text-slate-200 font-bold">
          <span>EnviroTrack Governance</span>
          <span className="text-emerald-400 font-mono text-[9px] font-bold">ISO 14001:2015</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          Statutory Environmental Clearance & Compliance Architecture for Tamil Nadu.
        </p>
      </div>
    </aside>
  );
};
