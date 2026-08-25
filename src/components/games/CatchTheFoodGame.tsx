import React, { useRef, useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Play, RotateCcw, Coins, Heart, Trophy, Sparkles } from 'lucide-react';

interface FoodFallingItem {
  x: number;
  y: number;
  type: 'burger' | 'pizza' | 'fries' | 'drink' | 'golden' | 'rotten';
  speed: number;
}

export const CatchTheFoodGame: React.FC = () => {
  const { closeGame, submitGameScore } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [gameState, setGameState] = useState<'READY' | 'PLAYING' | 'GAMEOVER'>('READY');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [rupeeValue, setRupeeValue] = useState(0);

  const trayXRef = useRef(160);
  const itemsRef = useRef<FoodFallingItem[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const startTimeRef = useRef(0);
  const lastSpawnRef = useRef(0);

  const handleStartGame = () => {
    setGameState('PLAYING');
    setScore(0);
    setLives(3);
    scoreRef.current = 0;
    livesRef.current = 3;
    trayXRef.current = 160;
    itemsRef.current = [];
    startTimeRef.current = Date.now();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== 'PLAYING') return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = e.clientX - rect.left;
    trayXRef.current = Math.max(35, Math.min(285, clientX));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (gameState !== 'PLAYING') return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || !e.touches[0]) return;
    const clientX = e.touches[0].clientX - rect.left;
    trayXRef.current = Math.max(35, Math.min(285, clientX));
  };

  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Spawn Food
      if (timestamp - lastSpawnRef.current > 700) {
        lastSpawnRef.current = timestamp;
        const types: FoodFallingItem['type'][] = ['burger', 'pizza', 'fries', 'drink', 'golden', 'rotten'];
        const weights = [0.3, 0.25, 0.2, 0.15, 0.05, 0.05];
        const r = Math.random();
        let selectedType: FoodFallingItem['type'] = 'burger';
        let cum = 0;
        for (let i = 0; i < types.length; i++) {
          cum += weights[i];
          if (r <= cum) {
            selectedType = types[i];
            break;
          }
        }

        itemsRef.current.push({
          x: Math.floor(30 + Math.random() * (canvas.width - 60)),
          y: -20,
          type: selectedType,
          speed: 3 + Math.random() * 2.5
        });
      }

      // Draw Insulated Delivery Tray
      const trayX = trayXRef.current;
      const trayY = canvas.height - 45;

      ctx.fillStyle = '#0891b2';
      ctx.beginPath();
      ctx.roundRect(trayX - 35, trayY, 70, 16, [6, 6, 2, 2]);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '10px sans-serif';
      ctx.fillText('HOT BAG', trayX - 22, trayY + 12);

      // Update and Draw Falling Food
      for (let i = itemsRef.current.length - 1; i >= 0; i--) {
        const item = itemsRef.current[i];
        item.y += item.speed;

        let emoji = '🍔';
        if (item.type === 'pizza') emoji = '🍕';
        else if (item.type === 'fries') emoji = '🍟';
        else if (item.type === 'drink') emoji = '🥤';
        else if (item.type === 'golden') emoji = '👑';
        else if (item.type === 'rotten') emoji = '💣';

        ctx.font = '24px sans-serif';
        ctx.fillText(emoji, item.x - 12, item.y);

        // Collision with Tray
        if (item.y >= trayY - 5 && item.y <= trayY + 15) {
          if (item.x >= trayX - 38 && item.x <= trayX + 38) {
            if (item.type === 'rotten') {
              livesRef.current -= 1;
              setLives(livesRef.current);
              if (livesRef.current <= 0) {
                handleGameOver();
                return;
              }
            } else if (item.type === 'golden') {
              scoreRef.current += 50;
            } else {
              scoreRef.current += 15;
            }
            setScore(scoreRef.current);
            itemsRef.current.splice(i, 1);
            continue;
          }
        }

        // Missed item
        if (item.y > canvas.height + 20) {
          if (item.type !== 'rotten') {
            livesRef.current -= 1;
            setLives(livesRef.current);
            if (livesRef.current <= 0) {
              handleGameOver();
              return;
            }
          }
          itemsRef.current.splice(i, 1);
        }
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    const handleGameOver = async () => {
      setGameState('GAMEOVER');
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

      const finalScore = scoreRef.current;
      const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
      const pts = await submitGameScore(finalScore, elapsed);
      setPointsEarned(pts);
      setRupeeValue(Math.round(pts / 10));
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameState, submitGameScore]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍕</span>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Catch the Food</h3>
              <p className="text-[10px] text-slate-500 font-mono">
                Catch meals in your thermal delivery bag
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

        {/* Live HUD */}
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2 border border-slate-200 text-xs font-mono">
          <div className="flex items-center gap-1 text-rose-600 font-bold">
            <Heart className="h-4 w-4 fill-rose-500" />
            <span>{lives} Lives</span>
          </div>
          <div className="flex items-center gap-1 text-amber-700 font-bold">
            <Coins className="h-4 w-4" />
            <span>{score} Pts</span>
          </div>
        </div>

        {/* Game Canvas Container */}
        <div className="relative flex justify-center overflow-hidden rounded-2xl border border-slate-300 bg-slate-900 shadow-inner">
          <canvas
            ref={canvasRef}
            width={320}
            height={380}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="w-[320px] h-[380px] cursor-pointer"
          />

          {/* READY Overlay */}
          {gameState === 'READY' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/85 p-6 text-center">
              <span className="text-4xl mb-2">🍕</span>
              <h4 className="text-xl font-black text-white">Catch the Food</h4>
              <p className="mt-2 text-xs text-slate-300">
                Move your mouse / finger to slide the insulated bag. Catch falling delicious meals (+15), avoid rotten bombs!
              </p>
              <button
                onClick={handleStartGame}
                className="mt-5 flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-6 py-3 text-sm font-black text-slate-950 uppercase shadow-lg shadow-cyan-500/30 transition-all"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Start Catching</span>
              </button>
            </div>
          )}

          {/* GAMEOVER Overlay */}
          {gameState === 'GAMEOVER' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 p-6 text-center animate-in zoom-in-95 duration-200">
              <Trophy className="h-10 w-10 text-amber-400 animate-bounce mb-2" />
              <h4 className="text-2xl font-black text-white">🎉 GAME OVER</h4>
              
              <div className="mt-4 w-full rounded-2xl bg-slate-900 p-4 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Score:</span>
                  <span className="font-bold text-white text-sm">{score}</span>
                </div>
                <div className="flex justify-between text-amber-400">
                  <span>Points Earned:</span>
                  <span className="font-bold text-sm">+{pointsEarned} Pts</span>
                </div>
                <div className="flex justify-between text-emerald-400 border-t border-slate-800 pt-1.5">
                  <span>Discount Value:</span>
                  <span className="font-black text-sm">₹{rupeeValue}</span>
                </div>
              </div>

              <div className="mt-5 flex gap-2 w-full">
                <button
                  onClick={handleStartGame}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 py-2.5 px-3 text-xs font-bold text-white transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Play Again</span>
                </button>
                <button
                  onClick={closeGame}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-800 py-2.5 px-3 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  Back to Tracking
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
