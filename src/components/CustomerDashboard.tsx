import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_CITIES } from '../data/cities';
import { RealisticDeliveryMap } from './RealisticDeliveryMap';
import { DeliveryTimeline } from './DeliveryTimeline';
import { AIDeliveryPredictionCard } from './AIDeliveryPredictionCard';
import { RouteBattle } from './RouteBattle';
import { AIModelPerformanceDashboard } from './AIModelPerformanceDashboard';
import { RoleSelectorBar } from './RoleSelectorBar';
import {
  Clock,
  Sparkles,
  MapPin,
  Store,
  Receipt,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  BrainCircuit,
  Car,
  CloudRain,
  Bike,
  Flame,
  ArrowRight,
  TrendingDown,
  Navigation,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { OrderStatus } from '../types';

export const CustomerDashboard: React.FC = () => {
  const {
    activeOrder,
    tracking,
    conditions,
    prediction,
    selectedCity,
    setActiveTab,
    isDeliveryCompleted,
    resetSimulation
  } = useApp();

  const cityInfo = SUPPORTED_CITIES[selectedCity] || SUPPORTED_CITIES.Vijayawada;
  const orderId = activeOrder?.id || 'ORD-8553';
  const restaurantName = activeOrder?.restaurantName || 'Spice Route Kitchen';
  const customerName = activeOrder?.customerName || 'Dilip (AI Pilot)';
  const currentStatus = activeOrder?.status || 'OUT_FOR_DELIVERY';

  const etaMinutes = isDeliveryCompleted ? 0 : (tracking?.etaMinutes ?? prediction?.predictedEtaMinutes ?? 24);
  const etaRangeMin = isDeliveryCompleted ? 0 : Math.max(1, etaMinutes - 3);
  const etaRangeMax = isDeliveryCompleted ? 0 : etaMinutes + 4;
  const confidencePercent = Math.round((prediction?.confidence || 0.92) * 100);
  const progressPercent = isDeliveryCompleted ? 100 : (tracking?.driverPosition.progress || 60);
  const distanceKm = tracking?.distanceRemainingKm ?? conditions.distanceKm;
  const speedKmh = tracking?.speedKmh ?? 32;

  // Arrival window calculation
  const now = new Date();
  const arrivalTimeMin = new Date(now.getTime() + etaRangeMin * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const arrivalTimeMax = new Date(now.getTime() + etaRangeMax * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // ETA Status (Early, On Time, Delayed)
  const getEtaStatus = () => {
    if (isDeliveryCompleted) return { label: 'Delivered', color: 'bg-emerald-100 text-emerald-950 border-emerald-300' };
    if (conditions.trafficLevel === 'SEVERE' || conditions.storeStatus === 'DELAYED') {
      return { label: 'Possible Delay (+4m)', color: 'bg-rose-100 text-rose-950 border-rose-300' };
    }
    if (conditions.trafficLevel === 'LOW' && conditions.weatherCondition === 'CLEAR') {
      return { label: 'Early Arrival (-3m)', color: 'bg-emerald-100 text-emerald-950 border-emerald-300' };
    }
    return { label: 'On Time (Guaranteed)', color: 'bg-cyan-100 text-cyan-950 border-cyan-300' };
  };

  const etaStatus = getEtaStatus();

  // Traffic delta
  const trafficMinutes = conditions.trafficLevel === 'SEVERE' ? 8 : (conditions.trafficLevel === 'HIGH' ? 5 : (conditions.trafficLevel === 'MEDIUM' ? 3 : 1));
  const prepMinutes = conditions.restaurantPrepTime || 8;
  const distanceMinutes = Math.round(conditions.distanceKm * 2.6);
  const weatherMinutes = conditions.weatherCondition === 'HEAVY_RAIN' || conditions.weatherCondition === 'STORM' ? 4 : (conditions.weatherCondition === 'RAIN' ? 2 : 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Prominent Role Selector Bar */}
      <RoleSelectorBar />

      {/* 2. Customer Hero Order Summary Banner */}
      <div className="rounded-3xl border border-orange-200/90 bg-gradient-to-br from-orange-50/95 via-amber-50/50 to-cyan-50/30 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-orange-600 text-white text-[10px] font-black uppercase px-2 py-0.5 tracking-wider">
                Order Tracking
              </span>
              <span className="font-mono text-xs font-bold text-slate-700 bg-white/80 px-2 py-0.5 rounded-md border border-orange-200">
                {orderId}
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${etaStatus.color}`}>
                ● {etaStatus.label}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              {restaurantName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 flex flex-wrap items-center gap-2">
              <span>Delivering to <strong>{customerName}</strong></span>
              <span>•</span>
              <span>Lotus Grand Residences, {cityInfo.name}</span>
            </p>
          </div>

          {/* Big ETA Countdown Highlight Box */}
          <div className="flex items-center gap-4 bg-white/90 p-4 rounded-2xl border border-orange-200 shadow-2xs backdrop-blur-md">
            <div className="text-right">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                Estimated Delivery Window
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-950 flex items-center justify-end gap-1">
                <span>{etaRangeMin}–{etaRangeMax}</span>
                <span className="text-sm font-sans font-bold text-slate-600">min</span>
              </div>
              <span className="text-[11px] font-medium text-slate-500">
                Arrival by <strong className="text-slate-800 font-bold">{arrivalTimeMin} – {arrivalTimeMax}</strong>
              </span>
            </div>

            <div className="h-10 w-px bg-slate-200 hidden sm:block" />

            <div className="hidden sm:block text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                Confidence
              </span>
              <div className="text-lg font-black text-emerald-600 font-mono">
                {confidencePercent}%
              </div>
              <span className="text-[10px] text-slate-400">ML Calibrated</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. 8-Stage Customer Delivery Progress Timeline */}
      <DeliveryTimeline />

      {/* 4. Real-Time Customer Map (Restaurant -> Rider -> Customer) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Navigation className="h-5 w-5 text-cyan-600" />
              <span>Live Delivery Journey Map</span>
            </h2>
            <p className="text-xs text-slate-500">
              Visualizing Restaurant ➔ Courier Partner (Moving) ➔ Your Doorstep
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-xl bg-slate-900 text-white text-xs font-mono font-bold px-3 py-1 flex items-center gap-1.5 shadow-2xs">
              <Bike className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
              <span>Rider Speed: {speedKmh} km/h</span>
            </span>
            <span className="rounded-xl bg-cyan-100 text-cyan-900 text-xs font-mono font-bold px-3 py-1 border border-cyan-200">
              {distanceKm} km away
            </span>
          </div>
        </div>

        {/* Realistic Delivery Map with high visibility rider marker */}
        <RealisticDeliveryMap />
      </div>

      {/* 5. "Why is my delivery taking this long?" Customer Explanation Section */}
      <div className="rounded-3xl border border-indigo-200/90 bg-gradient-to-br from-white via-indigo-50/30 to-sky-50/20 p-5 sm:p-6 shadow-sm space-y-4">
        
        <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 border border-indigo-300 px-3 py-0.5 text-[11px] font-bold text-indigo-950 mb-1">
              <Sparkles className="h-3 w-3 text-indigo-600" />
              <span>Transparent AI ETA Attribution</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight">
              Why is my delivery taking this long?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              PredictEats AI breaks down every minute in your estimated delivery time with live data.
            </p>
          </div>

          <div className="hidden sm:block text-right">
            <span className="text-xs font-bold text-slate-500">Total Predicted ETA</span>
            <div className="text-xl font-black font-mono text-indigo-950">
              ~{etaMinutes} min
            </div>
          </div>
        </div>

        {/* 5 Simple Visual Explanation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          
          {/* Card 1: Restaurant Prep */}
          <div className="rounded-2xl bg-white border border-amber-200 p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                <Store className="h-4 w-4" />
              </div>
              <span className="font-mono text-xs font-black text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                +{prepMinutes} min
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">
              Restaurant Preparation
            </h4>
            <p className="text-xs text-slate-600 leading-snug">
              Fresh cooking and packaging is taking approximately {prepMinutes} minutes.
            </p>
          </div>

          {/* Card 2: Traffic */}
          <div className="rounded-2xl bg-white border border-orange-200 p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-orange-800">
                <Car className="h-4 w-4" />
              </div>
              <span className="font-mono text-xs font-black text-orange-900 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                +{trafficMinutes} min
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">
              Live Traffic Impact
            </h4>
            <p className="text-xs text-slate-600 leading-snug">
              Current {conditions.trafficLevel.toLowerCase()} traffic adds approximately {trafficMinutes} minutes on main roads.
            </p>
          </div>

          {/* Card 3: Rider Distance */}
          <div className="rounded-2xl bg-white border border-cyan-200 p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-100 text-cyan-800">
                <Bike className="h-4 w-4" />
              </div>
              <span className="font-mono text-xs font-black text-cyan-900 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
                +{distanceMinutes} min
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">
              Rider Distance
            </h4>
            <p className="text-xs text-slate-600 leading-snug">
              Courier has {distanceKm} km remaining travelling at {speedKmh} km/h.
            </p>
          </div>

          {/* Card 4: Weather */}
          <div className="rounded-2xl bg-white border border-sky-200 p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-100 text-sky-800">
                <CloudRain className="h-4 w-4" />
              </div>
              <span className="font-mono text-xs font-black text-sky-900 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                +{weatherMinutes} min
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">
              Weather Conditions
            </h4>
            <p className="text-xs text-slate-600 leading-snug">
              {conditions.weatherCondition === 'CLEAR'
                ? 'Clear weather has zero delay impact on your delivery.'
                : `${conditions.weatherCondition.replace('_', ' ')} conditions add ~${weatherMinutes} min for safe driving.`}
            </p>
          </div>

          {/* Card 5: AI Calibration */}
          <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-600 text-white p-4 shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 text-white">
                <BrainCircuit className="h-4 w-4" />
              </div>
              <span className="font-mono text-xs font-black text-cyan-200 bg-black/20 px-2 py-0.5 rounded-md">
                {confidencePercent}%
              </span>
            </div>
            <h4 className="text-xs font-bold text-white">
              AI ML Synthesis
            </h4>
            <p className="text-xs text-cyan-100 leading-snug">
              XGBoost model cross-evaluates 15+ variables for pinpoint precision.
            </p>
          </div>

        </div>

      </div>

      {/* 6. Hero AI Delivery Prediction Card & What-If Factors */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-cyan-600" />
            <span>Interactive AI ETA Simulator &amp; Signals</span>
          </h3>
          <span className="text-xs text-slate-500">
            Adjust sliders to test live ML recalculation
          </span>
        </div>
        <AIDeliveryPredictionCard />
      </div>

      {/* 7. Route Intelligence & Model Performance */}
      <RouteBattle />
      <AIModelPerformanceDashboard />

    </div>
  );
};
