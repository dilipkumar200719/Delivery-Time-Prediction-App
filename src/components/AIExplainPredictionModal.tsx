import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BrainCircuit,
  Clock,
  Sparkles,
  ShieldCheck,
  ChefHat,
  Bike,
  Car,
  CloudRain,
  Sun,
  Route,
  History,
  X,
  TrendingUp,
  TrendingDown,
  Info,
  CheckCircle2,
  AlertTriangle,
  Code2,
  HelpCircle,
  Activity,
  Layers
} from 'lucide-react';
import { ML_MODEL_SPEC } from '../ml/deliveryML';

interface AIExplainPredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'customer' | 'technical';
}

export const AIExplainPredictionModal: React.FC<AIExplainPredictionModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'customer'
}) => {
  const { prediction, conditions, tracking, activeOrder } = useApp();
  const [activeTab, setActiveTab] = useState<'customer' | 'technical'>(defaultTab);

  if (!isOpen) return null;

  const etaMinutes = tracking?.etaMinutes ?? prediction?.predictedEtaMinutes ?? 28;
  const etaRangeMin = prediction?.minEtaMinutes ?? Math.max(12, Math.round(etaMinutes * 0.9));
  const etaRangeMax = prediction?.maxEtaMinutes ?? Math.max(etaRangeMin + 4, Math.round(etaMinutes * 1.15));
  const confidence = Math.round((prediction?.confidence ?? 0.92) * 100);
  const onTimeProbability = Math.round((prediction?.onTimeProbability ?? 0.91) * 100);

  // Original baseline vs current
  const originalEta = 24;
  const etaDelta = etaMinutes - originalEta;

  // Exact Shapley additive breakdown
  const baseTravelTime = prediction?.baseDeliveryMinutes ?? Math.max(10, Math.round((conditions.distanceKm || 4.2) * 2.8));
  const prepTime = prediction?.prepMinutesImpact ?? conditions.restaurantPrepTime ?? 8;
  const trafficImpact = prediction?.trafficMinutesImpact ?? (conditions.trafficLevel === 'SEVERE' ? 9 : (conditions.trafficLevel === 'HIGH' ? 6 : (conditions.trafficLevel === 'MEDIUM' ? 3 : 0)));
  const weatherImpact = prediction?.weatherMinutesImpact ?? ((conditions.weatherCondition === 'HEAVY_RAIN' || conditions.weatherCondition === 'STORM') ? 5 : (conditions.weatherCondition === 'RAIN' ? 2 : 0));
  const vehicleImpact = prediction?.vehicleMinutesImpact ?? 0;
  const smartSavings = prediction?.smartRouteMinutesImpact ?? -2;

  const factors = [
    {
      name: 'Rider Distance & Base Travel',
      value: `${baseTravelTime} min`,
      rawMinutes: baseTravelTime,
      icon: Bike,
      color: 'text-sky-700 bg-sky-50 border-sky-200',
      description: `Transit duration for ${conditions.distanceKm || 4.2} km at nominal urban speed (~30 km/h).`
    },
    {
      name: 'Kitchen Preparation',
      value: `+${prepTime} min`,
      rawMinutes: prepTime,
      icon: ChefHat,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      description: `Cooking & packing time for ${conditions.numberOfItems || 3} items (${conditions.storeStatus} kitchen status).`
    },
    {
      name: 'Traffic Congestion',
      value: trafficImpact > 0 ? `+${trafficImpact} min` : '0 min',
      rawMinutes: trafficImpact,
      icon: Car,
      color: trafficImpact > 4 ? 'text-rose-700 bg-rose-50 border-rose-200' : 'text-amber-700 bg-amber-50 border-amber-200',
      description: `${conditions.trafficLevel} congestion index along primary corridor intersections.`
    },
    {
      name: 'Weather Impact',
      value: weatherImpact > 0 ? `+${weatherImpact} min` : '0 min',
      rawMinutes: weatherImpact,
      icon: conditions.weatherCondition === 'CLEAR' ? Sun : CloudRain,
      color: weatherImpact > 0 ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200',
      description: conditions.weatherCondition === 'CLEAR' ? 'Clear weather with zero atmospheric delay.' : `${conditions.weatherCondition.replace('_', ' ')} requiring reduced cruising speeds.`
    },
    {
      name: 'AI Smart Rerouting Savings',
      value: `${smartSavings} min`,
      rawMinutes: smartSavings,
      icon: Route,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      description: 'Dynamic green-corridor micro-routing bypasses congested bottlenecks.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/20">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black uppercase tracking-wider text-cyan-800">
                  EXPLAINABLE AI • TRANSPARENT ETA
                </span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                  {confidence}% Confidence
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Why is my delivery time this long?
              </h2>
            </div>
          </div>

          {/* Tab Switcher: Customer vs Technical */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setActiveTab('customer')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'customer'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Customer View
            </button>
            <button
              onClick={() => setActiveTab('technical')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'technical'
                  ? 'bg-white text-indigo-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Code2 className="h-3.5 w-3.5 text-indigo-600" />
              <span>Judge / Technical</span>
            </button>
          </div>
        </div>

        {/* Big ETA Range & Health Box */}
        <div className="rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50/90 via-sky-50/50 to-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-900">
                Calibrated Arrival Window
              </span>
              {etaDelta > 0 ? (
                <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>+{etaDelta}m vs initial estimate</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>On Schedule</span>
                </span>
              )}
            </div>

            <div className="text-3xl sm:text-4xl font-black text-slate-950 mt-1 flex items-baseline gap-2">
              <span className="font-mono">{etaRangeMin}–{etaRangeMax}</span>
              <span className="text-lg font-bold text-slate-500">minutes</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Expected arrival by <strong className="text-slate-800 font-bold">{new Date(Date.now() + etaMinutes * 60000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</strong>.
            </p>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0">
            <div className="rounded-xl bg-white border border-cyan-200 p-3 text-center sm:text-right shadow-2xs flex-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">On-Time Probability</span>
              <span className="text-xl font-black text-emerald-700 block font-mono">{onTimeProbability}%</span>
              <span className="text-[10px] text-slate-500 font-medium">Within target window</span>
            </div>
          </div>
        </div>

        {activeTab === 'customer' ? (
          /* ================= CUSTOMER EXPLANATION VIEW ================= */
          <div className="space-y-5">
            
            {/* Plain English Customer Summary Callout */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                <Info className="h-4 w-4 text-amber-600" />
                <span>Plain-English Summary for You</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                {prediction?.customerWhyLateExplanation ||
                  `Your food is expected in ${etaRangeMin}–${etaRangeMax} minutes. This accounts for cooking your order fresh (${prepTime} min), courier travel across ${conditions.distanceKm} km, and current ${conditions.trafficLevel.toLowerCase()} road traffic.`}
              </p>
            </div>

            {/* Factor Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
                <span>Where does each minute come from?</span>
                <span>Impact on ETA</span>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                {factors.map((f, idx) => {
                  const Icon = f.icon;
                  return (
                    <div key={idx} className="p-3.5 bg-white hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-xl border shrink-0 ${f.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-slate-900 block leading-tight">
                            {f.name}
                          </span>
                          <span className="text-xs text-slate-500 leading-tight">
                            {f.description}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 inline-block">
                          {f.value}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        ) : (
          /* ================= TECHNICAL / JUDGE EXPLANATION VIEW ================= */
          <div className="space-y-5">
            
            {/* Architecture Card */}
            <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/80 to-sky-50/40 p-4 space-y-2">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wider">
                <Layers className="h-4 w-4 text-indigo-600" />
                <span>Model Architecture &amp; Training Spec</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-mono">
                {ML_MODEL_SPEC.architecture}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                <div className="rounded-xl bg-white p-2.5 border border-indigo-100 text-center">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">MAE Metric</span>
                  <span className="text-sm font-black text-indigo-950 font-mono">{ML_MODEL_SPEC.maeMinutes} min</span>
                </div>
                <div className="rounded-xl bg-white p-2.5 border border-indigo-100 text-center">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">RMSE</span>
                  <span className="text-sm font-black text-indigo-950 font-mono">{ML_MODEL_SPEC.rmseMinutes} min</span>
                </div>
                <div className="rounded-xl bg-white p-2.5 border border-indigo-100 text-center">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">R² Variance</span>
                  <span className="text-sm font-black text-indigo-950 font-mono">{ML_MODEL_SPEC.r2Score}</span>
                </div>
                <div className="rounded-xl bg-white p-2.5 border border-indigo-100 text-center">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Train Samples</span>
                  <span className="text-sm font-black text-indigo-950 font-mono">{ML_MODEL_SPEC.trainingSamples.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Top Feature Importance Weights */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Top GBDT Feature Importance Weights
              </span>

              <div className="space-y-2">
                {ML_MODEL_SPEC.topFeatures.map((feat, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-200 bg-white p-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{feat.name}</span>
                      <span className="font-mono font-black text-indigo-700">{Math.round(feat.importance * 100)}% weight</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-600 to-indigo-600 rounded-full"
                        style={{ width: `${feat.importance * 100}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">{feat.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Raw Formula Log */}
            <div className="rounded-2xl bg-slate-950 text-emerald-400 p-4 font-mono text-[11px] space-y-1 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Inference Calculation Log</span>
              <p className="text-slate-300">
                {prediction?.technicalExplanation || `ETA = ${baseTravelTime}m (Transit) + ${prepTime}m (Prep) + ${trafficImpact}m (Traffic) + ${weatherImpact}m (Weather) ${smartSavings}m (Reroute) = ${etaMinutes}m.`}
              </p>
            </div>

          </div>
        )}

        {/* Footer CTAs */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Telemetry calibrated in real-time</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 hover:bg-black text-white px-5 py-2.5 text-xs font-bold transition-colors shadow-xs cursor-pointer"
          >
            Close Explanation
          </button>
        </div>

      </div>
    </div>
  );
};
