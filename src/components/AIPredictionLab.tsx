import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AIDeliveryPredictionCard } from './AIDeliveryPredictionCard';
import { DeliveryDigitalTwin } from './DeliveryDigitalTwin';
import { RouteBattle } from './RouteBattle';
import { DecisionRoom } from './DecisionRoom';
import { AIModelPerformanceDashboard } from './AIModelPerformanceDashboard';
import { DeliveryHealthWidget } from './DeliveryHealthWidget';
import {
  BrainCircuit,
  Sliders,
  Sparkles,
  CloudRain,
  Flame,
  Sun,
  Activity,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';

export const AIPredictionLab: React.FC = () => {
  const { conditions, updateConditions, prediction, setActiveTab } = useApp();
  const [activeTab, setActiveSubTab] = useState<'SIMULATOR' | 'ARCHITECTURE' | 'BENCHMARKS' | 'SHAP'>('SIMULATOR');

  const applyScenario = async (scenario: 'storm' | 'kitchen' | 'sprint') => {
    if (scenario === 'storm') {
      await updateConditions({
        trafficLevel: 'SEVERE',
        weatherCondition: 'HEAVY_RAIN',
        distanceKm: 6.8,
        restaurantPrepTime: 15
      }, 'Monsoon Storm Gridlock');
    } else if (scenario === 'kitchen') {
      await updateConditions({
        trafficLevel: 'MEDIUM',
        weatherCondition: 'CLEAR',
        restaurantPrepTime: 24,
        storeStatus: 'DELAYED'
      }, 'Kitchen Dinner Rush Surge');
    } else if (scenario === 'sprint') {
      await updateConditions({
        trafficLevel: 'LOW',
        weatherCondition: 'CLEAR',
        distanceKm: 2.8,
        restaurantPrepTime: 6,
        storeStatus: 'READY'
      }, 'Optimal Clear Sprint');
    }
  };

  return (
    <div id="ai-prediction-lab-view" className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-200 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 p-6 sm:p-8 text-white shadow-md">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 px-3 py-1 text-xs font-bold text-cyan-300">
            <Cpu className="h-3.5 w-3.5" />
            <span>PredictEats AI Core Engine • Gradient Boosted Telemetry</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            AI Prediction Lab &amp; ML Architecture
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            Explore how multi-modal machine learning replaces static delivery countdowns by continuously modeling kitchen prep loads, road surface friction, weather physics, and courier telemetry.
          </p>

          {/* Quick Scenario Triggers */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-bold">Inject Live Scenario:</span>
            <button
              onClick={() => applyScenario('storm')}
              className="rounded-xl border border-rose-500/40 bg-rose-950/60 hover:bg-rose-900/80 px-3 py-1 text-xs font-bold text-rose-300 transition-colors flex items-center gap-1"
            >
              <span>🌧️</span> Heavy Storm (+5m)
            </button>
            <button
              onClick={() => applyScenario('kitchen')}
              className="rounded-xl border border-amber-500/40 bg-amber-950/60 hover:bg-amber-900/80 px-3 py-1 text-xs font-bold text-amber-300 transition-colors flex items-center gap-1"
            >
              <span>🍕</span> Kitchen Surge (+8m)
            </button>
            <button
              onClick={() => applyScenario('sprint')}
              className="rounded-xl border border-emerald-500/40 bg-emerald-950/60 hover:bg-emerald-900/80 px-3 py-1 text-xs font-bold text-emerald-300 transition-colors flex items-center gap-1"
            >
              <span>☀️</span> Clear Sprint (-4m)
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('SIMULATOR')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'SIMULATOR'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Live Prediction &amp; Physics Map
        </button>
        <button
          onClick={() => setActiveSubTab('ARCHITECTURE')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'ARCHITECTURE'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Model Architecture
        </button>
        <button
          onClick={() => setActiveSubTab('BENCHMARKS')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'BENCHMARKS'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Benchmarks &amp; Accuracy
        </button>
        <button
          onClick={() => setActiveSubTab('SHAP')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'SHAP'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          SHAP Factor Attribution
        </button>
      </div>

      {/* Tab 1: Live Prediction & Physics */}
      {activeTab === 'SIMULATOR' && (
        <div className="space-y-6">
          <AIDeliveryPredictionCard />
          <DeliveryDigitalTwin />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <RouteBattle />
            </div>
            <div className="lg:col-span-5">
              <DeliveryHealthWidget />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Model Architecture */}
      {activeTab === 'ARCHITECTURE' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Layers className="h-5 w-5 text-cyan-600" />
              <span>How PredictEats AI Estimates Arrival Times</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50/50 space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 font-black">
                  1
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Kitchen Prep State Machine</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Analyzes dish complexity (e.g. slow handi dum biryani vs quick fried roll) and live kitchen surge queue to forecast exact handoff timestamps.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50/50 space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600 font-black">
                  2
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Corridor Traffic &amp; Weather</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Dynamic transit modeling factoring in real-time road chokepoints, rain surface friction coefficients, and vehicle telemetry.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50/50 space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 font-black">
                  3
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Continuous Kalman Recalculation</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Re-evaluates remaining travel time every 5 seconds. If a monsoon cloudburst or traffic block is encountered, users receive transparent recalculation notices.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-cyan-50/70 border border-cyan-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-black text-cyan-950 text-sm">Ready to test in real food ordering?</h4>
                <p className="text-xs text-cyan-800">Add dishes to your cart and experience live AI predictions from order to doorstep.</p>
              </div>
              <button
                onClick={() => setActiveTab('HOME')}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-xs transition-colors whitespace-nowrap"
              >
                Go to Food Homepage →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Benchmarks */}
      {activeTab === 'BENCHMARKS' && (
        <div className="space-y-6">
          <AIModelPerformanceDashboard />
        </div>
      )}

      {/* Tab 4: SHAP Attribution */}
      {activeTab === 'SHAP' && (
        <div className="space-y-6">
          <DecisionRoom />
        </div>
      )}

    </div>
  );
};
