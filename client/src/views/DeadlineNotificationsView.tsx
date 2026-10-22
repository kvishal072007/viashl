import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { PageHeader } from '../components/layout/PageHeader';
import {
  Bell,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Plus,
  Building,
  User,
  AlertCircle,
  XCircle,
  Send,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { DeadlineItem } from '../data/centralData';

export const DeadlineNotificationsView: React.FC = () => {
  const { projects, deadlines, addDeadline } = useData();
  const [selectedProject, setSelectedProject] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localDeadlines, setLocalDeadlines] = useState(deadlines);

  // Sync if context updates
  React.useEffect(() => {
    setLocalDeadlines(deadlines);
  }, [deadlines]);

  const [formData, setFormData] = useState<Omit<DeadlineItem, 'id'>>({
    title: '',
    projectId: 'PRJ-001',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    status: 'Upcoming',
    notificationMessage: '⚠️ Compliance deadline in 7 days',
    responsiblePerson: '',
    category: 'Compliance',
  });

  const handleStatusChange = (id: string, newStatus: DeadlineItem['status']) => {
    setLocalDeadlines((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    addDeadline({
      ...formData,
      notificationMessage:
        formData.notificationMessage ||
        (formData.status === 'Overdue'
          ? `❌ Requirement is overdue: ${formData.title}`
          : `⚠️ Environmental action due soon: ${formData.title}`),
    });

    setFormData({
      title: '',
      projectId: 'PRJ-001',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'Upcoming',
      notificationMessage: '',
      responsiblePerson: '',
      category: 'Compliance',
    });
    setIsModalOpen(false);
  };

  const filteredDeadlines = localDeadlines.filter((item) => {
    const matchesProj = selectedProject === 'All' || item.projectId === selectedProject;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    return matchesProj && matchesStatus;
  });

  // Calculate live counts
  const upcomingCount = localDeadlines.filter((d) => d.status === 'Upcoming').length;
  const dueTodayCount = localDeadlines.filter((d) => d.status === 'Due Today').length;
  const overdueCount = localDeadlines.filter((d) => d.status === 'Overdue').length;
  const completedCount = localDeadlines.filter((d) => d.status === 'Completed').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="10. 🔔 Deadline + Notifications"
        description="Statutory tracking center to ensure critical environmental test dates, approval renewals, and compliance dossiers are never missed."
        badge="Deadline & Alert Hub"
        action={{
          label: 'Create Deadline Alert',
          icon: Plus,
          onClick: () => setIsModalOpen(true),
        }}
      />

      {/* Real-time Notification Banner Hub */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-amber-400" />
          Active Environmental Notifications & Urgent Alerts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-300">⚠️ Compliance deadline in 3 days</p>
              <p className="text-xs text-slate-300 mt-1">
                Monthly water & air quality test report due for TNPCB submission.
              </p>
              <span className="inline-block mt-2 text-[10px] font-mono text-amber-400/80">Chennai Highway Expansion</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-start gap-3">
            <Clock className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-orange-300">⚠️ Approval expires in 10 days</p>
              <p className="text-xs text-slate-300 mt-1">
                Consent to Operate (CTO) renewal application filing deadline approaching.
              </p>
              <span className="inline-block mt-2 text-[10px] font-mono text-orange-400/80">Ennore Creek Remediation</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 animate-pulse">
            <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-rose-300">❌ Requirement is overdue</p>
              <p className="text-xs text-slate-300 mt-1">
                Continuous online TOC/COD telemetry connection pending verification.
              </p>
              <span className="inline-block mt-2 text-[10px] font-mono text-rose-400/80">Ennore Creek Dredging</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/80 border border-blue-900/40 rounded-xl p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-400 font-medium">Upcoming</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">{upcomingCount}</p>
        </div>

        <div className="bg-slate-900/80 border border-amber-900/40 rounded-xl p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-400 font-medium">Due Today</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-1">{dueTodayCount}</p>
        </div>

        <div className="bg-slate-900/80 border border-rose-900/40 rounded-xl p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-rose-400 font-medium">Overdue</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-rose-400 mt-1">{overdueCount}</p>
        </div>

        <div className="bg-slate-900/80 border border-emerald-900/40 rounded-xl p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-medium">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{completedCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
            <Building className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs"
            >
              <option value="All" className="bg-slate-900 text-white">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs"
            >
              <option value="All" className="bg-slate-900 text-white">All Statuses</option>
              <option value="Upcoming" className="bg-slate-900 text-white">Upcoming</option>
              <option value="Due Today" className="bg-slate-900 text-white">Due Today</option>
              <option value="Overdue" className="bg-slate-900 text-white">Overdue</option>
              <option value="Completed" className="bg-slate-900 text-white">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Deadline Items List */}
      <div className="space-y-3">
        {filteredDeadlines.map((item) => {
          const proj = projects.find((p) => p.id === item.projectId);
          const isOverdue = item.status === 'Overdue';
          const isDueToday = item.status === 'Due Today';
          const isCompleted = item.status === 'Completed';

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                isOverdue
                  ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-500'
                  : isDueToday
                  ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-500'
                  : isCompleted
                  ? 'bg-slate-900/40 border-slate-800 opacity-75'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        isOverdue
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : isDueToday
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {item.id} • {item.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-amber-300/90 font-medium">
                    {item.notificationMessage}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      {proj ? proj.name : item.projectId}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      Due: {item.dueDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      {item.responsiblePerson}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  {item.status !== 'Completed' ? (
                    <button
                      onClick={() => handleStatusChange(item.id, 'Completed')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark Completed
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(item.id, 'Upcoming')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs transition"
                    >
                      Reopen
                    </button>
                  )}
                  <button
                    onClick={() => {
                      alert(`Urgent dispatch notification sent to ${item.responsiblePerson} regarding: "${item.title}"`);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                    title="Send Alert Notification to Officer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Deadline Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" />
              Create Deadline Notification
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Set automated notifications for environmental monitoring, clearance renewals, or compliance milestones.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Work / Requirement Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly Water Quality Test / Approval Renewal"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Project</label>
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as DeadlineItem['category'] })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                  >
                    <option value="Compliance">Compliance</option>
                    <option value="Approval">Approval Renewal</option>
                    <option value="Monitoring">Monitoring Test</option>
                    <option value="Mitigation">Mitigation Measure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Responsible Officer</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Er. K. Ramesh"
                    value={formData.responsiblePerson}
                    onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Initial Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as DeadlineItem['status'] })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Due Today">Due Today</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Notification Alert Text</label>
                <input
                  type="text"
                  placeholder="e.g. ⚠️ Compliance deadline in 3 days / ⚠️ Approval expires in 10 days"
                  value={formData.notificationMessage}
                  onChange={(e) => setFormData({ ...formData, notificationMessage: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium shadow-lg shadow-amber-900/30"
                >
                  Set Deadline & Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
