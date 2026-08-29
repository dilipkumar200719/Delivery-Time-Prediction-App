import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Receipt,
  Clock,
  Compass,
  Gamepad2,
  CheckCircle2,
  Truck,
  Sparkles,
  Bot,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Star,
  XCircle,
  KeyRound,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { AIExplainPredictionModal } from './AIExplainPredictionModal';
import { PaymentDetailsCard } from './PaymentDetailsCard';
import { OrderRecord } from '../types';

export const MyOrdersView: React.FC = () => {
  const {
    userOrders,
    activeOrder,
    setActiveTab,
    setActiveOrderById,
    reorderItems,
    cancelOrder,
    rateOrder
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ACTIVE' | 'DELIVERED' | 'CANCELLED'>('ALL');
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [expandedPaymentOrderId, setExpandedPaymentOrderId] = useState<string | null>(null);

  // Rate Modal State
  const [ratingOrder, setRatingOrder] = useState<OrderRecord | null>(null);
  const [selectedStars, setSelectedStars] = useState(5);
  const [ratingFeedback, setRatingFeedback] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Cancel Modal State
  const [cancellingOrder, setCancellingOrder] = useState<OrderRecord | null>(null);

  const filteredOrders = userOrders.filter(order => {
    if (activeFilter === 'ACTIVE') {
      return order.status !== 'DELIVERED' && order.status !== 'CANCELLED';
    }
    if (activeFilter === 'DELIVERED') {
      return order.status === 'DELIVERED';
    }
    if (activeFilter === 'CANCELLED') {
      return order.status === 'CANCELLED';
    }
    return true;
  });

  const handleRateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingOrder) return;
    await rateOrder(ratingOrder.id, selectedStars, ratingFeedback);
    setRatingSubmitted(true);
    setTimeout(() => {
      setRatingOrder(null);
      setRatingSubmitted(false);
      setRatingFeedback('');
      setSelectedStars(5);
    }, 1200);
  };

  const handleCancelConfirm = async () => {
    if (!cancellingOrder) return;
    await cancelOrder(cancellingOrder.id);
    setCancellingOrder(null);
  };

  return (
    <section className="space-y-6 pt-2">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              My Orders &amp; AI Telemetry
            </h2>
            <span className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-bold text-cyan-700 border border-cyan-200">
              {userOrders.length} {userOrders.length === 1 ? 'Order' : 'Orders'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time food delivery tracking, AI arrival telemetry, reorders, and digital invoice breakdowns.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100/80 border border-slate-200 self-start sm:self-auto overflow-x-auto">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'ACTIVE', label: 'Active Live' },
            { id: 'DELIVERED', label: 'Delivered' },
            { id: 'CANCELLED', label: 'Cancelled' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-4 shadow-xs">
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <Receipt className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                {activeFilter === 'ALL' ? 'No orders placed yet' : `No ${activeFilter.toLowerCase()} orders found`}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore top restaurants, place an order, and experience real-time AI delivery prediction!
              </p>
            </div>
            <button
              onClick={() => setActiveTab('HOME')}
              className="rounded-xl bg-cyan-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-cyan-700 transition-colors shadow-xs"
            >
              Explore Restaurants
            </button>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isActive = activeOrder?.id === order.id;
            const predEta = order.prediction?.predictedEtaMinutes || 24;
            const etaRangeMin = Math.max(12, Math.round(predEta * 0.9));
            const etaRangeMax = Math.max(etaRangeMin + 4, Math.round(predEta * 1.15));
            const confidence = Math.round((order.prediction?.confidence || 0.92) * 100);
            const isPaymentExpanded = expandedPaymentOrderId === order.id;
            const isDelivered = order.status === 'DELIVERED';
            const isCancelled = order.status === 'CANCELLED';
            const isLive = !isDelivered && !isCancelled;

            return (
              <div
                key={order.id}
                className={`rounded-2xl border bg-white p-5 sm:p-6 shadow-xs transition-all space-y-4 ${
                  isActive && isLive ? 'border-cyan-400 ring-2 ring-cyan-100' : 'border-slate-200'
                }`}
              >
                
                {/* Top Row: Order ID, Restaurant & Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">
                        {order.restaurantName}
                      </h3>
                      <span className="text-xs font-mono font-semibold text-slate-500">
                        #{order.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(order.startedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      {order.deliveryAddress && ` • ${order.deliveryAddress.slice(0, 35)}...`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {isDelivered ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Delivered</span>
                      </span>
                    ) : isCancelled ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 border border-rose-200">
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Cancelled</span>
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        {order.deliveryOtp && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-mono font-black text-amber-800 border border-amber-300">
                            <KeyRound className="h-3 w-3" />
                            <span>OTP: {order.deliveryOtp}</span>
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-800 border border-cyan-200">
                          <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                          <span>{order.status.replace(/_/g, ' ')}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Middle: Items & AI Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  
                  {/* Items list */}
                  <div className="md:col-span-6 space-y-1.5">
                    <div className="text-[11px] font-bold uppercase text-slate-400">Items Ordered ({order.items?.length || 0})</div>
                    <div className="text-xs text-slate-700 font-medium space-y-1">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between max-w-sm">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${item.isVeg ?? true ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            <span className="text-slate-800 truncate">{item.name}</span>
                            <span className="text-slate-400 font-bold">×{item.quantity}</span>
                          </div>
                          <span className="font-bold text-slate-900 ml-2">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs font-black text-slate-900 pt-1 flex items-center justify-between max-w-sm border-t border-slate-100">
                      <span>Total Paid:</span>
                      <span className="text-cyan-900">₹{order.totalAmountRupees}</span>
                    </div>

                    {order.customerRating && (
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-600 pt-1">
                        <span>Your Rating:</span>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map(st => (
                            <Star
                              key={st}
                              className={`h-3 w-3 ${st <= order.customerRating! ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                            />
                          ))}
                        </div>
                        {order.customerFeedback && <span className="text-slate-500 font-normal italic">"{order.customerFeedback}"</span>}
                      </div>
                    )}
                  </div>

                  {/* AI Prediction Highlight Box */}
                  <div className="md:col-span-6 rounded-2xl border border-cyan-200 bg-cyan-50/50 p-3.5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <Bot className="h-3.5 w-3.5 text-cyan-600" />
                        <span>AI Delivery Window</span>
                      </div>
                      <div className="text-lg font-black text-slate-900 mt-0.5">
                        {isDelivered ? 'Delivered on time' : (isCancelled ? 'Order Cancelled' : `${etaRangeMin}–${etaRangeMax} min`)}
                      </div>
                      <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                        <ShieldCheck className="h-3 w-3" /> {confidence}% confidence 🟢
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">Traffic &amp; Weather</span>
                      <span className="text-xs font-bold text-slate-700">
                        {order.conditions?.trafficLevel || 'Normal'} • {order.conditions?.weatherCondition?.replace('_', ' ') || 'Clear'}
                      </span>
                      {order.delayCompensationPoints && order.delayCompensationPoints > 0 && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 mt-1 block">
                          +{order.delayCompensationPoints} Pts SLA Compensated
                        </span>
                      )}
                    </div>
                  </div>

                </div>

                {/* Collapsible Payment Details Preview */}
                {isPaymentExpanded && (
                  <div className="pt-2 animate-in fade-in duration-200">
                    <PaymentDetailsCard orderId={order.id} />
                  </div>
                )}

                {/* Footer Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setExpandedPaymentOrderId(isPaymentExpanded ? null : order.id)}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <Receipt className="h-3.5 w-3.5 text-cyan-600" />
                      <span>{isPaymentExpanded ? 'Hide Bill' : 'Invoice & Bill'}</span>
                      {isPaymentExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>

                    <button
                      onClick={() => setExplainModalOpen(true)}
                      className="flex items-center gap-1.5 rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-800 hover:bg-cyan-100 transition-colors"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-cyan-600" />
                      <span>Explain ETA</span>
                    </button>

                    {/* Reorder Button */}
                    <button
                      onClick={() => reorderItems(order)}
                      className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors"
                    >
                      <RotateCcw className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Reorder</span>
                    </button>

                    {/* Rate Order Button for delivered */}
                    {isDelivered && !order.customerRating && (
                      <button
                        onClick={() => {
                          setRatingOrder(order);
                          setSelectedStars(5);
                        }}
                        className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100 transition-colors"
                      >
                        <Star className="h-3.5 w-3.5 text-amber-600" />
                        <span>Rate & Earn 50 Pts</span>
                      </button>
                    )}

                    {/* Cancel Order if active & early */}
                    {isLive && (order.status === 'CONFIRMED' || order.status === 'PREPARING') && (
                      <button
                        onClick={() => setCancellingOrder(order)}
                        className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors"
                      >
                        <XCircle className="h-3.5 w-3.5 text-rose-600" />
                        <span>Cancel Order</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isLive ? (
                      <button
                        onClick={() => setActiveOrderById(order.id)}
                        className="flex items-center gap-1.5 rounded-xl bg-cyan-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-cyan-700 transition-colors shadow-xs"
                      >
                        <Compass className="h-3.5 w-3.5" />
                        <span>Live AI Digital Twin</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveTab('GAMES')}
                        className="flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-100 transition-colors shadow-xs"
                      >
                        <Gamepad2 className="h-3.5 w-3.5 text-purple-600" />
                        <span>Play Mini Games</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Rate Order Modal */}
      {ratingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500 fill-amber-400" />
                <h3 className="text-base font-bold text-slate-900">Rate Your Experience</h3>
              </div>
              <button
                onClick={() => setRatingOrder(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {ratingSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-slate-900">Thank You!</h4>
                <p className="text-xs text-slate-500">You earned +50 AI Delivery Points!</p>
              </div>
            ) : (
              <form onSubmit={handleRateSubmit} className="space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-xs text-slate-600">
                    How was the delivery for <strong>{ratingOrder.restaurantName}</strong>?
                  </p>
                  <div className="flex items-center justify-center gap-2 py-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setSelectedStars(star)}
                        className="p-1 transition-transform hover:scale-125"
                      >
                        <Star
                          className={`h-7 w-7 ${
                            star <= selectedStars ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="text-xs font-bold text-amber-700">
                    {selectedStars === 5 ? '⭐ Super Fast & Fresh!' : (selectedStars >= 4 ? '👍 Very Good' : 'Fair')}
                  </div>
                </div>

                <textarea
                  value={ratingFeedback}
                  onChange={(e) => setRatingFeedback(e.target.value)}
                  placeholder="Share details about food quality, packaging, or arrival time (optional)..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  rows={3}
                />

                <button
                  type="submit"
                  className="w-full rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-xs cursor-pointer"
                >
                  Submit Rating &amp; Earn 50 Points
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-rose-600">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-base font-bold text-slate-900">Cancel Order #{cancellingOrder.id}?</h3>
            </div>
            <p className="text-xs text-slate-600">
              Are you sure you want to cancel your order from <strong>{cancellingOrder.restaurantName}</strong>?
              Your payment will be instantly refunded to your original payment source.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCancellingOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelConfirm}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      <AIExplainPredictionModal
        isOpen={explainModalOpen}
        onClose={() => setExplainModalOpen(false)}
      />

    </section>
  );
};

