import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ShoppingBag,
  Coins,
  MapPin,
  Search,
  User,
  Activity,
  Volume2,
  VolumeX,
  Compass,
  Utensils,
  Receipt,
  Gamepad2,
  BrainCircuit,
  Sliders
} from 'lucide-react';
import { AppTab } from '../types';

export const Navbar: React.FC = () => {
  const {
    user,
    activeOrder,
    tracking,
    activeTab,
    setActiveTab,
    cartCount,
    setIsCartOpen,
    setIsJudgeModeOpen,
    setIsWalletOpen,
    setIsAuthOpen,
    setIsAdminOpen,
    ttsEnabled,
    setTtsEnabled,
    searchQuery,
    setSearchQuery,
    isDbConnected
  } = useApp();

  const navItems: { tab: AppTab; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { tab: 'HOME', label: 'Home', icon: Utensils },
    { tab: 'RESTAURANTS', label: 'Restaurants', icon: Compass },
    { tab: 'ORDERS', label: 'My Orders', icon: Receipt },
    { tab: 'TWIN', label: 'AI Tracking', icon: BrainCircuit, badge: 'Live' },
    { tab: 'GAMES', label: 'Play & Earn', icon: Gamepad2 },
    { tab: 'PULSE', label: 'City Pulse', icon: Activity },
    { tab: 'ROUTES', label: 'Route Battle', icon: MapPin },
    { tab: 'DECISION_ROOM', label: 'AI Decisions', icon: Sliders }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        
        {/* Left: Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('HOME')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-sm shadow-cyan-600/20 group-hover:scale-105 transition-transform">
              <BrainCircuit className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  Predict<span className="text-cyan-600">Eats</span>
                </span>
                <span className="rounded-md bg-cyan-50 px-1.5 py-0.5 text-[10px] font-bold font-mono text-cyan-700 border border-cyan-200">
                  AI
                </span>
              </div>
              <p className="hidden text-[10px] font-medium tracking-wide text-slate-500 sm:block">
                Predict • Optimize • Play • Reward
              </p>
            </div>
          </button>

          {/* Location Chip */}
          <div className="hidden xl:flex items-center gap-1.5 rounded-full bg-slate-100/90 px-3 py-1 text-xs text-slate-700 border border-slate-200">
            <MapPin className="h-3.5 w-3.5 text-cyan-600 shrink-0" />
            <span className="font-medium truncate max-w-[140px]">Indiranagar, Bengaluru</span>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
          {navItems.map(({ tab, label, icon: Icon, badge }) => {
            const isActive = activeTab === tab || (tab === 'TWIN' && activeTab === 'TRACKING');
            return (
              <button
                key={tab}
                id={`nav-tab-${tab.toLowerCase()}`}
                onClick={() => setActiveTab(tab)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-cyan-600' : 'text-slate-400'}`} />
                <span>{label}</span>
                {badge && (
                  <span className={`text-[9px] font-bold px-1 rounded-full ${
                    isActive ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Section: Search, Points, Cart, Judge Mode & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Search */}
          <div className="relative hidden xl:block w-40">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search food, dish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Delivery Points Wallet Pill */}
          <button
            id="nav-wallet-button"
            onClick={() => setIsWalletOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100/80 transition-all shadow-xs"
            title="Rewards Wallet & Points History"
          >
            <Coins className="h-3.5 w-3.5 text-amber-600" />
            <span>{user?.deliveryPoints ?? 250} Pts</span>
            <span className="hidden sm:inline text-amber-700/80 font-normal">• ₹{user?.rewardBalanceRupees ?? 25}</span>
          </button>

          {/* Judge Mode Button */}
          <button
            id="nav-judge-button"
            onClick={() => setIsJudgeModeOpen(true)}
            className="group relative flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 border border-pink-200 px-3 py-1.5 text-xs font-bold text-pink-700 hover:border-pink-300 hover:bg-pink-100/70 transition-all shadow-xs"
            title="Live ML Interactive Simulator"
          >
            <Sparkles className="h-3.5 w-3.5 text-pink-600 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">🎤</span>
            <span className="font-extrabold tracking-tight">JUDGE MODE</span>
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
            </span>
          </button>

          {/* Cart Button with Reactive Badge */}
          <button
            id="nav-cart-button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center h-9 px-3 gap-1.5 rounded-xl bg-cyan-600 text-white font-bold text-xs hover:bg-cyan-700 transition-colors shadow-sm shadow-cyan-600/20"
            title="Open Cart"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white text-cyan-800 text-[11px] font-black px-1.5 shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Audio TTS Toggle */}
          <button
            id="nav-tts-toggle"
            onClick={() => setTtsEnabled(!ttsEnabled)}
            title={ttsEnabled ? 'AI Voice Enabled (Click to Mute)' : 'Enable AI Voice Narration'}
            className={`hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
              ttsEnabled
                ? 'border-cyan-400 bg-cyan-50 text-cyan-700'
                : 'border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          {/* Admin Control Center Button */}
          <button
            id="nav-admin-button"
            onClick={() => setIsAdminOpen(true)}
            title="Admin Simulation & Model Parameters"
            className="hidden sm:flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
          >
            <Sliders className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden md:inline">Admin</span>
          </button>

          {/* User Profile */}
          <button
            id="nav-user-button"
            onClick={() => setIsAuthOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <div className="relative">
              <User className="h-4 w-4 text-cyan-600" />
              {isDbConnected && (
                <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500" title="Firestore Sync Active" />
              )}
            </div>
            <span className="hidden md:inline font-semibold max-w-[90px] truncate">
              {user?.displayName || 'User'}
            </span>
          </button>

        </div>
      </div>

      {/* Mobile Navigation Row */}
      <div className="lg:hidden flex items-center justify-between overflow-x-auto no-scrollbar border-t border-slate-100 bg-slate-50/95 px-2 py-1.5 gap-1">
        {navItems.map(({ tab, label, icon: Icon }) => {
          const isActive = activeTab === tab || (tab === 'TWIN' && activeTab === 'TRACKING');
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] whitespace-nowrap ${
                isActive ? 'text-cyan-700 font-extrabold bg-white shadow-xs' : 'text-slate-500 font-medium'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-600' : 'text-slate-400'}`} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
