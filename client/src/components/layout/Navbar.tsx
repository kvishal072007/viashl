import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Bell,
  Activity,
  ChevronDown,
  UserCheck,
  Radio,
  FileCheck2,
  Palette,
  Sparkles,
  UserCog,
  LogOut,
  Search,
  Zap,
} from 'lucide-react';
import { ProfileModal } from '../auth/ProfileModal';

interface NavbarProps {
  activeView: string;
  currentTheme: string;
  setTheme: (theme: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeView, currentTheme, setTheme }) => {
  const { currentUser, users, switchUser, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const themeOptions = [
    { id: 'theme-emerald', name: '🌿 Neo-Emerald Cyber-Forest (Default)', color: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
    { id: 'theme-ocean', name: '🌌 Deep Ocean Sapphire Tech', color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)' },
    { id: 'theme-sunset', name: '🪐 Velvet Amber & Gold Executive', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' },
    { id: 'theme-light', name: '💎 Crisp Light Glass ESG', color: '#059669', glow: 'rgba(5, 150, 105, 0.3)' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-6 py-3 transition-colors duration-300">
        <div className="flex items-center justify-between gap-4">
          {/* Brand & Logo */}
          <div className="flex items-center gap-3.5">
            <div className="relative group cursor-pointer">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all duration-300 group-hover:scale-105">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                  EnviroTrack
                </span>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                  TN INFRA • v2.8
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Tamil Nadu Statutory Environmental Governance & Live Compliance Matrix
              </p>
            </div>
          </div>

          {/* Center System Status Ticker */}
          <div className="hidden xl:flex items-center gap-5 text-xs text-slate-400 bg-slate-900/80 px-4 py-2 rounded-full border border-slate-800/90 shadow-inner">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">CAAQMS Telemetry: <strong className="text-emerald-400 font-mono">Active</strong></span>
            </div>
            <div className="h-3 w-px bg-slate-700/60" />
            <div className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>Redis: <strong className="text-cyan-400 font-mono">0.8ms</strong></span>
            </div>
            <div className="h-3 w-px bg-slate-700/60" />
            <div className="flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
              <span>SEIAA & TNPCB: <strong className="text-amber-400">Synced</strong></span>
            </div>
          </div>

          {/* Right Controls: Theme Selector, Alerts, User Profile */}
          <div className="flex items-center gap-3">
            {/* Theme Palette Switcher */}
            <div className="relative">
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 transition-all flex items-center gap-1.5 text-xs font-bold shadow-md hover:scale-[1.02] cursor-pointer"
                title="Change Visual Theme"
              >
                <Palette className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Theme</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
              </button>

              {themeDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-72 glass-panel bg-slate-900/95 border border-slate-700/90 rounded-2xl shadow-2xl p-2.5 z-50 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-slate-800/80">
                    <p className="text-xs font-extrabold text-slate-200">Aesthetic Color Themes</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Switch real-time UI/UX palette</p>
                  </div>
                  <div className="py-1.5 space-y-1">
                    {themeOptions.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setTheme(t.id);
                          setThemeDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                          currentTheme === t.id
                            ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm'
                            : 'hover:bg-slate-800/80 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: t.color, boxShadow: `0 0 10px ${t.glow}` }}
                          />
                          <span className="truncate">{t.name}</span>
                        </div>
                        {currentTheme === t.id && <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <button className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-slate-100 hover:border-slate-700 transition-all relative hover:scale-105 cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-slate-950 animate-pulse"></span>
            </button>

            {/* Direct Logout / Login Screen Button */}
            <button
              onClick={() => logout()}
              title="Return to Login Page"
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer hover:scale-105"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Login Screen</span>
            </button>

            {/* User Profile Pill & Actions */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/60 transition-all text-left group cursor-pointer shadow-md hover:scale-[1.01]"
              >
                <div className="relative">
                  <img
                    src={currentUser?.avatarUrl || '/vishal_profile.jpg'}
                    alt={currentUser?.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/80 group-hover:ring-emerald-400 transition-all"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                </div>
                <div className="hidden md:block">
                  <p className="text-xs font-black text-slate-100 group-hover:text-emerald-400 transition-colors">
                    {currentUser?.name}
                  </p>
                  <p className="text-[10px] text-emerald-400 font-mono font-bold">{currentUser?.role}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 ml-0.5 transition-transform" />
              </button>

              {/* User Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-80 glass-panel bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl p-3 z-50 animate-fadeIn">
                  {/* Active Profile Header */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={currentUser?.avatarUrl || '/vishal_profile.jpg'}
                        alt={currentUser?.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500"
                      />
                      <div className="truncate">
                        <p className="font-extrabold text-xs text-slate-100">{currentUser?.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{currentUser?.email}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {currentUser?.role}
                    </span>
                  </div>

                  {/* Edit Profile & Password */}
                  <div className="space-y-1 pb-2 border-b border-slate-800">
                    <button
                      onClick={() => {
                        setIsProfileOpen(true);
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                    >
                      <UserCog className="w-4 h-4" />
                      <span>Edit Profile & Password</span>
                    </button>
                  </div>

                  {/* Switch Persona (Demo Roles) */}
                  <div className="py-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-1.5 font-mono">
                      Switch Role (Tamil Nadu Governance)
                    </p>
                    <div className="space-y-1">
                      {users.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            switchUser(u);
                            setDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                            currentUser?.id === u.id
                              ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30'
                              : 'hover:bg-slate-800/70 text-slate-300'
                          }`}
                        >
                          <img src={u.avatarUrl || '/vishal_profile.jpg'} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                          <div className="truncate flex-1">
                            <p className="font-medium text-slate-200">{u.name}</p>
                            <p className="text-[10px] text-slate-400">{u.role}</p>
                          </div>
                          {currentUser?.id === u.id && <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Logout */}
                  <div className="pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Profile & Password Modal */}
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
};
