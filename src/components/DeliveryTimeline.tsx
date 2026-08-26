import React from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  PackageCheck,
  Bike,
  MapPin,
  ShieldCheck,
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
  const { tracking, activeOrder } = useApp();

  const progress = tracking?.driverPosition?.progress ?? 32;
  const etaMinutes = tracking?.etaMinutes ?? 18;

  // Derive active stage dynamically from progress
  const getStepStatus = (stepIndex: number): 'completed' | 'current' | 'upcoming' => {
    // 0: Confirmed (always completed for active tracking)
    // 1: Preparing (completed if progress >= 5)
    // 2: Food Ready (completed if progress >= 15)
    // 3: Picked Up (completed if progress >= 25)
    // 4: On The Way (current if 25 <= progress < 90)
    // 5: Arriving Soon (current if progress >= 90 && progress < 100)
    // 6: Delivered (completed if progress >= 100)

    if (progress >= 100) {
      return stepIndex === 6 ? 'completed' : 'completed';
    }
    if (progress >= 90) {
      if (stepIndex < 5) return 'completed';
      if (stepIndex === 5) return 'current';
      return 'upcoming';
    }
    if (progress >= 25) {
      if (stepIndex < 4) return 'completed';
      if (stepIndex === 4) return 'current';
      return 'upcoming';
    }
    if (progress >= 15) {
      if (stepIndex < 3) return 'completed';
      if (stepIndex === 3) return 'current';
      return 'upcoming';
    }
    if (progress >= 5) {
      if (stepIndex < 2) return 'completed';
      if (stepIndex === 2) return 'current';
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
      title: 'Food Preparing',
      subtitle: 'Chef grilling items fresh',
      time: '4:18 PM',
      status: getStepStatus(1),
      icon: ChefHat
    },
    {
      id: 'step_ready',
      title: 'Packed & Ready',
      subtitle: 'Tamper-evident sealed',
      time: '4:21 PM',
      status: getStepStatus(2),
      icon: PackageCheck
    },
    {
      id: 'step_picked_up',
      title: 'Picked Up',
      subtitle: 'Rahul scanned package',
      time: '4:23 PM',
      status: getStepStatus(3),
      icon: Bike
    },
    {
      id: 'step_on_way',
      title: 'On the Way',
      subtitle: `Speed ~${tracking?.speedKmh || 28} km/h • Knowledge City corridor`,
      time: `~${etaMinutes}m ETA`,
      status: getStepStatus(4),
      icon: Bike
    },
    {
      id: 'step_arriving',
      title: 'Arriving Soon',
      subtitle: 'Approaching Financial District',
      time: 'Next milestone',
      status: getStepStatus(5),
      icon: MapPin
    },
    {
      id: 'step_delivered',
      title: 'Handover & OTP',
      subtitle: 'PIN: 8553 verification',
      time: 'Destination',
      status: getStepStatus(6),
      icon: ShieldCheck
    }
  ];

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
              <span>Live Delivery Timeline</span>
              <span className="flex h-2 w-2 rounded-full bg-cyan-600 animate-ping" />
            </h3>
            <p className="text-xs text-slate-500">
              Real-time milestone progression synchronized with rider telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-800 border border-cyan-200">
            Stage {steps.findIndex(s => s.status === 'current') + 1} of 7
          </span>
        </div>
      </div>

      {/* Desktop Horizontal Stepper */}
      <div className="hidden lg:block pt-6 pb-2">
        <div className="relative flex items-center justify-between">
          
          {/* Background Connecting Track */}
          <div className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 bg-slate-100 rounded-full z-0" />
          
          {/* Progress Filled Track */}
          <div
            className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-cyan-600 rounded-full transition-all duration-500 z-0"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />

          {/* Stepper Nodes */}
          {steps.map((step, idx) => {
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current';
            const Icon = step.icon;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center group max-w-[120px] text-center">
                
                {/* Step Circle */}
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'border-cyan-600 bg-cyan-600 text-white shadow-sm shadow-cyan-600/30'
                      : isCurrent
                      ? 'border-cyan-600 bg-white text-cyan-600 shadow-md ring-4 ring-cyan-100 animate-pulse'
                      : 'border-slate-300 bg-slate-50 text-slate-400'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {/* Step Titles & Time */}
                <div className="mt-2.5 space-y-0.5">
                  <div className={`text-xs font-bold leading-tight ${isCurrent ? 'text-cyan-700' : isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.title}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium truncate max-w-[110px]">
                    {step.subtitle}
                  </div>
                  <div className="text-[10px] font-mono font-bold text-slate-400">
                    {step.time}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile / Tablet Vertical Timeline */}
      <div className="lg:hidden space-y-3 pt-4">
        {steps.map((step, idx) => {
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';
          const isUpcoming = step.status === 'upcoming';
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative flex items-start gap-3 pl-1">
              
              {/* Vertical line connecting nodes */}
              {idx < steps.length - 1 && (
                <div
                  className={`absolute left-[18px] top-8 h-full w-0.5 -translate-x-1/2 ${
                    isCompleted ? 'bg-cyan-600' : 'bg-slate-200'
                  }`}
                />
              )}

              {/* Node Circle */}
              <div
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                  isCompleted
                    ? 'border-cyan-600 bg-cyan-600 text-white shadow-xs'
                    : isCurrent
                    ? 'border-cyan-600 bg-white text-cyan-600 ring-4 ring-cyan-100 animate-pulse'
                    : 'border-slate-300 bg-slate-50 text-slate-400'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>

              {/* Content */}
              <div className="flex-1 rounded-xl p-2 bg-slate-50/70 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className={`text-xs font-bold ${isCurrent ? 'text-cyan-700' : isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.title}
                  </div>
                  <div className="text-[11px] text-slate-500">{step.subtitle}</div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                    isCurrent ? 'bg-cyan-100 text-cyan-800' : 'text-slate-400'
                  }`}>
                    {step.time}
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
