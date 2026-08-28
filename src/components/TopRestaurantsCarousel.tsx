import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { RESTAURANTS_DATA, Restaurant } from '../data/foodCatalog';
import { Star, Clock, Heart, ChevronLeft, ChevronRight, Sparkles, MapPin, Tag } from 'lucide-react';

interface TopRestaurantsCarouselProps {
  onSelectRestaurant?: (restaurantId: string) => void;
}

export const TopRestaurantsCarousel: React.FC<TopRestaurantsCarouselProps> = ({ onSelectRestaurant }) => {
  const { setActiveTab, conditions } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const calculateDynamicDeliveryTime = (restaurant: Restaurant) => {
    const transit = Math.round((restaurant.distanceKm || 3.0) * 2.4);
    const traffic = conditions.trafficLevel === 'SEVERE' ? 5 : (conditions.trafficLevel === 'HIGH' ? 3 : 0);
    const weather = conditions.weatherCondition === 'HEAVY_RAIN' ? 4 : 0;
    const base = restaurant.avgPrepTime + transit + traffic + weather;
    return `${Math.max(15, base - 3)}–${Math.max(20, base + 4)} min`;
  };

  const handleRestaurantClick = (restaurant: Restaurant) => {
    if (onSelectRestaurant) {
      onSelectRestaurant(restaurant.id);
    } else {
      // Store in window or context
      (window as any).__SELECTED_RESTAURANT_ID__ = restaurant.id;
      setActiveTab('RESTAURANT_DETAIL' as any);
    }
  };

  return (
    <section id="top-restaurants-section" className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <span>Top Restaurants Near You</span>
            <span className="text-xl">🔥</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            AI-predicted delivery speeds with live kitchen surge telemetry
          </p>
        </div>

        {/* Scroll Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            id="btn-restaurants-scroll-left"
            onClick={() => scroll('left')}
            aria-label="Scroll restaurants left"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            id="btn-restaurants-scroll-right"
            onClick={() => scroll('right')}
            aria-label="Scroll restaurants right"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-5 overflow-x-auto pb-4 pt-1 scroll-smooth no-scrollbar"
      >
        {RESTAURANTS_DATA.map(rest => {
          const isFav = !!favorites[rest.id];
          const deliveryTimeStr = calculateDynamicDeliveryTime(rest);

          return (
            <div
              key={rest.id}
              id={`restaurant-card-${rest.id}`}
              onClick={() => handleRestaurantClick(rest)}
              className="group relative flex flex-col justify-between flex-shrink-0 w-[270px] sm:w-[300px] cursor-pointer overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-orange-200"
            >
              {/* Image & Badges */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                <img
                  src={rest.image}
                  alt={rest.name}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Dark Gradient Overlay for bottom text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

                {/* Top Row: Discount Tag & Favorite Button */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                  {rest.discount ? (
                    <span className="flex items-center gap-1 rounded-xl bg-orange-600/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-black text-white shadow-sm">
                      <Tag className="h-3 w-3" />
                      <span>{rest.discount}</span>
                    </span>
                  ) : <span />}

                  <button
                    onClick={(e) => toggleFavorite(e, rest.id)}
                    aria-label="Toggle Favorite"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-slate-700 hover:bg-white transition-transform active:scale-90 shadow-sm"
                  >
                    <Heart className={`h-4 w-4 ${isFav ? 'text-rose-500 fill-rose-500' : 'text-slate-700'}`} />
                  </button>
                </div>

                {/* Bottom Overlay: AI Delivery Time & Distance */}
                <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between text-white text-xs font-bold">
                  <span className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                    <Clock className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{deliveryTimeStr}</span>
                  </span>

                  <span className="text-[11px] font-medium text-slate-200 drop-shadow-sm">
                    {rest.distanceKm} km
                  </span>
                </div>
              </div>

              {/* Restaurant Info Body */}
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-black text-slate-900 text-base group-hover:text-orange-600 transition-colors line-clamp-1">
                    {rest.name}
                  </h3>

                  {/* Rating Badge */}
                  <div className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white shadow-2xs flex-shrink-0">
                    <Star className="h-3 w-3 fill-white" />
                    <span>{rest.rating}</span>
                  </div>
                </div>

                {/* Cuisines */}
                <p className="text-xs text-slate-500 font-medium line-clamp-1">
                  {rest.cuisine}
                </p>

                {/* Location & Delivery Fee */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1 truncate max-w-[150px]">
                    <MapPin className="h-3 w-3 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{rest.location}</span>
                  </span>

                  <span className="text-emerald-700 font-semibold">
                    {rest.deliveryFee === 0 ? 'Free Delivery' : `₹${rest.deliveryFee} fee`}
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
};
