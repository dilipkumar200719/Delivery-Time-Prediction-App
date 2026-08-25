import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Receipt,
  Clock,
  Compass,
  Gamepad2,
  CheckCircle2,
  Truck,
  Sparkles,
  Bot,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const MyOrdersView: React.FC = () => {
  const {
    userOrders,
    activeOrder,
    setActiveTab,
    tracking
  } = useApp();

  return (
    <section className="space-y-6 pt-2">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              My Orders & AI Telemetry
            </h2>
            <span className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-bold text-cyan-700 border border-cyan-200">
              Firestore Persisted
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Track past and live delivery predictions, real arrival time comparisons, and gamification rewards.
          </p>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {userOrders.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-4 shadow-xs">
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <Receipt className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">No orders placed yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Place your first food order to activate live AI delivery tracking and play while you wait!
              </p>
            </div>
            <button
              onClick={() => setActiveTab('HOME')}
              className="rounded-xl bg-cyan-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-cyan-700 transition-colors shadow-xs"
            >
              Order Food Now
            </button>
          </div>
        ) : (
          userOrders.map((order) => {
            const isActive = activeOrder?.id === order.id;
            const predEta = order.prediction?.predictedEtaMinutes || 18;
            const confidence = Math.round((order.prediction?.confidence || 0.92) * 100);

            return (
              <div
                key={order.id}
                className={`rounded-2xl border bg-white p-5 sm:p-6 shadow-xs transition-all ${
                  isActive ? 'border-cyan-300 ring-1 ring-cyan-200' : 'border-slate-200'
                }`}
              >
                
                {/* Top Row: Order ID, Restaurant & Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">
                        {order.restaurantName}
                      </h3>
                      <span className="text-xs font-mono font-semibold text-slate-500">
                        #{order.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(order.startedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.status === 'DELIVERED' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Delivered</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-800 border border-cyan-200">
                        <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                        <span>{order.status.replace(/_/g, ' ')}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Middle: Items & AI Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-3 items-center">
                  
                  {/* Items list */}
                  <div className="md:col-span-6 space-y-1">
                    <div className="text-[11px] font-bold uppercase text-slate-400">Items Ordered</div>
                    <div className="text-xs text-slate-700 font-medium space-y-0.5">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between max-w-sm">
                          <span>{item.name} × {item.quantity}</span>
                          <span className="font-semibold text-slate-900">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs font-bold text-slate-900 pt-1">
                      Total: ₹{order.totalAmountRupees}
                    </div>
                  </div>

                  {/* AI Prediction Highlight */}
                  <div className="md:col-span-6 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <Bot className="h-3.5 w-3.5 text-cyan-600" />
                        <span>AI Estimated Arrival</span>
                      </div>
                      <div className="text-xl font-black text-slate-900 mt-0.5">
                        {predEta} min
                      </div>
                      <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                        <ShieldCheck className="h-3 w-3" /> {confidence}% confidence
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">Traffic & Corridor</span>
                      <span className="text-xs font-bold text-slate-700">
                        {order.conditions?.trafficLevel || 'Normal'}
                      </span>
                      {order.delayCompensationPoints && order.delayCompensationPoints > 0 && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 mt-1 block">
                          +{order.delayCompensationPoints} Pts SLA Compensated
                        </span>
                      )}
                    </div>
                  </div>

                </div>

                {/* Footer Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setActiveTab('TWIN')}
                    className="flex items-center gap-1.5 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-700 transition-colors shadow-xs"
                  >
                    <Compass className="h-3.5 w-3.5" />
                    <span>Track with AI Digital Twin</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('GAMES')}
                    className="flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2 text-xs font-bold text-purple-700 hover:bg-purple-100 transition-colors shadow-xs"
                  >
                    <Gamepad2 className="h-3.5 w-3.5 text-purple-600" />
                    <span>Play While Waiting</span>
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </section>
  );
};
