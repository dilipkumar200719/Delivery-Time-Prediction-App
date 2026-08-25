import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Play, RotateCcw, Coins, Heart, Zap, Trophy, Sparkles } from 'lucide-react';

interface GameObject {
  x: number;
  y: number;
  type: 'package' | 'star' | 'boost' | 'coin' | 'car' | 'bus' | 'roadblock';
  width: number;
  height: number;
  speed: number;
}

export const DeliveryRushGame: React.FC = () => {
  const { closeGame, submitGameScore, conditions } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [gameState, setGameState] = useState<'READY' | 'PLAYING' | 'GAMEOVER'>('READY');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(1);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [rupeeValue, setRupeeValue] = useState(0);

  const playerRef = useRef({ x: 160, lane: 1, targetX: 160 });
  const objectsRef = useRef<GameObject[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const scoreRef = useRef<number>(0);
  const livesRef = useRef<number>(3);
  const comboRef = useRef<number>(1);

  const lanePositions = [60, 160, 260];

  const handleStartGame = () => {
    setGameState('PLAYING');
    setScore(0);
    setLives(3);
    setCombo(1);
    scoreRef.current = 0;
    livesRef.current = 3;
    comboRef.current = 1;
    playerRef.current = { x: 160, lane: 1, targetX: 160 };
    objectsRef.current = [];
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING') return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        const currentLane = playerRef.current.lane;
        if (currentLane > 0) {
          playerRef.current.lane = currentLane - 1;
          playerRef.current.targetX = lanePositions[currentLane - 1];
        }
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        const currentLane = playerRef.current.lane;
        if (currentLane < 2) {
          playerRef.current.lane = currentLane + 1;
          playerRef.current.targetX = lanePositions[currentLane + 1];
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const moveLane = (dir: 'left' | 'right') => {
    if (gameState !== 'PLAYING') return;
    const currentLane = playerRef.current.lane;
    if (dir === 'left' && currentLane > 0) {
      playerRef.current.lane = currentLane - 1;
      playerRef.current.targetX = lanePositions[currentLane - 1];
    } else if (dir === 'right' && currentLane < 2) {
      playerRef.current.lane = currentLane + 1;
      playerRef.current.targetX = lanePositions[currentLane + 1];
    }
  };

  const handleGameOver = useCallback(async () => {
    setGameState('GAMEOVER');
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    const finalScore = scoreRef.current;
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    const pts = await submitGameScore(finalScore, elapsed);
    setPointsEarned(pts);
    setRupeeValue(Math.round(pts / 10));
  }, [submitGameScore]);

  // Main Canvas Game Engine Loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let roadOffset = 0;

    const gameLoop = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Road (Light Clean Cyber theme)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Side Curbs
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(0, 0, 10, canvas.height);
      ctx.fillRect(canvas.width - 10, 0, 10, canvas.height);

      // Road Lane Markings
      roadOffset = (roadOffset + 6) % 40;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.setLineDash([20, 20]);
      ctx.lineDashOffset = -roadOffset;

      ctx.beginPath();
      ctx.moveTo(110, 0);
      ctx.lineTo(110, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(210, 0);
      ctx.lineTo(210, canvas.height);
      ctx.stroke();

      ctx.setLineDash([]);

      // Spawn Objects
      if (timestamp - lastSpawnRef.current > 750) {
        lastSpawnRef.current = timestamp;
        const randomLane = Math.floor(Math.random() * 3);
        const spawnX = lanePositions[randomLane];
        const isGoodItem = Math.random() < 0.65;

        let objType: GameObject['type'] = 'package';
        if (isGoodItem) {
          const r = Math.random();
          if (r < 0.4) objType = 'package';
          else if (r < 0.7) objType = 'coin';
          else if (r < 0.9) objType = 'star';
          else objType = 'boost';
        } else {
          const r = Math.random();
          if (r < 0.5) objType = 'car';
          else if (r < 0.8) objType = 'roadblock';
          else objType = 'bus';
        }

        const baseSpeed = conditions.weatherCondition === 'HEAVY_RAIN' ? 4 : (conditions.trafficLevel === 'SEVERE' ? 6 : 5);
        objectsRef.current.push({
          x: spawnX,
          y: -30,
          type: objType,
          width: 32,
          height: 32,
          speed: baseSpeed + (scoreRef.current / 300)
        });
      }

      // Smooth Lerp Player position
      playerRef.current.x += (playerRef.current.targetX - playerRef.current.x) * 0.25;
      const px = playerRef.current.x;
      const py = canvas.height - 70;

      // Draw Bike Rider
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(px, py, 14, 0, Math.PI * 2);
      ctx.fill();

      // Bike Body
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(px - 6, py - 18, 12, 34);

      // Rider Helmet
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px, py - 4, 7, 0, Math.PI * 2);
      ctx.fill();

      // Thermal Delivery Box on rear
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(px - 10, py + 8, 20, 14);

      // Update & Draw Objects
      for (let i = objectsRef.current.length - 1; i >= 0; i--) {
        const obj = objectsRef.current[i];
        obj.y += obj.speed;

        // Render object
        if (obj.type === 'package') {
          ctx.fillStyle = '#a855f7';
          ctx.fillRect(obj.x - 12, obj.y - 12, 24, 24);
          ctx.fillStyle = '#ffffff';
          ctx.font = '14px sans-serif';
          ctx.fillText('📦', obj.x - 9, obj.y + 6);
        } else if (obj.type === 'star') {
          ctx.fillStyle = '#eab308';
          ctx.fillText('⭐', obj.x - 9, obj.y + 6);
        } else if (obj.type === 'coin') {
          ctx.fillStyle = '#fbbf24';
          ctx.fillText('🪙', obj.x - 8, obj.y + 6);
        } else if (obj.type === 'boost') {
          ctx.fillStyle = '#10b981';
          ctx.fillText('⚡', obj.x - 7, obj.y + 6);
        } else if (obj.type === 'car') {
          ctx.fillStyle = '#f43f5e';
          ctx.fillRect(obj.x - 15, obj.y - 20, 30, 42);
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px monospace';
          ctx.fillText('🚗', obj.x - 8, obj.y + 5);
        } else if (obj.type === 'bus') {
          ctx.fillStyle = '#ea580c';
          ctx.fillRect(obj.x - 18, obj.y - 26, 36, 52);
          ctx.fillStyle = '#ffffff';
          ctx.fillText('🚌', obj.x - 8, obj.y + 5);
        } else if (obj.type === 'roadblock') {
          ctx.fillStyle = '#e11d48';
          ctx.fillText('🚧', obj.x - 9, obj.y + 6);
        }

        // Collision Check with player
        const dist = Math.hypot(px - obj.x, py - obj.y);
        if (dist < 28) {
          if (obj.type === 'package') {
            scoreRef.current += 30 * comboRef.current;
            comboRef.current = Math.min(5, comboRef.current + 1);
          } else if (obj.type === 'star') {
            scoreRef.current += 10 * comboRef.current;
          } else if (obj.type === 'coin') {
            scoreRef.current += 5 * comboRef.current;
          } else if (obj.type === 'boost') {
            scoreRef.current += 20 * comboRef.current;
          } else {
            livesRef.current -= 1;
            comboRef.current = 1;
            setLives(livesRef.current);

            if (livesRef.current <= 0) {
              handleGameOver();
              return;
            }
          }

          setScore(scoreRef.current);
          setCombo(comboRef.current);
          objectsRef.current.splice(i, 1);
          continue;
        }

        if (obj.y > canvas.height + 50) {
          objectsRef.current.splice(i, 1);
        }
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameState, handleGameOver, conditions]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛵</span>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Delivery Rush</h3>
              <p className="text-[10px] text-slate-500 font-mono">
                Weather: {conditions.weatherCondition} • Traffic: {conditions.trafficLevel}
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
          <div className="flex items-center gap-1 text-cyan-700 font-bold">
            <span>Combo: {combo}x</span>
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
            className="w-[320px] h-[380px]"
          />

          {/* READY Overlay */}
          {gameState === 'READY' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/85 p-6 text-center">
              <span className="text-4xl mb-2">🛵</span>
              <h4 className="text-xl font-black text-white">Delivery Rush</h4>
              <p className="mt-2 text-xs text-slate-300">
                Use Left / Right arrow keys (or buttons below) to steer the bike. Collect packages (+30), avoid cars and obstacles!
              </p>
              <button
                id="btn-start-delivery-rush-game"
                onClick={handleStartGame}
                className="mt-5 flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-6 py-3 text-sm font-black text-slate-950 uppercase shadow-lg shadow-cyan-500/30 transition-all"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Start Ride</span>
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
                  <span>Game Score:</span>
                  <span className="font-bold text-white text-sm">{score}</span>
                </div>
                <div className="flex justify-between text-amber-400">
                  <span>Delivery Points Awarded:</span>
                  <span className="font-bold text-sm">+{pointsEarned} Pts</span>
                </div>
                <div className="flex justify-between text-emerald-400 border-t border-slate-800 pt-1.5">
                  <span>Reward Discount Value:</span>
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

        {/* Mobile / On-Screen Touch Controls */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => moveLane('left')}
            className="rounded-xl border border-slate-200 bg-slate-100 py-2.5 text-center text-xs font-bold text-slate-800 active:bg-slate-200"
          >
            ← Steer Left
          </button>
          <button
            onClick={() => moveLane('right')}
            className="rounded-xl border border-slate-200 bg-slate-100 py-2.5 text-center text-xs font-bold text-slate-800 active:bg-slate-200"
          >
            Steer Right →
          </button>
        </div>

      </div>
    </div>
  );
};
