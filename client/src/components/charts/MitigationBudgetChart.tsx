import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Project } from '../../types';

interface MitigationBudgetChartProps {
  projects: Project[];
}

export const MitigationBudgetChart: React.FC<MitigationBudgetChartProps> = ({ projects }) => {
  const chartData = projects.map((p) => ({
    name: p.code,
    fullName: p.name,
    allocated: p.allocatedEmpBudgetUsdMillion,
    spent: p.spentEmpBudgetUsdMillion,
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            unit="M$"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '12px',
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
          />
          <Bar dataKey="allocated" name="Allocated EMP Budget ($M)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          <Bar dataKey="spent" name="Spent EMP Budget ($M)" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
