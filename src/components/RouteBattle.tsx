import React from 'react';
import { useApp } from '../context/AppContext';
import { Compass, CheckCircle2, ShieldAlert, Sparkles, Navigation, ArrowRight } from 'lucide-react';
import { RouteOption } from '../types';

export const RouteBattle: React.FC = () => {
  const { prediction, tracking, selectRoute } = useApp();

  const routes = prediction?.availableRoutes || [];
  const activeRouteId = tracking?.currentRouteId || prediction?.recommendedRoute?.id;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Compass className="h-5 w-5 text-cyan-600" />
              AI Route Battle & Multi-Corridor Analysis
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time evaluation of competing urban transit corridors based on dynamic chokepoint friction and safety
          </p>
        </div>

        {/* AI Choice Badge */}
        <div className="flex items-center gap-2 rounded-full bg-cyan-50 px-3.5 py-1 text-xs font-bold text-cyan-800 border border-cyan-200">
          <Sparkles className="h-3.5 w-3.5 text-cyan-600" />
          <span>AI Choice: {prediction?.recommendedRoute?.name.split('—')[1] || 'Optimal Path'}</span>
        </div>
      </div>

      {/* 3 Competing Route Cards Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {routes.map((route: RouteOption) => {
          const isSelected = activeRouteId === route.id;
          const isAiChoice = route.isRecommended;

          return (
            <div
              key={route.id}
              onClick={() => selectRoute(route.id)}
              className={`cursor-pointer relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-cyan-500 bg-cyan-50/40 shadow-sm ring-1 ring-cyan-500'
                  : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {/* Recommended Top Tag */}
              {isAiChoice && (
                <div className="absolute top-0 right-0 rounded-bl-xl bg-cyan-600 px-3 py-0.5 text-[10px] font-black uppercase text-white shadow-xs">
                  ★ RECOMMENDED
                </div>
              )}

              <div className="space-y-3">
                
                {/* Route Name & Distance */}
                <div className="flex items-center justify-between pr-8">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {route.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {route.distanceKm} km transit path
                    </p>
                  </div>
                </div>

                {/* ETA Metric */}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-slate-900">
                    {route.estimatedMinutes}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">mins</span>
                </div>

                {/* Risk Level and Signals */}
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Risk Level</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      route.riskLevel === 'LOW'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : route.riskLevel === 'MEDIUM'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {route.riskLevel} Risk (Score {route.score}/100)
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 line-clamp-2">
                    {route.highlightReason || route.trafficSummary}
                  </div>
                </div>

              </div>

              {/* Selection Button */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    selectRoute(route.id);
                  }}
                  className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-colors ${
                    isSelected
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Active Route Path</span>
                    </>
                  ) : (
                    <>
                      <span>Switch to This Route</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
