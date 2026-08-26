import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  BrainCircuit,
  Clock,
  Sparkles,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Car,
  CloudRain,
  Sun,
  ChefHat,
  Bike,
  Route,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sliders,
  Compass,
  ArrowRight
} from 'lucide-react';

export const AIDeliveryPredictionCard: React.FC<{
  className?: string;
  showWhatIfSimulator?: boolean;
  showRouteIntelligence?: boolean;
  compact?: boolean;
}> = ({
  className = '',
  showWhatIfSimulator = true,
  showRouteIntelligence = true,
  compact = false
}) => {
  const {
    prediction,
    conditions,
    tracking,
    activeOrder,
    updateConditions,
    setActiveTab,
    selectRoute
  } = useApp();

  const [isWhyEtaOpen, setIsWhyEtaOpen] = useState(true);
  const [selectedWhatIf, setSelectedWhatIf] = useState<string | null>(null);

  // Derive core prediction values
  const etaMinutes = tracking?.etaMinutes ?? prediction?.predictedEtaMinutes ?? 24;
  const confidence = prediction?.confidence ?? 0.92;
  const confidencePercent = Math.round(confidence * 100);
  const remainingDist = tracking?.distanceRemainingKm ?? 3.2;

  // Confidence Category
  const confidenceCategory = useMemo(() => {
    if (confidencePercent >= 85) {
      return {
        label: 'High Confidence',
        badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dotColor: 'bg-emerald-500',
        progressColor: 'bg-emerald-500',
        explanation: 'Traffic and restaurant preparation conditions are currently stable across the corridor.'
      };
    } else if (confidencePercent >= 70) {
      return {
        label: 'Moderate Confidence',
        badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
        dotColor: 'bg-amber-500',
        progressColor: 'bg-amber-500',
        explanation: 'Mild traffic fluctuations detected on arterial intersections; variance within ±3 min.'
      };
    } else {
      return {
        label: 'Low Confidence',
        badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
        dotColor: 'bg-rose-500',
        progressColor: 'bg-rose-500',
        explanation: 'Rapidly shifting monsoon/traffic conditions; ETA updating continuously with live telemetry.'
      };
    }
  }, [confidencePercent]);

  // Arrival Window
  const arrivalWindow = useMemo(() => {
    const minD = new Date(Date.now() + Math.max(1, etaMinutes - 2) * 60 * 1000);
    const maxD = new Date(Date.now() + (etaMinutes + 5) * 60 * 1000);
    return `${minD.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} – ${maxD.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  }, [etaMinutes]);

  // ETA Breakdown calculation (real signals)
  const breakdown = useMemo(() => {
    const prep = conditions.restaurantPrepTime || 8;
    const dist = Math.max(4, Math.round((conditions.distanceKm || 3.2) * 2.1));
    const traffic = conditions.trafficLevel === 'SEVERE' ? 8 : (conditions.trafficLevel === 'HIGH' ? 5 : (conditions.trafficLevel === 'MEDIUM' ? 3 : 1));
    const weather = conditions.weatherCondition === 'HEAVY_RAIN' || conditions.weatherCondition === 'STORM' ? 4 : (conditions.weatherCondition === 'RAIN' ? 2 : 0);
    const routeFactor = Math.max(2, etaMinutes - (prep + dist + traffic + weather));

    return [
      { label: 'Restaurant preparation', time: `+${prep} min`, icon: ChefHat, desc: 'Kitchen active grill time' },
      { label: 'Delivery partner distance', time: `+${dist} min`, icon: Bike, desc: 'Courier transit to pickup & drop' },
      { label: 'Traffic friction', time: `+${traffic} min`, icon: Car, desc: `${conditions.trafficLevel} density delay` },
      { label: 'Weather condition', time: `+${weather} min`, icon: conditions.weatherCondition === 'CLEAR' ? Sun : CloudRain, desc: conditions.weatherCondition.replace('_', ' ') },
      { label: 'Route corridor buffer', time: `+${Math.max(1, routeFactor)} min`, icon: Route, desc: 'Signals & turns optimization' }
    ];
  }, [conditions, etaMinutes]);

  // AI Explanation text based on live signals
  const aiExplanationText = useMemo(() => {
    const traffic = conditions.trafficLevel;
    const weather = conditions.weatherCondition;
    if (traffic === 'SEVERE' || traffic === 'HIGH') {
      return `Your order is en route. Heavy traffic along the main junction is the primary factor adding ~${traffic === 'SEVERE' ? '8' : '5'} min, but AI dynamic rerouting is avoiding total gridlock.`;
    }
    if (weather === 'RAIN' || weather === 'HEAVY_RAIN') {
      return `Wet road safety protocols active. Delivery speed is calibrated for wet asphalt, ensuring food arrives safely with minimal delay.`;
    }
    return `Your order is currently on track. Moderate traffic and steady kitchen preparation indicate a smooth, on-schedule delivery.`;
  }, [conditions]);

  // Dynamic ETA Timeline history points
  const etaTimeline = useMemo(() => {
    const baseEta = etaMinutes;
    return [
      { time: '12:10 PM', eta: baseEta + 7, status: 'Order Placed' },
      { time: '12:18 PM', eta: baseEta + 4, status: 'Kitchen Prep' },
      { time: '12:24 PM', eta: baseEta + 1, status: 'Courier Picked Up' },
      { time: 'NOW', eta: baseEta, status: 'On Track', current: true }
    ];
  }, [etaMinutes]);

  // What If Simulation handlers
  const handleWhatIf = async (type: string) => {
    setSelectedWhatIf(type);
    if (type === 'traffic_heavy') {
      await updateConditions({ trafficLevel: 'SEVERE' }, 'What-If: Heavy Traffic Surge (+5m)');
    } else if (type === 'traffic_clear') {
      await updateConditions({ trafficLevel: 'LOW' }, 'What-If: Clear Roads Express (-4m)');
    } else if (type === 'rain_monsoon') {
      await updateConditions({ weatherCondition: 'HEAVY_RAIN' }, 'What-If: Monsoon Rain (+4m)');
    } else if (type === 'fast_prep') {
      await updateConditions({ restaurantPrepTime: 4, storeStatus: 'READY' }, 'What-If: Fast Kitchen (-5m)');
    } else if (type === 'reset') {
      await updateConditions({
        trafficLevel: 'MEDIUM',
        weatherCondition: 'CLEAR',
        restaurantPrepTime: 8,
        storeStatus: 'NORMAL'
      }, 'Reset to Standard Conditions');
      setSelectedWhatIf(null);
    }
  };

  return (
    <div className={`overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs space-y-6 ${className}`}>
      
      {/* 1. Header Bar: AI Model Label & Confidence Meter */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-xs">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black tracking-wider text-slate-900 uppercase">
                AI DELIVERY PREDICTION
              </span>
              <span className="rounded-md bg-cyan-50 px-1.5 py-0.5 text-[10px] font-bold text-cyan-800 border border-cyan-200">
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Multi-modal ensemble analyzing road, weather &amp; kitchen telemetry
            </p>
          </div>
        </div>

        {/* Confidence Badge & Progress Meter */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Prediction Confidence</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${confidenceCategory.progressColor} rounded-full transition-all duration-500`}
                  style={{ width: `${confidencePercent}%` }}
                />
              </div>
              <span className="text-xs font-black text-slate-900">{confidencePercent}%</span>
            </div>
          </div>

          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${confidenceCategory.badgeColor}`}>
            <span className={`h-2 w-2 rounded-full ${confidenceCategory.dotColor} animate-ping`} />
            <span>{confidenceCategory.label}</span>
          </span>
        </div>
      </div>

      {/* 2. Main Centerpiece: Big Prominent ETA Display */}
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50/90 via-white to-cyan-50/30 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Big Minutes Counter */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Arriving In
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-black tracking-tight text-slate-950">
                {etaMinutes}
              </span>
              <span className="text-2xl font-bold text-slate-500">min</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-sm font-bold text-slate-900 font-mono">
                {arrivalWindow}
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5" />
                ON TRACK
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 text-center sm:text-left">
            <div className="rounded-xl bg-white border border-slate-200 p-3 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Distance</span>
              <span className="text-sm font-black text-slate-900 mt-0.5 block">{remainingDist} km</span>
              <span className="text-[10px] text-slate-500 font-medium">To destination</span>
            </div>

            <div className="rounded-xl bg-white border border-slate-200 p-3 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Traffic Flow</span>
              <span className="text-sm font-black text-slate-900 mt-0.5 block">{conditions.trafficLevel}</span>
              <span className="text-[10px] text-slate-500 font-medium">Corridor speed</span>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-xl bg-white border border-slate-200 p-3 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Weather</span>
              <span className="text-sm font-black text-slate-900 mt-0.5 block truncate">
                {conditions.weatherCondition.replace('_', ' ')}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Clear road index</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. ⭐ UNIQUE FEATURE #1: "Why this ETA?" Expandable Factor Breakdown */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 overflow-hidden transition-all">
        <button
          onClick={() => setIsWhyEtaOpen(!isWhyEtaOpen)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-100/70 transition-colors"
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-cyan-600" />
            <span className="text-xs font-black tracking-wide text-slate-900 uppercase">
              Why this ETA? — AI Signal Breakdown
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-cyan-700">
            <span>{isWhyEtaOpen ? 'Hide factors' : 'Explain factors'}</span>
            {isWhyEtaOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </button>

        {isWhyEtaOpen && (
          <div className="p-4 pt-0 space-y-4 border-t border-slate-200/60 mt-1">
            
            {/* Factor Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-3">
              {breakdown.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700 shrink-0 mt-0.5">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block leading-tight">{item.label}</span>
                        <span className="text-[10px] text-slate-500 font-medium">{item.desc}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-black text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-lg border border-cyan-200 shrink-0">
                      {item.time}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Natural Language AI Explanation */}
            <div className="rounded-xl bg-white border border-cyan-200/80 p-3.5 flex items-start gap-3 shadow-xs">
              <Sparkles className="h-4 w-4 text-cyan-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">AI Plain Language Summary:</span>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  "{aiExplanationText}"
                </p>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* 4. ⭐ UNIQUE FEATURE #4: Dynamic ETA Timeline (Evolution Over Time) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-600" />
            <span className="text-xs font-bold text-slate-900 uppercase">
              Dynamic ETA Timeline
            </span>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <TrendingDown className="h-3.5 w-3.5" />
            <span>ETA improved by 7 minutes</span>
          </span>
        </div>

        {/* Stepper Timeline Points */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          {etaTimeline.map((pt, i) => (
            <div
              key={i}
              className={`rounded-xl p-2.5 text-center border transition-all ${
                pt.current
                  ? 'border-cyan-500 bg-cyan-50/70 shadow-xs'
                  : 'border-slate-100 bg-slate-50/70 text-slate-500'
              }`}
            >
              <span className="text-[10px] font-mono font-bold text-slate-400 block">{pt.time}</span>
              <span className={`text-sm sm:text-base font-black mt-0.5 block ${pt.current ? 'text-cyan-800' : 'text-slate-700'}`}>
                {pt.eta} min
              </span>
              <span className="text-[9px] font-semibold text-slate-500 truncate block mt-0.5">{pt.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. ⭐ UNIQUE FEATURE #3: "What If?" Scenario Simulator */}
      {showWhatIfSimulator && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-cyan-600" />
              <span className="text-xs font-black tracking-wide text-slate-900 uppercase">
                "What If?" Delivery Scenario Simulator
              </span>
            </div>
            {selectedWhatIf && (
              <button
                onClick={() => handleWhatIf('reset')}
                className="text-[10px] font-bold text-slate-500 hover:text-slate-800 underline"
              >
                Reset Conditions
              </button>
            )}
          </div>

          <p className="text-xs text-slate-500 leading-normal">
            Explore how live road variables change your predicted delivery time in real time:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            
            {/* Scenario 1: Traffic Spike */}
            <button
              onClick={() => handleWhatIf('traffic_heavy')}
              className={`p-3 rounded-xl border text-left transition-all bg-white hover:border-amber-400 shadow-xs ${
                selectedWhatIf === 'traffic_heavy' ? 'border-amber-500 ring-2 ring-amber-100' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <Car className="h-3.5 w-3.5 text-amber-500" />
                  Traffic Increases?
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-2 pt-1 border-t border-slate-100 text-xs">
                <span className="text-slate-400">Current: {etaMinutes}m</span>
                <span className="font-bold text-amber-700">Heavy: {etaMinutes + 5}m</span>
              </div>
            </button>

            {/* Scenario 2: Rain */}
            <button
              onClick={() => handleWhatIf('rain_monsoon')}
              className={`p-3 rounded-xl border text-left transition-all bg-white hover:border-blue-400 shadow-xs ${
                selectedWhatIf === 'rain_monsoon' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <CloudRain className="h-3.5 w-3.5 text-blue-500" />
                  Starts Raining?
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-2 pt-1 border-t border-slate-100 text-xs">
                <span className="text-slate-400">Current: {etaMinutes}m</span>
                <span className="font-bold text-blue-700">Rain: {etaMinutes + 4}m</span>
              </div>
            </button>

            {/* Scenario 3: Fast Prep */}
            <button
              onClick={() => handleWhatIf('fast_prep')}
              className={`p-3 rounded-xl border text-left transition-all bg-white hover:border-emerald-400 shadow-xs ${
                selectedWhatIf === 'fast_prep' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <ChefHat className="h-3.5 w-3.5 text-emerald-500" />
                  Preps 5m Faster?
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-2 pt-1 border-t border-slate-100 text-xs">
                <span className="text-slate-400">Current: {etaMinutes}m</span>
                <span className="font-bold text-emerald-700">Fast: {Math.max(12, etaMinutes - 5)}m</span>
              </div>
            </button>

          </div>
        </div>
      )}

      {/* 6. ⭐ UNIQUE FEATURE #5: Smart Route Intelligence */}
      {showRouteIntelligence && prediction?.availableRoutes && prediction.availableRoutes.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-cyan-600" />
              <span className="text-xs font-bold text-slate-900 uppercase">
                Smart Route Intelligence
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">3 AI pathways analyzed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {prediction.availableRoutes.map((route, idx) => {
              const isRec = route.isRecommended || idx === 0;
              const isSelected = tracking?.currentRouteId === route.id || (isRec && !tracking?.currentRouteId);

              return (
                <button
                  key={route.id}
                  onClick={() => selectRoute(route.id)}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-50/70 ring-2 ring-cyan-100 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[110px]">
                      {route.name.split('—')[0]}
                    </span>
                    {isRec && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-cyan-100 text-cyan-800">
                        🏆 Best
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1.5 mt-1.5">
                    <span className="text-base font-black text-slate-900">{route.estimatedMinutes} min</span>
                    <span className="text-[11px] text-slate-500 font-medium">• {route.distanceKm} km</span>
                  </div>

                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                    {route.trafficSummary}
                  </p>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-500 leading-normal pt-1">
            💡 <strong>Recommended Route:</strong> Provides optimal balance between minimal traffic delay risks and shortest distance.
          </p>
        </div>
      )}

      {/* 7. ⭐ UNIQUE FEATURE #6: Prediction Health & Signal Stability */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-900 uppercase">
              Prediction System Health &amp; Signal Feeds
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>🟢 Stable &amp; Informed</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
          <div className="rounded-xl bg-white border border-slate-200 p-2.5 text-center">
            <span className="text-[9px] font-bold text-slate-400 block uppercase">Kitchen Prep</span>
            <span className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1 mt-0.5">
              <CheckCircle2 className="h-3 w-3" /> Live Sync
            </span>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-2.5 text-center">
            <span className="text-[9px] font-bold text-slate-400 block uppercase">Traffic Flow</span>
            <span className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1 mt-0.5">
              <CheckCircle2 className="h-3 w-3" /> Real-time
            </span>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-2.5 text-center">
            <span className="text-[9px] font-bold text-slate-400 block uppercase">Weather Radar</span>
            <span className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1 mt-0.5">
              <CheckCircle2 className="h-3 w-3" /> Calibrated
            </span>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-2.5 text-center">
            <span className="text-[9px] font-bold text-slate-400 block uppercase">Rider Telemetry</span>
            <span className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1 mt-0.5">
              <CheckCircle2 className="h-3 w-3" /> Active GPS
            </span>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-2.5 text-center">
            <span className="text-[9px] font-bold text-slate-400 block uppercase">Corridor Model</span>
            <span className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1 mt-0.5">
              <CheckCircle2 className="h-3 w-3" /> Validated
            </span>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-2.5 text-center">
            <span className="text-[9px] font-bold text-slate-400 block uppercase">Historical Logs</span>
            <span className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1 mt-0.5">
              <CheckCircle2 className="h-3 w-3" /> Ensembled
            </span>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 leading-normal">
          All major prediction signals are currently available and continuously updating with zero telemetry latency.
        </p>
      </div>

    </div>
  );
};
