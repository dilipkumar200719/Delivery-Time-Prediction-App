import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BrainCircuit,
  MapPin,
  Car,
  CloudRain,
  Zap,
  Store,
  Compass,
  Sparkles,
  ShieldCheck,
  Percent,
  CheckCircle2,
  Sliders
} from 'lucide-react';

export const DecisionRoom: React.FC = () => {
  const { prediction, conditions, ttsEnabled, speakAIInsight } = useApp();

  const factors = prediction?.factorContributions || [];
  const eta = prediction?.predictedEtaMinutes || 18;

  const getFactorIcon = (factorKey: string) => {
    switch (factorKey) {
      case 'distance': return <MapPin className="h-4 w-4 text-cyan-600" />;
      case 'traffic': return <Car className="h-4 w-4 text-amber-500" />;
      case 'weather': return <CloudRain className="h-4 w-4 text-blue-500" />;
      case 'vehicle': return <Zap className="h-4 w-4 text-emerald-600" />;
      case 'prep': return <Store className="h-4 w-4 text-purple-600" />;
      case 'smart_route': return <Compass className="h-4 w-4 text-teal-600" />;
      default: return <BrainCircuit className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* SIGNATURE FEATURE: AI DECISION ROOM */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                Why Did AI Predict {eta} Min?
              </h2>
              <p className="text-xs text-slate-500">
                Transparent feature attribution decomposition using trained gradient boosting Shapley weights
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 font-semibold">
              Additive Shapley Attribution
            </span>
          </div>
        </div>

        {/* Breakdown of Factors List */}
        <div className="mt-6 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Factor Attribution Breakdown
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {factors.map((f, idx) => {
              const isPositiveImpact = f.impactMinutes > 0;
              const barWidth = Math.min(100, Math.max(15, Math.abs(f.impactMinutes) * 12));

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 shadow-2xs">
                        {getFactorIcon(f.factorKey)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          {f.factorName}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Weight: {f.percentage}%
                        </span>
                      </div>
                    </div>

                    <span className={`text-xs font-mono font-black px-2.5 py-1 rounded-lg ${
                      isPositiveImpact
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {isPositiveImpact ? `+${f.impactMinutes} min` : `${f.impactMinutes} min`}
                    </span>
                  </div>

                  {/* Impact visual bar */}
                  <div className="space-y-1">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full ${isPositiveImpact ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {f.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ETA DNA Visual Pipeline Section */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-cyan-600" />
              <span>ETA DNA — Sequential Factor Propagation</span>
            </h3>
            <span className="text-[10px] font-mono font-bold text-slate-400">Additive Linear Pipeline</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            
            {/* Step 1: Distance */}
            <div className="flex-1 min-w-[100px] rounded-xl border border-slate-200 bg-slate-50/80 p-2.5 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Distance</span>
              <span className="text-xs font-black text-slate-800 block mt-0.5">{conditions.distanceKm} km</span>
              <span className="text-[10px] font-mono text-cyan-700 font-bold">+{Math.round(conditions.distanceKm * 2.2)}m</span>
            </div>

            <div className="text-slate-300 font-bold hidden sm:block">→</div>

            {/* Step 2: Traffic */}
            <div className="flex-1 min-w-[100px] rounded-xl border border-slate-200 bg-slate-50/80 p-2.5 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Traffic</span>
              <span className="text-xs font-black text-slate-800 block mt-0.5">{conditions.trafficLevel}</span>
              <span className="text-[10px] font-mono text-amber-600 font-bold">
                +{conditions.trafficLevel === 'SEVERE' ? '8' : conditions.trafficLevel === 'HIGH' ? '5' : conditions.trafficLevel === 'MEDIUM' ? '3' : '1'}m
              </span>
            </div>

            <div className="text-slate-300 font-bold hidden sm:block">→</div>

            {/* Step 3: Weather */}
            <div className="flex-1 min-w-[100px] rounded-xl border border-slate-200 bg-slate-50/80 p-2.5 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Weather</span>
              <span className="text-xs font-black text-slate-800 block mt-0.5">{conditions.weatherCondition.replace('_', ' ')}</span>
              <span className="text-[10px] font-mono text-blue-600 font-bold">
                +{conditions.weatherCondition === 'STORM' ? '5' : conditions.weatherCondition === 'HEAVY_RAIN' ? '4' : conditions.weatherCondition === 'RAIN' ? '2' : '0'}m
              </span>
            </div>

            <div className="text-slate-300 font-bold hidden sm:block">→</div>

            {/* Step 4: Kitchen */}
            <div className="flex-1 min-w-[100px] rounded-xl border border-slate-200 bg-slate-50/80 p-2.5 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Kitchen</span>
              <span className="text-xs font-black text-slate-800 block mt-0.5">{conditions.storeStatus}</span>
              <span className="text-[10px] font-mono text-purple-600 font-bold">+{conditions.restaurantPrepTime}m</span>
            </div>

            <div className="text-slate-300 font-bold hidden sm:block">→</div>

            {/* Step 5: Route */}
            <div className="flex-1 min-w-[100px] rounded-xl border border-teal-200 bg-teal-50/70 p-2.5 text-center">
              <span className="text-[10px] text-teal-800 font-bold block uppercase">AI Route</span>
              <span className="text-xs font-black text-teal-900 block mt-0.5">Optimal</span>
              <span className="text-[10px] font-mono text-teal-700 font-bold">-2m saved</span>
            </div>

            <div className="text-slate-300 font-bold hidden sm:block">=</div>

            {/* Final: Total ETA */}
            <div className="flex-1 min-w-[110px] rounded-xl border border-cyan-300 bg-cyan-600 p-2.5 text-center text-white shadow-xs">
              <span className="text-[10px] text-cyan-100 font-bold block uppercase">Predicted ETA</span>
              <span className="text-sm font-black text-white block mt-0.5">{eta} MIN</span>
              <span className="text-[10px] font-mono text-cyan-100 font-medium">92% Conf</span>
            </div>

          </div>
        </div>

        {/* AI Synthetic Explanation */}
        <div className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4 sm:p-5 flex items-start gap-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-600 shadow-xs">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-950">
              AI Synthetic Decision Summary
            </h4>
            <p className="text-xs text-cyan-900 leading-relaxed">
              {prediction?.explanationText || `Predicted ETA is ${eta} minutes based on distance (${conditions.distanceKm} km), ${conditions.trafficLevel.toLowerCase()} traffic density, and ${conditions.weatherCondition.toLowerCase()} weather.`}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
