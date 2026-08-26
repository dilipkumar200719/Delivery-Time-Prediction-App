import React from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_CITIES } from '../data/cities';
import { SupportedCity } from '../types';
import {
  MapPin,
  CheckCircle2,
  X,
  Building2,
  Compass,
  Navigation,
  Sparkles
} from 'lucide-react';

export const LocationSelectorModal: React.FC = () => {
  const {
    selectedCity,
    setSelectedCity,
    isLocationModalOpen,
    setIsLocationModalOpen
  } = useApp();

  if (!isLocationModalOpen) return null;

  const cityList: SupportedCity[] = ['Vijayawada', 'Hyderabad', 'Mumbai', 'Chennai'];

  const handleSelectCity = (city: SupportedCity) => {
    setSelectedCity(city);
    setIsLocationModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl space-y-5 p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 border border-cyan-100">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-slate-900">
                Choose Your Delivery City
              </h3>
              <p className="text-xs text-slate-500">
                PredictEats AI optimizes live routes and kitchen ETAs per city
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* City Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cityList.map((cityKey) => {
            const city = SUPPORTED_CITIES[cityKey];
            const isSelected = selectedCity === cityKey;

            return (
              <button
                key={cityKey}
                onClick={() => handleSelectCity(cityKey)}
                className={`relative flex flex-col items-start rounded-2xl p-4 text-left border transition-all ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-50/70 shadow-xs ring-2 ring-cyan-100'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-bold text-cyan-800 bg-cyan-100/90 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-600" />
                    Active
                  </span>
                )}

                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <Building2 className={`h-4 w-4 ${isSelected ? 'text-cyan-600' : 'text-slate-400'}`} />
                  <span>{city.name}</span>
                </div>

                <span className="text-xs text-slate-500 font-medium mt-0.5">
                  {city.state}
                </span>

                <div className="mt-3 pt-2 border-t border-slate-100/80 w-full">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                    <Navigation className="h-3 w-3 text-cyan-600 shrink-0" />
                    <span className="truncate">{city.popularArea}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5 line-clamp-1">
                    {city.tagline}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="rounded-xl bg-slate-50 p-3 flex items-center gap-2 text-xs text-slate-600 border border-slate-100">
          <Sparkles className="h-4 w-4 text-cyan-600 shrink-0" />
          <span>
            Selecting a city automatically calibrates live arterial corridors, localized food catalogs, and real-time transit telemetry.
          </span>
        </div>

      </div>
    </div>
  );
};
