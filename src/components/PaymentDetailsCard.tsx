import React from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  CheckCircle2,
  Receipt,
  MapPin,
  Clock,
  ShieldCheck,
  Building2,
  Copy,
  Download,
  Utensils
} from 'lucide-react';

interface PaymentDetailsCardProps {
  className?: string;
  orderId?: string;
}

export const PaymentDetailsCard: React.FC<PaymentDetailsCardProps> = ({
  className = '',
  orderId
}) => {
  const { activeOrder, userOrders, prediction, selectedCity } = useApp();

  const targetOrder = orderId 
    ? userOrders.find(o => o.id === orderId) || activeOrder
    : activeOrder;

  const totalAmount = targetOrder?.totalAmountRupees || 410;
  const foodItemsTotal = totalAmount > 90 ? totalAmount - 30 - 10 + 50 : 420;
  const deliveryFee = 30;
  const platformFee = 10;
  const aiDiscount = 50;

  const items = targetOrder?.items && targetOrder.items.length > 0
    ? targetOrder.items
    : [
        { name: 'Royal Chicken Dum Biryani (Handi Pack)', quantity: 1, price: 290 },
        { name: 'Garlic Butter Naan (2 pcs)', quantity: 2, price: 130 }
      ];

  const transactionId = '#PE482194';
  const paymentTime = targetOrder?.startedAt 
    ? new Date(targetOrder.startedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : '2:16 PM';

  const restaurantName = targetOrder?.restaurantName || 'Spice Route Kitchen';
  const etaMinutes = targetOrder?.prediction?.predictedEtaMinutes || prediction?.predictedEtaMinutes || 28;
  const etaRange = `${Math.max(12, Math.round(etaMinutes * 0.9))}–${Math.max(16, Math.round(etaMinutes * 1.15))} min`;

  return (
    <div className={`overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs space-y-6 ${className}`}>
      
      {/* Top Banner: Payment Success Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                PAYMENT SUCCESSFUL
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {transactionId}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              ₹{totalAmount} Paid via UPI
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigator.clipboard?.writeText(transactionId)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            title="Copy Transaction ID"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Copy Ref</span>
          </button>
        </div>
      </div>

      {/* Grid: 2 Columns (Left = Payment Breakdown, Right = Order & Delivery Details) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Payment Summary Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
              <CreditCard className="h-4 w-4 text-cyan-600" />
              <span>Payment Details</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500">
              Paid at {paymentTime}
            </span>
          </div>

          {/* Line item amounts */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Food Items Subtotal</span>
              <span className="font-semibold text-slate-900">₹{foodItemsTotal}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Delivery Fee</span>
              <span className="font-semibold text-slate-900">₹{deliveryFee}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Platform Fee</span>
              <span className="font-semibold text-slate-900">₹{platformFee}</span>
            </div>

            <div className="flex items-center justify-between text-emerald-700">
              <span>AI Intelligent Discount</span>
              <span className="font-bold">-₹{aiDiscount}</span>
            </div>

            <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-sm font-black text-slate-950">
              <span>TOTAL PAID</span>
              <span className="text-base text-emerald-700 font-mono">₹{totalAmount}</span>
            </div>
          </div>

          {/* Payment Method Badge */}
          <div className="rounded-xl border border-slate-200 bg-white p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="h-6 w-8 rounded bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-[9px]">
                UPI
              </div>
              <div>
                <span className="font-bold text-slate-800 block">UPI •••• 4821</span>
                <span className="text-[10px] text-slate-400">Google Pay / Instant Bank Settlement</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Verified
            </span>
          </div>
        </div>

        {/* Right Column: Order Details & Destination */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
              <Utensils className="h-4 w-4 text-cyan-600" />
              <span>Order Summary</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
              #{targetOrder?.id || 'ORD-8553'}
            </span>
          </div>

          {/* Restaurant & ETA */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-700">
              <span className="text-slate-500">Restaurant:</span>
              <span className="font-bold text-slate-900">{restaurantName}</span>
            </div>

            <div className="flex items-center justify-between text-slate-700">
              <span className="text-slate-500">AI ETA Prediction:</span>
              <span className="font-mono font-bold text-cyan-800">{etaRange}</span>
            </div>

            <div className="flex items-center justify-between text-slate-700">
              <span className="text-slate-500">Order Status:</span>
              <span className="font-bold text-emerald-700">
                {targetOrder?.status === 'DELIVERED' ? 'Delivered 🎉' : 'In Transit / Out for Delivery 🛵'}
              </span>
            </div>
          </div>

          {/* Itemized List */}
          <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Ordered Items
            </span>
            <div className="divide-y divide-slate-100 max-h-28 overflow-y-auto">
              {items.map((item, idx) => (
                <div key={idx} className="py-1 flex items-center justify-between text-xs">
                  <span className="text-slate-800 font-medium">
                    {item.name} <strong className="text-slate-400 font-normal">× {item.quantity}</strong>
                  </span>
                  <span className="font-semibold text-slate-900">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="flex items-start gap-2 text-xs text-slate-600">
            <MapPin className="h-4 w-4 text-cyan-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block">Delivery Address</span>
              <span className="text-slate-500">
                Flat 402, Pine Grove Apts, 12th Main, Indiranagar, {selectedCity}
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
