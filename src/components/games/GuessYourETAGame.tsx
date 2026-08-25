import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BrainCircuit,
  X,
  Sparkles,
  MapPin,
  Car,
  CloudRain,
  Store,
  Compass,
  Trophy,
  CheckCircle2,
  Coins,
  ArrowRight
} from 'lucide-react';
import { predictDelivery } from '../../ml/deliveryML';

export const GuessYourETAGame: React.FC = () => {
  const { closeGame, conditions, submitGameScore, prediction } = useApp();

  const [guessedEta, setGuessedEta] = useState<number>(18);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [actualAiEta, setActualAiEta] = useState<number>(0);
  const [delta, setDelta] = useState<number>(0);
  const [pointsEarned, setPointsEarned] = useState<number>(0);

  const handleGuessSubmit = async (guess: number) => {
    setIsCalculating(true);
    setGuessedEta(guess);

    const realPred = predictDelivery(conditions);
    const aiEta = realPred.predictedEtaMinutes;
    const diff = Math.abs(guess - aiEta);

    setTimeout(async () => {
      setActualAiEta(aiEta);
      setDelta(diff);

      const points = await submitGameScore(0, 10, { difference: diff, gameName: 'Guess Your ETA' });
      setPointsEarned(points);
      setIsCalculating(false);
      setHasSubmitted(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Guess Your ETA Challenge</h3>
              <p className="text-[10px] text-slate-500">
                Predict the exact minute your courier arrives to win bonus rewards
              </p>
            </div>
          </div>
          <button
            onClick={closeGame}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live Context Factors Card */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Current Environmental Telemetry
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-700">
              <MapPin className="h-3.5 w-3.5 text-cyan-600" />
              <span>Distance: {conditions.distanceKm} km</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <Car className="h-3.5 w-3.5 text-amber-500" />
              <span>Traffic: {conditions.trafficLevel}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <CloudRain className="h-3.5 w-3.5 text-blue-500" />
              <span>Weather: {conditions.weatherCondition}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <Store className="h-3.5 w-3.5 text-purple-600" />
              <span>Kitchen: {conditions.restaurantPrepTime}m</span>
            </div>
          </div>
        </div>

        {/* Guess Slider */}
        {!hasSubmitted ? (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <span className="text-xs text-slate-500 font-semibold">Your Estimated Delivery Arrival</span>
              <div className="text-4xl font-black text-slate-900">
                {guessedEta} <span className="text-sm font-semibold text-slate-400">minutes</span>
              </div>
            </div>

            <input
              type="range"
              min="10"
              max="45"
              step="1"
              value={guessedEta}
              onChange={(e) => setGuessedEta(parseInt(e.target.value))}
              className="w-full accent-cyan-600"
            />

            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>10 min (Turbo)</span>
              <span>25 min (Average)</span>
              <span>45 min (Storm/Peak)</span>
            </div>

            <button
              onClick={() => handleGuessSubmit(guessedEta)}
              disabled={isCalculating}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 text-xs font-bold text-white hover:bg-cyan-700 transition-colors shadow-xs"
            >
              {isCalculating ? 'Verifying with AI Engine...' : 'SUBMIT PREDICTION & EARN'}
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 space-y-3 text-center">
              <div className="flex justify-center">
                <Trophy className="h-10 w-10 text-emerald-600 animate-bounce" />
              </div>
              <h4 className="text-xl font-black text-slate-900">
                {delta === 0 ? '🎯 EXACT BULLSEYE!' : delta <= 2 ? '⚡ AMAZING GUESS!' : '👍 NICE TRY!'}
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-emerald-200">
                <div>
                  <span className="text-slate-500">Your Guess:</span>
                  <div className="text-lg font-bold text-slate-900">{guessedEta} min</div>
                </div>
                <div>
                  <span className="text-slate-500">AI Actual Model:</span>
                  <div className="text-lg font-bold text-cyan-700">{actualAiEta} min</div>
                </div>
              </div>

              <div className="rounded-xl bg-white p-3 border border-emerald-200 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Points Awarded:</span>
                <span className="font-black text-emerald-600 text-sm">+{pointsEarned} Pts</span>
              </div>
            </div>

            <button
              onClick={closeGame}
              className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-xs"
            >
              Return to Delivery Screen
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
