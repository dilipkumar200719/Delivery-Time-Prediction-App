import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BrainCircuit,
  CloudRain,
  Car,
  Store,
  Navigation,
  User,
  Zap,
  BatteryCharging,
  Gauge,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  AlertOctagon,
  TrendingDown,
  Compass,
  MapPin,
  Activity,
  HeartHandshake
} from 'lucide-react';
import { RealisticDeliveryMap } from './RealisticDeliveryMap';

export const DeliveryDigitalTwin: React.FC = () => {
  const {
    activeOrder,
    tracking,
    conditions,
    prediction,
    toggleSimulationPlayPause,
    setSimulationSpeed,
    resetSimulation,
    updateConditions,
    selectRoute
  } = useApp();

  const progress = tracking?.driverPosition?.progress ?? 28;
  const currentSpeed = tracking?.speedKmh ?? 28;
  const remainingDist = tracking?.distanceRemainingKm ?? 2.9;
  const eta = tracking?.etaMinutes ?? 18;
  const isPaused = tracking?.isPaused ?? false;
  const simSpeed = tracking?.simulationSpeed ?? 1;
  const battery = tracking?.batteryLevel ?? 85;
  const deliveryHealth = tracking?.deliveryHealth ?? prediction?.deliveryHealthScore ?? 87;
  const riskScore = tracking?.riskScore ?? prediction?.riskScore ?? 18;

  // Selected route
  const activeRoute = prediction?.availableRoutes.find(r => r.id === tracking?.currentRouteId) || prediction?.recommendedRoute;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs space-y-6">
      
      {/* Top Header: Title & Simulation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-600 animate-ping" />
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 flex items-center gap-2">
              <BrainCircuit className="h-6 w-6 text-cyan-600" />
              AI Delivery Digital Twin
            </h2>
            <span className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-[11px] font-mono font-bold text-cyan-800 border border-cyan-200">
              LIVE SIMULATION
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time cyber-physical simulation synchronizing environmental nodes with virtual courier trajectory in Hyderabad
          </p>
        </div>

        {/* Playback Controls & Speed */}
        <div className="flex items-center gap-2">
          <button
            id="twin-play-pause-btn"
            onClick={toggleSimulationPlayPause}
            className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all ${
              isPaused
                ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                : 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            {isPaused ? <Play className="h-3.5 w-3.5 fill-current" /> : <Pause className="h-3.5 w-3.5 fill-current" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          <button
            id="twin-reset-btn"
            onClick={resetSimulation}
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            title="Restart Simulation Run"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>

          {/* Speed Multipliers */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5 text-xs">
            {[1, 2, 5, 10].map((s) => (
              <button
                key={s}
                onClick={() => setSimulationSpeed(s)}
                className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-colors ${
                  simSpeed === s
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Centerpiece: Real Interactive Leaflet Map */}
      <RealisticDeliveryMap heightClass="h-[520px] sm:h-[600px]" />

      {/* Bottom Telemetry & Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Metric 1: ETA & Distance */}
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-900 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-cyan-600" />
            Predicted Arrival
          </span>
          <div className="flex items-baseline justify-between pt-1">
            <div className="text-2xl sm:text-3xl font-black text-cyan-950">
              {eta} <span className="text-sm font-semibold text-cyan-700">mins</span>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                {remainingDist} km left
              </div>
            </div>
          </div>
        </div>

        {/* Metric 2: Speed & Battery */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5 text-cyan-600" />
            Courier Velocity
          </span>
          <div className="flex items-baseline justify-between pt-1">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {currentSpeed} <span className="text-sm font-normal text-slate-500">km/h</span>
            </div>
            <div className="text-right text-xs font-bold text-emerald-600 flex items-center gap-1">
              <BatteryCharging className="h-3.5 w-3.5" />
              <span>{battery}% EV</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Delivery Health Score */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-emerald-600" />
            Delivery Health
          </span>
          <div className="flex items-baseline justify-between pt-1">
            <div className="text-2xl sm:text-3xl font-black text-emerald-700">
              {deliveryHealth}<span className="text-sm text-slate-500 font-semibold">/100</span>
            </div>
            <div className="text-right text-xs font-bold text-slate-600">
              {deliveryHealth >= 75 ? '🟢 Optimal' : (deliveryHealth >= 50 ? '🟡 Moderate' : '🔴 At Risk')}
            </div>
          </div>
        </div>

        {/* Metric 4: Risk Index */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
            Transit Friction
          </span>
          <div className="flex items-baseline justify-between pt-1">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {riskScore}<span className="text-sm text-slate-500 font-semibold">%</span>
            </div>
            <div className="text-right text-xs font-bold text-slate-600">
              {conditions.trafficLevel} Traffic
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

