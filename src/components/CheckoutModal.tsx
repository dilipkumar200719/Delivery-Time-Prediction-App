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
  Lock
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartDeliveryFee,
    cartTotal,
    cartDynamicEta,
    checkoutAndPlaceOrder,
    user
  } = useApp();

  const [address, setAddress] = useState('Flat 402, Pine Grove Apts, 12th Main, Indiranagar, Bengaluru - 560038');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'COD' | 'WALLET'>('UPI');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await checkoutAndPlaceOrder({
        address,
        paymentMethod,
        specialInstructions
      });
    } catch (err) {
      console.warn('Checkout error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                AI Fast Checkout
              </h2>
              <p className="text-xs text-slate-500">
                Secure payment & instant telemetry initialization
              </p>
            </div>
          </div>

          <button
            id="close-checkout-modal"
            onClick={() => setIsCheckoutOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handlePlaceOrder} className="space-y-5">
          
          {/* Delivery Address */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-cyan-600" />
                Delivery Address
              </span>
              <span className="text-[10px] text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded font-mono">
                Verified Drop Zone
              </span>
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
            />
          </div>

          {/* Items Summary Compact Box */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2.5">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Order Items ({cart.length})
            </div>
            <div className="divide-y divide-slate-200/60 max-h-36 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="py-1.5 flex items-center justify-between text-xs">
                  <span className="text-slate-800 truncate max-w-[280px]">
                    {item.name} <strong className="text-slate-500">× {item.quantity}</strong>
                  </span>
                  <span className="font-semibold text-slate-900">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI ETA Highlight Widget */}
          <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-cyan-700 shadow-xs">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-cyan-950">
                  AI Predicted Delivery ETA
                </div>
                <p className="text-[11px] text-cyan-700">
                  Calculated from live traffic, kitchen prep & weather
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-black text-cyan-900">
                {cartDynamicEta.min}–{cartDynamicEta.max} min
              </div>
              <div className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 justify-end">
                <ShieldCheck className="h-3 w-3" /> 92% confidence
              </div>
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
                { id: 'WALLET', label: 'AI Points', desc: `₹${user?.rewardBalanceRupees ?? 25} Bal` },
                { id: 'COD', label: 'Cash / COD', desc: 'On delivery' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === m.id
                      ? 'border-cyan-600 bg-cyan-50/80 text-cyan-950 font-bold shadow-xs'
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
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">₹{cartSubtotal}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee</span>
              <span className="font-semibold text-slate-900">
                {cartDeliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${cartDeliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-950 pt-2 border-t border-slate-200">
              <span>Grand Total</span>
              <span>₹{cartTotal}</span>
            </div>
          </div>

          {/* Submit Action */}
          <button
            id="btn-place-order"
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3.5 text-sm font-bold text-white hover:bg-cyan-700 transition-all shadow-md shadow-cyan-600/25 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Initializing AI Digital Twin...
              </span>
            ) : (
              <>
                <span>PLACE ORDER & START AI TRACKING</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
