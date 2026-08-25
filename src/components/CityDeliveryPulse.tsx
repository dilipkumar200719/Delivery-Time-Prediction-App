import React from 'react';
import { useApp } from '../context/AppContext';
import { Activity, MapPin, TrendingUp, AlertTriangle, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const CityDeliveryPulse: React.FC = () => {
  const zones = [
    { name: 'Madhapur Tech Zone', activeOrders: 342, avgEta: '18 min', status: 'OPTIMAL', delayRisk: '4%' },
    { name: 'HITEC City Cyber Towers', activeOrders: 488, avgEta: '24 min', status: 'CONGESTED', delayRisk: '22%' },
    { name: 'Kondapur Junction', activeOrders: 194, avgEta: '27 min', status: 'HIGH_SURGE', delayRisk: '34%' },
    { name: 'Gachibowli Financial District', activeOrders: 285, avgEta: '16 min', status: 'OPTIMAL', delayRisk: '6%' },
    { name: 'Knowledge City / T-Hub', activeOrders: 210, avgEta: '15 min', status: 'OPTIMAL', delayRisk: '5%' },
    { name: 'Jubilee Hills Road 36', activeOrders: 310, avgEta: '29 min', status: 'CONGESTED', delayRisk: '28%' }
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs space-y-5">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                City Delivery Pulse & Macro Hubs
              </h2>
              <span className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-[10px] font-black uppercase text-cyan-800 border border-cyan-200">
                HYDERABAD METRO
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Aggregate metropolitan traffic density, courier distribution and dynamic delivery latency
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-700">1,829 Active Deliveries</span>
        </div>
      </div>

      {/* Grid of City Zones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {zones.map((zone, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3 shadow-2xs hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <MapPin className="h-3.5 w-3.5 text-cyan-600" />
                {zone.name}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                zone.status === 'OPTIMAL' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                zone.status === 'MODERATE' ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' :
                zone.status === 'CONGESTED' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {zone.status.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block">Orders</span>
                <span className="text-xs font-bold text-slate-800">{zone.activeOrders}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Avg ETA</span>
                <span className="text-xs font-bold text-slate-800">{zone.avgEta}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Delay Risk</span>
                <span className="text-xs font-bold text-slate-800">{zone.delayRisk}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

