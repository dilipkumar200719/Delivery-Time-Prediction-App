import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, AlertTriangle, ShieldAlert, CheckCircle2, HeartPulse } from 'lucide-react';

export const DeliveryHealthWidget: React.FC = () => {
  const { prediction, conditions, tracking } = useApp();

  const healthScore = tracking?.deliveryHealth ?? (prediction?.deliveryHealthScore ?? 87);
  const isDegraded = healthScore < 65;
  const isWarning = healthScore >= 65 && healthScore < 80;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <HeartPulse className="h-5 w-5 text-emerald-600" />
          <h3 className="text-base font-bold tracking-tight text-slate-900">
            Delivery Health Index
          </h3>
        </div>
        <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
          isDegraded
            ? 'bg-rose-50 text-rose-700 border-rose-200'
            : (isWarning ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200')
        }`}>
          {isDegraded ? '⚠️ CRITICAL RISK' : (isWarning ? '🟡 MODERATE RISK' : '🟢 OPTIMAL FLOW')}
        </span>
      </div>

      {/* Main Score Bar */}
      <div className="mt-5 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider">Operational Health</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className={`text-4xl sm:text-5xl font-black ${
              isDegraded ? 'text-rose-600' : (isWarning ? 'text-amber-600' : 'text-emerald-600')
            }`}>
              {healthScore}
            </span>
            <span className="text-sm font-semibold text-slate-400">/ 100</span>
          </div>
        </div>

        {isDegraded && (
          <div className="flex items-center gap-1.5 rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">
            <AlertTriangle className="h-4 w-4 text-rose-600" />
            <span className="font-bold">Risk Factors Elevated</span>
          </div>
        )}
      </div>

      {/* Health Gauge Meter */}
      <div className="mt-3 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isDegraded
              ? 'bg-rose-500'
              : (isWarning ? 'bg-amber-500' : 'bg-emerald-500')
          }`}
          style={{ width: `${healthScore}%` }}
        />
      </div>

      {/* Health Sub-metrics */}
      <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
          <span className="text-[11px] text-slate-500 block">Traffic Flow</span>
          <span className="font-bold text-slate-800 mt-0.5 block">
            {conditions.trafficLevel === 'LOW' ? '98% Smooth' : (conditions.trafficLevel === 'MEDIUM' ? '82% Flow' : '45% Jam')}
          </span>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
          <span className="text-[11px] text-slate-500 block">Kitchen Speed</span>
          <span className="font-bold text-slate-800 mt-0.5 block">
            {conditions.storeStatus === 'READY' ? '100% Fast' : (conditions.storeStatus === 'NORMAL' ? '92% On-Time' : '68% Delayed')}
          </span>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
          <span className="text-[11px] text-slate-500 block">Route Friction</span>
          <span className="font-bold text-slate-800 mt-0.5 block">
            {conditions.roadCondition === 'NORMAL' ? 'Low (5%)' : 'Elevated (28%)'}
          </span>
        </div>
      </div>

    </div>
  );
};
