import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  actions?: React.ReactNode;
  action?: {
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    onClick: () => void;
  };
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  description,
  badge,
  actions,
  action,
}) => {
  const displayText = subtitle || description || '';
  const ActionIcon = action?.icon;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800/80">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight font-sans">
            {title}
          </h1>
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {badge}
            </span>
          )}
        </div>
        {displayText && (
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">{displayText}</p>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {actions}
        {action && (
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
          >
            {ActionIcon && <ActionIcon className="w-4 h-4" />}
            <span>{action.label}</span>
          </button>
        )}
      </div>
    </div>
  );
};
