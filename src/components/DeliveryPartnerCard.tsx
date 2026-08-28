import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Phone,
  MessageSquare,
  Star,
  ShieldCheck,
  Zap,
  Bike,
  Copy,
  Check,
  Send,
  X,
  Heart,
  KeyRound,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const DeliveryPartnerCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { tracking, activeOrder, setIsOtpModalOpen } = useApp();
  
  const [isCalling, setIsCalling] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [sentMessageToast, setSentMessageToast] = useState<string | null>(null);
  const [tipAmount, setTipAmount] = useState<number | null>(null);

  const etaMinutes = tracking?.etaMinutes ?? 18;
  const remainingDist = tracking?.distanceRemainingKm ?? 2.8;
  const deliveryOtp = activeOrder?.deliveryOtp || '8553';

  const quickMessages = [
    'Please leave order at my front door',
    'Call when you reach the security gate',
    'Gate passcode is #402',
    'Please do not ring the doorbell'
  ];

  const handleCopyOtp = () => {
    navigator.clipboard.writeText(deliveryOtp);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const handleSendMessage = (msg: string) => {
    setSentMessageToast(`Message delivered to Rahul: "${msg}"`);
    setIsMessaging(false);
    setCustomMsg('');
    setTimeout(() => setSentMessageToast(null), 4000);
  };

  const handleTip = (amt: number) => {
    setTipAmount(amt);
    setSentMessageToast(`₹${amt} tip added for Rahul! Thank you.`);
    setTimeout(() => setSentMessageToast(null), 3500);
  };

  return (
    <div className={`overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-5 ${className}`}>
      
      {/* Toast Alert Feedback */}
      {sentMessageToast && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800 flex items-center justify-between animate-in fade-in">
          <span>{sentMessageToast}</span>
          <button onClick={() => setSentMessageToast(null)} className="text-emerald-600 hover:text-emerald-900">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Courier Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          {/* Avatar with live pulse badge */}
          <div className="relative">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-700 text-white font-black text-xl shadow-md border-2 border-white">
              RK
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white" title="Verified Delivery Pilot">
              <ShieldCheck className="h-2.5 w-2.5" />
            </span>
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-black text-slate-900">Rahul Kumar</h3>
              <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200 flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                4.9 (2.4k+ drops)
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              <Bike className="h-3.5 w-3.5 text-cyan-600" />
              <span>Ather 450X EV • <span className="font-mono font-semibold text-slate-700">TS 09 EU 4821</span></span>
            </p>

            <div className="mt-1 flex items-center gap-2 text-[11px] font-bold text-cyan-700">
              <span className="flex h-2 w-2 rounded-full bg-cyan-600 animate-ping" />
              <span>On the way • {remainingDist} km away ({etaMinutes} min)</span>
            </div>
          </div>
        </div>

        {/* Delivery OTP Security Badge */}
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Delivery OTP</span>
          <div className="flex items-center gap-1 mt-0.5 bg-slate-100 rounded-xl px-2.5 py-1 border border-slate-200">
            <span className="font-mono text-sm font-black tracking-widest text-slate-900">{deliveryOtp}</span>
            <button
              onClick={handleCopyOtp}
              className="text-slate-400 hover:text-slate-700 p-0.5"
              title="Copy OTP"
            >
              {copiedOtp ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Communication Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => setIsCalling(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white py-2.5 text-xs font-bold transition-all shadow-xs"
        >
          <Phone className="h-3.5 w-3.5" />
          <span>Call Rahul</span>
        </button>

        <button
          onClick={() => setIsMessaging(true)}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 text-xs font-bold transition-colors"
        >
          <MessageSquare className="h-3.5 w-3.5 text-cyan-600" />
          <span>Message Partner</span>
        </button>
      </div>

      {/* Verify Delivery Handover (Enter OTP) Action Button */}
      <button
        id="btn-open-otp-verification"
        onClick={() => setIsOtpModalOpen(true)}
        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 text-xs font-black tracking-wide shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
      >
        <KeyRound className="h-4 w-4" />
        <span>VERIFY DOORSTEP HANDOVER (ENTER OTP)</span>
      </button>

      {/* Quick Tip Pill Row */}
      <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
          <Heart className="h-3.5 w-3.5 text-rose-500" />
          <span>Tip Rahul:</span>
        </div>
        <div className="flex items-center gap-1.5">
          {[20, 30, 50].map((amt) => (
            <button
              key={amt}
              onClick={() => handleTip(amt)}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                tipAmount === amt
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              +₹{amt}
            </button>
          ))}
        </div>
      </div>

      {/* Call Dialog Modal Simulation */}
      {isCalling && (
        <div className="rounded-2xl bg-slate-900 text-white p-4 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-emerald-400 animate-pulse" />
              <span className="text-xs font-bold">Masked Private Connect</span>
            </div>
            <button onClick={() => setIsCalling(false)} className="text-slate-400 hover:text-white">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-300">
            Connecting to partner Rahul Kumar via our secure privacy proxy... Your phone number stays hidden.
          </p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-mono text-emerald-400">Status: Line ringing...</span>
            <button
              onClick={() => {
                setIsCalling(false);
                setSentMessageToast('Call ended with Rahul Kumar.');
                setTimeout(() => setSentMessageToast(null), 3000);
              }}
              className="rounded-lg bg-rose-600 hover:bg-rose-700 px-3 py-1 text-xs font-bold text-white transition-colors"
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {/* Message Dialog Modal */}
      {isMessaging && (
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-slate-800">Quick Message to Rahul</span>
            <button onClick={() => setIsMessaging(false)} className="text-slate-400 hover:text-slate-700">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-1.5">
            {quickMessages.map((msg, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(msg)}
                className="w-full text-left text-xs bg-white hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 rounded-lg p-2 text-slate-700 transition-colors"
              >
                "{msg}"
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            <input
              type="text"
              placeholder="Type custom delivery instruction..."
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            <button
              disabled={!customMsg.trim()}
              onClick={() => handleSendMessage(customMsg)}
              className="rounded-lg bg-cyan-600 disabled:opacity-50 text-white p-2 hover:bg-cyan-700 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
