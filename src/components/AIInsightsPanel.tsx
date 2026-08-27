import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BrainCircuit,
  Car,
  CloudRain,
  ChefHat,
  ShieldCheck,
  Zap,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Sun,
  Activity,
  Sliders,
  CheckCircle2,
  TrendingUp,
  Award,
  AlertTriangle,
  Info,
  Timer
} from 'lucide-react';
import { AIExplainPredictionModal } from './AIExplainPredictionModal';

export const AIInsightsPanel: React.FC<{ className?: string }> = ({ className = '' }) => {
  const {
    conditions,
    updateConditions,
    prediction,
    tracking,
    activeOrder
  } = useApp();

  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);

  const etaMinutes = tracking?.etaMinutes ?? prediction?.predictedEtaMinutes ?? 28;
  const etaRangeMin = Math.max(12, Math.round(etaMinutes * 0.9));
  const etaRangeMax = Math.max(etaRangeMin + 4, Math.round(etaMinutes * 1.15));
  const confidence = Math.round((prediction?.confidence ?? 0.92) * 100);

  const reliabilityScore = 94; // 94/100 Excellent Reliability
  const onTimeProb = 91; // 91%

  return (
    <div className={`overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs space-y-8 ${className}`}>
      
      {/* 1. Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/20">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                  AI INSIGHTS &amp; EVALUATION
                </span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  94/100 Reliability Score ⭐
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                AI Delivery Intelligence Engine
              </h2>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsExplainModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-xs"
        >
          <Sparkles className="h-4 w-4" />
          <span>Explain Current Prediction</span>
        </button>
      </div>

      {/* 2. End-to-End AI Pipeline Visualization */}
      <div className="rounded-2xl border border-cyan-200 bg-gradient-to-b from-cyan-50/70 to-white p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-cyan-950 flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-cyan-600" />
            5-Stage AI Inference Pipeline
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Active Real-Time Pipeline
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            { step: '1', title: 'Input Signals', desc: 'Distance, weather, traffic & kitchen load', icon: Sliders },
            { step: '2', title: 'Feature Extraction', desc: 'Normalized speed, friction & wait vectors', icon: Activity },
            { step: '3', title: 'Range Prediction', desc: `${etaRangeMin}–${etaRangeMax} min predicted window`, icon: BrainCircuit },
            { step: '4', title: 'Explainability', desc: 'Additive Shapley attribution factor bars', icon: Sparkles },
            { step: '5', title: 'Dynamic Recalibration', desc: 'Auto-adapts to live route chokepoints', icon: RotateCcw }
          ].map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="rounded-xl border border-cyan-100 bg-white p-3 space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="flex h-5 w-5 rounded-full bg-cyan-600 text-white text-[10px] font-bold items-center justify-center">
                    {s.step}
                  </span>
                  <Icon className="h-3.5 w-3.5 text-cyan-600" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">
                  {s.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Interactive Simulators: Traffic & Weather Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Simulator A: Traffic Impact */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-amber-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                🚦 Traffic Impact Simulator
              </h4>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Active: {conditions.trafficLevel}
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Select traffic congestion intensity to see real-time recalculation of ETA and confidence:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { level: 'LOW', label: 'Low Flow', eta: '24 min', delay: '0m', color: 'border-emerald-300 bg-emerald-50 text-emerald-800' },
              { level: 'MEDIUM', label: 'Medium', eta: '29 min', delay: '+3m', color: 'border-amber-300 bg-amber-50 text-amber-800' },
              { level: 'HIGH', label: 'Heavy', eta: '38 min', delay: '+6m', color: 'border-orange-300 bg-orange-50 text-orange-800' },
              { level: 'SEVERE', label: 'Gridlock', eta: '46 min', delay: '+9m', color: 'border-rose-300 bg-rose-50 text-rose-800' }
            ].map((t) => {
              const isCurrent = conditions.trafficLevel === t.level;
              return (
                <button
                  key={t.level}
                  onClick={() => updateConditions({ trafficLevel: t.level as any })}
                  className={`rounded-xl border p-2.5 text-center transition-all ${
                    isCurrent
                      ? `${t.color} ring-2 ring-cyan-500 font-bold shadow-xs`
                      : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="text-[11px] block font-bold">{t.label}</span>
                  <span className="text-xs font-black block mt-0.5">~{t.eta}</span>
                  <span className="text-[10px] text-slate-400 block">{t.delay} delay</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Simulator B: Weather Impact */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CloudRain className="h-4 w-4 text-blue-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                🌦️ Weather Impact Simulator
              </h4>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Active: {conditions.weatherCondition}
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Simulate precipitation and monsoon conditions to trigger safety deceleration rules:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { cond: 'CLEAR', label: 'Clear Skies', impact: '0 min', icon: Sun, color: 'border-emerald-300 bg-emerald-50 text-emerald-800' },
              { cond: 'RAIN', label: 'Light Rain', impact: '+4 min', icon: CloudRain, color: 'border-blue-300 bg-blue-50 text-blue-800' },
              { cond: 'HEAVY_RAIN', label: 'Heavy Rain', impact: '+9 min', icon: CloudRain, color: 'border-indigo-300 bg-indigo-50 text-indigo-800' },
              { cond: 'STORM', label: 'Storm', impact: '+14 min', icon: CloudRain, color: 'border-purple-300 bg-purple-50 text-purple-800' }
            ].map((w) => {
              const isCurrent = conditions.weatherCondition === w.cond;
              const Icon = w.icon;
              return (
                <button
                  key={w.cond}
                  onClick={() => updateConditions({ weatherCondition: w.cond as any })}
                  className={`rounded-xl border p-2.5 text-center transition-all ${
                    isCurrent
                      ? `${w.color} ring-2 ring-cyan-500 font-bold shadow-xs`
                      : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 mx-auto mb-1 opacity-80" />
                  <span className="text-[11px] block font-bold">{w.label}</span>
                  <span className="text-[10px] text-slate-500 block">{w.impact}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* 4. Two Key AI Evaluation Components: Restaurant Prep + AI Reliability Score */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Component 1: AI Restaurant Preparation Estimate */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-amber-600" />
              <h4 className="text-sm font-bold text-slate-900">
                👨‍🍳 AI Food Preparation Estimate
              </h4>
            </div>
            <span className="font-mono text-sm font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
              {conditions.restaurantPrepTime || 12} minutes
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Formula: <strong className="text-slate-800 font-mono">Total ETA = Preparation + Pickup + Travel + Traffic + Weather Adjustments</strong>
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600 bg-slate-50 p-2 rounded-lg">
              <span>Ordered Items Count:</span>
              <span className="font-bold text-slate-900">{conditions.numberOfItems || 3} items</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 bg-slate-50 p-2 rounded-lg">
              <span>Cuisine Category:</span>
              <span className="font-bold text-slate-900">Biryani &amp; Tandoor (Fresh Handi)</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 bg-slate-50 p-2 rounded-lg">
              <span>Kitchen Workload &amp; Live Queue:</span>
              <span className="font-bold text-emerald-700">Optimal (4 active tickets)</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 bg-slate-50 p-2 rounded-lg">
              <span>Historical Prep Deviation:</span>
              <span className="font-bold text-slate-900">±1.2 min from average</span>
            </div>
          </div>
        </div>

        {/* Component 2: AI Delivery Reliability & On-Time Probability */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-600" />
              <h4 className="text-sm font-bold text-slate-900">
                🧠 AI Delivery Reliability Score
              </h4>
            </div>
            <span className="font-mono text-sm font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
              {reliabilityScore} / 100 — Excellent
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>🎯 On-Time Delivery Probability</span>
                <span className="text-emerald-700">{onTimeProb}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${onTimeProb}%` }} />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                High probability of arriving within the predicted {etaRangeMin}–{etaRangeMax} min window.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Restaurant Reliability</span>
                <span className="font-bold text-slate-900">96% on-schedule</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Rider Availability</span>
                <span className="font-bold text-slate-900">Assigned (Rahul K.)</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Traffic Stability</span>
                <span className="font-bold text-slate-900">92% Corridor score</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Weather Friction</span>
                <span className="font-bold text-emerald-700">Safe clearance</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 5. What Affects Your Delivery Time Panel */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-cyan-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            What affects your delivery time? (Feature Weights)
          </h4>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { factor: 'Distance', impact: 'HIGH', color: 'bg-rose-50 text-rose-700 border-rose-200' },
            { factor: 'Traffic', impact: 'HIGH', color: 'bg-rose-50 text-rose-700 border-rose-200' },
            { factor: 'Weather', impact: 'MEDIUM', color: 'bg-amber-50 text-amber-700 border-amber-200' },
            { factor: 'Restaurant Prep', impact: 'MEDIUM', color: 'bg-amber-50 text-amber-700 border-amber-200' },
            { factor: 'Rider Availability', impact: 'LOW', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            { factor: 'Historical Patterns', impact: 'HIGH', color: 'bg-rose-50 text-rose-700 border-rose-200' }
          ].map((f, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-2.5 text-center shadow-2xs">
              <span className="text-xs font-bold text-slate-900 block truncate">{f.factor}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-block mt-1 ${f.color}`}>
                {f.impact} IMPACT
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Integration */}
      <AIExplainPredictionModal
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
      />

    </div>
  );
};
