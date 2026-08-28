import React, { useState } from 'react';
import { PROMO_OFFERS } from '../data/foodCatalog';
import { Tag, Check, Sparkles, Copy } from 'lucide-react';

export const OffersSection: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section id="offers-section" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <span>Today's Best Offers</span>
            <span className="text-xl">🏷️</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Stack promo codes with AI delivery points for maximum savings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PROMO_OFFERS.map(offer => {
          const isCopied = copiedCode === offer.code;
          return (
            <div
              key={offer.code}
              id={`promo-card-${offer.code}`}
              className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:-translate-y-1 hover:shadow-md space-y-3"
            >
              {/* Top Accent Gradient Ribbon */}
              <div className={`h-1.5 w-full rounded-full bg-gradient-to-r ${offer.bgGradient}`} />

              <div className="flex items-center justify-between">
                <span className="text-2xl">{offer.icon}</span>
                <span className="rounded-xl bg-orange-50 border border-orange-200 px-2.5 py-0.5 text-xs font-black text-orange-700">
                  {offer.discount}
                </span>
              </div>

              <div className="space-y-1">
                <div className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-orange-600" />
                  <span>{offer.code}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {offer.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  Min ₹{offer.minOrder}
                </span>

                <button
                  onClick={() => handleCopyCode(offer.code)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    isCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-orange-600 hover:text-white'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3 w-3" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Apply Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
