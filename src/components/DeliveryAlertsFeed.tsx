import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  CheckCircle2,
  Bike,
  AlertTriangle,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  X
} from 'lucide-react';

interface DeliveryAlertItem {
  id: string;
  type: 'pickup' | 'transit' | 'traffic' | 'weather' | 'proximity' | 'otp';
  title: string;
  message: string;
  timeAgo: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  isRead?: boolean;
}

export const DeliveryAlertsFeed: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { tracking, conditions } = useApp();
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const progress = tracking?.driverPosition?.progress ?? 32;
  const etaMinutes = tracking?.etaMinutes ?? 18;

  // Build live contextual alerts based on conditions and progress
  const alerts = useMemo<DeliveryAlertItem[]>(() => {
    const list: DeliveryAlertItem[] = [
      {
        id: 'alert_otp',
        type: 'otp',
        title: 'Delivery OTP Code: 8553',
        message: 'Share this 4-digit security code with Rahul Kumar upon delivery for contactless handover.',
        timeAgo: 'Just now',
        icon: ShieldCheck,
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
      },
      {
        id: 'alert_proximity',
        type: 'proximity',
        title: progress > 70 ? 'Rider is 500m away!' : `Rider is ${tracking?.distanceRemainingKm || 2.4} km away`,
        message: progress > 70 ? 'Please be ready to receive your fresh order.' : `Estimated arrival in ~${etaMinutes} minutes.`,
        timeAgo: '1m ago',
        icon: Bike,
        color: 'text-cyan-800 bg-cyan-50 border-cyan-200'
      }
    ];

    if (conditions.trafficLevel === 'SEVERE' || conditions.trafficLevel === 'HIGH' || conditions.trafficLevel === 'MEDIUM') {
      list.push({
        id: 'alert_traffic',
        type: 'traffic',
        title: `Traffic Alert: ${conditions.trafficLevel} Congestion`,
        message: 'Transit delay of ~3–6 min detected. AI dynamic routing engaged to minimize travel time.',
        timeAgo: '3m ago',
        icon: AlertTriangle,
        color: 'text-amber-800 bg-amber-50 border-amber-200'
      });
    }

    if (conditions.weatherCondition === 'RAIN' || conditions.weatherCondition === 'HEAVY_RAIN' || conditions.weatherCondition === 'STORM') {
      list.push({
        id: 'alert_weather',
        type: 'weather',
        title: `Weather Advisory: ${conditions.weatherCondition.replace(/_/g, ' ')}`,
        message: 'Rain impact may add 4–7 min for rider safety and braking distance.',
        timeAgo: '5m ago',
        icon: Clock,
        color: 'text-blue-800 bg-blue-50 border-blue-200'
      });
    }

    list.push({
      id: 'alert_pickup',
      type: 'pickup',
      title: 'Order Picked Up',
      message: 'Rahul Kumar picked up your food package from Spice Route Kitchen (Madhapur).',
      timeAgo: '8m ago',
      icon: CheckCircle2,
      color: 'text-slate-800 bg-slate-50 border-slate-200'
    });

    return list.filter(item => !dismissedAlerts.includes(item.id));
  }, [conditions.trafficLevel, conditions.weatherCondition, progress, etaMinutes, tracking?.distanceRemainingKm, dismissedAlerts]);

  const handleDismiss = (id: string) => {
    setDismissedAlerts(prev => [...prev, id]);
  };

  return (
    <div className={`overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4 ${className}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Smart Delivery Alerts</span>
              <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-ping" />
            </h3>
          </div>
        </div>

        <span className="text-[11px] font-bold text-slate-400">
          {alerts.length} active updates
        </span>
      </div>

      {/* Alert Items Feed */}
      <div className="space-y-2.5">
        {alerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <div
              key={alert.id}
              className={`rounded-2xl border p-3.5 flex items-start gap-3 transition-all ${alert.color}`}
            >
              <div className="mt-0.5 shrink-0">
                <Icon className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">{alert.title}</h4>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">{alert.timeAgo}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-normal">{alert.message}</p>
              </div>

              <button
                onClick={() => handleDismiss(alert.id)}
                className="text-slate-400 hover:text-slate-600 p-0.5"
                title="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
