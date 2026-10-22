import React from 'react';

interface ComplianceScoreGaugeProps {
  score: number; // 0 to 100
  size?: number;
  label?: string;
}

export const ComplianceScoreGauge: React.FC<ComplianceScoreGaugeProps> = ({
  score,
  size = 150,
  label = 'State Compliance Index',
}) => {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const gradientId = `gauge-gradient-${Math.round(score)}`;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Ambient Radial Glow */}
        <div
          className="absolute inset-4 rounded-full blur-xl opacity-30 pointer-events-none"
          style={{
            background:
              score >= 90
                ? 'rgba(16, 185, 129, 0.5)'
                : score >= 75
                ? 'rgba(6, 182, 212, 0.5)'
                : 'rgba(245, 158, 11, 0.5)',
          }}
        />

        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(30, 41, 59, 0.8)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black font-mono tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
            {score}%
          </span>
          <span className="text-[10px] text-emerald-400 font-extrabold tracking-wider uppercase font-mono mt-0.5">
            {score >= 90 ? '★ Optimal' : score >= 75 ? '● Satisfactory' : '▲ Action Needed'}
          </span>
        </div>
      </div>
      <p className="text-xs text-slate-300 font-bold mt-2.5 tracking-wide">{label}</p>
    </div>
  );
};
