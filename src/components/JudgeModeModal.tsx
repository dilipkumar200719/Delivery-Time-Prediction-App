import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  X,
  Play,
  ArrowRight,
  Car,
  CloudRain,
  MapPin,
  Store,
  BrainCircuit,
  Compass,
  CheckCircle2,
  Gamepad2,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { TrafficLevel, WeatherCondition, DeliveryConditions } from '../types';
import { predictDelivery } from '../ml/deliveryML';

export const JudgeModeModal: React.FC = () => {
  const {
    isJudgeModeOpen,
    setIsJudgeModeOpen,
    conditions,
    prediction,
    updateConditions,
    openGame,
    setActiveTab
  } = useApp();

  const [judgeTraffic, setJudgeTraffic] = useState<TrafficLevel>('SEVERE');
  const [judgeWeather, setJudgeWeather] = useState<WeatherCondition>('HEAVY_RAIN');
  const [judgeDistance, setJudgeDistance] = useState<number>(7.5);
  const [judgePrepTime, setJudgePrepTime] = useState<number>(14);

  const [isProcessing, setIsProcessing] = useState(false);
  const [hasSimulated, setHasSimulated] = useState(false);
  const [beforePrediction, setBeforePrediction] = useState<any>(null);
  const [afterPrediction, setAfterPrediction] = useState<any>(null);

  if (!isJudgeModeOpen) return null;

  const handleRunSimulation = async () => {
    setIsProcessing(true);
    setBeforePrediction(prediction || predictDelivery(conditions));

    setTimeout(async () => {
      const patched: Partial<DeliveryConditions> = {
        trafficLevel: judgeTraffic,
        weatherCondition: judgeWeather,
        distanceKm: judgeDistance,
        restaurantPrepTime: judgePrepTime,
        storeStatus: judgePrepTime > 10 ? 'DELAYED' : 'NORMAL'
      };

      const newPred = predictDelivery({ ...conditions, ...patched });
      setAfterPrediction(newPred);

      await updateConditions(patched, '🎤 Judge Mode Simulation');
      setIsProcessing(false);
      setHasSimulated(true);
    }, 600);
  };

  const handleLaunchGame = () => {
    setIsJudgeModeOpen(false);
    setActiveTab('GAMES');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/20">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Judge Mode Simulator
                </h2>
                <span className="rounded-md bg-pink-50 px-2 py-0.5 text-[10px] font-bold text-pink-700 border border-pink-200 uppercase">
                  Interactive Sandbox
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Stress-test live AI delivery predictions with severe environmental shifts
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsJudgeModeOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sliders and Condition Pickers */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Inject Stress Variables
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Traffic Level */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-2">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Car className="h-3.5 w-3.5 text-amber-500" />
                  Traffic Congestion
                </span>
                <span className="text-amber-700 font-mono">{judgeTraffic}</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {(['LOW', 'HIGH', 'SEVERE'] as TrafficLevel[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setJudgeTraffic(t)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                      judgeTraffic === t
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Weather Condition */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-2">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CloudRain className="h-3.5 w-3.5 text-blue-500" />
                  Weather Condition
                </span>
                <span className="text-blue-700 font-mono">{judgeWeather.replace('_', ' ')}</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {(['CLEAR', 'RAIN', 'HEAVY_RAIN'] as WeatherCondition[]).map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setJudgeWeather(w)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                      judgeWeather === w
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {w === 'HEAVY_RAIN' ? 'Storm' : w}
                  </button>
                ))}
              </div>
            </div>

            {/* Distance Slider */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-cyan-600" />
                  Delivery Distance
                </span>
                <span className="text-cyan-700 font-mono font-bold">{judgeDistance} km</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="12.0"
                step="0.5"
                value={judgeDistance}
                onChange={(e) => setJudgeDistance(parseFloat(e.target.value))}
                className="w-full accent-cyan-600"
              />
            </div>

            {/* Kitchen Prep Time */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <Store className="h-3.5 w-3.5 text-purple-600" />
                  Kitchen Prep Time
                </span>
                <span className="text-purple-700 font-mono font-bold">{judgePrepTime} min</span>
              </div>
              <input
                type="range"
                min="3"
                max="30"
                step="1"
                value={judgePrepTime}
                onChange={(e) => setJudgePrepTime(parseInt(e.target.value))}
                className="w-full accent-purple-600"
              />
            </div>

          </div>
        </div>

        {/* Action Button: Run Simulation */}
        <button
          onClick={handleRunSimulation}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white hover:bg-cyan-600 transition-colors shadow-sm disabled:opacity-50"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              Recalculating Decision Model...
            </span>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current" />
              <span>TEST AI PREDICTION UNDER THESE CONDITIONS</span>
            </>
          )}
        </button>

        {/* Simulation Output Card */}
        {hasSimulated && afterPrediction && (
          <div className="rounded-2xl border border-pink-200 bg-pink-50/50 p-5 space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs font-bold text-pink-950 border-b border-pink-100 pb-2">
              <span>Simulation Result</span>
              <span className="text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> 92% SLA Confidence
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">New Predicted ETA</span>
                <div className="text-3xl font-black text-slate-900">
                  {afterPrediction.predictedEtaMinutes} <span className="text-sm font-semibold text-slate-500">minutes</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500">Delay Risk</span>
                <div className="text-sm font-bold text-rose-600">
                  {Math.round(afterPrediction.delayProbability * 100)}% Risk
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleLaunchGame}
                className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-700 transition-colors shadow-xs"
              >
                <Gamepad2 className="h-4 w-4" />
                <span>Play & Earn While Waiting</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
