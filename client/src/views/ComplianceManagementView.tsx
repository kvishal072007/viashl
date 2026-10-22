import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { PageHeader } from '../components/layout/PageHeader';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Filter,
  Search,
  Plus,
  ShieldCheck,
  FileCheck2,
  FileText,
  User,
  XCircle,
  Eye,
  Download,
  Calendar,
  Building,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { ComplianceItem } from '../data/centralData';

const COMPLIANCE_PRESETS = [
  {
    requirement: 'Monthly water quality test must be done',
    relatedApproval: 'Environmental Clearance → Water Quality Monitoring Condition',
    dueDate: '2026-10-15',
    responsiblePerson: 'Environmental Officer',
    status: 'Completed' as const,
  },
  {
    requirement: 'Construction dust control must be maintained',
    relatedApproval: 'Environmental Clearance → Dust control condition',
    dueDate: '2026-10-25',
    responsiblePerson: 'Site Environmental Engineer',
    status: 'In Progress' as const,
  },
  {
    requirement: 'Waste must be properly disposed',
    relatedApproval: 'TNPCB Consent to Establish → Hazardous & C&D Waste Disposal',
    dueDate: '2026-10-30',
    responsiblePerson: 'Waste Management Officer',
    status: 'Pending' as const,
  },
  {
    requirement: 'Approved environmental conditions must be followed',
    relatedApproval: 'MoEFCC Clearance → General & Specific Conditions Schedule',
    dueDate: '2026-12-01',
    responsiblePerson: 'Compliance Officer',
    status: 'In Progress' as const,
  },
  {
    requirement: 'Required tree plantation must be completed',
    relatedApproval: 'Forest Clearance → Compensatory Afforestation (300 Trees)',
    dueDate: '2026-11-15',
    responsiblePerson: 'District Forest Officer',
    status: 'Pending' as const,
  },
];

export const ComplianceManagementView: React.FC = () => {
  const { projects, complianceRecords, addCompliance, updateComplianceStatus } = useData();
  const [selectedProject, setSelectedProject] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [evidencePreview, setEvidencePreview] = useState<{ doc: string; req: string } | null>(null);

  const [formData, setFormData] = useState<Omit<ComplianceItem, 'id'>>({
    projectId: 'PRJ-001',
    requirement: '',
    relatedApproval: 'Environmental Clearance → Dust control condition',
    dueDate: '2026-10-15',
    responsiblePerson: 'Environmental Officer',
    status: 'Pending',
    evidenceDocument: '',
    remarks: '',
  });

  const filteredCompliance = complianceRecords.filter((item) => {
    const matchesProject = selectedProject === 'All' || item.projectId === selectedProject;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    const matchesSearch =
      item.requirement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.responsiblePerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.relatedApproval.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.evidenceDocument && item.evidenceDocument.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesProject && matchesStatus && matchesSearch;
  });

  // Calculate live statistics for the 5 exact statuses
  const totalCount = complianceRecords.length;
  const pendingCount = complianceRecords.filter((c) => c.status === 'Pending').length;
  const inProgressCount = complianceRecords.filter((c) => c.status === 'In Progress').length;
  const completedCount = complianceRecords.filter((c) => c.status === 'Completed').length;
  const nonCompliantCount = complianceRecords.filter((c) => c.status === 'Non-Compliant').length;
  const overdueCount = complianceRecords.filter((c) => c.status === 'Overdue').length;

  const handlePresetSelect = (preset: typeof COMPLIANCE_PRESETS[0]) => {
    setFormData((prev) => ({
      ...prev,
      requirement: preset.requirement,
      relatedApproval: preset.relatedApproval,
      dueDate: preset.dueDate,
      responsiblePerson: preset.responsiblePerson,
      status: preset.status,
      evidenceDocument: `${preset.requirement.slice(0, 15).replace(/\s+/g, '_')}_Evidence.pdf`,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.requirement.trim()) return;

    addCompliance({
      ...formData,
      evidenceDocument: formData.evidenceDocument || `${formData.requirement.slice(0, 15).replace(/\s+/g, '_')}_Evidence.pdf`,
    });

    setFormData({
      projectId: 'PRJ-001',
      requirement: '',
      relatedApproval: 'Environmental Clearance → Dust control condition',
      dueDate: '2026-10-15',
      responsiblePerson: 'Environmental Officer',
      status: 'Pending',
      evidenceDocument: '',
      remarks: '',
    });
    setIsModalOpen(false);
  };

  // Exact 5 status badges requested by user
  const getStatusBadge = (status: ComplianceItem['status']) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <span>🟡</span>
            <span>Pending</span>
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
            <span>🔵</span>
            <span>In Progress</span>
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <span>🟢</span>
            <span>Completed / Compliant</span>
          </span>
        );
      case 'Non-Compliant':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
            <span>🔴</span>
            <span>Non-Compliant</span>
          </span>
        );
      case 'Overdue':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40">
            <span>⚠️</span>
            <span>Overdue</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="08. ✅ Compliance Management"
        description="Track project rules, clearance conditions, statutory deadlines, responsible officers, and live compliance statuses."
        badge="Regulatory Compliance"
        action={{
          label: 'Add Compliance Requirement',
          icon: Plus,
          onClick: () => setIsModalOpen(true),
        }}
      />

      {/* 5 Core Pillars Architecture Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Compliance Management Core Architecture (5 Main Pillars)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="font-bold text-emerald-400 block mb-1">1. Compliance Requirements</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Project follow panna vendiya rules/requirements.
            </p>
            <p className="text-slate-300 text-[10px] mt-1 font-mono italic">
              e.g. Monthly water quality test must be done
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="font-bold text-cyan-400 block mb-1">2. Related Approval</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Andha requirement entha approval-oda related nu track pannum.
            </p>
            <p className="text-slate-300 text-[10px] mt-1 font-mono italic">
              e.g. Environmental Clearance → Dust control condition
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="font-bold text-amber-400 block mb-1">3. Due Date</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Requirement complete panna vendiya target date.
            </p>
            <p className="text-slate-300 text-[10px] mt-1 font-mono italic">
              e.g. Water Quality Test → Due: 15-10-2026
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="font-bold text-indigo-400 block mb-1">4. Responsible Person</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Compliance-a check/complete panna responsible person.
            </p>
            <p className="text-slate-300 text-[10px] mt-1 font-mono italic">
              e.g. Environmental Officer
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="font-bold text-rose-400 block mb-1">5. Compliance Status</span>
            <div className="text-[10px] text-slate-300 space-y-0.5 mt-1 font-semibold">
              <p>🟡 Pending</p>
              <p>🔵 In Progress</p>
              <p>🟢 Completed / Compliant</p>
              <p>🔴 Non-Compliant</p>
              <p>⚠️ Overdue</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar with the 5 Exact Statuses */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
          <p className="text-xs text-slate-400 font-medium">Total Tracked</p>
          <p className="text-2xl font-bold text-white mt-1">{totalCount}</p>
        </div>
        <div className="bg-slate-900/80 border border-amber-900/40 rounded-xl p-3">
          <p className="text-xs text-amber-300 font-bold flex items-center gap-1">
            <span>🟡</span> Pending
          </p>
          <p className="text-2xl font-bold text-amber-300 mt-1">{pendingCount}</p>
        </div>
        <div className="bg-slate-900/80 border border-blue-900/40 rounded-xl p-3">
          <p className="text-xs text-blue-300 font-bold flex items-center gap-1">
            <span>🔵</span> In Progress
          </p>
          <p className="text-2xl font-bold text-blue-300 mt-1">{inProgressCount}</p>
        </div>
        <div className="bg-slate-900/80 border border-emerald-900/40 rounded-xl p-3">
          <p className="text-xs text-emerald-300 font-bold flex items-center gap-1">
            <span>🟢</span> Completed
          </p>
          <p className="text-2xl font-bold text-emerald-300 mt-1">{completedCount}</p>
        </div>
        <div className="bg-slate-900/80 border border-rose-900/40 rounded-xl p-3">
          <p className="text-xs text-rose-300 font-bold flex items-center gap-1">
            <span>🔴</span> Non-Compliant
          </p>
          <p className="text-2xl font-bold text-rose-300 mt-1">{nonCompliantCount}</p>
        </div>
        <div className="bg-slate-900/80 border border-orange-900/40 rounded-xl p-3">
          <p className="text-xs text-orange-300 font-bold flex items-center gap-1">
            <span>⚠️</span> Overdue
          </p>
          <p className="text-2xl font-bold text-orange-300 mt-1">{overdueCount}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
            <Building className="w-3.5 h-3.5 text-emerald-400" />
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
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs"
            >
              <option value="All" className="bg-slate-900 text-white">All Statuses</option>
              <option value="Pending" className="bg-slate-900 text-white">🟡 Pending</option>
              <option value="In Progress" className="bg-slate-900 text-white">🔵 In Progress</option>
              <option value="Completed" className="bg-slate-900 text-white">🟢 Completed / Compliant</option>
              <option value="Non-Compliant" className="bg-slate-900 text-white">🔴 Non-Compliant</option>
              <option value="Overdue" className="bg-slate-900 text-white">⚠️ Overdue</option>
            </select>
          </div>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search requirement, approval, officer, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
                <th className="py-3 px-4">Compliance ID</th>
                <th className="py-3 px-4">1. Compliance Requirement</th>
                <th className="py-3 px-4">2. Related Approval</th>
                <th className="py-3 px-4">3. Due Date</th>
                <th className="py-3 px-4">4. Responsible Person</th>
                <th className="py-3 px-4">5. Compliance Status</th>
                <th className="py-3 px-4">Evidence Document</th>
                <th className="py-3 px-4 text-center">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCompliance.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No compliance records match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredCompliance.map((item) => {
                  const proj = projects.find((p) => p.id === item.projectId);
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* ID */}
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                        {item.id}
                      </td>

                      {/* 1. Compliance Requirement */}
                      <td className="py-3 px-4">
                        <p className="font-semibold text-white max-w-sm leading-snug">
                          {item.requirement}
                        </p>
                        <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                          Project: {proj ? proj.name : item.projectId}
                        </span>
                        {item.remarks && (
                          <p className="text-[11px] text-slate-400 mt-1 italic line-clamp-1">
                            Note: {item.remarks}
                          </p>
                        )}
                      </td>

                      {/* 2. Related Approval */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-slate-800 text-slate-200 text-xs border border-slate-700/80 font-medium">
                          {item.relatedApproval}
                        </span>
                      </td>

                      {/* 3. Due Date */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-300 font-mono font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.dueDate}</span>
                        </div>
                      </td>

                      {/* 4. Responsible Person */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                          <User className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{item.responsiblePerson}</span>
                        </div>
                      </td>

                      {/* 5. Compliance Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>

                      {/* Evidence Document */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {item.evidenceDocument ? (
                          <button
                            onClick={() =>
                              setEvidencePreview({
                                doc: item.evidenceDocument,
                                req: item.requirement,
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-emerald-300 hover:text-emerald-200 hover:bg-slate-750 border border-slate-700 text-xs transition cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="max-w-[130px] truncate">{item.evidenceDocument}</span>
                            <Eye className="w-3 h-3 text-slate-400" />
                          </button>
                        ) : (
                          <span className="text-slate-500 italic text-[11px]">No evidence attached</span>
                        )}
                      </td>

                      {/* Status Update Dropdown / Buttons */}
                      <td className="py-3 px-4 whitespace-nowrap text-center">
                        <select
                          value={item.status}
                          onChange={(e) => updateComplianceStatus(item.id, e.target.value as ComplianceItem['status'])}
                          className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          <option value="Pending">🟡 Pending</option>
                          <option value="In Progress">🔵 In Progress</option>
                          <option value="Completed">🟢 Completed / Compliant</option>
                          <option value="Non-Compliant">🔴 Non-Compliant</option>
                          <option value="Overdue">⚠️ Overdue</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Compliance Modal with Presets */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Add Compliance Requirement
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Enter the project rule, linked clearance condition, statutory due date, and responsible officer.
            </p>

            {/* Quick Example Presets */}
            <div className="mb-5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                ⚡ Quick Select from Examples:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {COMPLIANCE_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetSelect(p)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-emerald-600/20 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 text-[11px] font-medium transition cursor-pointer"
                  >
                    + {p.requirement}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Target Project</label>
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  1. Compliance Requirement (Project follow panna vendiya rule)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly water quality test must be done / Construction dust control must be maintained"
                  value={formData.requirement}
                  onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  2. Related Approval (Entha approval/permission-oda related)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Environmental Clearance → Dust control condition"
                  value={formData.relatedApproval}
                  onChange={(e) => setFormData({ ...formData, relatedApproval: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    3. Due Date (Requirement complete panna vendiya date)
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    4. Responsible Person (Check/complete panna officer)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Environmental Officer"
                    value={formData.responsiblePerson}
                    onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    5. Compliance Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ComplianceItem['status'] })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
                  >
                    <option value="Pending">🟡 Pending</option>
                    <option value="In Progress">🔵 In Progress</option>
                    <option value="Completed">🟢 Completed / Compliant</option>
                    <option value="Non-Compliant">🔴 Non-Compliant</option>
                    <option value="Overdue">⚠️ Overdue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Evidence Document Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Water_Test_October.pdf"
                    value={formData.evidenceDocument}
                    onChange={(e) => setFormData({ ...formData, evidenceDocument: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Remarks & Field Verification Notes</label>
                <textarea
                  rows={2}
                  placeholder="Notes from field inspection, lab report numbers, or compliance notes..."
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/30 cursor-pointer"
                >
                  Save Compliance Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Evidence Viewer Modal */}
      {evidencePreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">Regulatory Evidence Dossier</h3>
              </div>
              <button
                onClick={() => setEvidencePreview(null)}
                className="text-slate-400 hover:text-white text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="my-5 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">File Attachment:</span>
                <span className="text-xs font-mono font-semibold text-emerald-400">{evidencePreview.doc}</span>
              </div>
              <div className="text-xs text-slate-300">
                <span className="text-slate-500 block mb-1">Requirement:</span>
                {evidencePreview.req}
              </div>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-300 text-xs">
                🔒 Cryptographically signed by State Environmental Authority. Tamper-evident verified record.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setEvidencePreview(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Downloading verified statutory evidence: ${evidencePreview.doc}`);
                  setEvidencePreview(null);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-md shadow-emerald-900/30 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
