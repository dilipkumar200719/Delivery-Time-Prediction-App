import React from 'react';
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
  ArrowRight
} from 'lucide-react';

export const RestaurantsView: React.FC = () => {
  const { setSelectedCategory, setActiveTab } = useApp();

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
              Partner Kitchens & Digital Nodes
            </h2>
            <span className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-bold text-cyan-700 border border-cyan-200">
              5 Verified Nodes
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time kitchen telemetry, preparation speed tracking, and automated dispatch corridors.
          </p>
        </div>
      </div>

      {/* Grid of Kitchens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {RESTAURANTS_DATA.map((rest) => (
          <div
            key={rest.id}
            onClick={() => handleRestaurantSelect(rest)}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-all duration-200 hover:border-slate-300 flex flex-col justify-between"
          >
            
            {/* Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
              <img
                src={rest.image}
                alt={rest.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80';
                }}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* AI Status Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1 backdrop-blur-xs shadow-xs text-xs font-bold text-slate-900">
                <Bot className="h-3.5 w-3.5 text-cyan-600" />
                <span>AI Dispatch: </span>
                <span className={
                  rest.aiStatus === 'OPTIMAL' ? 'text-emerald-600' :
                  rest.aiStatus === 'MODERATE' ? 'text-amber-600' : 'text-blue-600'
                }>
                  {rest.aiStatus}
                </span>
              </div>

              {/* Discount Tag */}
              {rest.discount && (
                <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-md bg-cyan-600 px-2 py-0.5 text-[11px] font-bold text-white shadow-xs">
                  <Tag className="h-3 w-3" />
                  <span>{rest.discount}</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                    {rest.name}
                  </h3>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    {rest.rating} ({rest.ratingCount})
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-1">{rest.cuisine}</p>
              </div>

              {/* Telemetry Metrics */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>Avg Prep: <strong>{rest.avgPrepTime}m</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <MapPin className="h-3.5 w-3.5 text-cyan-600" />
                  <span>Distance: <strong>{rest.distanceKm} km</strong></span>
                </div>
              </div>

              {/* View Menu Button */}
              <button className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-50 py-2 text-xs font-bold text-slate-700 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                <span>View Menu & Order</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
