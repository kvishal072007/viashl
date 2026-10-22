import React from 'react';
import { AlertCircle, CheckCircle2, Flame, ShieldAlert } from 'lucide-react';

interface ImpactItem {
  domain: string;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  reversibility: 'Reversible' | 'Partially Reversible' | 'Irreversible';
  mitigationStrategy: string;
  riskScore: number;
}

interface ImpactRiskMatrixProps {
  impacts: ImpactItem[];
}

export const ImpactRiskMatrix: React.FC<ImpactRiskMatrixProps> = ({ impacts }) => {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'High':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'Moderate':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-3">
      {impacts.map((item, idx) => (
        <div
          key={idx}
          className="p-4 rounded-xl glass-card bg-slate-900/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-sm font-bold text-slate-200">{item.domain}</span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getSeverityBadge(
                  item.severity
                )}`}
              >
                {item.severity} Severity
              </span>
              <span className="text-xs text-slate-400">
                Reversibility:{' '}
                <strong className="text-slate-300 font-medium">{item.reversibility}</strong>
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-2">
              <span className="text-emerald-400/90 font-medium">Mitigation Plan:</span>{' '}
              {item.mitigationStrategy}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                Leopold Score
              </p>
              <p
                className={`text-lg font-black font-mono ${
                  item.riskScore >= 20
                    ? 'text-rose-400'
                    : item.riskScore >= 14
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {item.riskScore} / 25
              </p>
            </div>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                item.riskScore >= 20
                  ? 'bg-rose-500/10 text-rose-400'
                  : item.riskScore >= 14
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'bg-emerald-500/10 text-emerald-400'
              }`}
            >
              {item.riskScore >= 20 ? (
                <Flame className="w-5 h-5" />
              ) : item.riskScore >= 14 ? (
                <ShieldAlert className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
