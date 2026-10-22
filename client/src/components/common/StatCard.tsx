import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  variant?: 'emerald' | 'cyan' | 'amber' | 'rose' | 'slate';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'emerald',
  onClick,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'emerald':
        return {
          border: 'border-emerald-500/30 hover:border-emerald-400/60 shadow-emerald-950/30',
          iconBg: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10',
          glow: 'from-emerald-500/10 to-transparent',
          valueColor: 'text-emerald-300',
        };
      case 'cyan':
        return {
          border: 'border-cyan-500/30 hover:border-cyan-400/60 shadow-cyan-950/30',
          iconBg: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10',
          glow: 'from-cyan-500/10 to-transparent',
          valueColor: 'text-cyan-300',
        };
      case 'amber':
        return {
          border: 'border-amber-500/30 hover:border-amber-400/60 shadow-amber-950/30',
          iconBg: 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/10',
          glow: 'from-amber-500/10 to-transparent',
          valueColor: 'text-amber-300',
        };
      case 'rose':
        return {
          border: 'border-rose-500/30 hover:border-rose-400/60 shadow-rose-950/30',
          iconBg: 'bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-lg shadow-rose-500/10',
          glow: 'from-rose-500/10 to-transparent',
          valueColor: 'text-rose-300',
        };
      default:
        return {
          border: 'border-slate-800 hover:border-slate-700',
          iconBg: 'bg-slate-800 text-slate-300 border border-slate-700',
          glow: 'from-slate-800/10 to-transparent',
          valueColor: 'text-slate-100',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-2xl p-6 relative overflow-hidden transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl ${
        styles.border
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Background Radial Glow Accent */}
      <div
        className={`absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br ${styles.glow} blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
      />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-mono">
            {title}
          </p>
          <h3 className={`text-3xl font-black mt-2 font-mono tracking-tight ${styles.valueColor}`}>
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>
          )}
        </div>
        <div className={`p-3.5 rounded-2xl ${styles.iconBg} transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {trend && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs relative z-10">
          <div className="flex items-center gap-1.5">
            {trend.isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span
              className={`font-mono font-bold ${
                trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {trend.value}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">vs last cycle</span>
        </div>
      )}
    </div>
  );
};
