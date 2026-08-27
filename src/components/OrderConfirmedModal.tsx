import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  CheckCircle2,
  BrainCircuit,
  Gamepad2,
  Compass,
  ArrowRight,
  ShieldCheck,
  Clock,
  MapPin,
  X
} from 'lucide-react';

export const OrderConfirmedModal: React.FC = () => {
  const {
    orderConfirmedModal,
    setOrderConfirmedModal,
    setActiveTab,
    prediction
  } = useApp();

  if (!orderConfirmedModal) return null;

  const handleTrackWithAI = () => {
    setOrderConfirmedModal(null);
    setActiveTab('TWIN');
  };

  const handlePlayWhileWaiting = () => {
    setOrderConfirmedModal(null);
    setActiveTab('GAMES');
  };

  const etaMinutes = orderConfirmedModal.prediction?.predictedEtaMinutes || prediction?.predictedEtaMinutes || 24;
  const confidence = Math.round((orderConfirmedModal.prediction?.confidence || 0.91) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Close */}
        <button
          onClick={() => setOrderConfirmedModal(null)}
          className="absolute top-4 right-4 rounded-lg p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Celebration Header */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm shadow-emerald-500/20">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700">
              🎉 Order Confirmed
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Order #{orderConfirmedModal.id}
            </h2>
            <p className="text-xs text-slate-500">
              Your food is being freshly prepared at <strong className="text-slate-800">{orderConfirmedModal.restaurantName}</strong>.
            </p>
          </div>
        </div>

        {/* AI Prediction Highlight Box (Section 8) */}
        <div className="rounded-2xl border border-cyan-200 bg-gradient-to-b from-cyan-50/90 to-white p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-xs border-b border-cyan-100 pb-2.5">
            <span className="font-bold text-cyan-900 flex items-center gap-1.5">
              <BrainCircuit className="h-4 w-4 text-cyan-600" />
              AI DELIVERY PREDICTION
            </span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Confidence {confidence}% 🟢
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-left">
              <span className="text-xs text-slate-500">Estimated Delivery Window</span>
              <div className="text-3xl font-black text-slate-900 mt-0.5">
                {Math.max(12, Math.round(etaMinutes * 0.9))}–{Math.max(16, Math.round(etaMinutes * 1.15))} <span className="text-base font-semibold text-slate-500">minutes</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">Payment Status</span>
              <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg mt-0.5 border border-emerald-200">
                ₹{orderConfirmedModal.totalAmountRupees || 410} Paid via UPI ✅
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            id="btn-track-with-ai"
            onClick={handleTrackWithAI}
            className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-xs font-bold text-white hover:bg-cyan-700 transition-all shadow-md shadow-cyan-600/20"
          >
            <Compass className="h-4 w-4" />
            <span>TRACK WITH AI</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            id="btn-play-while-waiting"
            onClick={handlePlayWhileWaiting}
            className="flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-5 py-3 text-xs font-bold text-purple-700 hover:bg-purple-100 transition-colors shadow-xs"
          >
            <Gamepad2 className="h-4 w-4 text-purple-600" />
            <span>PLAY WHILE WAITING</span>
          </button>
        </div>

      </div>
    </div>
  );
};
