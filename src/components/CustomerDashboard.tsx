import React from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_CITIES } from '../data/cities';
import { RealisticDeliveryMap } from './RealisticDeliveryMap';
import { DeliveryTimeline } from './DeliveryTimeline';
import { AIDeliveryPredictionCard } from './AIDeliveryPredictionCard';
import { RouteBattle } from './RouteBattle';
import { AIModelPerformanceDashboard } from './AIModelPerformanceDashboard';
import { RoleSelectorBar } from './RoleSelectorBar';
import { CustomerOtpNotification } from './CustomerOtpNotification';
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
  Sliders,
  KeyRound
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const {
    activeOrder,
    tracking,
    conditions,
    prediction,
    selectedCity,
    setActiveTab,
    isDeliveryCompleted,
    isWaitingForOtp,
    setIsOtpModalOpen,
    resetSimulation
  } = useApp();

  const cityInfo = SUPPORTED_CITIES[selectedCity] || SUPPORTED_CITIES.Vijayawada;
  const orderId = activeOrder?.id || 'ORD-8553';
  const restaurantName = activeOrder?.restaurantName || 'Spice Route Kitchen';
  const customerName = activeOrder?.customerName || 'Dilip (AI Pilot)';
  const currentStatus = activeOrder?.status || 'OUT_FOR_DELIVERY';
  const deliveryOtp = activeOrder?.deliveryOtp || '8553';

  const etaMinutes = isDeliveryCompleted ? 0 : (tracking?.etaMinutes ?? prediction?.predictedEtaMinutes ?? 28);
  const etaRangeMin = prediction?.minEtaMinutes ?? (isDeliveryCompleted ? 0 : Math.max(1, etaMinutes - 3));
  const etaRangeMax = prediction?.maxEtaMinutes ?? (isDeliveryCompleted ? 0 : etaMinutes + 4);
  const confidencePercent = Math.round((prediction?.confidence || 0.92) * 100);
  const distanceKm = tracking?.distanceRemainingKm ?? conditions.distanceKm;
  const speedKmh = tracking?.speedKmh ?? 32;

  // Arrival window calculation
  const now = new Date();
  const arrivalTimeMin = new Date(now.getTime() + etaRangeMin * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const arrivalTimeMax = new Date(now.getTime() + etaRangeMax * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // ETA Status
  const getEtaStatus = () => {
    if (isDeliveryCompleted) return { label: 'Delivered', color: 'bg-emerald-100 text-emerald-950 border-emerald-300' };
    if (isWaitingForOtp) return { label: 'Arrived • Waiting for OTP', color: 'bg-amber-100 text-amber-950 border-amber-300 animate-pulse' };
    if (conditions.trafficLevel === 'SEVERE' || conditions.storeStatus === 'DELAYED') {
      return { label: 'Possible Delay (+4m)', color: 'bg-rose-100 text-rose-950 border-rose-300' };
    }
    if (conditions.trafficLevel === 'LOW' && conditions.weatherCondition === 'CLEAR') {
      return { label: 'Early Arrival (-3m)', color: 'bg-emerald-100 text-emerald-950 border-emerald-300' };
    }
    return { label: 'On Time (Guaranteed)', color: 'bg-cyan-100 text-cyan-950 border-cyan-300' };
  };

  const etaStatus = getEtaStatus();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Prominent Role Selector Bar */}
      <RoleSelectorBar />

      {/* 1.5. Prominent Top Customer OTP Notification Banner */}
      <CustomerOtpNotification />

      {/* 2. Customer Hero Order Summary Banner */}
      <div className="rounded-3xl border border-cyan-200/90 bg-gradient-to-br from-cyan-50/95 via-sky-50/50 to-blue-50/30 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-cyan-700 text-white text-[10px] font-black uppercase px-2 py-0.5 tracking-wider">
                Active Order Tracking
              </span>
              <span className="font-mono text-xs font-bold text-slate-700 bg-white/80 px-2 py-0.5 rounded-md border border-cyan-200">
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

          {/* OTP Quick Verification Box or ETA Highlight Box */}
          {isWaitingForOtp ? (
            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border-2 border-amber-400 shadow-md animate-in fade-in">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                  Delivery OTP
                </span>
                <span className="font-mono text-2xl font-black text-slate-900 tracking-wider">
                  {deliveryOtp}
                </span>
                <span className="text-[10px] text-slate-500 block">Share with rider</span>
              </div>
              <button
                id="btn-customer-enter-otp-hero"
                onClick={() => setIsOtpModalOpen(true)}
                className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2.5 text-xs font-black hover:from-amber-600 hover:to-orange-700 transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>ENTER OTP</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 bg-white/90 p-4 rounded-2xl border border-cyan-200 shadow-2xs backdrop-blur-md">
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
          )}

        </div>
      </div>

      {/* STEP 1: 7-Stage Customer Delivery Progress Timeline */}
      <DeliveryTimeline />

      {/* STEP 2-10: Main AI ETA Prediction Suite */}
      <AIDeliveryPredictionCard />

      {/* Live Customer Map: Restaurant -> Rider -> Customer */}
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

        {/* Realistic Delivery Map */}
        <RealisticDeliveryMap />
      </div>

      {/* Route Battle & Model Performance Dashboards */}
      <RouteBattle />
      <AIModelPerformanceDashboard />

    </div>
  );
};
