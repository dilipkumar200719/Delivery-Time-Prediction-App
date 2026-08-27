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
import { DeliveryTimeline } from './DeliveryTimeline';
import { DeliveryPartnerCard } from './DeliveryPartnerCard';
import { AIDeliveryPredictionCard } from './AIDeliveryPredictionCard';
import { DeliveryIntelligenceCard } from './DeliveryIntelligenceCard';
import { DeliveryAlertsFeed } from './DeliveryAlertsFeed';
import { PaymentDetailsCard } from './PaymentDetailsCard';
import { AIInsightsPanel } from './AIInsightsPanel';
import { RouteBattle } from './RouteBattle';
import { AIModelPerformanceDashboard } from './AIModelPerformanceDashboard';

export const DeliveryDigitalTwin: React.FC = () => {
  const {
    activeOrder,
    tracking,
    conditions,
    prediction,
    toggleSimulationPlayPause,
    setSimulationSpeed,
    resetSimulation
  } = useApp();

  const progress = tracking?.driverPosition?.progress ?? 28;
  const currentSpeed = tracking?.speedKmh ?? 28;
  const remainingDist = tracking?.distanceRemainingKm ?? 2.8;
  const eta = tracking?.etaMinutes ?? 18;
  const isPaused = tracking?.isPaused ?? false;
  const simSpeed = tracking?.simulationSpeed ?? 1;
  const battery = tracking?.batteryLevel ?? 85;
  const deliveryHealth = tracking?.deliveryHealth ?? prediction?.deliveryHealthScore ?? 87;
  const riskScore = tracking?.riskScore ?? prediction?.riskScore ?? 18;

  return (
    <div className="space-y-6">
      
      {/* 1. Top Hero: Live Status & Simulation Controls */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-600 animate-ping" />
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 flex items-center gap-2">
                <BrainCircuit className="h-6 w-6 text-cyan-600" />
                Live Logistics Tracking &amp; Delivery Twin
              </h2>
              <span className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-[11px] font-mono font-bold text-cyan-800 border border-cyan-200">
                LIVE TELEMETRY
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Autonomous logistics intelligence engine tracking order <strong className="text-slate-800 font-mono">#ORD-8553</strong> from Spice Route Kitchen to Gachibowli
            </p>
          </div>

          {/* Playback Controls & Speed Multipliers */}
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

        {/* Feature 1: Live Delivery Status Timeline */}
        <div className="pt-5">
          <DeliveryTimeline />
        </div>

        {/* Centerpiece: Real Interactive Leaflet Map */}
        <div className="pt-6">
          <RealisticDeliveryMap heightClass="h-[480px] sm:h-[580px]" />
        </div>

        {/* Telemetry Quick Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-5">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Courier Velocity</span>
            <div className="text-xl font-black text-slate-900 mt-0.5 flex items-baseline gap-1">
              <span>{currentSpeed}</span>
              <span className="text-xs font-normal text-slate-500">km/h</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">EV Battery Level</span>
            <div className="text-xl font-black text-emerald-700 mt-0.5 flex items-baseline gap-1">
              <span>{battery}%</span>
              <span className="text-xs font-semibold text-emerald-600">Ather EV</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Delivery Health</span>
            <div className="text-xl font-black text-slate-900 mt-0.5 flex items-baseline gap-1">
              <span>{deliveryHealth}</span>
              <span className="text-xs font-normal text-slate-400">/100</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Transit Friction</span>
            <div className="text-xl font-black text-slate-900 mt-0.5 flex items-baseline gap-1">
              <span>{riskScore}%</span>
              <span className="text-xs font-semibold text-slate-500">{conditions.trafficLevel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Structured Logistics Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Delivery Partner Card + Smart Alerts + Payment & Order Details */}
        <div className="lg:col-span-5 space-y-6">
          <DeliveryPartnerCard />
          <DeliveryAlertsFeed />
          <PaymentDetailsCard />
        </div>

        {/* Right Column: AI Delivery Prediction (Hero Feature) + What-If & AI Insights */}
        <div className="lg:col-span-7 space-y-6">
          <AIDeliveryPredictionCard />
          <AIInsightsPanel />
          <DeliveryIntelligenceCard />
        </div>

      </div>

      {/* 3. Route Intelligence & Multi-Corridor Analysis */}
      <RouteBattle />

      {/* 4. Model Performance & Validation Benchmark */}
      <AIModelPerformanceDashboard />

    </div>
  );
};
