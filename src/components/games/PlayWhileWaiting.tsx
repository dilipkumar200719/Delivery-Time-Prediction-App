import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Gamepad2,
  BrainCircuit,
  Coins,
  Sparkles,
  Zap,
  Clock,
  Play,
  Trophy,
  ArrowRight
} from 'lucide-react';

export const PlayWhileWaiting: React.FC = () => {
  const {
    activeOrder,
    tracking,
    prediction,
    user,
    openGame,
    leaderboard
  } = useApp();

  const eta = tracking?.etaMinutes ?? (prediction?.predictedEtaMinutes ?? 18);

  let recommendationBadge = 'Quick Play (~2 min)';
  let recommendedGame = 'Guess Your ETA';
  if (eta >= 20) {
    recommendationBadge = 'Full Rush Challenge (~5 min)';
    recommendedGame = 'Delivery Rush';
  } else if (eta >= 10) {
    recommendationBadge = 'Standard Challenge (~3 min)';
    recommendedGame = 'Delivery Rush';
  }

  const gamesList = [
    {
      id: 'Delivery Rush',
      title: '🛵 Delivery Rush',
      subtitle: 'Dodge potholes, collect pizzas, jump barriers in a fast-paced infinite runner!',
      reward: 'Up to 300 Pts (₹30)',
      color: 'border-cyan-200 bg-cyan-50/40 hover:bg-cyan-50/70',
      badge: 'Most Popular'
    },
    {
      id: 'Catch the Food',
      title: '🍕 Catch the Food',
      subtitle: 'Catch burgers & samosas in your insulated delivery bag before they hit the ground.',
      reward: 'Up to 250 Pts (₹25)',
      color: 'border-amber-200 bg-amber-50/40 hover:bg-amber-50/70',
      badge: 'Casual'
    },
    {
      id: 'Guess Your ETA',
      title: '🎯 Guess Your ETA',
      subtitle: 'Test your intuition! Predict the exact minute your courier arrives for jackpot points.',
      reward: '150 Pts (Exact match)',
      color: 'border-purple-200 bg-purple-50/40 hover:bg-purple-50/70',
      badge: 'Jackpot'
    }
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs space-y-6">
      
      {/* Top Banner: Waiting Time & Rewards Prompt */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Active Delivery Waiting Time
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-3xl sm:text-4xl font-black text-slate-900">
              {eta}:00
            </span>
            <span className="text-xs font-semibold text-slate-500">mins remaining</span>
          </div>
        </div>

        {/* Turn Waiting into Rewards Pill */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-3 sm:px-4">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-amber-600" />
            <div>
              <div className="text-xs font-bold text-amber-950">
                Turn waiting time into food discounts!
              </div>
              <p className="text-[11px] text-amber-800">
                Play games below to earn real Delivery Points redeemable for order discounts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation Chip */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400 font-bold uppercase tracking-wider">AI Suggested Game:</span>
        <span className="rounded-full bg-cyan-50 px-3 py-1 font-bold text-cyan-800 border border-cyan-200 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-cyan-600" />
          {recommendedGame} • {recommendationBadge}
        </span>
      </div>

      {/* 3 Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {gamesList.map((game) => (
          <div
            key={game.id}
            className={`rounded-2xl border p-5 transition-all flex flex-col justify-between space-y-4 shadow-2xs ${game.color}`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
                  {game.badge}
                </span>
                <span className="text-xs font-black text-amber-700">
                  {game.reward}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-3">
                {game.title}
              </h3>

              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {game.subtitle}
              </p>
            </div>

            <button
              onClick={() => openGame(game.id as any)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-cyan-600 transition-colors shadow-xs"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>PLAY NOW & EARN</span>
            </button>
          </div>
        ))}
      </div>

      {/* Leaderboard Snippet */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Trophy className="h-4 w-4 text-amber-500" />
            Top Waiting Champions Leaderboard
          </span>
          <span className="text-xs text-slate-500">Live Weekly Sync</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          {leaderboard.slice(0, 3).map((lead, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-white p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-amber-600">#{lead.rank}</span>
                <span className="font-semibold text-slate-800 truncate max-w-[100px]">{lead.displayName || (lead as any).userName || 'Champion'}</span>
              </div>
              <span className="font-mono font-black text-slate-900">{lead.totalPoints} pts</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
