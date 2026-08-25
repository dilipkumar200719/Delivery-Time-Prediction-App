import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Coins,
  X,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
  Gift,
  Ticket,
  CheckCircle2,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const RewardsWalletModal: React.FC = () => {
  const {
    isWalletOpen,
    setIsWalletOpen,
    user,
    rewards,
    redeemReward,
    adminSettings
  } = useApp();

  const [selectedDiscount, setSelectedDiscount] = useState<number>(25);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);

  if (!isWalletOpen) return null;

  const points = user?.deliveryPoints ?? 250;
  const rupeeValue = Math.round(points / adminSettings.pointsPerRupee);

  const handleRedeem = async (amount: number) => {
    setIsRedeeming(true);
    const success = await redeemReward(amount);
    setIsRedeeming(false);
    if (success) {
      setRedeemSuccess(`🎉 Successfully redeemed ₹${amount} discount voucher! Code: EATSAI${amount}`);
      setTimeout(() => setRedeemSuccess(null), 5000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl my-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={() => setIsWalletOpen(false)}
          className="absolute top-5 right-5 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Delivery Points & Rewards Wallet
            </h2>
            <p className="text-xs text-slate-500">
              Earn points while waiting, playing games, and from SLA delay compensations
            </p>
          </div>
        </div>

        {/* Current Balance Display Card */}
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50/50 p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Available Delivery Points
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-black text-amber-950">
                {points}
              </span>
              <span className="text-sm font-bold text-amber-800">
                Points (≈ ₹{rupeeValue})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-white/90 px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>10 Pts = ₹1 Cash Value</span>
          </div>
        </div>

        {/* Success Banner */}
        {redeemSuccess && (
          <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-xs font-bold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{redeemSuccess}</span>
          </div>
        )}

        {/* Redemption Options */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Convert Points to Order Discount
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { rupees: 25, pts: 250 },
              { rupees: 50, pts: 500 },
              { rupees: 100, pts: 1000 }
            ].map((opt) => {
              const canAfford = points >= opt.pts;
              return (
                <div
                  key={opt.rupees}
                  className={`rounded-2xl border p-4 text-center space-y-2 transition-all ${
                    canAfford
                      ? 'border-slate-200 bg-slate-50/80 hover:border-amber-300'
                      : 'border-slate-100 bg-slate-50/40 opacity-60'
                  }`}
                >
                  <Ticket className="h-5 w-5 text-amber-600 mx-auto" />
                  <div>
                    <div className="text-base font-black text-slate-900">₹{opt.rupees} Off</div>
                    <div className="text-[11px] text-slate-500 font-semibold">{opt.pts} Points</div>
                  </div>
                  <button
                    disabled={!canAfford || isRedeeming}
                    onClick={() => handleRedeem(opt.rupees)}
                    className="w-full rounded-xl bg-slate-900 py-1.5 text-[11px] font-bold text-white hover:bg-amber-600 transition-colors disabled:opacity-40"
                  >
                    Redeem
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transaction History */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Recent Points Activity
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
            {rewards.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">
                No reward transactions yet. Play games while waiting to earn points!
              </p>
            ) : (
              rewards.map((tx) => (
                <div key={tx.id} className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {tx.type === 'REDEMPTION' ? (
                      <div className="h-7 w-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <ArrowDownLeft className="h-4 w-4" />
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-slate-900">{tx.title}</div>
                      <div className="text-[10px] text-slate-400">{new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>

                  <span className={`font-mono font-bold ${
                    tx.type === 'REDEMPTION' ? 'text-rose-600' : 'text-emerald-600'
                  }`}>
                    {tx.type === 'REDEMPTION' ? `-${tx.points} pts` : `+${tx.points} pts`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
