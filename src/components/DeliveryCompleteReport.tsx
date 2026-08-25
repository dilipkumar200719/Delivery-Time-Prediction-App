import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Trophy,
  CheckCircle2,
  AlertTriangle,
  Gift,
  Coins,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  BrainCircuit,
  ArrowRight
} from 'lucide-react';

export const DeliveryCompleteReport: React.FC = () => {
  const {
    isDeliveryCompleted,
    completedReport,
    claimDelayCompensation,
    resetSimulation,
    setActiveTab,
    setIsDeliveryCompleted
  } = useApp();

  const [hasClaimedCompensation, setHasClaimedCompensation] = useState(false);

  if (!isDeliveryCompleted || !completedReport) return null;

  const predicted = completedReport.prediction?.predictedEtaMinutes || 18;
  const actual = completedReport.actualEtaMinutes || 19;
  const delta = Math.max(0, actual - predicted);
  const compensationPoints = completedReport.delayCompensationPoints || 0;

  const handleClaim = async () => {
    await claimDelayCompensation();
    setHasClaimedCompensation(true);
  };

  const handleOrderMore = () => {
    setIsDeliveryCompleted(false);
    setActiveTab('HOME');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl my-8 text-center space-y-6">
        
        {/* Trophy & Header */}
        <div className="flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 mb-3 shadow-xs">
            <Trophy className="h-8 w-8" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-emerald-700">
            Delivery Complete
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-0.5">
            Order #{completedReport.id}
          </h2>
          <p className="text-xs text-slate-500">
            Your hot meal has been delivered. Real-time telemetry session finalized.
          </p>
        </div>

        {/* Telemetry Matrix Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">AI Prediction</span>
            <div className="text-lg font-black text-slate-900 mt-0.5">{predicted} min</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Actual Arrival</span>
            <div className="text-lg font-black text-slate-900 mt-0.5">{actual} min</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Accuracy Rate</span>
            <div className="text-lg font-black text-emerald-600 mt-0.5">
              {delta <= 1 ? '98.5%' : delta <= 3 ? '94.2%' : '88.0%'}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Points Earned</span>
            <div className="text-lg font-black text-amber-600 mt-0.5">
              +100 Pts
            </div>
          </div>

        </div>

        {/* Delay Compensation Banner if delayed */}
        {compensationPoints > 0 && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Gift className="h-4 w-4 text-amber-600" />
                AI Guaranteed On-Time SLA Breach
              </span>
              <span className="text-xs font-black text-amber-900">
                +{compensationPoints} Bonus Points (₹{Math.round(compensationPoints / 10)})
              </span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Order arrived {delta} minutes beyond AI initial estimate due to severe congestion. We have compensated your account automatically.
            </p>
            {!hasClaimedCompensation ? (
              <button
                onClick={handleClaim}
                className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 transition-colors shadow-xs"
              >
                Claim ₹{Math.round(compensationPoints / 10)} Credit to Wallet
              </button>
            ) : (
              <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Claimed to wallet balance
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={resetSimulation}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Re-run Simulation</span>
          </button>

          <button
            onClick={handleOrderMore}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-cyan-600 py-3 text-xs font-bold text-white hover:bg-cyan-700 transition-colors shadow-xs"
          >
            <span>Explore Menu & Reorder</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
