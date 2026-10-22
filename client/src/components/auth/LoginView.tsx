import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const res = await login(email.trim(), password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Invalid credentials. Access denied.');
    }
  };

  return (
    <div className="min-h-screen theme-grid-white flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-6 space-y-2 relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-0.5 shadow-2xl shadow-emerald-500/30 mb-1">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            EnviroTrack <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">Infra</span>
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono">
            TN Portal
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg font-medium">
          Tamil Nadu Infrastructure Environmental Impact Assessment & Statutory Compliance Governance System
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-slate-300 shadow-2xl relative overflow-hidden bg-white/95 backdrop-blur-2xl text-slate-900 z-10">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">Officer Sign In</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your authorized email and password to access the project dashboard
            </p>
          </div>
          <span className="px-2 py-1 rounded-md text-[10px] font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
            Secure Portal
          </span>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="off"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:border-emerald-600 focus:bg-white focus:outline-none font-mono font-medium placeholder:font-sans placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="off"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:border-emerald-600 focus:bg-white focus:outline-none font-mono text-sm placeholder:font-sans placeholder:text-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all mt-3 cursor-pointer hover:scale-[1.01]"
          >
            {loading ? 'Verifying Credentials...' : 'Sign In & Enter Dashboard'}
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>
        </form>
      </div>

      <footer className="mt-6 text-center text-xs text-slate-500 relative z-10 flex items-center gap-2">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>EnviroTrack Infra • MoEFCC & TNPCB Compliant Governance System</span>
      </footer>
    </div>
  );
};
