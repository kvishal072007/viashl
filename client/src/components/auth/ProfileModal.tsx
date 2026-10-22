import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { User, ShieldCheck, Lock, Building, Check, Sparkles, Image } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateProfile } = useAuth();
  const [name, setName] = useState(currentUser?.name || 'Vishal');
  const [department, setDepartment] = useState(currentUser?.department || 'State Environmental Oversight & Clearances Directorate');
  const [organization, setOrganization] = useState(currentUser?.organization || 'SEIAA Tamil Nadu & Environment, Climate Change and Forests Dept');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '/vishal_profile.jpg');
  const [password, setPassword] = useState(currentUser?.password || 'vishal123');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const predefinedAvatars = [
    '/vishal_profile.jpg',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateProfile({
      name,
      department,
      organization,
      avatarUrl,
      password,
    });
    if (success) {
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 800);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Admin Profile & Credentials"
      subtitle="Update officer details, profile avatar, and account access password"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Profile Avatar Selector */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <label className="block text-slate-300 font-bold">Choose Profile Picture</label>
          <div className="flex items-center gap-3 flex-wrap">
            {predefinedAvatars.map((url, i) => (
              <img
                key={i}
                src={url}
                alt="Avatar option"
                onClick={() => setAvatarUrl(url)}
                className={`w-12 h-12 rounded-full object-cover cursor-pointer border-2 transition-all hover:scale-110 ${
                  avatarUrl === url
                    ? 'border-emerald-400 ring-2 ring-emerald-500/50 scale-105'
                    : 'border-slate-700 opacity-60 hover:opacity-100'
                }`}
              />
            ))}
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mt-2 mb-1">Custom Image URL</label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:border-emerald-500 focus:outline-none"
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Name & Role */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Officer / Admin Name</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 font-bold focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Assigned Role</label>
            <input
              disabled
              type="text"
              value={`${currentUser?.role} (Highest Level)`}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-emerald-400 font-mono"
            />
          </div>
        </div>

        {/* Department & Organization */}
        <div>
          <label className="block text-slate-400 font-semibold mb-1">Directorate / Department</label>
          <input
            required
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1">Government Authority / Organization</label>
          <input
            required
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Login Password */}
        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <Lock className="w-4 h-4" />
            <span>Admin Login Password</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Set your secret password for logging into the EnviroTrack portal.
          </p>
          <input
            required
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300 font-mono font-bold focus:border-emerald-400 focus:outline-none"
            placeholder="Enter password..."
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" /> Saved!
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Save Profile & Password
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
