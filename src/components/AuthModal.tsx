import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, X, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, LogIn } from 'lucide-react';
import { FirebaseDbService } from '../services/firebaseDb';

export const AuthModal: React.FC = () => {
  const { isAuthOpen, setIsAuthOpen, user, loginUser } = useApp();

  const [name, setName] = useState(user?.displayName || 'Dilip (AI Pilot)');
  const [email, setEmail] = useState(user?.email || 'dilipdhammu2@gmail.com');
  const [role, setRole] = useState<'USER' | 'DRIVER' | 'ADMIN'>('USER');

  if (!isAuthOpen) return null;

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginUser(email, name);
    setIsAuthOpen(false);
  };

  const selectQuickProfile = async (pName: string, pEmail: string, _pRole: 'USER' | 'DRIVER' | 'ADMIN') => {
    await loginUser(pEmail, pName);
    setIsAuthOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Close */}
        <button
          onClick={() => setIsAuthOpen(false)}
          className="absolute top-5 right-5 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 border border-cyan-200">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Account & Profile
            </h2>
            <p className="text-xs text-slate-500">
              Manage your delivery identity, rewards wallet, and role
            </p>
          </div>
        </div>

        {/* Quick Switch Switcher */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Switch Demo Account
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => selectQuickProfile('Alex Rider', 'alex.rider@predict-eats.ai', 'USER')}
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-left hover:border-cyan-400 transition-all"
            >
              <div className="text-xs font-bold text-slate-900">Alex Rider</div>
              <div className="text-[10px] text-slate-500">Customer • 350 pts</div>
            </button>
            <button
              onClick={() => selectQuickProfile('Operations Admin', 'admin@predict-eats.ai', 'ADMIN')}
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-left hover:border-cyan-400 transition-all"
            >
              <div className="text-xs font-bold text-slate-900">Ops Admin</div>
              <div className="text-[10px] text-slate-500">Full System Access</div>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSaveUser} className="space-y-4 pt-2 border-t border-slate-100">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 focus:border-cyan-500 focus:outline-hidden"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 focus:border-cyan-500 focus:outline-hidden"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 focus:border-cyan-500 focus:outline-hidden"
            >
              <option value="USER">Customer (Order & Play)</option>
              <option value="DRIVER">Delivery Fleet Courier</option>
              <option value="ADMIN">System Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-cyan-600 transition-colors shadow-xs"
          >
            <LogIn className="h-4 w-4" />
            <span>Save Profile</span>
          </button>
        </form>

      </div>
    </div>
  );
};
