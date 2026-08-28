import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { RESTAURANTS_DATA, FOOD_CATALOG, FoodItem, Restaurant } from '../data/foodCatalog';
import {
  Star,
  Clock,
  MapPin,
  Tag,
  ArrowLeft,
  Search,
  Plus,
  Minus,
  Check,
  Heart,
  Share2,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface RestaurantDetailPageProps {
  restaurantId?: string;
  onBack?: () => void;
}

export const RestaurantDetailPage: React.FC<RestaurantDetailPageProps> = ({ restaurantId, onBack }) => {
  const { cart, addToCart, updateCartQuantity, setActiveTab, conditions } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [dietFilter, setDietFilter] = useState<'ALL' | 'VEG' | 'NON_VEG'>('ALL');
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedItemToast, setAddedItemToast] = useState<string | null>(null);

  // Determine active restaurant
  const currentRestId = restaurantId || (window as any).__SELECTED_RESTAURANT_ID__ || 'rest_spice_route';
  const restaurant: Restaurant = useMemo(() => {
    return RESTAURANTS_DATA.find(r => r.id === currentRestId) || RESTAURANTS_DATA[0];
  }, [currentRestId]);

  // Restaurant Menu items
  const menuItems = useMemo(() => {
    const directItems = FOOD_CATALOG.filter(item => item.restaurantId === restaurant.id);
    if (directItems.length > 0) return directItems;
    // Fallback: show popular items tagged under this restaurant's theme
    return FOOD_CATALOG.slice(0, 8);
  }, [restaurant.id]);

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      if (dietFilter === 'VEG' && !item.isVeg) return false;
      if (dietFilter === 'NON_VEG' && item.isVeg) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [menuItems, dietFilter, searchQuery]);

  const handleAdd = (item: FoodItem) => {
    addToCart(item);
    setAddedItemToast(item.id);
    setTimeout(() => setAddedItemToast(null), 1200);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setActiveTab('HOME');
    }
  };

  const calculateDynamicEta = (prepTime: number) => {
    const transit = Math.round((restaurant.distanceKm || 3.0) * 2.4);
    const traffic = conditions.trafficLevel === 'SEVERE' ? 5 : (conditions.trafficLevel === 'HIGH' ? 3 : 0);
    const weather = conditions.weatherCondition === 'HEAVY_RAIN' ? 4 : 0;
    const base = prepTime + transit + traffic + weather;
    return `${Math.max(15, base - 2)}–${Math.max(20, base + 3)} min`;
  };

  return (
    <div id="restaurant-detail-view" className="space-y-6 animate-in fade-in duration-300">
      
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-xs hover:bg-orange-50 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Discovery</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-orange-50 shadow-xs transition-colors"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'text-rose-500 fill-rose-500' : 'text-slate-600'}`} />
          </button>
        </div>
      </div>

      {/* Restaurant Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
        
        {/* Banner Image */}
        <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-slate-900">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

          {/* Floating Top Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {restaurant.discount && (
              <span className="flex items-center gap-1 rounded-xl bg-orange-600 px-3 py-1 text-xs font-black text-white shadow-md">
                <Tag className="h-3.5 w-3.5" />
                <span>{restaurant.discount}</span>
              </span>
            )}
            <span className="flex items-center gap-1 rounded-xl bg-slate-900/80 backdrop-blur-md px-3 py-1 text-xs font-bold text-cyan-300 border border-white/10">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>AI Verified Kitchen</span>
            </span>
          </div>

          {/* Floating Bottom Info */}
          <div className="absolute bottom-4 inset-x-4 sm:inset-x-6 text-white space-y-2">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white drop-shadow-sm">
                  {restaurant.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-200 font-medium mt-0.5">
                  {restaurant.cuisine} • <span className="text-slate-300">{restaurant.location}</span>
                </p>
              </div>

              {/* Rating Box */}
              <div className="flex items-center gap-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-2">
                <div className="flex items-center gap-1 text-emerald-400 font-black text-base">
                  <Star className="h-4 w-4 fill-emerald-400" />
                  <span>{restaurant.rating}</span>
                </div>
                <div className="h-6 w-px bg-white/20" />
                <span className="text-xs font-medium text-slate-300">
                  {restaurant.ratingCount} reviews
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 sm:p-6 bg-slate-50/70 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">AI Delivery Estimate</span>
              <span className="text-slate-500 text-[11px]">{calculateDynamicEta(restaurant.avgPrepTime)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Distance</span>
              <span className="text-slate-500 text-[11px]">{restaurant.distanceKm} km from you</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Delivery Fee</span>
              <span className="text-emerald-700 font-bold text-[11px]">
                {restaurant.deliveryFee === 0 ? 'Free Delivery' : `₹${restaurant.deliveryFee}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Kitchen Load</span>
              <span className="text-slate-500 text-[11px]">Optimal (Prep ~{restaurant.avgPrepTime}m)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Menu Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
        
        {/* Search menu */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items in menu..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:outline-hidden"
          />
        </div>

        {/* Veg / Non-Veg filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 w-full sm:w-auto justify-center">
          <button
            onClick={() => setDietFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              dietFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            All ({menuItems.length})
          </button>
          <button
            onClick={() => setDietFilter('VEG')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              dietFilter === 'VEG' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Pure Veg</span>
          </button>
          <button
            onClick={() => setDietFilter('NON_VEG')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              dietFilter === 'NON_VEG' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            <span>Non-Veg</span>
          </button>
        </div>

      </div>

      {/* Menu List Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <span>Menu &amp; Specialties</span>
          <span className="text-xs font-bold text-slate-400">({filteredMenuItems.length} dishes)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMenuItems.map(item => {
            const inCart = cart.find(c => c.id === item.id);
            const isJustAdded = addedItemToast === item.id;
            const etaStr = calculateDynamicEta(item.prepTime);

            return (
              <div
                key={item.id}
                id={`restaurant-item-${item.id}`}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-4 shadow-xs hover:border-orange-200 hover:shadow-md transition-all space-y-3"
              >
                <div className="flex gap-3">
                  {/* Left: Info */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          item.isVeg ? 'bg-emerald-600 ring-2 ring-emerald-200' : 'bg-rose-600 ring-2 ring-rose-200'
                        }`}
                      />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="font-black text-slate-900 text-sm sm:text-base leading-snug group-hover:text-orange-600 transition-colors">
                      {item.name}
                    </h3>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900">₹{item.price}</span>
                      <div className="flex items-center gap-0.5 text-emerald-700 text-xs font-bold">
                        <Star className="h-3 w-3 fill-emerald-600 text-emerald-600" />
                        <span>{item.rating}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>

                  {/* Right: Image & Action */}
                  <div className="relative flex flex-col items-center flex-shrink-0">
                    <div className="h-24 w-24 rounded-2xl overflow-hidden bg-slate-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Add to Cart Button floating below image */}
                    <div className="mt-2 w-full">
                      {inCart ? (
                        <div className="flex items-center justify-between rounded-xl bg-orange-600 text-white font-bold text-xs shadow-xs">
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="p-1.5 hover:bg-orange-700 rounded-l-xl transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-1 font-black">{inCart.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="p-1.5 hover:bg-orange-700 rounded-r-xl transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAdd(item)}
                          className={`w-full py-1.5 px-3 rounded-xl text-xs font-black shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1 ${
                            isJustAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-orange-600 hover:bg-orange-700 text-white'
                          }`}
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="h-3 w-3" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus className="h-3 w-3" />
                              <span>ADD</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Subfooter with ETA */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="h-3 w-3 text-cyan-600" />
                    <span>Est. {etaStr}</span>
                  </span>
                  <span>Prep ~{item.prepTime}m</span>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
