import React from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  PackageCheck,
  Bike,
  MapPin,
  PartyPopper,
  Sparkles
} from 'lucide-react';

interface TimelineStep {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  status: 'completed' | 'current' | 'upcoming';
  icon: React.FC<{ className?: string }>;
}

export const DeliveryTimeline: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { tracking, activeOrder, isDeliveryCompleted, isWaitingForOtp } = useApp();

  const progress = tracking?.driverPosition?.progress ?? 32;
  const etaMinutes = (isDeliveryCompleted || isWaitingForOtp) ? 0 : (tracking?.etaMinutes ?? 28);
  const etaRangeMin = Math.max(1, Math.round(etaMinutes * 0.9));
  const etaRangeMax = Math.max(etaRangeMin + 3, Math.round(etaMinutes * 1.15));

  // Derive 6 standard stages based on progress & OTP verification:
  // 0: Order Confirmed
  // 1: Restaurant Preparing
  // 2: Food Ready
  // 3: Rider Picked Up
  // 4: On the Way
  // 5: Delivered / Waiting for OTP
  const getStepStatus = (stepIndex: number): 'completed' | 'current' | 'upcoming' => {
    if (isDeliveryCompleted) {
      return 'completed';
    }
    if (isWaitingForOtp || progress >= 95) {
      if (stepIndex < 5) return 'completed';
      if (stepIndex === 5) return 'current';
      return 'upcoming';
    }
    if (progress >= 30) {
      if (stepIndex < 4) return 'completed';
      if (stepIndex === 4) return 'current';
      return 'upcoming';
    }
    if (progress >= 18) {
      if (stepIndex < 3) return 'completed';
      if (stepIndex === 3) return 'current';
      return 'upcoming';
    }
    if (progress >= 8) {
      if (stepIndex < 2) return 'completed';
      if (stepIndex === 2) return 'current';
      return 'upcoming';
    }
    if (progress >= 3) {
      if (stepIndex < 1) return 'completed';
      if (stepIndex === 1) return 'current';
      return 'upcoming';
    }
    return stepIndex === 0 ? 'current' : 'upcoming';
  };

  const steps: TimelineStep[] = [
    {
      id: 'step_confirmed',
      title: 'Order Confirmed',
      subtitle: activeOrder?.restaurantName || 'Spice Route Kitchen',
      time: '4:15 PM',
      status: getStepStatus(0),
      icon: CheckCircle2
    },
    {
      id: 'step_preparing',
      title: 'Restaurant Preparing',
      subtitle: 'Chef cooking fresh items',
      time: '4:18 PM',
      status: getStepStatus(1),
      icon: ChefHat
    },
    {
      id: 'step_ready',
      title: 'Food Ready',
      subtitle: 'Tamper-sealed & packed',
      time: '4:21 PM',
      status: getStepStatus(2),
      icon: PackageCheck
    },
    {
      id: 'step_picked_up',
      title: 'Rider Picked Up',
      subtitle: 'Rahul collected hot food bag',
      time: '4:24 PM',
      status: getStepStatus(3),
      icon: Bike
    },
    {
      id: 'step_on_way',
      title: 'On the Way',
      subtitle: `Speed ~${tracking?.speedKmh || 28} km/h • Transit Corridor`,
      time: isWaitingForOtp ? 'Arrived' : `${etaRangeMin}–${etaRangeMax}m ETA`,
      status: getStepStatus(4),
      icon: MapPin
    },
    {
      id: 'step_delivered',
      title: isDeliveryCompleted ? 'Delivered' : (isWaitingForOtp ? 'Waiting for OTP' : 'Doorstep Handover'),
      subtitle: isDeliveryCompleted ? 'Verified with OTP ✓ Completed' : 'Enter OTP to verify handover',
      time: isDeliveryCompleted ? 'Completed' : (isWaitingForOtp ? 'Pending OTP' : 'Destination'),
      status: getStepStatus(5),
      icon: PartyPopper
    }
  ];

  const currentStepIdx = steps.findIndex(s => s.status === 'current');
  const activeStageNumber = currentStepIdx !== -1 ? currentStepIdx + 1 : (progress >= 100 ? 6 : 5);

  return (
    <div className={`overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs ${className}`}>
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Live Order Tracking Timeline</span>
              <span className="flex h-2 w-2 rounded-full bg-cyan-600 animate-ping" />
            </h3>
            <p className="text-xs text-slate-500">
              6-Stage progression synchronized with courier telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-800 border border-cyan-200">
            Stage {activeStageNumber} of 6: {steps[currentStepIdx]?.title || 'On the Way'}
          </span>
        </div>
      </div>

      {/* Active Stage Live ETA Spotlight Callout */}
      <div className="rounded-2xl border border-cyan-200/80 bg-gradient-to-r from-cyan-50/90 via-sky-50/50 to-white p-3.5 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-800 block">
                CURRENT STAGE: {steps[currentStepIdx]?.title || 'On the Way'}
              </span>
              <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                Current ETA: <span className="font-mono text-cyan-950 font-black">{etaRangeMin}–{etaRangeMax} min</span> • Confidence: <span className="text-emerald-700 font-black">92%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Clock className="h-3.5 w-3.5 text-cyan-600" />
            <span>Expected arrival: <strong className="font-mono text-slate-950 font-black">{new Date(Date.now() + etaMinutes * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></span>
          </div>
        </div>
      </div>

      {/* Desktop Horizontal Stepper */}
      <div className="hidden md:block pt-6 pb-2">
        <div className="relative flex items-center justify-between">
          
          {/* Background Track */}
          <div className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 bg-slate-100 rounded-full z-0" />
          
          {/* Progress Filled Track */}
          <div
            className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-cyan-600 rounded-full transition-all duration-500 z-0"
            style={{ width: `${Math.min(100, Math.max(0, (activeStageNumber - 1) * 20))}%` }}
          />

          {/* Stepper Nodes */}
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current';

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center text-center">
                
                {/* Circle Indicator */}
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'border-cyan-600 bg-cyan-600 text-white shadow-xs'
                      : isCurrent
                      ? 'border-cyan-600 bg-white text-cyan-600 ring-4 ring-cyan-100 scale-110 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-400'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {/* Text Labels */}
                <div className="mt-2 max-w-[100px]">
                  <span
                    className={`block text-[11px] font-bold leading-tight ${
                      isCurrent
                        ? 'text-cyan-900 font-black'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                    {step.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Vertical Stepper */}
      <div className="md:hidden space-y-4 pt-4">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';

          return (
            <div key={step.id} className="flex items-start gap-3.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 shrink-0 ${
                  isCompleted
                    ? 'border-cyan-600 bg-cyan-600 text-white'
                    : isCurrent
                    ? 'border-cyan-600 bg-white text-cyan-600 ring-4 ring-cyan-100'
                    : 'border-slate-200 bg-white text-slate-400'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 pb-2 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isCurrent ? 'text-cyan-900' : 'text-slate-800'}`}>
                    {step.title}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{step.time}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{step.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
