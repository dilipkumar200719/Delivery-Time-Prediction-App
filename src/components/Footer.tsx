import React from 'react';
import { useApp } from '../context/AppContext';
import { Utensils, Sparkles, ShieldCheck, Heart, MapPin, Bike } from 'lucide-react';
import { SUPPORTED_CITIES } from '../data/cities';

export const Footer: React.FC = () => {
  const { setActiveTab, setSelectedCity } = useApp();

  return (
    <footer id="main-application-footer" className="mt-16 border-t border-slate-200 bg-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Feature Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 rounded-3xl border border-orange-100 bg-orange-50/50 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-xs">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">AI-Powered Arrival ETAs</h4>
              <p className="text-xs text-slate-500">Live corridor physics &amp; kitchen load calculation</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-xs">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">On-Time SLA Guarantee</h4>
              <p className="text-xs text-slate-500">Automatic delay compensation points into wallet</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-xs">
              <Bike className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Digital Twin Tracking</h4>
              <p className="text-xs text-slate-500">Sub-meter rider telemetry &amp; live route updates</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
          
          {/* Col 1: Brand Info */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-600 text-white shadow-xs">
                <Utensils className="h-5 w-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                PredictEats <span className="text-orange-600">AI</span>
              </span>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed max-w-sm">
              Next-generation food discovery platform combining authentic local eateries with machine-learning delivery time prediction.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>94.2% AI Accuracy SLA</span>
              </span>
            </div>
          </div>

          {/* Col 2: Discovery */}
          <div className="space-y-2.5">
            <h5 className="font-black text-slate-900 uppercase tracking-wider text-[11px]">Discover</h5>
            <ul className="space-y-2 text-slate-600 font-medium">
              <li>
                <button onClick={() => setActiveTab('HOME')} className="hover:text-orange-600 transition-colors">
                  Food Homepage
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('RESTAURANTS')} className="hover:text-orange-600 transition-colors">
                  All Restaurants
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('OFFERS')} className="hover:text-orange-600 transition-colors">
                  Deals &amp; Offers
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('ORDERS')} className="hover:text-orange-600 transition-colors">
                  My Orders
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: AI Intelligence */}
          <div className="space-y-2.5">
            <h5 className="font-black text-slate-900 uppercase tracking-wider text-[11px]">AI Intelligence</h5>
            <ul className="space-y-2 text-slate-600 font-medium">
              <li>
                <button onClick={() => setActiveTab('TWIN')} className="hover:text-orange-600 transition-colors">
                  Track Order
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('AI_LAB')} className="hover:text-orange-600 transition-colors">
                  AI Prediction Lab
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('ROUTES')} className="hover:text-orange-600 transition-colors">
                  Route Battle Analysis
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('GAMES')} className="hover:text-orange-600 transition-colors">
                  Play While Waiting
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Cities We Deliver To */}
          <div className="space-y-2.5">
            <h5 className="font-black text-slate-900 uppercase tracking-wider text-[11px]">Cities Served</h5>
            <ul className="space-y-2 text-slate-600 font-medium">
              {Object.keys(SUPPORTED_CITIES).map(city => (
                <li key={city}>
                  <button
                    onClick={() => {
                      setSelectedCity(city as any);
                      setActiveTab('HOME');
                    }}
                    className="hover:text-orange-600 transition-colors"
                  >
                    {city}
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} PredictEats AI. AI-Powered Food Delivery Platform.</p>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-500 font-semibold">
              <span>Made with</span>
              <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
              <span>for Food Lovers</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
