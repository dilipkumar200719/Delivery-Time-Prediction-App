import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_CITIES } from '../data/cities';
import {
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
  Sliders,
  ChevronDown,
  TrendingUp,
  Sparkles,
  X
} from 'lucide-react';
import { AppTab } from '../types';

export const Navbar: React.FC = () => {
  const {
    user,
    activeTab,
    setActiveTab,
    selectedCity,
    setIsLocationModalOpen,
    cartCount,
    setIsCartOpen,
    setIsWalletOpen,
    setIsAuthOpen,
    setIsAdminOpen,
    ttsEnabled,
    setTtsEnabled,
    searchQuery,
    setSearchQuery,
    isDbConnected
  } = useApp();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const cityInfo = SUPPORTED_CITIES[selectedCity] || SUPPORTED_CITIES.Vijayawada;

  const searchSuggestions = [
    { label: 'Royal Chicken Dum Biryani', category: 'Biryani' },
    { label: 'Smoked Peri-Peri Paneer Pizza', category: 'Pizza' },
    { label: 'Truffle Smash Cheeseburger', category: 'Burger' },
    { label: 'Hakka Noodles & Dimsum', category: 'Chinese' },
    { label: 'Belgian Chocolate Waffle', category: 'Dessert' }
  ];

  // Close search suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: {
    tab: AppTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: string;
    activeStyle: string;
    activeIconColor: string;
  }[] = [
    {
      tab: 'HOME',
      label: 'Home',
      icon: Utensils,
      activeStyle: 'bg-orange-50 text-orange-950 border-orange-200 font-black shadow-2xs',
      activeIconColor: 'text-orange-600'
    },
    {
      tab: 'RESTAURANTS',
      label: 'Restaurants',
      icon: Compass,
      activeStyle: 'bg-amber-50 text-amber-950 border-amber-200 font-black shadow-2xs',
      activeIconColor: 'text-amber-600'
    },
    {
      tab: 'ORDERS',
      label: 'My Orders',
      icon: Receipt,
      activeStyle: 'bg-sky-50 text-sky-950 border-sky-200 font-black shadow-2xs',
      activeIconColor: 'text-sky-600'
    },
    {
      tab: 'TWIN',
      label: 'Track Order',
      icon: BrainCircuit,
      badge: 'Live',
      activeStyle: 'bg-cyan-50 text-cyan-950 border-cyan-300 font-black shadow-2xs',
      activeIconColor: 'text-cyan-600'
    },
    {
      tab: 'INSIGHTS',
      label: 'AI Insights',
      icon: Sparkles,
      badge: 'AI',
      activeStyle: 'bg-indigo-50 text-indigo-950 border-indigo-300 font-black shadow-2xs',
      activeIconColor: 'text-indigo-600'
    },
    {
      tab: 'GAMES',
      label: 'Play & Earn',
      icon: Gamepad2,
      activeStyle: 'bg-purple-50 text-purple-950 border-purple-200 font-black shadow-2xs',
      activeIconColor: 'text-purple-600'
    },
    {
      tab: 'PULSE',
      label: 'City Pulse',
      icon: Activity,
      activeStyle: 'bg-emerald-50 text-emerald-950 border-emerald-200 font-black shadow-2xs',
      activeIconColor: 'text-emerald-600'
    }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-orange-100/80 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 py-2.5">
        
        {/* Left: Brand Logo & Interactive Location Selector */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Original PredictEats AI Logo */}
          <button
            onClick={() => setActiveTab('HOME')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 via-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-600/20 group-hover:scale-105 transition-transform">
              <BrainCircuit className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400 border border-white"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-slate-900">
                  Predict<span className="text-cyan-600">Eats</span>
                </span>
                <span className="rounded-md bg-cyan-100 px-1.5 py-0.5 text-[10px] font-black font-mono text-cyan-800 border border-cyan-200">
                  AI
                </span>
              </div>
              <p className="hidden text-[10px] font-bold tracking-wide text-slate-500 sm:block">
                Predict. Personalize. Track. Deliver.
              </p>
            </div>
          </button>

          {/* Interactive Location Selector Button */}
          <button
            id="navbar-city-selector"
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-orange-50/80 hover:bg-orange-100 px-3 py-1 text-xs text-orange-950 border border-orange-200 transition-all shadow-2xs group"
            title="Change City"
          >
            <MapPin className="h-3.5 w-3.5 text-orange-600 group-hover:scale-110 transition-transform shrink-0" />
            <div className="flex items-center gap-1">
              <span className="font-bold text-slate-900">{cityInfo.name}</span>
              <span className="hidden md:inline text-slate-600 font-medium truncate max-w-[120px]">
                • {cityInfo.popularArea.split('&')[0]}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-orange-400 group-hover:text-orange-600 transition-colors" />
          </button>
        </div>

        {/* Center: Desktop Navigation Tabs with Colorful Active States */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/80">
          {navItems.map(({ tab, label, icon: Icon, badge, activeStyle, activeIconColor }) => {
            const isActive = activeTab === tab || (tab === 'TWIN' && activeTab === 'TRACKING');
            return (
              <button
                key={tab}
                id={`nav-tab-${tab.toLowerCase()}`}
                onClick={() => setActiveTab(tab)}
                className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs transition-all border ${
                  isActive
                    ? activeStyle
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/70 font-semibold'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? activeIconColor : 'text-slate-400'}`} />
                <span>{label}</span>
                {badge && (
                  <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-cyan-600 text-white' : 'bg-cyan-100 text-cyan-800'
                  }`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Section: Search, Points, Cart, Audio TTS & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Search with Autocomplete Popover */}
          <div ref={searchContainerRef} className="relative hidden xl:block w-44">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search dishes, cuisine..."
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3 w-3" />
              </button>
            )}

            {/* Search Suggestions Popover */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 mt-1.5 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl backdrop-blur-md z-50 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-cyan-600" />
                    Popular Searches
                  </span>
                </div>
                <div className="space-y-1">
                  {searchSuggestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchQuery(item.label);
                        setIsSearchFocused(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-xs hover:bg-orange-50 flex items-center justify-between text-slate-700 hover:text-orange-950 group"
                    >
                      <span className="truncate">{item.label}</span>
                      <span className="text-[10px] text-slate-400 group-hover:text-orange-600 font-mono">
                        {item.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Delivery Points Wallet Pill */}
          <button
            id="nav-wallet-button"
            onClick={() => setIsWalletOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-300 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-all shadow-2xs"
            title="Rewards Wallet & Points History"
          >
            <Coins className="h-3.5 w-3.5 text-amber-600" />
            <span>{user?.deliveryPoints ?? 250} Pts</span>
            <span className="hidden sm:inline text-amber-800/80 font-normal">• ₹{user?.rewardBalanceRupees ?? 25}</span>
          </button>

          {/* Cart Button with Reactive Badge */}
          <button
            id="nav-cart-button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center h-9 px-3 gap-1.5 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 transition-colors shadow-sm shadow-orange-600/20"
            title="Open Cart"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white text-orange-900 text-[11px] font-black px-1.5 shadow-2xs">
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
            title="Simulation Parameters & Tuning"
            className="hidden sm:flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
          >
            <Sliders className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden md:inline">Admin</span>
          </button>

          {/* User Profile Button */}
          <button
            id="nav-user-button"
            onClick={() => setIsAuthOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <div className="relative">
              <User className="h-4 w-4 text-cyan-600" />
              {isDbConnected && (
                <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500" title="Firestore Connected" />
              )}
            </div>
            <span className="hidden md:inline font-semibold max-w-[90px] truncate">
              {user?.displayName || 'User'}
            </span>
          </button>

        </div>
      </div>

      {/* Mobile Bottom-Friendly Row Navigation */}
      <div className="lg:hidden flex items-center justify-between overflow-x-auto no-scrollbar border-t border-slate-100 bg-white/95 px-2 py-1.5 gap-1">
        {navItems.map(({ tab, label, icon: Icon, activeIconColor }) => {
          const isActive = activeTab === tab || (tab === 'TWIN' && activeTab === 'TRACKING');
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] whitespace-nowrap transition-all ${
                isActive ? 'text-slate-900 font-black bg-orange-50 border border-orange-200 shadow-2xs' : 'text-slate-500 font-medium'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? activeIconColor : 'text-slate-400'}`} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
