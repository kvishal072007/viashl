import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { PageHeader } from '../components/layout/PageHeader';
import {
  History,
  ShieldCheck,
  Filter,
  Search,
  UserCheck,
  Calendar,
  Clock,
  Layers,
  Sparkles,
  Lock,
  Download,
} from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { audits } = useData();
  const [search, setSearch] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('All');
  const [selectedUser, setSelectedUser] = useState<string>('All');

  // Extract unique modules and users
  const modules = Array.from(new Set(audits.map((a) => a.module)));
  const users = Array.from(new Set(audits.map((a) => a.user)));

  const filteredLogs = audits.filter((item) => {
    const matchesModule = selectedModule === 'All' || item.module === selectedModule;
    const matchesUser = selectedUser === 'All' || item.user === selectedUser;
    const matchesSearch =
      item.user.toLowerCase().includes(search.toLowerCase()) ||
      item.action.toLowerCase().includes(search.toLowerCase()) ||
      item.module.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.date.includes(search);
    return matchesModule && matchesUser && matchesSearch;
  });

  const handleExportAuditTrail = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,User,Action,Module,Date,Time,Description\n' +
      audits
        .map(
          (a) =>
            `"${a.id}","${a.user}","${a.action}","${a.module}","${a.date}","${a.time}","${a.description.replace(/"/g, '""')}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `State_Environmental_Audit_Log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="12. 📝 Audit Log"
        description="Chronological security audit trail maintaining an immutable history of every action taken across all environmental modules."
        badge="Immutable Security Audit"
        action={{
          label: 'Export Audit CSV',
          icon: Download,
          onClick: handleExportAuditTrail,
        }}
      />

      {/* Purpose Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                System Action Ledger (Purpose: System-la yaar enna action pannanga nu history maintain panna)
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Every project creation, environmental assessment, risk escalation, clearance upload, compliance review, and report generation is captured in real-time.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-lg border border-slate-800 text-xs">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Total Audit Events:</span>
            <span className="font-bold text-emerald-400 font-mono">{audits.length}</span>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs"
            >
              <option value="All" className="bg-slate-900 text-white">All Modules</option>
              {modules.map((m) => (
                <option key={m} value={m} className="bg-slate-900 text-white">
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs"
            >
              <option value="All" className="bg-slate-900 text-white">All Users</option>
              {users.map((u) => (
                <option key={u} value={u} className="bg-slate-900 text-white">
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by User, Action, Module, Description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No audit records match your filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* User */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                          {item.user.charAt(0)}
                        </div>
                        <span className="font-semibold text-white">{item.user}</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-slate-200 font-medium text-xs border border-slate-700">
                        {item.action}
                      </span>
                    </td>

                    {/* Module */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        {item.module}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.date}</span>
                      </div>
                    </td>

                    {/* Time */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.time}</span>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4">
                      <p className="text-slate-300 max-w-xl font-normal leading-relaxed">
                        {item.description}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
