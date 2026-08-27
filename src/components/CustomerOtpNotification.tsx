import React from 'react';
import { useApp } from '../context/AppContext';
import {
  KeyRound,
  ShieldCheck,
  Bike,
  Sparkles,
  MapPin,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export const CustomerOtpNotification: React.FC<{ className?: string }> = ({ className = '' }) => {
  const {
    isWaitingForOtp,
    otpRequested,
    isRiderArrived,
    isDeliveryCompleted,
    activeOrder,
    setIsOtpModalOpen,
    tracking
  } = useApp();

  const isEligible = (isWaitingForOtp || otpRequested || isRiderArrived || (tracking?.driverPosition?.progress ?? 0) >= 95) && !isDeliveryCompleted;

  if (!isEligible) return null;

  const orderId = activeOrder?.id || 'ORD-8553';
  const deliveryOtp = activeOrder?.deliveryOtp || '8553';
  const restaurantName = activeOrder?.restaurantName || 'Spice Route Kitchen';

  return (
    <div
      id="customer-delivery-verification-banner"
      className={`rounded-3xl border-2 border-amber-400/90 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-4 sm:p-5 shadow-xl shadow-amber-500/20 animate-in fade-in duration-300 relative overflow-hidden ${className}`}
    >
      {/* Background ambient pulse */}
      <div className="absolute top-0 right-0 -z-0 h-48 w-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left icon and message */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-amber-600 shadow-md shadow-amber-950/20">
            <KeyRound className="h-6 w-6" />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white border border-white/30">
                <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                Delivery Verification Required
              </span>
              <span className="font-mono text-xs font-bold text-amber-100 bg-amber-950/30 px-2 py-0.5 rounded-md border border-amber-300/30">
                Order #{orderId}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-white leading-tight">
              Your delivery partner has reached your location!
            </h3>

            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-medium">
              Please provide the 4-digit delivery OTP to Rahul Sharma to safely complete your order from <strong>{restaurantName}</strong>.
            </p>
          </div>
        </div>

        {/* Right Action Button & OTP Badge */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 self-end md:self-center">
          
          <div className="hidden sm:flex flex-col items-end rounded-2xl bg-amber-950/30 border border-white/20 px-3.5 py-1.5 backdrop-blur-md">
            <span className="text-[10px] font-bold text-amber-200 uppercase tracking-wider">
              Your Delivery OTP
            </span>
            <span className="font-mono text-base font-black text-white tracking-widest">
              {deliveryOtp}
            </span>
          </div>

          <button
            id="btn-customer-enter-otp"
            onClick={() => setIsOtpModalOpen(true)}
            className="rounded-2xl bg-white hover:bg-amber-50 text-slate-950 hover:text-orange-950 px-5 py-3 text-xs sm:text-sm font-black transition-all shadow-lg shadow-amber-950/30 flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <ShieldCheck className="h-4 w-4 text-orange-600" />
            <span>ENTER OTP</span>
            <ChevronRight className="h-4 w-4 text-orange-600" />
          </button>
          
        </div>

      </div>
    </div>
  );
};
