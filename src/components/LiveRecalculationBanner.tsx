import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, TrendingUp, TrendingDown, Clock, ShieldCheck } from 'lucide-react';

export const LiveRecalculationBanner: React.FC = () => {
  const { recalculationToast } = useApp();

  if (!recalculationToast) return null;

  const isDelay = recalculationToast.newEta > recalculationToast.previousEta;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className={`overflow-hidden rounded-2xl border p-4 shadow-xl backdrop-blur-md ${
        isDelay
          ? 'border-amber-300 bg-amber-50/95 text-amber-950 shadow-amber-500/10'
          : 'border-emerald-300 bg-emerald-50/95 text-emerald-950 shadow-emerald-500/10'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-black/5">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-cyan-600 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-cyan-600" />
              AI Recalculation Event
            </span>
          </div>
          <span className="text-[10px] font-mono opacity-60">
            {recalculationToast.timestamp}
          </span>
        </div>

        {/* ETA Change Numbers */}
        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-xs opacity-75">Predicted ETA Shift</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-bold line-through opacity-50">
                {recalculationToast.previousEta}m
              </span>
              <ArrowRight className="h-4 w-4 opacity-75" />
              <span className="text-2xl font-black">
                {recalculationToast.newEta}m
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-black ${
              isDelay ? 'bg-amber-200/80 text-amber-900' : 'bg-emerald-200/80 text-emerald-900'
            }`}>
              {isDelay ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {isDelay ? `+${recalculationToast.newEta - recalculationToast.previousEta} min` : `${recalculationToast.newEta - recalculationToast.previousEta} min`}
            </span>
          </div>
        </div>

        {/* Reasons */}
        <div className="mt-3 space-y-1 pt-2 border-t border-black/5 text-xs">
          {recalculationToast.reasons.map((r, i) => (
            <div key={i} className="flex justify-between items-center opacity-90">
              <span className="truncate max-w-[260px]">• {r.description}</span>
              <span className="font-mono font-bold">
                {r.deltaMinutes > 0 ? `+${r.deltaMinutes}m` : `${r.deltaMinutes}m`}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
