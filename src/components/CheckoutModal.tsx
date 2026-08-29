import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  MapPin,
  CreditCard,
  Wallet,
  ShieldCheck,
  Bot,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Tag,
  Home,
  Briefcase,
  PhoneCall,
  BellOff,
  Coins
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartDeliveryFee,
    cartGst,
    cartPlatformFee,
    cartDiscount,
    cartTotal,
    appliedCoupon,
    setAppliedCoupon,
    isRedeemingPoints,
    setIsRedeemingPoints,
    cartDynamicEta,
    checkoutAndPlaceOrder,
    user
  } = useApp();

  const [address, setAddress] = useState('Flat 402, Pine Grove Apts, 12th Main, Indiranagar, Bengaluru - 560038');
  const [addressType, setAddressType] = useState<'HOME' | 'WORK' | 'OTHER'>('HOME');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'COD' | 'WALLET'>('UPI');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState<string[]>(['Contactless Delivery']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');

  if (!isCheckoutOpen) return null;

  const toggleDeliveryNote = (note: string) => {
    setDeliveryNotes(prev => 
      prev.includes(note) ? prev.filter(n => n !== note) : [...prev, note]
    );
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate real-world 1.2s payment tokenization and gateway authorization
    try {
      setProcessingStep('Authorizing Secure Payment Token...');
      await new Promise(r => setTimeout(r, 450));
      
      setProcessingStep('Initializing AI Digital Twin Trajectory...');
      await new Promise(r => setTimeout(r, 450));
      
      setProcessingStep('Transmitting Live Order to Kitchen...');
      await new Promise(r => setTimeout(r, 400));

      const instructions = [
        ...deliveryNotes,
        specialInstructions ? `Note: ${specialInstructions}` : ''
      ].filter(Boolean).join(' • ');

      await checkoutAndPlaceOrder({
        address,
        paymentMethod,
        specialInstructions: instructions,
        couponCode: appliedCoupon || undefined,
        discountAmount: cartDiscount,
        pointsRedeemed: isRedeemingPoints ? Math.min(50, Math.floor(user?.rewardBalanceRupees || 25)) : 0
      });
    } catch (err) {
      console.warn('Checkout error:', err);
    } finally {
      setIsSubmitting(false);
      setProcessingStep('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-2xl space-y-5 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Secure AI Fast Checkout
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                End-to-end encrypted • Guaranteed SLA On-Time Protection
              </p>
            </div>
          </div>

          <button
            id="close-checkout-modal"
            onClick={() => setIsCheckoutOpen(false)}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-30"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handlePlaceOrder} className="space-y-4">
          
          {/* Delivery Address & Type */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-cyan-600" />
                <span>Delivery Address</span>
              </label>
              
              {/* Address Quick Presets */}
              <div className="flex items-center gap-1">
                {[
                  { id: 'HOME', label: 'Home', icon: Home, addr: 'Flat 402, Pine Grove Apts, 12th Main, Indiranagar, Bengaluru - 560038' },
                  { id: 'WORK', label: 'Work', icon: Briefcase, addr: 'Prestige Tech Park, Outer Ring Road, Kadubeesanahalli, Bengaluru - 560103' },
                  { id: 'OTHER', label: 'Other', icon: MapPin, addr: 'Tower 3, Brigade Gateway, Malleshwaram West, Bengaluru - 560055' }
                ].map(type => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => {
                        setAddressType(type.id as any);
                        setAddress(type.addr);
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                        addressType === type.id
                          ? 'bg-cyan-600 text-white border-cyan-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white'
                      }`}
                    >
                      <Icon className="h-3 w-3" />
                      <span>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
            />
          </div>

          {/* Delivery Instructions Chips */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Handover Preferences</div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'Contactless Delivery', label: 'Contactless' },
                { id: 'Leave at Door', label: 'Leave at Door' },
                { id: 'Call Upon Arrival', label: 'Call on Arrival' },
                { id: "Don't Ring Bell", label: "Don't Ring Bell" }
              ].map(note => {
                const isSelected = deliveryNotes.includes(note.id);
                return (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => toggleDeliveryNote(note.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white'
                    }`}
                  >
                    {isSelected ? '✓ ' : ''}{note.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Items Summary Compact Box */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>ORDER ITEMS ({cart.length})</span>
              <span className="text-slate-500">{cart[0]?.restaurantName || 'Spice Route Kitchen'}</span>
            </div>
            <div className="divide-y divide-slate-200/60 max-h-28 overflow-y-auto pr-1 space-y-1">
              {cart.map((item) => (
                <div key={item.id} className="pt-1.5 first:pt-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 truncate max-w-[280px]">
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <span className="text-slate-800 font-medium truncate">{item.name}</span>
                    <span className="text-slate-500 font-bold">× {item.quantity}</span>
                  </div>
                  <span className="font-bold text-slate-900">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI ETA Highlight Widget */}
          <div className="rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50/60 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-cyan-700 shadow-2xs">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-black text-cyan-950">
                  AI Real-Time Arrival Window
                </div>
                <p className="text-[11px] text-cyan-700 font-medium">
                  Live traffic, prep sync & route telemetry active
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-black text-cyan-900">
                {cartDynamicEta.min}–{cartDynamicEta.max} min
              </div>
              <div className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 justify-end">
                <ShieldCheck className="h-3 w-3" /> 92% SLA confidence
              </div>
            </div>
          </div>

          {/* Coupons & Rewards Box */}
          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-orange-600" />
                <span>Promo Code & Coupons</span>
              </span>
              {appliedCoupon && (
                <button
                  type="button"
                  onClick={() => setAppliedCoupon(null)}
                  className="text-[11px] font-bold text-rose-600 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { code: 'PREDICT50', label: '₹50 OFF' },
                { code: 'FIRSTEAT', label: '20% OFF' },
                { code: 'FREEDEL', label: 'Free Delivery' }
              ].map(c => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setAppliedCoupon(appliedCoupon === c.code ? null : c.code)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                    appliedCoupon === c.code
                      ? 'bg-orange-600 text-white border-orange-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-orange-50 hover:border-orange-200'
                  }`}
                >
                  {c.code} {appliedCoupon === c.code ? '✓ Applied' : `(${c.label})`}
                </button>
              ))}
            </div>

            {/* AI Delivery Points Redemption Toggle */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-700">
                <Coins className="h-3.5 w-3.5 text-amber-500" />
                <span>Use AI Delivery Points (₹{user?.rewardBalanceRupees ?? 25} available)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsRedeemingPoints(!isRedeemingPoints)}
                className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border transition-all ${
                  isRedeemingPoints
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {isRedeemingPoints ? 'Applied -₹25' : 'Redeem'}
              </button>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'UPI', label: 'UPI / GPay', desc: 'Instant 0-fee' },
                { id: 'CARD', label: 'Credit Card', desc: 'Visa / MC' },
                { id: 'WALLET', label: 'AI Wallet', desc: `₹${user?.rewardBalanceRupees ?? 25} Bal` },
                { id: 'COD', label: 'Cash / COD', desc: 'On delivery' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    paymentMethod === m.id
                      ? 'border-cyan-600 bg-cyan-50/80 text-cyan-950 font-bold shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold">{m.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Item Subtotal</span>
              <span className="font-semibold text-slate-900">₹{cartSubtotal}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Partner Fee</span>
              <span className="font-semibold text-slate-900">
                {cartDeliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${cartDeliveryFee}`}
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
                <span>Discount Applied ({appliedCoupon || (isRedeemingPoints ? 'Rewards' : '')})</span>
                <span>-₹{cartDiscount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm sm:text-base font-black text-slate-950 pt-2 border-t border-slate-200">
              <span>Grand Total</span>
              <span className="text-cyan-900 font-black">₹{cartTotal}</span>
            </div>
          </div>

          {/* Submit Action */}
          <button
            id="btn-place-order"
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3.5 text-sm font-bold text-white hover:bg-cyan-700 transition-all shadow-md shadow-cyan-600/25 disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2.5">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                <span className="font-bold">{processingStep || 'Processing Order...'}</span>
              </span>
            ) : (
              <>
                <span>PAY ₹{cartTotal} & START AI TRACKING</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};

