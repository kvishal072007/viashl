import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const getBadgeStyle = (val: string) => {
    switch (val) {
      // Success / Compliant / Completed
      case 'Approved':
      case 'Compliant':
      case 'Completed':
      case 'Closed':
      case 'Normal':
      case 'EIA Finalized':
      case 'Appraised by EAC':
        return {
          pill: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-950/20',
          dot: 'bg-emerald-400',
        };

      // In Progress / Active
      case 'In Progress':
      case 'Under Review':
      case 'Submitted':
      case 'CAP Submitted':
      case 'ToR Approved':
      case 'Active Construction':
        return {
          pill: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-950/20',
          dot: 'bg-cyan-400',
        };

      // Warning / Advisory / Pending
      case 'Queries Raised':
      case 'Partially Compliant':
      case 'Pending':
      case 'Advisory':
      case 'In Preparation':
      case 'Pre-Construction & Clearances':
      case 'Minor':
      case 'Planning & Scoping':
        return {
          pill: 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-950/20',
          dot: 'bg-amber-400',
        };

      // Danger / High Risk
      case 'Non-Compliant':
      case 'Critical Threshold Exceeded':
      case 'Major':
      case 'Critical':
      case 'Rejected':
      case 'Delayed':
      case 'High Risk (Category A)':
        return {
          pill: 'bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-950/20',
          dot: 'bg-rose-400',
        };

      default:
        return {
          pill: 'bg-slate-800/60 text-slate-300 border-slate-700/60',
          dot: 'bg-slate-400',
        };
    }
  };

  const config = getBadgeStyle(status);

  const sizeClasses =
    size === 'sm'
      ? 'px-2.5 py-0.5 text-[11px] font-bold'
      : size === 'md'
      ? 'px-3 py-1 text-xs font-bold'
      : 'px-3.5 py-1.5 text-sm font-extrabold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono tracking-tight transition-all ${sizeClasses} ${config.pill}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      <span>{status}</span>
    </span>
  );
};
