import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { PageHeader } from '../components/layout/PageHeader';
import {
  FolderOpen,
  Plus,
  FileText,
  Download,
  Trash2,
  Eye,
  Filter,
  Search,
  Building,
  UploadCloud,
  FileCheck2,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  User,
  HardDrive,
} from 'lucide-react';
import { DocumentItem } from '../data/centralData';

const DOCUMENT_TYPES = [
  'Environmental Assessment Report',
  'Environmental Approval',
  'Risk Assessment',
  'Mitigation Report',
  'Monitoring Report',
  'Compliance Report',
  'Government Certificate',
] as const;

export const ComplianceDocsView: React.FC = () => {
  const { projects, documents, addDocument, deleteDocument } = useData();
  const [selectedProject, setSelectedProject] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<DocumentItem | null>(null);

  const [formData, setFormData] = useState<Omit<DocumentItem, 'id'>>({
    name: '',
    projectId: 'PRJ-001',
    documentType: 'Environmental Assessment Report',
    uploadedBy: 'Vishal (State Admin)',
    uploadDate: new Date().toISOString().split('T')[0],
    version: 'v1.0',
    fileSize: '4.2 MB',
    fileUrl: '',
  });

  const filteredDocs = documents.filter((doc) => {
    const matchesProject = selectedProject === 'All' || doc.projectId === selectedProject;
    const matchesType = selectedType === 'All' || doc.documentType === selectedType;
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProject && matchesType && matchesSearch;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    addDocument({
      ...formData,
      fileUrl: formData.fileUrl || `/docs/${formData.name.replace(/\s+/g, '_')}.pdf`,
    });

    setFormData({
      name: '',
      projectId: 'PRJ-001',
      documentType: 'Environmental Assessment Report',
      uploadedBy: 'Vishal (State Admin)',
      uploadDate: new Date().toISOString().split('T')[0],
      version: 'v1.0',
      fileSize: '4.2 MB',
      fileUrl: '',
    });
    setIsUploadOpen(false);
  };

  const handleDownload = (doc: DocumentItem) => {
    // Generate simulated download
    const blob = new Blob([
      `GOVERNMENT OF TAMIL NADU - STATE ENVIRONMENTAL RECORD\n` +
      `=====================================================\n` +
      `Document ID: ${doc.id}\n` +
      `Document Name: ${doc.name}\n` +
      `Project ID: ${doc.projectId}\n` +
      `Document Type: ${doc.documentType}\n` +
      `Uploaded By: ${doc.uploadedBy}\n` +
      `Upload Date: ${doc.uploadDate}\n` +
      `Version: ${doc.version}\n` +
      `SHA-256 Fingerprint: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\n` +
      `Status: STATUTORY AUDIT SEALED & CERTIFIED\n`
    ], { type: 'text/plain' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.name.replace(/\s+/g, '_')}_${doc.version}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This action will be logged in the Audit Trail.`)) {
      deleteDocument(id);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="09. 📄 Document Management"
        description="Maintain all project-related environmental reports, approvals, risk records, and statutory certificates in one secure central repository."
        badge="Document Management"
        action={{
          label: 'Upload Document',
          icon: Plus,
          onClick: () => setIsUploadOpen(true),
        }}
      />

      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/20 to-slate-900 border border-blue-500/30 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 flex-shrink-0">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Centralized Environmental Vault (Features: Upload, View, Download, Delete)
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Supported: Environmental Assessment Report, Environmental Approval, Risk Assessment, Mitigation Report, Monitoring Report, Compliance Report, Government Certificate.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-lg border border-slate-700/80">
            <HardDrive className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-400">Total Documents:</span>
            <span className="text-lg font-bold text-white">{documents.length}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
            <Building className="w-3.5 h-3.5 text-blue-400" />
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
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs"
            >
              <option value="All" className="bg-slate-900 text-white">All Document Types</option>
              {DOCUMENT_TYPES.map((t) => (
                <option key={t} value={t} className="bg-slate-900 text-white">
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents, IDs, authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Document Name</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Document Type</th>
                <th className="py-3 px-4">Uploaded By</th>
                <th className="py-3 px-4">Upload Date</th>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4">File</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No documents match your filter.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => {
                  const proj = projects.find((p) => p.id === doc.projectId);
                  return (
                    <tr key={doc.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                            <FileText className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-semibold text-white block max-w-xs truncate">{doc.name}</span>
                            <span className="text-[11px] text-slate-500 font-mono">{doc.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-300 block max-w-[180px] truncate">
                          {proj ? proj.name : doc.projectId}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{doc.projectId}</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          {doc.documentType}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{doc.uploadedBy}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-300 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{doc.uploadDate}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-emerald-400">
                        {doc.version}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-slate-400 font-mono text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {doc.fileSize || 'PDF'}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* View Feature */}
                          <button
                            onClick={() => setViewingDoc(doc)}
                            title="View Document"
                            className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Download Feature */}
                          <button
                            onClick={() => handleDownload(doc)}
                            title="Download Document"
                            className="p-1.5 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/30 transition"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Feature */}
                          <button
                            onClick={() => handleDelete(doc.id, doc.name)}
                            title="Delete Document"
                            className="p-1.5 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Feature Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-blue-400" />
              Upload Project Document
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Upload statutory environmental assessments, approvals, risk plans, or monitoring files.
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Document Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Six-Monthly Environmental Compliance Dossier"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Target Project</label>
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Document Type</label>
                <select
                  value={formData.documentType}
                  onChange={(e) => setFormData({ ...formData, documentType: e.target.value as DocumentItem['documentType'] })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                >
                  {DOCUMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Uploaded By</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vishal (Admin)"
                    value={formData.uploadedBy}
                    onChange={(e) => setFormData({ ...formData, uploadedBy: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Version</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. v1.0"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* File Dropzone Simulator */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">Attach File</label>
                <div className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 rounded-xl p-6 text-center cursor-pointer transition bg-slate-950/40">
                  <UploadCloud className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-300 font-medium">Click to select or drag and drop statutory PDF</p>
                  <p className="text-[11px] text-slate-500 mt-1">PDF, DOCX, XLSX (Max 50MB, SHA-256 seal auto-applied)</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-900/30"
                >
                  Upload & Seal Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Feature Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-sm">Document Inspector</h3>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                className="text-slate-400 hover:text-white text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="my-5 space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-2">{viewingDoc.name}</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-500 block">Document ID:</span>
                    <span className="font-mono text-blue-400">{viewingDoc.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Document Type:</span>
                    <span>{viewingDoc.documentType}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Uploaded By:</span>
                    <span>{viewingDoc.uploadedBy}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Upload Date:</span>
                    <span>{viewingDoc.uploadDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Version:</span>
                    <span className="font-mono text-emerald-400">{viewingDoc.version}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">File Size:</span>
                    <span>{viewingDoc.fileSize || '4.2 MB'}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>Cryptographic SHA-256 Checksum: <strong>8f4e2...a90b</strong> (Verified Untampered)</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setViewingDoc(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDownload(viewingDoc);
                  setViewingDoc(null);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-md shadow-blue-900/30"
              >
                <Download className="w-3.5 h-3.5" />
                Download File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
