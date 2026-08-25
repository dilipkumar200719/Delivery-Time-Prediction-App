import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Zap,
  MapPin,
  Clock,
  CloudRain,
  Car,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  Compass,
  Layers,
  Play
} from 'lucide-react';
import { TrafficLevel, WeatherCondition, VehicleType } from '../types';

export const PredictorHero: React.FC = () => {
  const {
    conditions,
    prediction,
    predictNow,
    updateConditions,
    createOrderAndStartSimulation,
    setIsJudgeModeOpen,
    setIsFutureViewOpen
  } = useApp();

  const [isPredicting, setIsPredicting] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<number>(0);

  const handlePredictClick = async () => {
    setIsPredicting(true);
    setPipelineStep(1);

    // Neural pipeline animation steps
    setTimeout(() => setPipelineStep(2), 250);
    setTimeout(() => setPipelineStep(3), 500);
    setTimeout(() => setPipelineStep(4), 750);
    setTimeout(async () => {
      await predictNow();
      setPipelineStep(5);
      setTimeout(() => {
        setIsPredicting(false);
        setPipelineStep(0);
      }, 600);
    }, 1000);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'ON_TIME':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'POSSIBLE_DELAY':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'HIGH_DELAY':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default:
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 p-5 sm:p-8 shadow-2xl backdrop-blur-xl">
      
      {/* Background Neural Grid Pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#082f4915_1px,transparent_1px),linear-gradient(to_bottom,#082f4915_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute -top-24 -right-24 -z-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 -z-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      {/* Top Banner Tagline & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
            AI Multi-Factor Delivery Intelligence Engine
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Model Version:</span>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            GB-v2.4 [Scikit Regression + Multi-Class Ensemble]
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
        
        {/* Left Column: One-Tap Prediction Launch & Condition Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Real-Time <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">Delivery Twin</span> & ETA AI
            </h1>
            <p className="mt-2 text-sm text-slate-400 max-w-xl leading-relaxed">
              Trained on multi-modal weather, traffic density, route chokepoints, and kitchen backlogs. Predicts precise arrival times and explains every factor with mathematical transparency.
            </p>
          </div>

          {/* Quick Input Parameters Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            
            {/* Distance */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-cyan-400" /> Distance</span>
                <span className="font-mono font-bold text-white">{conditions.distanceKm} km</span>
              </div>
              <input
                id="param-distance-slider"
                type="range"
                min="1.0"
                max="12.0"
                step="0.5"
                value={conditions.distanceKm}
                onChange={(e) => updateConditions({ distanceKm: parseFloat(e.target.value) }, 'Distance changed')}
                className="mt-2 w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Traffic */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span className="flex items-center gap-1"><Car className="h-3.5 w-3.5 text-amber-400" /> Traffic</span>
              </div>
              <select
                id="param-traffic-select"
                value={conditions.trafficLevel}
                onChange={(e) => updateConditions({ trafficLevel: e.target.value as TrafficLevel }, 'Traffic update')}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-2 py-1 text-xs font-semibold text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="LOW">Low (Smooth)</option>
                <option value="MEDIUM">Medium (Normal)</option>
                <option value="HIGH">High (Congested)</option>
                <option value="SEVERE">Severe (Gridlock)</option>
              </select>
            </div>

            {/* Weather */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span className="flex items-center gap-1"><CloudRain className="h-3.5 w-3.5 text-blue-400" /> Weather</span>
              </div>
              <select
                id="param-weather-select"
                value={conditions.weatherCondition}
                onChange={(e) => updateConditions({ weatherCondition: e.target.value as WeatherCondition }, 'Weather update')}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-2 py-1 text-xs font-semibold text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="CLEAR">Clear Sky</option>
                <option value="CLOUDY">Overcast</option>
                <option value="RAIN">Moderate Rain</option>
                <option value="HEAVY_RAIN">Heavy Downpour</option>
                <option value="STORM">Thunderstorm</option>
              </select>
            </div>

            {/* Vehicle Type */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5 text-emerald-400" /> Vehicle</span>
              </div>
              <select
                id="param-vehicle-select"
                value={conditions.vehicleType}
                onChange={(e) => updateConditions({ vehicleType: e.target.value as VehicleType }, 'Vehicle switched')}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-2 py-1 text-xs font-semibold text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="BIKE">Standard Bike</option>
                <option value="SCOOTER">Scooter</option>
                <option value="EV_BIKE">EV Swift Bike</option>
                <option value="CAR">City Car</option>
              </select>
            </div>

          </div>

          {/* SIGNATURE FEATURE #9: ONE-TAP PREDICTION BUTTON */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              id="btn-predict-my-delivery"
              onClick={handlePredictClick}
              disabled={isPredicting}
              className="relative flex-1 group overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 p-[2px] font-bold text-white shadow-xl shadow-cyan-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75"
            >
              <div className="flex items-center justify-center gap-3 rounded-[14px] bg-slate-950/90 px-6 py-4 transition-colors group-hover:bg-transparent">
                <Sparkles className={`h-5 w-5 text-cyan-300 ${isPredicting ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} />
                <span className="text-base sm:text-lg font-black tracking-wide uppercase">
                  {isPredicting ? 'AI Evaluating Corridors...' : '✨ PREDICT MY DELIVERY'}
                </span>
                <span className="rounded-full bg-cyan-400/20 px-2.5 py-0.5 text-xs font-mono text-cyan-200 border border-cyan-400/30">
                  1-TAP AI
                </span>
              </div>
            </button>

            {/* Start Live Simulation Button */}
            <button
              id="btn-start-simulation"
              onClick={() => createOrderAndStartSimulation()}
              className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/90 px-5 py-4 text-sm font-bold text-slate-200 hover:border-cyan-500/50 hover:bg-slate-800 transition-all shadow-md"
            >
              <Play className="h-4 w-4 text-emerald-400 fill-emerald-400" />
              <span>Simulate Delivery</span>
            </button>
          </div>

          {/* Neural Pipeline Animation State */}
          {isPredicting && (
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3 font-mono text-xs text-cyan-300 animate-pulse">
              <div className="flex items-center justify-between">
                <span>
                  {pipelineStep === 1 && '📍 Ingesting spatial coordinates & distance...'}
                  {pipelineStep === 2 && '🌦 Evaluating weather drag & roadway waterlogging...'}
                  {pipelineStep === 3 && '🚦 Computing dynamic corridor congestion metrics...'}
                  {pipelineStep === 4 && '🧠 Running GradientBoost regression & risk classification...'}
                  {pipelineStep === 5 && '✅ ETA & Optimal Route calculated!'}
                </span>
                <span className="text-[10px] text-cyan-400/70">{pipelineStep * 20}%</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
                  style={{ width: `${pipelineStep * 20}%` }}
                />
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Prominent Futuristic ETA Display & Metrics */}
        <div className="lg:col-span-5">
          <div className="relative overflow-hidden rounded-2xl border border-cyan-500/40 bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 shadow-xl shadow-cyan-500/10">
            
            {/* Glowing Accent */}
            <div className="absolute top-0 right-0 h-32 w-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                Predicted Arrival ETA
              </span>
              <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${getStatusColor(prediction?.deliveryStatus)}`}>
                {prediction?.deliveryStatus === 'ON_TIME' && <CheckCircle2 className="h-3 w-3" />}
                {prediction?.deliveryStatus === 'POSSIBLE_DELAY' && <AlertTriangle className="h-3 w-3" />}
                {prediction?.deliveryStatus === 'HIGH_DELAY' && <ShieldAlert className="h-3 w-3" />}
                {prediction?.deliveryStatus?.replace('_', ' ') || 'ON TIME'}
              </span>
            </div>

            {/* Giant ETA Typography */}
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-6xl sm:text-7xl font-black tracking-tight text-white font-mono drop-shadow-[0_0_20px_rgba(6,182,212,0.35)]">
                {prediction?.predictedEtaMinutes ?? 18}
              </span>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-cyan-400">MINUTES</span>
                <span className="text-xs text-slate-400">estimated time</span>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-800/80 pt-4">
              
              {/* Delay Probability */}
              <div className="rounded-lg bg-slate-900/80 p-2 text-center border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Delay Prob</span>
                <span className="text-base font-bold font-mono text-amber-400">
                  {Math.round((prediction?.delayProbability ?? 0.18) * 100)}%
                </span>
              </div>

              {/* Risk Score */}
              <div className="rounded-lg bg-slate-900/80 p-2 text-center border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Risk Score</span>
                <span className={`text-base font-bold font-mono ${
                  (prediction?.riskScore ?? 21) > 60 ? 'text-rose-400' : ((prediction?.riskScore ?? 21) > 35 ? 'text-amber-400' : 'text-emerald-400')
                }`}>
                  {prediction?.riskScore ?? 21} <span className="text-[10px] text-slate-500">/100</span>
                </span>
              </div>

              {/* Confidence */}
              <div className="rounded-lg bg-slate-900/80 p-2 text-center border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Confidence</span>
                <span className="text-base font-bold font-mono text-cyan-400">
                  {Math.round((prediction?.confidence ?? 0.88) * 100)}%
                </span>
              </div>

            </div>

            {/* Recommended Route Pill & Future View Quick Launch */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 rounded-xl bg-cyan-950/40 p-3 border border-cyan-500/20">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Compass className="h-4 w-4 text-cyan-400" />
                <span className="font-semibold">{prediction?.recommendedRoute?.name || 'Route C — AI Smart Arterial'}</span>
              </div>
              <button
                id="btn-see-future-view"
                onClick={() => setIsFutureViewOpen(true)}
                className="flex items-center gap-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 px-2.5 py-1 text-xs font-bold text-cyan-300 border border-cyan-400/30 transition-colors"
              >
                <span>🔮 Future View</span>
              </button>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};
