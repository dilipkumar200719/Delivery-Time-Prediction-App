import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  BrainCircuit,
  Clock,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Car,
  CloudRain,
  Sun,
  Wind,
  Thermometer,
  AlertTriangle,
  Compass,
  Zap,
  Activity
} from 'lucide-react';

export const DeliveryIntelligenceCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { tracking, conditions, prediction } = useApp();

  const etaMinutes = tracking?.etaMinutes ?? prediction?.predictedEtaMinutes ?? 18;
  const remainingDist = tracking?.distanceRemainingKm ?? 2.8;
  const deliveryHealth = tracking?.deliveryHealth ?? prediction?.deliveryHealthScore ?? 88;
  const riskScore = tracking?.riskScore ?? prediction?.riskScore ?? 18;

  // Active route
  const activeRoute = useMemo(() => {
    return (
      prediction?.availableRoutes.find(r => r.id === tracking?.currentRouteId) ||
      prediction?.recommendedRoute ||
      prediction?.availableRoutes[0]
    );
  }, [prediction, tracking?.currentRouteId]);

  // Compute realistic clock time for arrival
  const arrivalClockTime = useMemo(() => {
    const d = new Date(Date.now() + etaMinutes * 60 * 1000);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }, [etaMinutes]);

  const arrivalWindow = useMemo(() => {
    const minD = new Date(Date.now() + Math.max(1, etaMinutes - 2) * 60 * 1000);
    const maxD = new Date(Date.now() + (etaMinutes + 4) * 60 * 1000);
    return `${minD.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} – ${maxD.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  }, [etaMinutes]);

  // Traffic status calculation
  const trafficLevel = conditions.trafficLevel;
  const trafficDelayMin = trafficLevel === 'SEVERE' ? 9 : (trafficLevel === 'HIGH' ? 6 : (trafficLevel === 'MEDIUM' ? 3 : 0));
  
  // Weather status calculation
  const weather = conditions.weatherCondition;
  const isRain = weather === 'RAIN' || weather === 'HEAVY_RAIN' || weather === 'STORM';
  const weatherTemp = isRain ? 23 : 29;
  const rainProb = weather === 'STORM' ? 95 : (weather === 'HEAVY_RAIN' ? 85 : (weather === 'RAIN' ? 60 : 15));
  const weatherImpact = isRain ? 'Moderate Impact (+4 min)' : 'Low Impact (Optimal)';

  return (
    <div className={`overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-6 ${className}`}>
      
      {/* 1. Header with Smart ETA & Clock */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Smart ETA Intelligence</span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>Arriving at {arrivalClockTime}</span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              </h3>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 border border-emerald-200">
            In ~{etaMinutes} mins
          </span>
          <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border border-slate-200">
            {remainingDist} km away
          </span>
        </div>
      </div>

      {/* 2. Natural Language AI Logistics Summary */}
      <div className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-900">
            <BrainCircuit className="h-4 w-4 text-cyan-600" />
            <span>AI Logistics Insight</span>
          </div>
          <span className="text-[11px] font-bold text-cyan-700 bg-white px-2 py-0.5 rounded-lg border border-cyan-200">
            94% Route Efficiency
          </span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          Your delivery from <strong className="font-semibold text-slate-900">Spice Route Kitchen</strong> is advancing smoothly along the <strong className="font-semibold text-slate-900">{activeRoute?.name?.split('—')[0] || 'Knowledge City Corridor'}</strong>. 
          {trafficLevel === 'SEVERE' || trafficLevel === 'HIGH' 
            ? ` Traffic is congested on main arteries (+${trafficDelayMin}m friction), but AI dynamic rerouting is bypassing major bottlenecks.`
            : ` Traffic flow is steady across the corridor (${trafficLevel.toLowerCase()}).`}
          {isRain ? ' Wet road protocol active with safe braking distance.' : ' Weather conditions are favorable with zero precipitation delay.'}
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-medium text-slate-500">
          <span>Expected Arrival Window: <strong className="font-mono font-bold text-slate-800">{arrivalWindow}</strong></span>
          <span>•</span>
          <span>Health: <strong className="font-bold text-emerald-700">{deliveryHealth}/100</strong></span>
        </div>
      </div>

      {/* 3. Side-by-Side: Live Traffic Intelligence & Weather-Aware Delivery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Traffic Intelligence Card */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-bold text-slate-800">Traffic on Route</span>
            </div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${
              trafficLevel === 'SEVERE' ? 'bg-rose-50 text-rose-700 border-rose-200' :
              trafficLevel === 'HIGH' ? 'bg-amber-50 text-amber-800 border-amber-200' :
              trafficLevel === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-200' :
              'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {trafficLevel === 'LOW' ? 'Normal Flow' : `${trafficLevel} Traffic`}
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Expected Delay:</span>
              <span className="font-bold text-slate-900">
                {trafficDelayMin > 0 ? `+${trafficDelayMin} min delay` : 'No delay (0 min)'}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>HITEC Corridor Junction:</span>
              <span className={`font-semibold ${trafficLevel === 'SEVERE' ? 'text-rose-600' : 'text-emerald-700'}`}>
                {trafficLevel === 'SEVERE' ? 'Heavy 🔴' : (trafficLevel === 'HIGH' || trafficLevel === 'MEDIUM' ? 'Moderate 🟡' : 'Flowing 🟢')}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Knowledge City Express:</span>
              <span className="font-semibold text-emerald-700">Clear Green 🟢</span>
            </div>
          </div>
        </div>

        {/* Weather-Aware Delivery Card */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isRain ? <CloudRain className="h-4 w-4 text-blue-500" /> : <Sun className="h-4 w-4 text-amber-500" />}
              <span className="text-xs font-bold text-slate-800">Weather Condition</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
              {weather.replace(/_/g, ' ')} • {weatherTemp}°C
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Rain Probability:</span>
              <span className="font-bold text-slate-900">{rainProb}%</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Wind Velocity:</span>
              <span className="font-bold text-slate-900">12 km/h</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Delivery Impact:</span>
              <span className={`font-semibold ${isRain ? 'text-blue-700' : 'text-emerald-700'}`}>
                {weatherImpact}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
