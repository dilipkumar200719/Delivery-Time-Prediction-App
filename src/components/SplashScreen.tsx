import React, { useEffect, useState } from 'react';
import { Sparkles, Utensils, ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // 2.3 seconds display + 400ms fade transition
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(onFinish, 400);
    }, 2300);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(onFinish, 200);
  };

  return (
    <div
      id="brand-intro-splash-screen"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white transition-opacity duration-400 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Subtle glowing ambient lights */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-orange-600/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-600/20 blur-3xl pointer-events-none" />

      {/* Skip Button */}
      <button
        id="btn-skip-brand-intro"
        onClick={handleSkip}
        className="absolute top-6 right-6 flex items-center gap-1.5 rounded-full border border-slate-700/80 bg-slate-800/60 px-4 py-1.5 text-xs font-semibold text-slate-300 backdrop-blur-md hover:bg-slate-800 hover:text-white transition-all shadow-md"
      >
        <span>Skip Intro</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </button>

      {/* Central Brand Content */}
      <div className="relative flex flex-col items-center text-center px-6 max-w-lg space-y-6">
        
        {/* Animated Brand Logo Icon */}
        <div className="relative">
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-cyan-500 opacity-70 blur-lg animate-pulse" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 shadow-2xl border border-white/20">
            <Utensils className="h-12 w-12 text-white drop-shadow-md" />
            <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-white shadow-md">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>

        {/* Brand Name & Taglines */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold text-orange-400 tracking-wide uppercase">
            <span className="h-2 w-2 rounded-full bg-orange-400 animate-ping" />
            <span>Real Food • Smart Delivery</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            PredictEats <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-cyan-400">AI</span>
          </h1>

          <p className="text-lg font-bold text-orange-200">
            AI-Powered Delivery Time Prediction
          </p>

          <p className="text-sm font-medium text-slate-400 max-w-sm mx-auto">
            Order What You Love. Know When It Arrives.
          </p>
        </div>

        {/* Feature Highlights Pills */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-300">
          <span className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1">
            🍕 Smart Food
          </span>
          <span className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1">
            ⚡ Smarter Delivery
          </span>
          <span className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1">
            🎯 Better Planning
          </span>
        </div>

        {/* Subtle Loading Bar */}
        <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-cyan-400 rounded-full animate-[pulse_1.5s_ease-in-out_infinite] w-full" />
        </div>

      </div>
    </div>
  );
};
