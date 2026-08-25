import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  MapPin,
  Clock,
  ShieldCheck,
  Zap,
  CloudRain,
  Flame,
  Sun
} from 'lucide-react';

export const CustomerHero: React.FC = () => {
  const {
    prediction,
    conditions,
    setActiveTab,
    updateConditions,
    predictNow,
    setIsJudgeModeOpen,
    activeOrder
  } = useApp();

  const handlePredictClick = async () => {
    await predictNow();
    setActiveTab('TWIN');
  };

  const handleExploreClick = () => {
    const catalogEl = document.getElementById('food-catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const applyPreset = async (presetName: string) => {
    if (presetName === 'storm_traffic') {
      await updateConditions({
        trafficLevel: 'SEVERE',
        weatherCondition: 'HEAVY_RAIN',
        distanceKm: 6.8,
        restaurantPrepTime: 14
      }, '⚡ Monsoon Storm & Traffic Gridlock');
    } else if (presetName === 'kitchen_surge') {
      await updateConditions({
        trafficLevel: 'MEDIUM',
        weatherCondition: 'CLEAR',
        restaurantPrepTime: 22,
        storeStatus: 'DELAYED'
      }, '🍕 Kitchen Peak Surge Delay');
    } else if (presetName === 'sunny_sprint') {
      await updateConditions({
        trafficLevel: 'LOW',
        weatherCondition: 'CLEAR',
        distanceKm: 3.2,
        restaurantPrepTime: 6,
        storeStatus: 'READY'
      }, '☀️ Clear Sprint Express Corridor');
    }
  };

  const currentEta = prediction?.predictedEtaMinutes || 18;
  const confidencePercent = Math.round((prediction?.confidence || 0.92) * 100);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-50/80 via-white to-white p-6 sm:p-10 shadow-xs">
      
      {/* Background Decorative Accent */}
      <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-cyan-100/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -z-10 h-64 w-64 rounded-full bg-blue-50/60 blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: Hero Copy & Actions */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 border border-cyan-200 px-3 py-1 text-xs font-bold text-cyan-800">
            <Sparkles className="h-3.5 w-3.5 text-cyan-600" />
            <span>Next-Gen Predictive Delivery Intelligence</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 leading-[1.15]">
              Your food is on the way. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
                Now see exactly WHY.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
              AI predicts your delivery time using traffic, weather, restaurant preparation, route conditions and courier signals.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              id="hero-cta-predict"
              onClick={handlePredictClick}
              className="flex items-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 text-sm font-bold text-white hover:bg-cyan-700 shadow-md shadow-cyan-600/20 transition-all hover:translate-y-[-1px]"
            >
              <BrainCircuit className="h-4 w-4" />
              <span>PREDICT MY DELIVERY</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              id="hero-cta-explore"
              onClick={handleExploreClick}
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs"
            >
              <span>EXPLORE FOOD</span>
            </button>
          </div>

          {/* Quick Scenario Preset Pills */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Simulate Conditions:
            </span>
            <button
              onClick={() => applyPreset('storm_traffic')}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-colors"
            >
              <CloudRain className="h-3.5 w-3.5 text-blue-500" />
              <span>Monsoon Storm</span>
            </button>
            <button
              onClick={() => applyPreset('kitchen_surge')}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-colors"
            >
              <Flame className="h-3.5 w-3.5 text-amber-500" />
              <span>Kitchen Surge</span>
            </button>
            <button
              onClick={() => applyPreset('sunny_sprint')}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-colors"
            >
              <Sun className="h-3.5 w-3.5 text-emerald-500" />
              <span>Clear Sprint</span>
            </button>
          </div>

        </div>

        {/* Right: Small AI Prediction Visualization Card */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-wider text-slate-900 uppercase">
                  AI Delivery Prediction
                </span>
              </div>
              <span className="text-[11px] font-semibold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                Live Twin Model
              </span>
            </div>

            {/* ETA Big Display */}
            <div className="flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                    {currentEta}
                  </span>
                  <span className="text-lg font-bold text-slate-500">min</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Estimated Arrival Time
                </p>
              </div>

              <div className="text-right">
                <div className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>{confidencePercent}% confidence</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Multi-modal ensemble</p>
              </div>
            </div>

            {/* Live Factors Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-2.5">
                <div className="text-[11px] text-slate-500 font-medium">Traffic Density</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${
                    conditions.trafficLevel === 'SEVERE' ? 'bg-rose-500' :
                    conditions.trafficLevel === 'HIGH' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  {conditions.trafficLevel === 'LOW' ? 'Normal / Clear' : conditions.trafficLevel}
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-2.5">
                <div className="text-[11px] text-slate-500 font-medium">Weather Condition</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${
                    conditions.weatherCondition === 'HEAVY_RAIN' || conditions.weatherCondition === 'STORM' ? 'bg-blue-600' : 'bg-emerald-500'
                  }`} />
                  {conditions.weatherCondition.replace('_', ' ')}
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-2.5">
                <div className="text-[11px] text-slate-500 font-medium">Kitchen Status</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${
                    conditions.storeStatus === 'DELAYED' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  {conditions.storeStatus === 'READY' ? 'Fast' : (conditions.storeStatus === 'DELAYED' ? 'Surge Load' : 'Normal Prep')}
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-2.5">
                <div className="text-[11px] text-slate-500 font-medium">Route Path</div>
                <div className="text-xs font-bold text-emerald-700 mt-0.5 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Optimal AI Corridor ⭐
                </div>
              </div>
            </div>

            {/* Quick Live Link */}
            <button
              onClick={() => setActiveTab('TWIN')}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <span>View Interactive Digital Twin Map</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

          </div>
        </div>

      </div>

    </section>
  );
};
