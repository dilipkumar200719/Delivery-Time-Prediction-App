import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  X,
  Sliders,
  Database,
  BarChart3,
  CheckCircle2,
  ShieldAlert,
  Coins,
  Settings,
  Sparkles,
  Server
} from 'lucide-react';
import { FirebaseDbService } from '../services/firebaseDb';
import { AdminSettingsConfig } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    adminSettings
  } = useApp();

  const [settings, setSettings] = useState<AdminSettingsConfig>(adminSettings);
  const [isSaved, setIsSaved] = useState(false);
  const [stats, setStats] = useState({
    totalDeliveries: 1482,
    maeMinutes: 1.15,
    onTimeRate: 94.2,
    totalPointsIssued: 485200,
    totalRupeesRedeemed: 34200,
    compensationClaims: 84
  });

  useEffect(() => {
    setSettings(adminSettings);
  }, [adminSettings]);

  if (!isAdminOpen) return null;

  const handleSave = async () => {
    await FirebaseDbService.saveAdminSettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl my-8 space-y-6">
        
        {/* Close */}
        <button
          onClick={() => setIsAdminOpen(false)}
          className="absolute top-5 right-5 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 border border-cyan-200">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              PredictEats AI Engine Console
            </h2>
            <p className="text-xs text-slate-500">
              Live Firestore persistent weights, SLA thresholds, and ML model sensitivity parameters
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Accuracy MAE</span>
            <div className="text-xl font-black text-slate-900 mt-0.5">±{stats.maeMinutes} min</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">SLA On-Time Rate</span>
            <div className="text-xl font-black text-emerald-600 mt-0.5">{stats.onTimeRate}%</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Points Issued</span>
            <div className="text-xl font-black text-amber-600 mt-0.5">{stats.totalPointsIssued.toLocaleString()}</div>
          </div>
        </div>

        {/* Controls Configuration */}
        <div className="space-y-4 pt-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Algorithm Weights & Calibration
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-800">
                <span>Traffic Impact Multiplier</span>
                <span className="text-cyan-700 font-mono">{settings.trafficWeight}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={settings.trafficWeight}
                onChange={(e) => setSettings({ ...settings, trafficWeight: parseFloat(e.target.value) })}
                className="w-full accent-cyan-600"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-800">
                <span>Weather Impact Multiplier</span>
                <span className="text-cyan-700 font-mono">{settings.weatherWeight}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={settings.weatherWeight}
                onChange={(e) => setSettings({ ...settings, weatherWeight: parseFloat(e.target.value) })}
                className="w-full accent-cyan-600"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-800">
                <span>Delay Threshold (Compensation)</span>
                <span className="text-cyan-700 font-mono">{settings.delayThresholdMinutes} min</span>
              </div>
              <input
                type="range"
                min="2"
                max="10"
                step="1"
                value={settings.delayThresholdMinutes}
                onChange={(e) => setSettings({ ...settings, delayThresholdMinutes: parseInt(e.target.value) })}
                className="w-full accent-cyan-600"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-800">
                <span>Points Per Rupee</span>
                <span className="text-cyan-700 font-mono">{settings.pointsPerRupee} pts/₹</span>
              </div>
              <input
                type="range"
                min="5"
                max="20"
                step="1"
                value={settings.pointsPerRupee}
                onChange={(e) => setSettings({ ...settings, pointsPerRupee: parseInt(e.target.value) })}
                className="w-full accent-cyan-600"
              />
            </div>

          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          {isSaved ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Changes persisted to Firestore
            </span>
          ) : (
            <span className="text-xs text-slate-400">Settings update dynamically across active clients</span>
          )}

          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-cyan-600 transition-colors shadow-xs"
          >
            <Server className="h-4 w-4" />
            <span>Save Configuration</span>
          </button>
        </div>

      </div>
    </div>
  );
};
