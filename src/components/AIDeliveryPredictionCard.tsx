import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  BrainCircuit,
  Clock,
  Sparkles,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Car,
  CloudRain,
  Sun,
  ChefHat,
  Bike,
  Route,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sliders,
  Compass,
  ArrowRight,
  RotateCcw,
  Target,
  Info
} from 'lucide-react';
import { AIExplainPredictionModal } from './AIExplainPredictionModal';

export const AIDeliveryPredictionCard: React.FC<{
  className?: string;
  showWhatIfSimulator?: boolean;
  showRouteIntelligence?: boolean;
  compact?: boolean;
}> = ({
  className = '',
  showWhatIfSimulator = true,
  showRouteIntelligence = true,
  compact = false
}) => {
  const {
    prediction,
    conditions,
    tracking,
    activeOrder,
    updateConditions,
    setActiveTab,
    selectRoute
  } = useApp();

  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
  const [selectedWhatIf, setSelectedWhatIf] = useState<string | null>(null);

  // Derive core prediction values
  const etaMinutes = tracking?.etaMinutes ?? prediction?.predictedEtaMinutes ?? 28;
  const etaRangeMin = Math.max(12, Math.round(etaMinutes * 0.9));
  const etaRangeMax = Math.max(etaRangeMin + 4, Math.round(etaMinutes * 1.15));
  const confidence = prediction?.confidence ?? 0.92;
  const confidencePercent = Math.round(confidence * 100);
  const remainingDist = tracking?.distanceRemainingKm ?? 2.8;

  // Expected Clock Arrival Time
  const expectedArrivalClock = useMemo(() => {
    const d = new Date(Date.now() + etaMinutes * 60000);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }, [etaMinutes]);

  // Confidence Category
  const confidenceCategory = useMemo(() => {
    if (confidencePercent >= 85) {
      return {
        label: 'High Confidence',
        badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dotColor: 'bg-emerald-500',
        progressColor: 'bg-emerald-500',
        explanation: 'Traffic and restaurant preparation conditions are currently stable across the corridor.'
      };
    } else if (confidencePercent >= 70) {
      return {
        label: 'Moderate Confidence',
        badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
        dotColor: 'bg-amber-500',
        progressColor: 'bg-amber-500',
        explanation: 'Mild traffic fluctuations detected on arterial intersections; variance within ±3 min.'
      };
    } else {
      return {
        label: 'Low Confidence',
        badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
        dotColor: 'bg-rose-500',
        progressColor: 'bg-rose-500',
        explanation: 'Rapidly shifting monsoon/traffic conditions; ETA updating continuously with live telemetry.'
      };
    }
  }, [confidencePercent]);

  // Dynamic ETA Timeline history points
  const etaTimeline = useMemo(() => {
    const baseEta = etaMinutes;
    return [
      { time: '12:10 PM', eta: `${baseEta + 5}–${baseEta + 10}`, status: 'Order Placed' },
      { time: '12:18 PM', eta: `${baseEta + 3}–${baseEta + 7}`, status: 'Kitchen Prepared' },
      { time: '12:24 PM', eta: `${baseEta + 1}–${baseEta + 4}`, status: 'Courier Picked Up' },
      { time: 'NOW', eta: `${etaRangeMin}–${etaRangeMax}`, status: 'On the Way', current: true }
    ];
  }, [etaMinutes, etaRangeMin, etaRangeMax]);

  return (
    <div className={`overflow-hidden rounded-3xl border border-cyan-200/80 bg-white p-5 sm:p-7 shadow-xs space-y-6 ${className}`}>
      
      {/* 1. Header Bar: AI Model Label & Confidence Meter */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/20">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black tracking-wider text-slate-950 uppercase">
                🤖 AI DELIVERY PREDICTION
              </span>
              <span className="rounded-md bg-cyan-50 px-2 py-0.5 text-[10px] font-bold text-cyan-800 border border-cyan-200">
                LIVE ETA
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Multi-signal inference calculating travel, kitchen, and weather impact
            </p>
          </div>
        </div>

        {/* Confidence Badge & Progress Meter */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Prediction Confidence</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${confidenceCategory.progressColor} rounded-full transition-all duration-500`}
                  style={{ width: `${confidencePercent}%` }}
                />
              </div>
              <span className="text-xs font-black text-slate-900">{confidencePercent}%</span>
            </div>
          </div>

          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${confidenceCategory.badgeColor}`}>
            <span className={`h-2 w-2 rounded-full ${confidenceCategory.dotColor} animate-ping`} />
            <span>{confidenceCategory.label}</span>
          </span>
        </div>
      </div>

      {/* 2. Main Hero Centerpiece: Big Prominent ETA Range Display */}
      <div className="rounded-2xl border border-cyan-200/70 bg-gradient-to-br from-cyan-50/70 via-sky-50/30 to-white p-6 relative overflow-hidden">
        
        {/* Background Subtle Gradient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          
          {/* Big Minutes Range Counter */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-900 uppercase tracking-wider block">
                Estimated Delivery Window
              </span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="flex items-baseline gap-2.5">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-950">
                {etaRangeMin}–{etaRangeMax}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-slate-500">minutes</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Clock className="h-3.5 w-3.5 text-cyan-600" />
                <span>Expected arrival: <strong className="font-mono text-slate-950">{expectedArrivalClock}</strong></span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>On the Way</span>
              </span>
              <span className="text-[11px] text-slate-400">Updated 2 minutes ago</span>
            </div>
          </div>

          {/* On-Time Probability & Explain Button */}
          <div className="flex flex-col sm:items-end gap-3">
            <div className="rounded-xl bg-white border border-cyan-200 p-3 text-center sm:text-right shadow-2xs">
              <div className="flex items-center justify-between sm:justify-end gap-2 text-slate-600">
                <Target className="h-4 w-4 text-emerald-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  On-Time Probability
                </span>
              </div>
              <span className="text-2xl font-black text-emerald-700 block mt-0.5">91%</span>
              <span className="text-[10px] text-slate-500">Within predicted interval</span>
            </div>

            <button
              id="btn-explain-prediction-hero"
              onClick={() => setIsExplainModalOpen(true)}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 text-xs font-bold transition-all shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>🔍 Explain Prediction</span>
            </button>
          </div>

        </div>

        {/* Dynamic Recalculation Alert Banner */}
        <div className="mt-5 pt-4 border-t border-cyan-200/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-100 text-cyan-800 font-bold shrink-0">
              🔄
            </span>
            <span>
              <strong>ETA Updated:</strong> Your delivery time has been recalculated based on current conditions ({conditions.trafficLevel.toLowerCase()} traffic, {conditions.weatherCondition.toLowerCase().replace('_', ' ')}).
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-slate-400">Previous: <del className="font-mono">{etaRangeMin + 4}–{etaRangeMax + 5}m</del></span>
            <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
              Current: {etaRangeMin}–{etaRangeMax}m
            </span>
          </div>
        </div>

      </div>

      {/* 3. Interactive Condition Modifiers: Traffic & Weather & Kitchen Quick Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Traffic Controller */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Car className="h-3.5 w-3.5 text-amber-600" />
              Traffic Level
            </span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              {conditions.trafficLevel}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1 text-[10px] font-bold">
            {(['LOW', 'MEDIUM', 'HIGH', 'SEVERE'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => updateConditions({ trafficLevel: lvl })}
                className={`py-1 rounded-lg border text-center transition-colors ${
                  conditions.trafficLevel === lvl
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {lvl.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Weather Controller */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <CloudRain className="h-3.5 w-3.5 text-blue-600" />
              Weather Protocol
            </span>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
              {conditions.weatherCondition}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1 text-[10px] font-bold">
            {[
              { id: 'CLEAR', label: 'Clear' },
              { id: 'RAIN', label: 'Rain' },
              { id: 'HEAVY_RAIN', label: 'Heavy' },
              { id: 'STORM', label: 'Storm' }
            ].map(w => (
              <button
                key={w.id}
                onClick={() => updateConditions({ weatherCondition: w.id as any })}
                className={`py-1 rounded-lg border text-center transition-colors ${
                  conditions.weatherCondition === w.id
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        {/* Restaurant Kitchen Prep Time */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <ChefHat className="h-3.5 w-3.5 text-amber-600" />
              Kitchen Prep Time
            </span>
            <span className="text-[10px] font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
              {conditions.restaurantPrepTime || 12} min
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="4"
              max="25"
              value={conditions.restaurantPrepTime || 12}
              onChange={(e) => updateConditions({ restaurantPrepTime: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
            />
          </div>
        </div>

      </div>

      {/* 4. Dynamic ETA Progression Timeline */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-600" />
            <span className="text-xs font-bold text-slate-900 uppercase">
              Dynamic ETA Progression
            </span>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <TrendingDown className="h-3.5 w-3.5" />
            <span>ETA dynamic recalibration active</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {etaTimeline.map((pt, i) => (
            <div
              key={i}
              className={`rounded-xl p-2.5 text-center border transition-all ${
                pt.current
                  ? 'border-cyan-500 bg-cyan-50/70 shadow-xs ring-1 ring-cyan-400'
                  : 'border-slate-100 bg-slate-50/70 text-slate-500'
              }`}
            >
              <span className="text-[10px] font-mono font-bold text-slate-400 block">{pt.time}</span>
              <span className={`text-sm sm:text-base font-black mt-0.5 block ${pt.current ? 'text-cyan-900' : 'text-slate-700'}`}>
                {pt.eta} min
              </span>
              <span className="text-[9px] font-semibold text-slate-500 truncate block mt-0.5">{pt.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Deep Explanation */}
      <AIExplainPredictionModal
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
      />

    </div>
  );
};
