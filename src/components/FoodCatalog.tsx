import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FOOD_CATALOG, FoodItem } from '../data/foodCatalog';
import {
  Star,
  Clock,
  Plus,
  Check,
  Sparkles,
  Bot,
  Flame,
  Search,
  Filter
} from 'lucide-react';

export const FoodCatalog: React.FC = () => {
  const {
    cart,
    addToCart,
    updateCartQuantity,
    conditions,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [addedItemFeedback, setAddedItemFeedback] = useState<string | null>(null);

  const categories = [
    'All',
    'Pizza',
    'Burgers',
    'Biryani',
    'Indian',
    'Chinese',
    'Desserts',
    'Drinks',
    'Healthy'
  ];

  // Calculate dynamic AI ETA for each item based on current live conditions
  const calculateItemAIETA = (prepTime: number) => {
    const transitTime = Math.round(conditions.distanceKm * 2.8);
    const trafficDelay = conditions.trafficLevel === 'SEVERE' ? 5 : (conditions.trafficLevel === 'HIGH' ? 3 : 0);
    const weatherDelay = conditions.weatherCondition === 'HEAVY_RAIN' ? 4 : (conditions.weatherCondition === 'RAIN' ? 2 : 0);
    const base = prepTime + transitTime + trafficDelay + weatherDelay;
    const min = Math.max(14, base - 2);
    const max = Math.max(18, base + 2);
    return `${min}–${max} min`;
  };

  // Filter items by category and search
  const filteredItems = FOOD_CATALOG.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAdd = (item: FoodItem) => {
    addToCart(item);
    setAddedItemFeedback(item.id);
    setTimeout(() => {
      setAddedItemFeedback(null);
    }, 1200);
  };

  return (
    <section id="food-catalog-section" className="space-y-6 pt-4">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Explore Menu & AI ETAs
            </h2>
            <span className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-bold text-cyan-700 border border-cyan-200">
              Live Kitchen Sync
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Every dish features an AI estimated arrival time calculated in real-time.
          </p>
        </div>

        {/* Search & Counter */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-slate-800">{filteredItems.length}</strong> dishes
          </span>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => {
          const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              id={`cat-btn-${cat.toLowerCase()}`}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map(item => {
          const cartItem = cart.find(c => c.id === item.id);
          const aiEtaDisplay = calculateItemAIETA(item.prepTime);
          const isJustAdded = addedItemFeedback === item.id;

          return (
            <div
              key={item.id}
              id={`food-card-${item.id}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-all duration-200 hover:border-slate-300"
            >
              
              {/* Image Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  onError={(e) => {
                    // Graceful fallback to delicious culinary placeholder if external image fails
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
                  }}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Veg / Non-Veg Indicator */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg bg-white/90 px-2 py-1 backdrop-blur-xs shadow-xs">
                  <span className={`h-2 w-2 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-600'}`} />
                  <span className="text-[10px] font-bold text-slate-800">
                    {item.isVeg ? 'VEG' : 'NON-VEG'}
                  </span>
                </div>

                {/* Popular Badge */}
                {item.popular && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-lg bg-amber-500 text-white px-2 py-1 text-[10px] font-extrabold shadow-xs">
                    <Flame className="h-3 w-3 fill-current" />
                    <span>Popular</span>
                  </div>
                )}

                {/* Prep Time Tag */}
                <div className="absolute bottom-2.5 left-3 flex items-center gap-1 rounded-md bg-slate-900/80 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-xs">
                  <Clock className="h-3 w-3 text-slate-300" />
                  <span>{item.prepTime} min prep</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold text-slate-600 truncate max-w-[170px]">{item.restaurantName}</span>
                    <span className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      {item.rating}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-cyan-700 transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* AI ETA Badge Feature (Requirement 5) */}
                <div className="rounded-xl border border-cyan-200/80 bg-cyan-50/70 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-cyan-800">
                      <Bot className="h-3.5 w-3.5 text-cyan-600" />
                      AI ETA
                    </span>
                    <span className="text-xs font-black text-cyan-900">
                      {aiEtaDisplay}
                    </span>
                  </div>
                  <p className="text-[10px] text-cyan-700/90 mt-0.5">
                    Based on current kitchen load + traffic
                  </p>
                </div>

                {/* Footer: Price & Add Button */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400">Price</span>
                    <div className="text-lg font-black text-slate-900">
                      ₹{item.price}
                    </div>
                  </div>

                  {/* Add To Cart Controls */}
                  {cartItem ? (
                    <div className="flex items-center gap-2 rounded-xl bg-slate-900 px-2 py-1.5 text-white font-bold text-xs shadow-xs">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="h-6 w-6 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 text-sm"
                      >
                        -
                      </button>
                      <span className="min-w-4 text-center font-extrabold">{cartItem.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="h-6 w-6 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 text-sm"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      id={`add-btn-${item.id}`}
                      onClick={() => handleAdd(item)}
                      className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-xs ${
                        isJustAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-900 text-white hover:bg-cyan-600'
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
                          <span>Add</span>
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

    </section>
  );
};
