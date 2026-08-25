import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  X,
  Store,
  Package,
  Navigation,
  Car,
  Home,
  CheckCircle2,
  Clock,
  ArrowDown
} from 'lucide-react';

export const FutureViewModal: React.FC = () => {
  const { isFutureViewOpen, setIsFutureViewOpen, prediction, conditions, activeOrder } = useApp();

  if (!isFutureViewOpen) return null;

  const eta = prediction?.predictedEtaMinutes || 18;

  const timeline = [
    {
      time: 'NOW (0m)',
      title: 'Store Kitchen Preparation',
      icon: <Store className="h-5 w-5 text-purple-600" />,
      desc: `Chef confirms order #${activeOrder?.id || 'ORD-8553'}. ~${conditions.restaurantPrepTime}m kitchen prep time.`,
      status: 'active'
    },
    {
      time: '+4 MIN',
      title: 'Thermal Packing & Inspection',
      icon: <Package className="h-5 w-5 text-cyan-600" />,
      desc: 'Quality check complete. Order sealed in thermal humidity-lock carrier.',
      status: 'projected'
    },
    {
      time: '+8 MIN',
      title: 'Courier Pickup & Route Launch',
      icon: <Navigation className="h-5 w-5 text-emerald-600" />,
      desc: `Driver departs via ${prediction?.recommendedRoute?.name || 'AI Optimal Path'}.`,
      status: 'projected'
    },
    {
      time: '+13 MIN',
      title: 'Corridor Optimization & Traffic Clearance',
      icon: <Car className="h-5 w-5 text-amber-500" />,
      desc: `AI dynamic bypass mitigates ${conditions.trafficLevel.toLowerCase()} chokepoint delays.`,
      status: 'projected'
    },
    {
      time: `+${eta} MIN`,
      title: 'Doorstep Handover & Points Claim',
      icon: <Home className="h-5 w-5 text-teal-600" />,
      desc: 'Arrival at destination. Immediate delivery points award and post-delivery review.',
      status: 'projected'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Future View Delivery Timeline
              </h2>
              <p className="text-xs text-slate-500">
                AI simulated step-by-step projection of the upcoming delivery lifecycle
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsFutureViewOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Timeline list */}
        <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-6 py-2">
          {timeline.map((step, idx) => (
            <div key={idx} className="relative">
              
              {/* Bullet Node */}
              <div className="absolute -left-[35px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-slate-300 shadow-xs">
                {step.icon}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                    {step.time}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900">
                    {step.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* Close CTA */}
        <button
          onClick={() => setIsFutureViewOpen(false)}
          className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-xs"
        >
          Close Timeline
        </button>

      </div>
    </div>
  );
};
