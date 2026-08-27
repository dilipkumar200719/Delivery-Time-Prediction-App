import React from 'react';
import { useApp } from '../context/AppContext';
import { User, Bike, Sparkles, Navigation, ShieldCheck, ArrowRight } from 'lucide-react';

interface RoleSelectorBarProps {
  className?: string;
  compact?: boolean;
}

export const RoleSelectorBar: React.FC<RoleSelectorBarProps> = ({ className = '', compact = false }) => {
  const { userRole, setUserRole, activeTab, setActiveTab } = useApp();

  const handleSelectRole = (role: 'CUSTOMER' | 'RIDER') => {
    setUserRole(role);
    if (role === 'RIDER') {
      setActiveTab('RIDER');
      window.location.hash = '#rider';
    } else {
      if (activeTab === 'RIDER') {
        setActiveTab('HOME');
        window.location.hash = '#home';
      }
    }
  };

  if (compact) {
    return (
      <div className={`flex items-center rounded-2xl bg-slate-900/90 p-1 border border-slate-700/80 shadow-lg backdrop-blur-md ${className}`}>
        <button
          id="btn-role-customer-compact"
          onClick={() => handleSelectRole('CUSTOMER')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            userRole === 'CUSTOMER' && activeTab !== 'RIDER'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <User className="h-3.5 w-3.5" />
          <span>Customer View</span>
        </button>

        <button
          id="btn-role-rider-compact"
          onClick={() => handleSelectRole('RIDER')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            userRole === 'RIDER' || activeTab === 'RIDER'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <Bike className="h-3.5 w-3.5" />
          <span>Delivery Boy / Rider</span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
        </button>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl border border-slate-200 bg-gradient-to-b from-white via-slate-50/50 to-orange-50/20 p-4 sm:p-6 shadow-sm ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 border border-orange-300 px-3 py-0.5 text-[11px] font-bold text-orange-950 mb-1">
            <Sparkles className="h-3 w-3 text-orange-600" />
            <span>Multi-Role Delivery Intelligence Experience</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
            Choose Your Experience
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Switch seamlessly between Customer tracking view and Rider delivery navigation mode.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Shared Real-Time State Sync</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Option 1: CUSTOMER / USER */}
        <button
          id="btn-select-customer-role"
          onClick={() => handleSelectRole('CUSTOMER')}
          className={`group relative text-left rounded-2xl p-5 transition-all duration-200 border-2 overflow-hidden ${
            userRole === 'CUSTOMER' && activeTab !== 'RIDER'
              ? 'bg-gradient-to-br from-orange-50/95 via-white to-amber-50/80 border-orange-500 shadow-md ring-4 ring-orange-500/10'
              : 'bg-white border-slate-200 hover:border-orange-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all ${
                userRole === 'CUSTOMER' && activeTab !== 'RIDER'
                  ? 'bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-orange-100 text-orange-700'
              }`}>
                <User className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-700 block">
                  ROLE 01
                </span>
                <h3 className="text-lg font-black text-slate-950">
                  👤 CUSTOMER / USER
                </h3>
              </div>
            </div>

            {userRole === 'CUSTOMER' && activeTab !== 'RIDER' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-600 text-white text-[10px] font-black px-2.5 py-0.5 shadow-2xs">
                Active View
              </span>
            )}
          </div>

          <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Track your food, AI ETA, live map, courier telemetry, and order status in real time.
          </p>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-200/70 text-xs font-bold text-orange-700">
            <span>Explore Menu &amp; Track Food</span>
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Option 2: DELIVERY BOY / RIDER */}
        <button
          id="btn-select-rider-role"
          onClick={() => handleSelectRole('RIDER')}
          className={`group relative text-left rounded-2xl p-5 transition-all duration-200 border-2 overflow-hidden ${
            userRole === 'RIDER' || activeTab === 'RIDER'
              ? 'bg-gradient-to-br from-cyan-950 via-slate-900 to-blue-950 text-white border-cyan-400 shadow-xl ring-4 ring-cyan-500/20'
              : 'bg-white border-slate-200 hover:border-cyan-400 hover:shadow-md'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all ${
                userRole === 'RIDER' || activeTab === 'RIDER'
                  ? 'bg-gradient-to-tr from-cyan-400 to-blue-500 text-slate-950 shadow-lg shadow-cyan-400/30'
                  : 'bg-cyan-100 text-cyan-800'
              }`}>
                <Bike className="h-6 w-6" />
              </div>
              <div>
                <span className={`text-[10px] font-black uppercase tracking-wider block ${
                  userRole === 'RIDER' || activeTab === 'RIDER' ? 'text-cyan-300' : 'text-cyan-700'
                }`}>
                  ROLE 02 • DISPATCH
                </span>
                <h3 className={`text-lg font-black ${
                  userRole === 'RIDER' || activeTab === 'RIDER' ? 'text-white' : 'text-slate-950'
                }`}>
                  🛵 DELIVERY BOY / RIDER
                </h3>
              </div>
            </div>

            {userRole === 'RIDER' || activeTab === 'RIDER' ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 shadow-2xs animate-pulse">
                Active View
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-cyan-100 text-cyan-900 text-[10px] font-black px-2 py-0.5 border border-cyan-200">
                Switch Role
              </span>
            )}
          </div>

          <p className={`mt-3 text-xs sm:text-sm leading-relaxed font-medium ${
            userRole === 'RIDER' || activeTab === 'RIDER' ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Manage deliveries, pickup &amp; drop routes, customer OTP verification, navigation &amp; live earnings.
          </p>

          <div className={`mt-4 flex items-center justify-between pt-3 border-t text-xs font-bold ${
            userRole === 'RIDER' || activeTab === 'RIDER'
              ? 'border-slate-800 text-cyan-300'
              : 'border-slate-200/70 text-cyan-700'
          }`}>
            <span>Launch Rider Navigation &amp; Orders</span>
            <Navigation className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

      </div>
    </div>
  );
};
