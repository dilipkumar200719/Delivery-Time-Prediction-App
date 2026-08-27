import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RESTAURANTS_DATA, Restaurant } from '../data/foodCatalog';
import {
  Star,
  Clock,
  MapPin,
  Bot,
  Zap,
  TrendingUp,
  Tag,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  Layers
} from 'lucide-react';

export const RestaurantsView: React.FC = () => {
  const { setSelectedCategory, setActiveTab, conditions } = useApp();
  const [filterMode, setFilterMode] = useState<'ALL' | 'FASTEST' | 'TOP_RATED' | 'BEST_VALUE'>('ALL');

  // Compute live ETA for each restaurant node
  const getRestaurantETA = (rest: Restaurant) => {
    const transitMin = Math.round(rest.distanceKm * 2.6);
    const trafficMod = conditions.trafficLevel === 'SEVERE' ? 6 : conditions.trafficLevel === 'HIGH' ? 4 : 1;
    const weatherMod = conditions.weatherCondition === 'HEAVY_RAIN' ? 4 : conditions.weatherCondition === 'RAIN' ? 2 : 0;
    const total = rest.avgPrepTime + transitMin + trafficMod + weatherMod;
    const min = Math.max(14, total - 3);
    const max = Math.max(min + 4, total + 3);
    return { min, max, total, label: `${min}–${max} min` };
  };

  const sortedRestaurants = [...RESTAURANTS_DATA].sort((a, b) => {
    if (filterMode === 'FASTEST') {
      return getRestaurantETA(a).total - getRestaurantETA(b).total;
    }
    if (filterMode === 'TOP_RATED') {
      return b.rating - a.rating;
    }
    if (filterMode === 'BEST_VALUE') {
      return (b.rating / (b.distanceKm + 1)) - (a.rating / (a.distanceKm + 1));
    }
    return 0;
  });

  const fastestRestaurant = [...RESTAURANTS_DATA].sort((a, b) => getRestaurantETA(a).total - getRestaurantETA(b).total)[0];

  const handleRestaurantSelect = (rest: Restaurant) => {
    setSelectedCategory('All');
    setActiveTab('HOME');
    setTimeout(() => {
      const el = document.getElementById('food-catalog-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <section className="space-y-6 pt-2">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Partner Kitchens &amp; AI Dispatch Nodes
            </h2>
            <span className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-bold text-cyan-700 border border-cyan-200">
              5 Live Telemetry Nodes
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time kitchen queue telemetry, preparation velocity tracking, and algorithmic ETA calculation.
          </p>
        </div>

        {/* Fastest Highlight Badge */}
        {fastestRestaurant && (
          <div className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 px-3.5 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-black tracking-wider text-emerald-800">
                Fastest AI Predicted Delivery
              </div>
              <div className="text-xs font-bold text-slate-900">
                {fastestRestaurant.name} • <strong className="text-emerald-700 font-mono">{getRestaurantETA(fastestRestaurant).label}</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilterMode('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            filterMode === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Kitchens ({RESTAURANTS_DATA.length})
        </button>
        <button
          onClick={() => setFilterMode('FASTEST')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            filterMode === 'FASTEST'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          <Zap className="h-3.5 w-3.5" />
          <span>⚡ Fastest Delivery</span>
        </button>
        <button
          onClick={() => setFilterMode('TOP_RATED')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            filterMode === 'TOP_RATED'
              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
              : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50'
          }`}
        >
          <Star className="h-3.5 w-3.5" />
          <span>⭐ Best Rated</span>
        </button>
        <button
          onClick={() => setFilterMode('BEST_VALUE')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            filterMode === 'BEST_VALUE'
              ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
              : 'bg-white text-cyan-700 border-cyan-200 hover:bg-cyan-50'
          }`}
        >
          <Award className="h-3.5 w-3.5" />
          <span>🏆 Best Value AI</span>
        </button>
      </div>

      {/* Grid of Kitchens - ETA FIRST DESIGN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedRestaurants.map((rest) => {
          const restEta = getRestaurantETA(rest);
          const isFastest = rest.id === fastestRestaurant.id;

          return (
            <div
              key={rest.id}
              onClick={() => handleRestaurantSelect(rest)}
              className={`group cursor-pointer overflow-hidden rounded-3xl border bg-white shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${
                isFastest
                  ? 'border-emerald-300 ring-2 ring-emerald-400/30'
                  : 'border-slate-200 hover:border-cyan-300'
              }`}
            >
              
              {/* Image & Badges */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                <img
                  src={rest.image}
                  alt={rest.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80';
                  }}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* HERO AI ETA PROMINENT BADGE (ETA FIRST) */}
                <div className="absolute top-3 left-3 flex items-center gap-2 rounded-2xl bg-slate-950/90 text-white px-3 py-1.5 backdrop-blur-md shadow-lg border border-white/10">
                  <Bot className="h-4 w-4 text-cyan-400 animate-pulse" />
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-cyan-300">
                      AI PREDICTED ETA
                    </span>
                    <span className="text-sm font-black text-white font-mono leading-none">
                      {restEta.label}
                    </span>
                  </div>
                </div>

                {/* Confidence Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-xl bg-white/95 px-2.5 py-1 text-[10px] font-black text-emerald-800 backdrop-blur-xs shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>92% Conf</span>
                </div>

                {/* Discount Tag */}
                {rest.discount && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-lg bg-cyan-600 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
                    <Tag className="h-3 w-3" />
                    <span>{rest.discount}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-slate-900 group-hover:text-cyan-700 transition-colors">
                      {rest.name}
                    </h3>
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      {rest.rating} ({rest.ratingCount})
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1">{rest.cuisine}</p>
                </div>

                {/* Telemetry Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 rounded-xl p-2">
                    <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>Kitchen Prep: <strong className="text-slate-900 font-mono">{rest.avgPrepTime}m</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 rounded-xl p-2">
                    <MapPin className="h-3.5 w-3.5 text-cyan-600 shrink-0" />
                    <span>Transit: <strong className="text-slate-900 font-mono">{rest.distanceKm} km</strong></span>
                  </div>
                </div>

                {/* View Menu Button */}
                <button className="w-full flex items-center justify-center gap-1.5 rounded-2xl bg-cyan-50 group-hover:bg-cyan-600 py-3 text-xs font-bold text-cyan-900 group-hover:text-white transition-all shadow-2xs">
                  <span>Explore Dishes &amp; Order</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
