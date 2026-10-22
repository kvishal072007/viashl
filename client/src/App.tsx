import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LoginView } from './components/auth/LoginView';
import { DashboardView } from './views/DashboardView';
import { ProjectsView } from './views/ProjectsView';
import { AssessmentsView } from './views/AssessmentsView';
import { EnvironmentalRisksView } from './views/EnvironmentalRisksView';
import { ApprovalsView } from './views/ApprovalsView';
import { MitigationEMPView } from './views/MitigationEMPView';
import { SensorMonitoringView } from './views/SensorMonitoringView';
import { ComplianceManagementView } from './views/ComplianceManagementView';
import { ComplianceDocsView } from './views/ComplianceDocsView';
import { DeadlineNotificationsView } from './views/DeadlineNotificationsView';
import { ReportsView } from './views/ReportsView';
import { AuditLogsView } from './views/AuditLogsView';
import { Grid } from 'lucide-react';

const MainAppContent: React.FC<{
  currentTheme: string;
  setTheme: (t: string) => void;
}> = ({ currentTheme, setTheme }) => {
  const { currentUser } = useAuth();
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  if (!currentUser) {
    return <LoginView />;
  }

  const themes = [
    { id: 'theme-grid-white', label: '🤍 3D Studio Infinity Grid (Pure)', color: '#ffffff', desc: 'White 3D Perspective Grid' },
    { id: 'theme-grid-cyber', label: '🌌 3D Cyber Navy Grid', color: '#1e3a8a', desc: 'Deep Blue 3D Grid' },
    { id: 'theme-grid-emerald', label: '🌲 3D Emerald Forest Grid', color: '#047857', desc: 'Tamil Green 3D Grid' },
    { id: 'theme-grid-violet', label: '🔮 3D Neon Violet Grid', color: '#7e22ce', desc: 'Royal Purple 3D Grid' },
  ];

  // EXACT module mapping matching user's requested workflow
  const renderCurrentView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView
            setActiveView={setActiveView}
            setSelectedProjectId={setSelectedProjectId}
          />
        );
      case 'project-management':
        return <ProjectsView selectedProjectId={selectedProjectId} />;
      case 'environmental-assessment':
        return <AssessmentsView />;
      case 'environmental-risks':
        return <EnvironmentalRisksView />;
      case 'approval-management':
        return <ApprovalsView />;
      case 'mitigation-measures':
        return <MitigationEMPView />;
      case 'environmental-monitoring':
        return <SensorMonitoringView />;
      case 'compliance-management':
        return <ComplianceManagementView />;
      case 'document-management':
        return <ComplianceDocsView />;
      case 'deadline-notifications':
        return <DeadlineNotificationsView />;
      case 'reports':
        return <ReportsView />;
      case 'audit-log':
        return <AuditLogsView />;
      default:
        return (
          <DashboardView
            setActiveView={setActiveView}
            setSelectedProjectId={setSelectedProjectId}
          />
        );
    }
  };

  return (
    <div
      className={`min-h-screen ${currentTheme} transition-all duration-700 relative overflow-hidden flex flex-col`}
    >
      {/* Top Floating 3D Grid Theme Control Bar */}
      <div className="relative z-50 w-full bg-slate-950/90 border-b border-slate-800 px-6 py-2.5 flex items-center justify-between text-xs backdrop-blur-2xl shadow-xl text-slate-100">
        <div className="flex items-center gap-2.5 font-bold">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <Grid className="w-4 h-4" />
          </div>
          <span>3D Perspective Studio Grid Active</span>
          <span className="text-[11px] text-slate-400 font-normal hidden lg:inline">
            • Exact 12-Module Workflow Enabled
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                currentTheme === t.id
                  ? 'bg-emerald-500 text-slate-950 shadow-xl shadow-emerald-500/30 scale-105 ring-2 ring-white font-extrabold'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-750'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full border border-black/30"
                style={{ backgroundColor: t.color }}
              />
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="relative z-40">
        <Navbar
          activeView={activeView}
          currentTheme={currentTheme}
          setTheme={setTheme}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-110px)]">
          <div className="max-w-7xl mx-auto">{renderCurrentView()}</div>
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    return localStorage.getItem('envirotrack_theme') || 'theme-grid-white';
  });

  const handleSetTheme = (theme: string) => {
    setCurrentTheme(theme);
    localStorage.setItem('envirotrack_theme', theme);
  };

  return (
    <AuthProvider>
      <DataProvider>
        <MainAppContent currentTheme={currentTheme} setTheme={handleSetTheme} />
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
