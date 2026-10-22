import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface TrendData {
  time: string;
  pm25: number;
  pm10: number;
  noise: number;
  aqi: number;
}

const mockTrendHistory: TrendData[] = [
  { time: '08:00', pm25: 18.2, pm10: 42.5, noise: 52.0, aqi: 62 },
  { time: '10:00', pm25: 24.6, pm10: 55.1, noise: 58.4, aqi: 75 },
  { time: '12:00', pm25: 32.1, pm10: 68.3, noise: 64.2, aqi: 92 },
  { time: '14:00', pm25: 28.4, pm10: 61.0, noise: 60.1, aqi: 84 },
  { time: '16:00', pm25: 35.8, pm10: 74.2, noise: 66.5, aqi: 104 },
  { time: '18:00', pm25: 26.2, pm10: 52.4, noise: 56.8, aqi: 78 },
  { time: '20:00', pm25: 21.0, pm10: 45.1, noise: 50.2, aqi: 68 },
];

export const SensorTrendChart: React.FC = () => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={mockTrendHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorPm25" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '12px',
            }}
          />
          <Area
            type="monotone"
            dataKey="aqi"
            name="Air Quality Index (AQI)"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorAqi)"
          />
          <Area
            type="monotone"
            dataKey="pm25"
            name="PM2.5 (µg/m³)"
            stroke="#06b6d4"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPm25)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
