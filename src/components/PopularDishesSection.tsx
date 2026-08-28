import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { FOOD_CATALOG, FoodItem } from '../data/foodCatalog';
import { Star, Clock, Plus, Minus, Check, Flame, Sparkles, Filter, Search } from 'lucide-react';

export const PopularDishesSection: React.FC = () => {
  const {
    cart,
    addToCart,
    updateCartQuantity,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    conditions
  } = useApp();

  const [dietFilter, setDietFilter] = useState<'ALL' | 'VEG' | 'NON_VEG'>('ALL');
  const [addedItemToast, setAddedItemToast] = useState<string | null>(null);

  const calculateDynamicEta = (prepTime: number) => {
    const transit = Math.round((conditions.distanceKm || 3.2) * 2.2);
    const traffic = conditions.trafficLevel === 'SEVERE' ? 5 : (conditions.trafficLevel === 'HIGH' ? 3 : 0);
    const weather = conditions.weatherCondition === 'HEAVY_RAIN' ? 4 : 0;
    const base = prepTime + transit + traffic + weather;
    return `${Math.max(15, base - 2)}–${Math.max(20, base + 3)} min`;
  };

  const handleAdd = (item: FoodItem) => {
    addToCart(item);
    setAddedItemToast(item.id);
    setTimeout(() => setAddedItemToast(null), 1200);
  };

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    return FOOD_CATALOG.filter(item => {
      // Category filter
      if (selectedCategory && selectedCategory !== 'ALL') {
        if (item.category !== selectedCategory) return false;
      }

      // Veg / Non-Veg filter
      if (dietFilter === 'VEG' && !item.isVeg) return false;
      if (dietFilter === 'NON_VEG' && item.isVeg) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesRest = item.restaurantName.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesRest && !matchesCat) return false;
      }

      return true;
    });
  }, [selectedCategory, dietFilter, searchQuery]);

  const quickCategories = [
    { id: 'ALL', label: 'All Items' },
    { id: 'Biryani', label: '🍗 Biryani' },
    { id: 'Pizza', label: '🍕 Pizza' },
    { id: 'Burgers', label: '🍔 Burgers' },
    { id: 'South Indian', label: '🥞 South Indian' },
    { id: 'North Indian', label: '🍛 North Indian' },
    { id: 'Chinese', label: '🍜 Chinese' },
    { id: 'Desserts', label: '🍰 Desserts' },
    { id: 'Beverages', label: '🧋 Beverages' },
    { id: 'Fast Food', label: '🍟 Fast Food' }
  ];

  return (
    <section id="popular-dishes-section" className="space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <span>Popular Dishes Near You</span>
            <span className="text-xl">🍽️</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Handcrafted bestsellers backed by AI kitchen readiness &amp; corridor tracking
          </p>
        </div>

        {/* Veg / Non-Veg Toggle Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setDietFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              dietFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setDietFilter('VEG')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              dietFilter === 'VEG'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Pure Veg</span>
          </button>
          <button
            onClick={() => setDietFilter('NON_VEG')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              dietFilter === 'NON_VEG'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            <span>Non-Veg</span>
          </button>
        </div>
      </div>

      {/* Quick Category Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scroll-smooth no-scrollbar">
        {quickCategories.map(cat => {
          const isActive = selectedCategory === cat.id || (cat.id === 'ALL' && (!selectedCategory || selectedCategory === 'ALL'));
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id === 'ALL' ? 'ALL' : cat.id)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                isActive
                  ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Search status if searching */}
      {searchQuery.trim() && (
        <div className="flex items-center justify-between rounded-2xl bg-orange-50 border border-orange-200 px-4 py-2 text-xs font-medium text-orange-950">
          <span>Showing results for "{searchQuery}"</span>
          <button
            onClick={() => setSearchQuery('')}
            className="font-bold underline text-orange-800 hover:text-orange-950"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Dishes Grid */}
      {filteredDishes.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center space-y-3">
          <div className="text-4xl">🔍</div>
          <h3 className="text-base font-bold text-slate-900">No dishes found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your category or diet filter to explore more items in the catalog.
          </p>
          <button
            onClick={() => { setSelectedCategory('ALL'); setDietFilter('ALL'); setSearchQuery(''); }}
            className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredDishes.map(item => {
            const inCart = cart.find(c => c.id === item.id);
            const isJustAdded = addedItemToast === item.id;
            const etaStr = calculateDynamicEta(item.prepTime);

            return (
              <div
                key={item.id}
                id={`dish-card-${item.id}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-orange-200"
              >
                {/* Top Image Section */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient for text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Veg / Non-Veg Icon Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg bg-white/90 backdrop-blur-md px-2 py-0.5 shadow-xs border border-white/40">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        item.isVeg ? 'bg-emerald-600 ring-2 ring-emerald-200' : 'bg-rose-600 ring-2 ring-rose-200'
                      }`}
                    />
                    <span className="text-[10px] font-bold text-slate-800">
                      {item.isVeg ? 'Veg' : 'Non-Veg'}
                    </span>
                  </div>

                  {/* Tags */}
                  {item.tags && item.tags[0] && (
                    <div className="absolute top-3 right-3">
                      <span className="rounded-xl bg-orange-600/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-black text-white shadow-xs">
                        {item.tags[0]}
                      </span>
                    </div>
                  )}

                  {/* ETA & Prep time at bottom of image */}
                  <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between text-white text-xs font-bold">
                    <span className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-[11px]">
                      <Clock className="h-3 w-3 text-cyan-400" />
                      <span>{etaStr}</span>
                    </span>
                    <span className="text-[10px] text-slate-200">
                      Prep: {item.prepTime}m
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-black text-slate-900 text-sm sm:text-base group-hover:text-orange-600 transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200 flex-shrink-0">
                        <Star className="h-3 w-3 fill-emerald-600 text-emerald-600" />
                        <span>{item.rating}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 font-medium">
                      By <span className="text-slate-600 font-semibold">{item.restaurantName}</span>
                    </p>

                    <p className="text-xs text-slate-500 font-normal line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Price & Add to Cart Controls */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Price</span>
                      <div className="text-base font-black text-slate-900">
                        ₹{item.price}
                      </div>
                    </div>

                    {/* Cart Action */}
                    {inCart ? (
                      <div className="flex items-center rounded-xl bg-orange-600 text-white shadow-xs font-bold text-xs">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="px-2.5 py-1.5 hover:bg-orange-700 rounded-l-xl transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-2 min-w-[20px] text-center font-black">
                          {inCart.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="px-2.5 py-1.5 hover:bg-orange-700 rounded-r-xl transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        id={`btn-add-dish-${item.id}`}
                        onClick={() => handleAdd(item)}
                        className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black shadow-xs transition-all active:scale-95 ${
                          isJustAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-orange-600 hover:bg-orange-700 text-white'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5" />
                            <span>ADD</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};
