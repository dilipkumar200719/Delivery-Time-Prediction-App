import React from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_CITIES } from '../data/cities';
import {
  Search,
  ShieldCheck,
  CloudRain,
  Flame,
  Sun,
  Bike,
  ChevronRight
} from 'lucide-react';

const RIDER_AVATAR_IMG = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

export const CustomerHero: React.FC = () => {
  const {
    prediction,
    selectedCity,
    setActiveTab,
    updateConditions,
    tracking,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    isDeliveryCompleted
  } = useApp();

  const cityInfo = SUPPORTED_CITIES[selectedCity] || SUPPORTED_CITIES.Vijayawada;
  const currentEta = isDeliveryCompleted ? 0 : (tracking?.etaMinutes ?? prediction?.predictedEtaMinutes ?? 24);
  const confidencePercent = Math.round((prediction?.confidence || 0.92) * 100);

  const popularSearches = [
    { label: '🍗 Biryani', category: 'Biryani' },
    { label: '🍕 Pizza', category: 'Pizza' },
    { label: '🍔 Burgers', category: 'Burgers' },
    { label: '🍛 Meals & Thali', category: 'Indian' },
    { label: '🍰 Desserts', category: 'Desserts' },
    { label: '🥗 Healthy', category: 'Healthy' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const catalogEl = document.getElementById('food-catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryQuickSelect = (catName: string) => {
    setSelectedCategory(catName);
    const catalogEl = document.getElementById('food-catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const applyPreset = async (presetName: string) => {
    if (presetName === 'storm_traffic') {
      await updateConditions({
        trafficLevel: 'SEVERE',
        weatherCondition: 'HEAVY_RAIN',
        distanceKm: 6.8,
        restaurantPrepTime: 14
      }, '⚡ Monsoon Storm & Traffic Gridlock');
    } else if (presetName === 'kitchen_surge') {
      await updateConditions({
        trafficLevel: 'MEDIUM',
        weatherCondition: 'CLEAR',
        restaurantPrepTime: 22,
        storeStatus: 'DELAYED'
      }, '🍕 Kitchen Peak Surge Delay');
    } else if (presetName === 'sunny_sprint') {
      await updateConditions({
        trafficLevel: 'LOW',
        weatherCondition: 'CLEAR',
        distanceKm: 3.2,
        restaurantPrepTime: 6,
        storeStatus: 'READY'
      }, '☀️ Clear Sprint Express Corridor');
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-orange-200/80 bg-gradient-to-br from-orange-50/90 via-amber-50/50 to-rose-50/30 p-5 sm:p-8 shadow-xs">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -z-10 h-64 w-64 rounded-full bg-cyan-200/30 blur-3xl pointer-events-none" />

      <div className="space-y-6">
        
        {/* Top Header & Search Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 border border-orange-300 px-3.5 py-1 text-xs font-bold text-orange-950">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>PredictEats AI • Real-Time Food Delivery Intelligence</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 leading-[1.12]">
                Your food is on the way. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-cyan-600">
                  Predict when it arrives. Understand why.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-700 max-w-xl leading-relaxed">
                Discover top-rated restaurants in <span className="font-bold text-slate-900">{cityInfo.name}</span> with multi-modal AI analyzing live kitchen prep, corridor bottlenecks, and courier telemetry.
              </p>
            </div>

            {/* Consumer Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search restaurants, dishes & cuisines (e.g. Biryani, Pizza)..."
                  className="w-full rounded-2xl border border-orange-200 bg-white py-3.5 pl-12 pr-28 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-orange-500 focus:outline-hidden focus:ring-3 focus:ring-orange-500/15 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 rounded-xl bg-orange-600 hover:bg-orange-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Popular Quick Cravings Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Popular:
              </span>
              {popularSearches.map(item => (
                <button
                  key={item.category}
                  onClick={() => handleCategoryQuickSelect(item.category)}
                  className="rounded-xl border border-orange-200 bg-white/90 hover:bg-orange-100 hover:border-orange-300 px-3 py-1 text-xs font-semibold text-slate-800 hover:text-orange-950 shadow-2xs transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>

          </div>

          {/* Right: Active Order Live ETA Card */}
          <div className="lg:col-span-4">
            <div className="rounded-3xl border border-orange-200/90 bg-white p-5 sm:p-6 shadow-md space-y-4">
              
              <div className="flex items-center justify-between border-b border-orange-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold tracking-wider text-slate-900 uppercase">
                    Live Order Tracker
                  </span>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-900 border border-emerald-200">
                  {isDeliveryCompleted ? '🟢 Delivered' : '🟢 On Track'}
                </span>
              </div>

              {/* ETA Display */}
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                      {currentEta}
                    </span>
                    <span className="text-lg font-bold text-cyan-700">min</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isDeliveryCompleted
                      ? 'Delivered at Doorstep'
                      : `Arriving ~${new Date(Date.now() + currentEta * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>{confidencePercent}% Confident</span>
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">Multi-signal verified</p>
                </div>
              </div>

              {/* Mini Courier Status with Real Rider Avatar */}
              <div className="rounded-2xl bg-gradient-to-r from-cyan-50/80 to-blue-50/80 border border-cyan-200 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <img
                      src={RIDER_AVATAR_IMG}
                      alt="Rahul Kumar"
                      className="h-10 w-10 rounded-xl object-cover border border-cyan-400 shadow-xs"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-cyan-600 text-white text-[8px]">
                      🛵
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Rahul Kumar</h4>
                    <span className="text-[10px] text-cyan-800 font-bold block">Ather EV • {isDeliveryCompleted ? 'Delivered' : 'On the way'}</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('TWIN')}
                  className="rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1.5 text-xs font-bold transition-colors shadow-xs"
                >
                  Track Map
                </button>
              </div>

              {/* Fast Scenario Simulator */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500">Test Scenarios:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => applyPreset('storm_traffic')}
                    className="p-1.5 rounded-lg border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-700 transition-colors"
                    title="Simulate Monsoon Storm (+5m)"
                  >
                    <CloudRain className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => applyPreset('kitchen_surge')}
                    className="p-1.5 rounded-lg border border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-amber-700 transition-colors"
                    title="Simulate Kitchen Surge (+8m)"
                  >
                    <Flame className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => applyPreset('sunny_sprint')}
                    className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-700 transition-colors"
                    title="Simulate Clear Sprint (-4m)"
                  >
                    <Sun className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Active Order Banner if Order Exists */}
        <div className="rounded-2xl border border-orange-300 bg-gradient-to-r from-orange-100/90 via-amber-100/70 to-white p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-sm">
              <Bike className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-900">Your order is on the way 🛵</span>
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-900 border border-emerald-200">
                  {cityInfo.restaurantName}
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-0.5">
                Expected delivery in <span className="font-bold text-orange-950">{currentEta} mins</span> • Rahul Kumar is moving along {cityInfo.primaryRoads}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('TWIN')}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-black text-white px-4 py-2 text-xs font-bold transition-all shadow-xs"
            >
              <span>Track Live on Map</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>

    </section>
  );
};
