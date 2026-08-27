import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_CITIES } from '../data/cities';
import { RealisticDeliveryMap } from './RealisticDeliveryMap';
import { RouteBattle } from './RouteBattle';
import { RoleSelectorBar } from './RoleSelectorBar';
import {
  Bike,
  Navigation,
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  CloudRain,
  Car,
  Compass,
  ArrowRight,
  Battery,
  Award,
  Sparkles,
  KeyRound,
  DollarSign,
  Receipt,
  User,
  Store,
  ChevronRight,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { OrderStatus } from '../types';

export const RiderDashboard: React.FC = () => {
  const {
    activeOrder,
    tracking,
    conditions,
    prediction,
    selectedCity,
    updateConditions,
    updateOrderStatus,
    riderAdvanceWorkflowStage,
    riderVerifyOtp,
    requestDeliveryOtp,
    isRiderArrived,
    otpRequested,
    isWaitingForOtp,
    selectRoute,
    isDeliveryCompleted,
    resetSimulation,
    userRole,
    setUserRole,
    setActiveTab
  } = useApp();

  const cityInfo = SUPPORTED_CITIES[selectedCity] || SUPPORTED_CITIES.Vijayawada;
  const currentStatus = activeOrder?.status || 'OUT_FOR_DELIVERY';

  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [callInitiated, setCallInitiated] = useState(false);

  const orderId = activeOrder?.id || 'ORD-8553';
  const deliveryOtp = activeOrder?.deliveryOtp || '8553';
  const customerName = activeOrder?.customerName || 'Dilip (AI Pilot)';
  const restaurantName = activeOrder?.restaurantName || 'Spice Route Kitchen';
  const distanceKm = isWaitingForOtp || isDeliveryCompleted ? 0 : (tracking?.distanceRemainingKm ?? conditions.distanceKm);
  const speedKmh = isWaitingForOtp || isDeliveryCompleted ? 0 : (tracking?.speedKmh ?? 32);
  const etaMinutes = isDeliveryCompleted || isWaitingForOtp ? 0 : (tracking?.etaMinutes ?? prediction?.predictedEtaMinutes ?? 24);

  const toggleItemChecked = (itemName: string) => {
    setCheckedItems(prev => ({ ...prev, [itemName]: !prev[itemName] }));
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredOtp) return;
    const isValid = riderVerifyOtp(enteredOtp);
    if (isValid) {
      setOtpSuccess(true);
      setOtpError(false);
    } else {
      setOtpError(true);
      setOtpSuccess(false);
    }
  };

  const handleRequestOtpClick = () => {
    requestDeliveryOtp();
  };

  const handleWorkflowClick = async (status: OrderStatus) => {
    if (status === 'ARRIVING_SOON') {
      requestDeliveryOtp();
    } else {
      await riderAdvanceWorkflowStage(status);
    }
  };

  const handleEmergencyCall = () => {
    setCallInitiated(true);
    setTimeout(() => setCallInitiated(false), 4000);
  };

  const workflowStages: {
    status: OrderStatus;
    label: string;
    stepNumber: number;
    icon: React.FC<{ className?: string }>;
    description: string;
  }[] = [
    {
      status: 'CONFIRMED',
      label: 'Accept Order',
      stepNumber: 1,
      icon: Store,
      description: 'Accept delivery assignment from dispatch'
    },
    {
      status: 'PREPARING',
      label: 'At Restaurant',
      stepNumber: 2,
      icon: Clock,
      description: 'Arrive at kitchen & confirm preparation'
    },
    {
      status: 'DRIVER_ASSIGNED',
      label: 'Food Ready',
      stepNumber: 3,
      icon: CheckCircle2,
      description: 'Verify packed order items with merchant'
    },
    {
      status: 'OUT_FOR_DELIVERY',
      label: 'Pick Up & Start',
      stepNumber: 4,
      icon: Bike,
      description: 'Start live GPS transit to customer drop-off'
    },
    {
      status: 'ARRIVING_SOON',
      label: 'Arrived at Drop-off',
      stepNumber: 5,
      icon: MapPin,
      description: 'Ring doorbell or call customer'
    },
    {
      status: 'DELIVERED',
      label: 'Verify OTP & Complete',
      stepNumber: 6,
      icon: ShieldCheck,
      description: 'Enter customer OTP to complete handover'
    }
  ];

  const getStageIndex = (st: OrderStatus) => {
    switch (st) {
      case 'CONFIRMED': return 0;
      case 'PREPARING': return 1;
      case 'DRIVER_ASSIGNED': return 2;
      case 'OUT_FOR_DELIVERY': return 3;
      case 'ARRIVING_SOON': return 4;
      case 'DELIVERED': return 5;
      default: return 3;
    }
  };

  const currentStageIdx = isDeliveryCompleted ? 5 : getStageIndex(currentStatus);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Top Role Selector & Rider Dispatch Badge */}
      <RoleSelectorBar />

      {/* 2. Rider Profile & Active Mission Header */}
      <div className="rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-slate-950 via-cyan-950 to-slate-900 text-white p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -z-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 text-slate-950 font-black shadow-lg shadow-cyan-500/30">
                <Bike className="h-8 w-8 text-slate-950" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950" />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Rahul Sharma
                </h1>
                <span className="rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 px-2 py-0.5 text-xs font-mono font-bold">
                  Rider ID: RD-9042
                </span>
                <span className="rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 text-xs font-bold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Mission
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 flex flex-wrap items-center gap-3">
                <span>Vehicle: <strong>Ather 450X EV</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <Battery className="h-3.5 w-3.5" />
                  <strong>{tracking?.batteryLevel || 85}% Battery</strong>
                </span>
                <span>•</span>
                <span>Rating: <strong className="text-amber-300">⭐ 4.95 (1,420 trips)</strong></span>
              </p>
            </div>
          </div>

          {/* Quick Actions & Earnings */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl bg-white/10 border border-white/10 px-4 py-2.5 backdrop-blur-md">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 block">
                Trip Earnings
              </span>
              <div className="text-lg sm:text-xl font-black text-emerald-400 flex items-center gap-1 font-mono">
                <span>₹90.00</span>
                <span className="text-[10px] text-slate-300 font-sans font-normal">(₹45 base + ₹25 surge + ₹20 tip)</span>
              </div>
            </div>

            <button
              id="btn-emergency-support"
              onClick={handleEmergencyCall}
              className="rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-300 px-3.5 py-2.5 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              <span>{callInitiated ? 'Calling Dispatch SOS...' : 'SOS / Dispatch Support'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* 3. Interactive Rider Workflow Stepper Bar */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Navigation className="h-5 w-5 text-cyan-600" />
              <span>Rider Delivery Workflow</span>
            </h2>
            <p className="text-xs text-slate-500">
              Click any stage button below to advance delivery status. Instantly updates Customer tracking in real time.
            </p>
          </div>

          <button
            onClick={resetSimulation}
            className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-cyan-700 bg-slate-100 hover:bg-cyan-50 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>

        {/* Workflow Action Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
          {workflowStages.map((stage, idx) => {
            const Icon = stage.icon;
            const isCurrent = idx === currentStageIdx;
            const isCompleted = idx < currentStageIdx;

            return (
              <button
                key={stage.status}
                id={`btn-rider-stage-${stage.status.toLowerCase()}`}
                onClick={() => handleWorkflowClick(stage.status)}
                className={`text-left p-3 rounded-2xl border-2 transition-all flex flex-col justify-between relative group ${
                  isCurrent
                    ? 'bg-gradient-to-br from-cyan-50 via-white to-sky-50 border-cyan-500 shadow-md ring-2 ring-cyan-500/20'
                    : isCompleted
                    ? 'bg-emerald-50/50 border-emerald-200 text-slate-700 hover:border-emerald-400'
                    : 'bg-slate-50/70 border-slate-200/80 text-slate-500 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className={`text-[10px] font-black font-mono rounded-full px-1.5 py-0.2 ${
                    isCurrent
                      ? 'bg-cyan-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    #{stage.stepNumber}
                  </span>
                  <Icon className={`h-4 w-4 ${
                    isCurrent ? 'text-cyan-600 animate-bounce' : isCompleted ? 'text-emerald-600' : 'text-slate-400'
                  }`} />
                </div>

                <div>
                  <h4 className={`text-xs font-bold leading-tight ${isCurrent ? 'text-cyan-950 font-black' : 'text-slate-900'}`}>
                    {stage.label}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-snug">
                    {stage.description}
                  </p>
                </div>

                {isCurrent && (
                  <span className="mt-2 text-[9px] font-black uppercase tracking-wider text-cyan-700 bg-cyan-100 rounded-md px-1.5 py-0.5 text-center block">
                    Active Step
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Main Two-Column Navigation & Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Rider Navigation Map & Multi-Corridor Battle (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Map Header Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-cyan-600" />
                  <span>Rider Navigation: Kitchen → Customer</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Live GPS turn-by-turn corridor telemetry with dynamic waypoint calculation
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-xl bg-slate-900 text-white text-xs font-mono font-bold px-3 py-1 flex items-center gap-1.5 shadow-2xs">
                  <Bike className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{speedKmh} km/h</span>
                </span>
                <span className="rounded-xl bg-cyan-100 text-cyan-900 text-xs font-mono font-bold px-3 py-1 border border-cyan-200">
                  {distanceKm} km remaining
                </span>
              </div>
            </div>

            {/* Realistic Delivery Map */}
            <RealisticDeliveryMap />
          </div>

          {/* AI Route Battle & Multi-Corridor Selection */}
          <RouteBattle />

        </div>

        {/* Right Column: Delivery Information, OTP & Operational Intel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Card 1: Customer Contact & Delivery Info */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-cyan-600" />
                <h3 className="text-base font-black text-slate-900">
                  Delivery Details ({orderId})
                </h3>
              </div>
              <span className="rounded-full bg-emerald-100 text-emerald-950 text-xs font-bold px-2.5 py-0.5 border border-emerald-300">
                Paid Online (UPI)
              </span>
            </div>

            {/* Pickup & Drop Points */}
            <div className="space-y-4">
              
              {/* Pickup (Restaurant) */}
              <div className="flex items-start gap-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
                  <Store className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                    PICKUP LOCATION
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {restaurantName}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    MG Road Commercial Hub, {cityInfo.name}
                  </p>
                  <span className="inline-block mt-1 text-[11px] font-semibold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                    Kitchen Prep: ~{conditions.restaurantPrepTime}m
                  </span>
                </div>
              </div>

              {/* Drop-off (Customer) */}
              <div className="flex items-start gap-3 rounded-2xl bg-cyan-50/60 border border-cyan-200/80 p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-600 text-white shadow-xs">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-cyan-800">
                      DROP-OFF LOCATION
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-900">
                      {distanceKm} km
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {customerName}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Flat 402, Lotus Grand Residences, {cityInfo.name}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <a
                      href="tel:+919876543210"
                      className="inline-flex items-center gap-1 rounded-xl bg-slate-900 text-white text-xs font-bold px-3 py-1.5 hover:bg-slate-800 transition-colors shadow-2xs"
                    >
                      <Phone className="h-3 w-3" />
                      <span>Call Customer</span>
                    </a>
                    <a
                      href="sms:+919876543210"
                      className="inline-flex items-center gap-1 rounded-xl bg-cyan-100 text-cyan-900 text-xs font-bold px-3 py-1.5 hover:bg-cyan-200 transition-colors border border-cyan-300"
                    >
                      <MessageSquare className="h-3 w-3" />
                      <span>SMS</span>
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Order Items Verification Checklist */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Order Items ({activeOrder?.items.length || 2} items)</span>
                <span className="text-emerald-700">Check before pickup</span>
              </div>

              <div className="space-y-1.5 rounded-2xl bg-slate-50 p-3 border border-slate-200">
                {(activeOrder?.items || [
                  { name: 'Royal Chicken Dum Biryani', quantity: 2, price: 249 },
                  { name: 'Smoked Peri-Peri Paneer Pizza', quantity: 1, price: 299 }
                ]).map((item, i) => (
                  <label
                    key={i}
                    className="flex items-center justify-between text-xs text-slate-800 p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checkedItems[item.name] || false}
                        onChange={() => toggleItemChecked(item.name)}
                        className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 h-4 w-4"
                      />
                      <span className="font-semibold">{item.quantity}x {item.name}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-600">₹{item.price * item.quantity}</span>
                  </label>
                ))}
              </div>

              {/* Special Delivery Instructions */}
              <div className="rounded-xl bg-orange-50/70 border border-orange-200 p-2.5 text-xs text-orange-950 flex items-start gap-2">
                <span className="font-bold shrink-0">📌 Note:</span>
                <span>"Please leave with security or ring bell once. Do not knock loudly."</span>
              </div>
            </div>

            {/* OTP Verification & Customer Handover Box */}
            <div className="rounded-2xl border-2 border-cyan-400 bg-gradient-to-br from-cyan-50/90 via-sky-50/50 to-white p-4 space-y-3 shadow-sm">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-cyan-700" />
                  <span className="text-xs font-black uppercase tracking-wider text-cyan-950">
                    Handover OTP Verification
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-cyan-200 shadow-2xs">
                  Customer PIN: <strong className="text-cyan-800">{deliveryOtp}</strong>
                </span>
              </div>

              {/* Status breakdown when arriving / arrived */}
              <div className="rounded-xl bg-white/80 border border-cyan-200 p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Delivery Status:</span>
                  <span className={`font-bold ${isDeliveryCompleted ? 'text-emerald-700' : (isWaitingForOtp ? 'text-amber-700 font-black animate-pulse' : 'text-slate-800')}`}>
                    {isDeliveryCompleted ? '✓ Completed' : (isWaitingForOtp ? 'Arrived • Waiting for OTP' : 'En Route to Drop-off')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Distance to Customer:</span>
                  <span className="font-mono font-bold text-slate-800">{distanceKm} km</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">OTP Verification:</span>
                  <span className={`font-bold px-2 py-0.5 rounded-md text-[10px] ${
                    isDeliveryCompleted
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : otpRequested
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {isDeliveryCompleted ? '✓ VERIFIED' : (otpRequested ? 'REQUESTED (PENDING)' : 'NOT REQUESTED')}
                  </span>
                </div>
              </div>

              {/* Action: REQUEST OTP BUTTON */}
              {!isDeliveryCompleted && (
                <div className="space-y-2">
                  {!otpRequested ? (
                    <button
                      id="btn-rider-request-otp"
                      onClick={handleRequestOtpClick}
                      className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2.5 text-xs font-black text-white hover:from-amber-600 hover:to-orange-700 transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <KeyRound className="h-4 w-4" />
                      <span>REQUEST OTP FROM CUSTOMER</span>
                    </button>
                  ) : (
                    <div className="rounded-xl bg-amber-50 border border-amber-300 p-2.5 text-xs font-bold text-amber-950 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                        <span>OTP Request Sent ✓ Waiting for Customer...</span>
                      </span>
                      <button
                        onClick={handleRequestOtpClick}
                        className="text-[10px] underline text-amber-800 hover:text-amber-950"
                      >
                        Resend
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Manual OTP entry form by Rider if customer provides verbally */}
              {!isDeliveryCompleted ? (
                <form onSubmit={handleOtpSubmit} className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold text-slate-600 block">
                    Or Enter Customer OTP Manually:
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder="e.g. 8553"
                      className="flex-1 rounded-xl border border-cyan-300 px-3 py-2 text-center font-mono text-base font-black tracking-widest text-slate-900 focus:border-cyan-500 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/20 bg-white shadow-2xs"
                    />
                    <button
                      type="submit"
                      id="btn-verify-otp-rider"
                      className="rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-xs font-black text-white hover:from-cyan-500 hover:to-blue-500 transition-all shadow-md shadow-cyan-600/20 flex items-center gap-1 shrink-0 cursor-pointer active:scale-95"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>Verify</span>
                    </button>
                  </div>
                </form>
              ) : null}

              {otpSuccess || isDeliveryCompleted ? (
                <div className="rounded-xl bg-emerald-100 text-emerald-950 border border-emerald-300 p-2.5 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
                  <span>✓ OTP VERIFIED — Delivery Completed Successfully!</span>
                </div>
              ) : null}

              {otpError && (
                <div className="rounded-xl bg-rose-100 text-rose-950 border border-rose-300 p-2 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                  <AlertTriangle className="h-4 w-4 text-rose-700 shrink-0" />
                  <span>Incorrect OTP. Ask customer for 4-digit PIN (e.g. {deliveryOtp}).</span>
                </div>
              )}
            </div>

          </div>

          {/* Card 2: AI Delivery Intelligence & Operational Forecast */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
            
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <div>
                <h3 className="text-base font-black text-slate-900">
                  AI Delivery Intelligence
                </h3>
                <p className="text-xs text-slate-500">Live operational factors &amp; route advisories</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              
              {/* Traffic Alert */}
              <div className="rounded-2xl bg-orange-50 border border-orange-200 p-3">
                <span className="text-[10px] font-black uppercase text-orange-800 flex items-center gap-1">
                  <Car className="h-3 w-3 text-orange-600" />
                  <span>Live Traffic</span>
                </span>
                <div className="text-sm font-bold text-slate-900 mt-1">
                  {conditions.trafficLevel} Congestion
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Main ring road has +{conditions.trafficLevel === 'SEVERE' ? '8' : '4'}m bottleneck
                </p>
              </div>

              {/* Weather Alert */}
              <div className="rounded-2xl bg-sky-50 border border-sky-200 p-3">
                <span className="text-[10px] font-black uppercase text-sky-800 flex items-center gap-1">
                  <CloudRain className="h-3 w-3 text-sky-600" />
                  <span>Weather Impact</span>
                </span>
                <div className="text-sm font-bold text-slate-900 mt-1">
                  {conditions.weatherCondition.replace('_', ' ')}
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Road friction wet • Drive safely &lt;40km/h
                </p>
              </div>

            </div>

            {/* Actionable Guidance */}
            <div className="rounded-2xl bg-gradient-to-r from-indigo-50 to-cyan-50 border border-indigo-200/80 p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-indigo-950">
                <span>🤖</span>
                <span>AI Recommended Action for Rider:</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {prediction?.recommendedRoute?.highlightReason || 
                  'Take the Flyover Bypass corridor to avoid inner market construction and save 4.2 minutes on arrival.'}
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
