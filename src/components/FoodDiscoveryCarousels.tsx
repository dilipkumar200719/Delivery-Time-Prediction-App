import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { FOOD_CATALOG, FoodItem } from '../data/foodCatalog';
import { SUPPORTED_CITIES } from '../data/cities';
import {
  Star,
  Clock,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  Flame,
  Zap,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

interface CarouselProps {
  title: string;
  subtitle: string;
  items: FoodItem[];
  badge?: string;
  badgeBg?: string;
  icon?: React.FC<{ className?: string }>;
  iconBg?: string;
  containerBg?: string;
}

export const FoodDiscoveryCarousels: React.FC = () => {
  const {
    cart,
    addToCart,
    conditions,
    selectedCity,
    setSelectedCategory
  } = useApp();

  const cityInfo = SUPPORTED_CITIES[selectedCity] || SUPPORTED_CITIES.Vijayawada;
  const [addedItemFeedback, setAddedItemFeedback] = useState<string | null>(null);

  // Quick categories with colorful palettes
  const categoriesList = [
    { name: 'Biryani', icon: '🍗', count: '14 items', bg: 'bg-amber-50 hover:bg-amber-100 border-amber-200' },
    { name: 'Pizza', icon: '🍕', count: '18 items', bg: 'bg-orange-50 hover:bg-orange-100 border-orange-200' },
    { name: 'Burgers', icon: '🍔', count: '15 items', bg: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200' },
    { name: 'Indian', icon: '🍛', count: '24 items', bg: 'bg-rose-50 hover:bg-rose-100 border-rose-200' },
    { name: 'Chinese', icon: '🍜', count: '16 items', bg: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200' },
    { name: 'Healthy', icon: '🥗', count: '10 items', bg: 'bg-teal-50 hover:bg-teal-100 border-teal-200' },
    { name: 'Desserts', icon: '🍰', count: '14 items', bg: 'bg-purple-50 hover:bg-purple-100 border-purple-200' },
    { name: 'Drinks', icon: '🧋', count: '8 items', bg: 'bg-cyan-50 hover:bg-cyan-100 border-cyan-200' }
  ];

  // Dynamic AI ETA calculation
  const calculateItemETA = (prepTime: number) => {
    const transit = Math.round((conditions.distanceKm || 3.2) * 2.2);
    const traffic = conditions.trafficLevel === 'SEVERE' ? 5 : (conditions.trafficLevel === 'HIGH' ? 3 : 0);
    const weather = conditions.weatherCondition === 'HEAVY_RAIN' ? 4 : 0;
    const base = prepTime + transit + traffic + weather;
    return `${Math.max(14, base - 2)}–${Math.max(18, base + 2)} min`;
  };

  const handleAddToCart = (item: FoodItem) => {
    addToCart(item);
    setAddedItemFeedback(item.id);
    setTimeout(() => setAddedItemFeedback(null), 1200);
  };

  // Sub-component: Horizontal Scrollable Carousel Row
  const CarouselRow: React.FC<CarouselProps> = ({
    title,
    subtitle,
    items,
    badge,
    badgeBg = 'bg-amber-100 text-amber-900 border-amber-200',
    icon: Icon,
    iconBg = 'bg-orange-100 text-orange-600 border-orange-200',
    containerBg = 'bg-white'
  }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
      if (scrollRef.current) {
        const offset = direction === 'left' ? -320 : 320;
        scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
      }
    };

    return (
      <div className={`rounded-3xl border border-slate-200/80 ${containerBg} p-5 sm:p-6 shadow-xs space-y-4`}>
        
        {/* Row Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className={`flex h-9 w-9 items-center justify-center rounded-2xl ${iconBg} border shadow-2xs`}>
                <Icon className="h-5 w-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
                  {title}
                </h3>
                {badge && (
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${badgeBg}`}>
                    {badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">{subtitle}</p>
            </div>
          </div>

          {/* Left / Right Scroll Buttons */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-orange-50 hover:text-orange-900 shadow-xs transition-colors"
              title="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-orange-50 hover:text-orange-900 shadow-xs transition-colors"
              title="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-4 overflow-x-auto pb-2 pt-1 scroll-smooth no-scrollbar"
        >
          {items.map(item => {
            const inCart = cart.find(c => c.id === item.id);
            const isJustAdded = addedItemFeedback === item.id;
            const eta = calculateItemETA(item.prepTime);

            return (
              <div
                key={item.id}
                className="group relative flex w-[250px] sm:w-[270px] shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs hover:shadow-md transition-all duration-200 hover:border-orange-300"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Category Pill */}
                  <span className="absolute top-2 left-2 rounded-md bg-slate-950/80 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                    {item.category}
                  </span>

                  {/* Veg / Non-Veg Dot */}
                  <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-md bg-white shadow-xs border border-slate-200">
                    <span className={`h-2 w-2 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                  </span>

                  {/* Dynamic ETA Overlay Badge */}
                  <div className="absolute bottom-2 left-2 rounded-md bg-white/95 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-slate-800 border border-slate-200/80 flex items-center gap-1 shadow-xs">
                    <Clock className="h-3 w-3 text-orange-600" />
                    <span>{eta}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3.5 flex flex-col justify-between flex-1 space-y-2.5">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-sm font-bold text-slate-900 truncate leading-tight">
                        {item.name}
                      </h4>
                      <span className="flex items-center gap-0.5 text-xs font-bold text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-200 shrink-0">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        {item.rating}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {item.restaurantName || cityInfo.restaurantName}
                    </p>
                  </div>

                  {/* Price & Add Button */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-black text-slate-900">₹{item.price}</span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(item)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                        isJustAdded
                          ? 'bg-emerald-600 text-white'
                          : inCart
                          ? 'bg-orange-100 text-orange-950 border border-orange-300 hover:bg-orange-200'
                          : 'bg-orange-600 hover:bg-orange-700 text-white'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Added</span>
                        </>
                      ) : inCart ? (
                        <>
                          <ShoppingBag className="h-3.5 w-3.5" />
                          <span>In Cart ({inCart.quantity})</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    );
  };

  // Filter Carousel subsets
  const popularItems = FOOD_CATALOG.filter(item => item.popular || item.rating >= 4.7);
  const fastDeliveryItems = FOOD_CATALOG.filter(item => item.prepTime <= 10);
  const recommendedItems = FOOD_CATALOG.filter(item => item.popular || item.rating >= 4.8);

  return (
    <div className="space-y-6 pt-2">
      
      {/* 1. Food Categories Carousel (Warm Peach / Cream Background) */}
      <div className="rounded-3xl border border-amber-200/80 bg-gradient-to-r from-amber-50/70 via-orange-50/40 to-rose-50/30 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              What are you craving today?
            </h3>
            <p className="text-xs text-slate-600">
              Explore freshly prepared dishes with real-time AI delivery ETA across {cityInfo.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
          {categoriesList.map(cat => (
            <button
              key={cat.name}
              onClick={() => {
                setSelectedCategory(cat.name);
                const el = document.getElementById('food-catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center p-3.5 rounded-2xl ${cat.bg} border transition-all shrink-0 min-w-[95px] shadow-2xs group`}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-xs font-bold text-slate-900 mt-1.5">{cat.name}</span>
              <span className="text-[10px] text-slate-500 font-medium">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. AI Picks For You (Intelligent Adaptive Recommendations) */}
      <CarouselRow
        title="AI Picks For You"
        subtitle={`Ranked by intelligent ETA speed, kitchen reliability, and popularity in ${cityInfo.name}`}
        items={recommendedItems}
        badge="🤖 Smart Ranked"
        badgeBg="bg-indigo-100 text-indigo-950 border-indigo-300"
        icon={Sparkles}
        iconBg="bg-indigo-600 text-white border-indigo-700"
        containerBg="bg-gradient-to-br from-white via-indigo-50/30 to-cyan-50/20"
      />

      {/* 3. Popular Near You Carousel (Warm Orange Accent) */}
      <CarouselRow
        title="Trending Near You"
        subtitle={`Top-rated kitchens and favorite dishes in ${cityInfo.name}`}
        items={popularItems}
        badge="🔥 High Demand"
        badgeBg="bg-orange-100 text-orange-950 border-orange-300"
        icon={Flame}
        iconBg="bg-orange-500 text-white border-orange-600"
        containerBg="bg-gradient-to-br from-white via-orange-50/30 to-amber-50/20"
      />

      {/* 4. Fast Delivery Express (<20 min) */}
      <CarouselRow
        title="Best for Fast Delivery (<20 min)"
        subtitle="Quick prep kitchens with open transit corridors"
        items={fastDeliveryItems}
        badge="⚡ Under 20 min"
        badgeBg="bg-cyan-100 text-cyan-950 border-cyan-300"
        icon={Zap}
        iconBg="bg-cyan-600 text-white border-cyan-700"
        containerBg="bg-gradient-to-br from-white via-cyan-50/30 to-sky-50/20"
      />

    </div>
  );
};
