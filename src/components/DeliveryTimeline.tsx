import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  PackageCheck,
  Bike,
  Navigation,
  MapPin,
  PartyPopper,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Radio
} from 'lucide-react';

interface TimelineStep {
  id: string;
  stageNum: number;
  title: string;
  subtitle: string;
  time: string;
  status: 'completed' | 'current' | 'upcoming';
  durationInStage?: string;
  icon: React.FC<{ className?: string }>;
}

export const DeliveryTimeline: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { tracking, activeOrder, isDeliveryCompleted, isWaitingForOtp, prediction } = useApp();

  const progress = tracking?.driverPosition?.progress ?? 45;
  const etaMinutes = (isDeliveryCompleted || isWaitingForOtp) ? 0 : (tracking?.etaMinutes ?? prediction?.predictedEtaMinutes ?? 26);
  const etaRangeMin = prediction?.minEtaMinutes ?? Math.max(1, Math.round(etaMinutes * 0.9));
  const etaRangeMax = prediction?.maxEtaMinutes ?? Math.max(etaRangeMin + 3, Math.round(etaMinutes * 1.15));

  // Determine which of the 7 stages is currently active
  // 0: Order Confirmed
  // 1: Restaurant Preparing
  // 2: Food Ready
  // 3: Rider Picked Up
  // 4: On the Way
  // 5: Arriving Soon
  // 6: Delivered / Handed over
  const currentStageIndex = useMemo(() => {
    if (isDeliveryCompleted) return 6;
    if (isWaitingForOtp || progress >= 94) return 5; // Arriving Soon / At Doorstep
    if (progress >= 40) return 4; // On the Way
    if (progress >= 20) return 3; // Rider Picked Up
    if (progress >= 10) return 2; // Food Ready
    if (progress >= 4) return 1;  // Restaurant Preparing
    return 0; // Order Confirmed
  }, [isDeliveryCompleted, isWaitingForOtp, progress]);

  const getStepStatus = (stepIndex: number): 'completed' | 'current' | 'upcoming' => {
    if (stepIndex < currentStageIndex) return 'completed';
    if (stepIndex === currentStageIndex) return 'current';
    return 'upcoming';
  };

  const steps: TimelineStep[] = [
    {
      id: 'step_confirmed',
      stageNum: 1,
      title: 'Order Confirmed',
      subtitle: activeOrder?.restaurantName || 'Spice Route Kitchen',
      time: '6:15 PM',
      durationInStage: 'Completed in 1m',
      status: getStepStatus(0),
      icon: CheckCircle2
    },
    {
      id: 'step_preparing',
      stageNum: 2,
      title: 'Restaurant Preparing',
      subtitle: 'Chef cooking fresh items',
      time: '6:17 PM',
      durationInStage: 'Completed in 8m',
      status: getStepStatus(1),
      icon: ChefHat
    },
    {
      id: 'step_ready',
      stageNum: 3,
      title: 'Food Ready',
      subtitle: 'Tamper-sealed & packed',
      time: '6:25 PM',
      durationInStage: 'Completed in 2m',
      status: getStepStatus(2),
      icon: PackageCheck
    },
    {
      id: 'step_picked_up',
      stageNum: 4,
      title: 'Rider Picked Up',
      subtitle: 'Courier collected thermal bag',
      time: '6:27 PM',
      durationInStage: 'Completed in 2m',
      status: getStepStatus(3),
      icon: Bike
    },
    {
      id: 'step_on_way',
      stageNum: 5,
      title: 'On the Way',
      subtitle: `Rider transit • Speed ~${tracking?.speedKmh || 32} km/h`,
      time: '6:31 PM',
      durationInStage: 'In progress (~4m)',
      status: getStepStatus(4),
      icon: Navigation
    },
    {
      id: 'step_arriving',
      stageNum: 6,
      title: 'Arriving Soon',
      subtitle: isWaitingForOtp ? 'Rider at doorstep • OTP ready' : 'Within 500m of destination',
      time: isWaitingForOtp ? 'At Door' : `${Math.max(2, etaRangeMin)}m ETA`,
      durationInStage: isWaitingForOtp ? 'Awaiting OTP' : 'Upcoming',
      status: getStepStatus(5),
      icon: MapPin
    },
    {
      id: 'step_delivered',
      stageNum: 7,
      title: 'Delivered',
      subtitle: isDeliveryCompleted ? 'OTP verified ✓ Completed' : 'Final contactless handover',
      time: isDeliveryCompleted ? 'Delivered' : 'Final Step',
      durationInStage: isDeliveryCompleted ? 'Completed' : 'Upcoming',
      status: getStepStatus(6),
      icon: PartyPopper
    }
  ];

  const currentStep = steps[currentStageIndex] || steps[4];
  const nextStep = currentStageIndex < steps.length - 1 ? steps[currentStageIndex + 1] : null;

  return (
    <div id="section-order-status-timeline" className={`overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-5 ${className}`}>
      
      {/* Header Bar: Step Identifier & Status Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-xs">
            <Radio className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                STEP 1 • ORDER STATUS
              </span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <h3 className="text-base font-black text-slate-900">
              Live Delivery Lifecycle Timeline
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-900 border border-cyan-200 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-600" />
            <span>Stage {currentStageIndex + 1} of 7: <strong>{currentStep.title}</strong></span>
          </span>
        </div>
      </div>

      {/* Stage Live Intelligence Banner */}
      <div className="rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50/90 via-sky-50/50 to-white p-4 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 divide-y sm:divide-y-0 sm:divide-x divide-cyan-100">
          
          {/* Current Stage */}
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-800 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Current Status</span>
            </span>
            <div className="text-sm font-black text-slate-950">
              {currentStep.title}
            </div>
            <p className="text-[11px] text-slate-600">
              {currentStep.subtitle}
            </p>
          </div>

          {/* Time in Stage & Telemetry Update */}
          <div className="sm:pl-4 pt-2 sm:pt-0 space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Stage Activity &amp; Freshness
            </span>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-cyan-600" />
              <span>{currentStep.durationInStage || 'Active ~3 mins'}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Last telemetry refresh: <strong className="text-slate-700">Just now</strong>
            </p>
          </div>

          {/* Next Stage Preview */}
          <div className="sm:pl-4 pt-2 sm:pt-0 space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Next Stage
            </span>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <ArrowRight className="h-3.5 w-3.5 text-indigo-600" />
              <span>{nextStep ? nextStep.title : 'Order Fulfilled'}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {nextStep ? `Expected handover in ~${Math.max(2, etaRangeMin - 2)} mins` : 'Delivery completed smoothly'}
            </p>
          </div>

        </div>
      </div>

      {/* Desktop Horizontal Stepper: 7 Stages */}
      <div className="hidden lg:block pt-3 pb-2">
        <div className="relative flex items-center justify-between">
          
          {/* Background Track */}
          <div className="absolute top-5 left-4 right-4 h-1 bg-slate-100 rounded-full z-0" />
          
          {/* Progress Filled Track */}
          <div
            className="absolute top-5 left-4 h-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full transition-all duration-500 z-0"
            style={{ width: `${Math.min(100, Math.max(0, (currentStageIndex / 6) * 100))}%` }}
          />

          {/* Stepper Nodes */}
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current';

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center text-center">
                
                {/* Circle Node */}
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'border-cyan-600 bg-cyan-600 text-white shadow-xs'
                      : isCurrent
                      ? 'border-cyan-600 bg-white text-cyan-700 ring-4 ring-cyan-100 scale-110 shadow-md'
                      : 'border-slate-200 bg-slate-50 text-slate-400'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {/* Text Labels */}
                <div className="mt-2.5 max-w-[110px]">
                  <span
                    className={`block text-[11px] font-bold leading-tight ${
                      isCurrent
                        ? 'text-cyan-950 font-black'
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

      {/* Mobile / Tablet Responsive Stepper */}
      <div className="lg:hidden space-y-3 pt-2">
        {steps.map((step) => {
          const Icon = step.icon;
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';

          return (
            <div
              key={step.id}
              className={`flex items-start gap-3 p-2.5 rounded-2xl transition-all ${
                isCurrent ? 'bg-cyan-50/80 border border-cyan-200' : ''
              }`}
            >
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
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isCurrent ? 'text-cyan-950 font-black' : isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.stageNum}. {step.title}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{step.time}</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">{step.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
