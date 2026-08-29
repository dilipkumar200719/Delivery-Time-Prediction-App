import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Bot,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDeliveryFee,
    cartGst,
    cartPlatformFee,
    cartDiscount,
    cartTotal,
    appliedCoupon,
    setAppliedCoupon,
    cartDynamicEta,
    setIsCheckoutOpen,
    setActiveTab
  } = useApp();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleBrowseFood = () => {
    setIsCartOpen(false);
    setActiveTab('HOME');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Click backdrop to close */}
      <div
        className="absolute inset-0"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-250">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Your Cart
                </h2>
                <p className="text-xs text-slate-500">
                  {cart.length} unique {cart.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-slate-400 hover:text-rose-600 font-medium px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  Clear
                </button>
              )}
              <button
                id="close-cart-drawer"
                onClick={() => setIsCartOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Cart Items Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
                <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Your cart is empty</h3>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Explore delicious dishes and experience real-time AI delivery intelligence!
                  </p>
                </div>
                <button
                  onClick={handleBrowseFood}
                  className="mt-2 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-700 transition-colors shadow-xs"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3 shadow-xs"
                  >
                    
                    {/* Item Thumbnail */}
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
                      }}
                      className="h-14 w-14 rounded-xl object-cover shrink-0 bg-slate-200"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full shrink-0 ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {item.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {item.restaurantName}
                      </p>
                      <div className="text-xs font-black text-slate-900 mt-1">
                        ₹{item.price * item.quantity}
                        <span className="text-[10px] font-normal text-slate-400 ml-1">
                          (₹{item.price} each)
                        </span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 shadow-xs">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="h-6 w-6 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-slate-700 font-bold text-xs"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-4 text-center text-xs font-black text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="h-6 w-6 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-slate-700 font-bold text-xs"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50/60 space-y-4">
              
              {/* AI ETA Estimate Widget */}
              <div className="rounded-2xl border border-cyan-200 bg-cyan-50/80 p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-900">
                    <Bot className="h-4 w-4 text-cyan-600" />
                    <span>AI ESTIMATED DELIVERY</span>
                  </div>
                  <span className="text-sm font-black text-cyan-900">
                    {cartDynamicEta.min}–{cartDynamicEta.max} min
                  </span>
                </div>
                <p className="text-[11px] text-cyan-700">
                  Calculated based on restaurant kitchen load, real-time traffic density, and weather conditions.
                </p>
              </div>

              {/* Promo Offers Pills */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Coupons & Offers</div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { code: 'PREDICT50', label: '₹50 OFF (>₹199)' },
                    { code: 'FIRSTEAT', label: '20% OFF' },
                    { code: 'FREEDEL', label: 'FREE Delivery' }
                  ].map(c => (
                    <button
                      key={c.code}
                      onClick={() => setAppliedCoupon(appliedCoupon === c.code ? null : c.code)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                        appliedCoupon === c.code
                          ? 'bg-orange-600 text-white border-orange-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-orange-300'
                      }`}
                    >
                      {c.code} {appliedCoupon === c.code ? '✓' : `(${c.label})`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-slate-900">₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Partner Fee</span>
                  <span className="font-semibold text-slate-900">
                    {cartDeliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${cartDeliveryFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST & Restaurant Packaging</span>
                  <span className="font-semibold text-slate-900">₹{cartGst}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Platform & AI Telemetry Fee</span>
                  <span className="font-semibold text-slate-900">₹{cartPlatformFee}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount Applied ({appliedCoupon || 'Rewards'})</span>
                    <span>-₹{cartDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t border-slate-200">
                  <span>Grand Total</span>
                  <span className="text-base text-cyan-900 font-black">₹{cartTotal}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                id="btn-proceed-checkout"
                onClick={handleCheckoutClick}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 text-sm font-bold text-white hover:bg-cyan-700 transition-colors shadow-md shadow-cyan-600/20"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="h-4 w-4" />
              </button>

            </div>
          )}

        </div>
      </div>

    </div>
  );
};
