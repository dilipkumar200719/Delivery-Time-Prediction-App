import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { CustomerHero } from './components/CustomerHero';
import { FoodDiscoveryCarousels } from './components/FoodDiscoveryCarousels';
import { AIDeliveryPredictionCard } from './components/AIDeliveryPredictionCard';
import { FoodCatalog } from './components/FoodCatalog';
import { RestaurantsView } from './components/RestaurantsView';
import { MyOrdersView } from './components/MyOrdersView';
import { DeliveryDigitalTwin } from './components/DeliveryDigitalTwin';
import { DecisionRoom } from './components/DecisionRoom';
import { RouteBattle } from './components/RouteBattle';
import { DeliveryHealthWidget } from './components/DeliveryHealthWidget';
import { LiveRecalculationBanner } from './components/LiveRecalculationBanner';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmedModal } from './components/OrderConfirmedModal';
import { PlayWhileWaiting } from './components/games/PlayWhileWaiting';
import { DeliveryRushGame } from './components/games/DeliveryRushGame';
import { CatchTheFoodGame } from './components/games/CatchTheFoodGame';
import { GuessYourETAGame } from './components/games/GuessYourETAGame';
import { FutureViewModal } from './components/FutureViewModal';
import { RewardsWalletModal } from './components/RewardsWalletModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { DeliveryCompleteReport } from './components/DeliveryCompleteReport';
import { CityDeliveryPulse } from './components/CityDeliveryPulse';
import { LocationSelectorModal } from './components/LocationSelectorModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppTab } from './types';

import {
  Compass,
  Sliders,
  Sparkles,
  MapPin,
  Activity,
  Receipt,
  RotateCcw,
  Coins,
  BrainCircuit,
  Gift,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Car,
  CloudRain,
  Eye
} from 'lucide-react';

const MainDashboard: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    conditions,
    updateConditions,
    activeGame,
    setIsWalletOpen,
    setIsFutureViewOpen,
    setIsCheckoutOpen,
    setIsAuthOpen,
    resetSimulation,
    user,
    prediction
  } = useApp();

  // Bi-directional URL Hash Synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const path = window.location.pathname.replace('/', '').toLowerCase();
      const target = hash || path;

      if (target === 'restaurants') setActiveTab('RESTAURANTS');
      else if (target === 'orders' || target === 'my-orders') setActiveTab('ORDERS');
      else if (target === 'tracking' || target === 'twin' || target === 'digital-twin') setActiveTab('TWIN');
      else if (target === 'games' || target === 'play') setActiveTab('GAMES');
      else if (target === 'pulse' || target === 'city-pulse') setActiveTab('PULSE');
      else if (target === 'routes' || target === 'route-battle') setActiveTab('ROUTES');
      else if (target === 'decision-room' || target === 'decisions') setActiveTab('DECISION_ROOM');
      else if (target === 'rewards' || target === 'wallet') {
        setActiveTab('REWARDS');
        setIsWalletOpen(true);
      }
      else if (target === 'future' || target === 'future-view') {
        setActiveTab('FUTURE');
        setIsFutureViewOpen(true);
      }
      else if (target === 'profile' || target === 'account') {
        setActiveTab('PROFILE');
        setIsAuthOpen(true);
      }
      else if (target === 'checkout') {
        setActiveTab('CHECKOUT');
        setIsCheckoutOpen(true);
      }
      else if (target === 'home' || target === '') {
        setActiveTab('HOME');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setActiveTab, setIsWalletOpen, setIsFutureViewOpen, setIsCheckoutOpen, setIsAuthOpen]);

  // Sync state to hash without page reload
  useEffect(() => {
    const tabToHash: Record<AppTab, string> = {
      HOME: 'home',
      RESTAURANTS: 'restaurants',
      ORDERS: 'orders',
      TWIN: 'tracking',
      TRACKING: 'tracking',
      GAMES: 'games',
      PULSE: 'city-pulse',
      ROUTES: 'routes',
      DECISION_ROOM: 'decision-room',
      REWARDS: 'rewards',
      FUTURE: 'future',
      PROFILE: 'profile',
      CHECKOUT: 'checkout'
    };

    const targetHash = tabToHash[activeTab] || 'home';
    if (window.location.hash.replace('#', '') !== targetHash) {
      window.history.replaceState(null, '', `#${targetHash}`);
    }
  }, [activeTab]);

  // Quick Preset Environmental Scenarios
  const applyPreset = async (presetName: string) => {
    if (presetName === 'storm_traffic') {
      await updateConditions({
        trafficLevel: 'SEVERE',
        weatherCondition: 'HEAVY_RAIN',
        distanceKm: 6.8,
        restaurantPrepTime: 12
      }, '⚡ Monsoon Storm & Severe Congestion');
    } else if (presetName === 'kitchen_surge') {
      await updateConditions({
        trafficLevel: 'MEDIUM',
        weatherCondition: 'CLEAR',
        restaurantPrepTime: 22,
        storeStatus: 'DELAYED'
      }, '🍕 Kitchen Peak Rush Surge');
    } else if (presetName === 'sunny_sprint') {
      await updateConditions({
        trafficLevel: 'LOW',
        weatherCondition: 'CLEAR',
        distanceKm: 3.2,
        restaurantPrepTime: 6,
        storeStatus: 'READY'
      }, '☀️ Optimal Weather & Clear Corridor');
    }
  };

  const isTrackingActive = activeTab === 'TWIN' || activeTab === 'TRACKING';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-cyan-100 selection:text-cyan-900 font-sans pb-24 overflow-x-hidden">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Sticky Real-Time Recalculation Alert */}
      <LiveRecalculationBanner />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Environmental Stress Scenario Bar (Available on Home, Tracking, Pulse & Routes) */}
        {(activeTab === 'HOME' || isTrackingActive || activeTab === 'PULSE' || activeTab === 'ROUTES' || activeTab === 'DECISION_ROOM') && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-cyan-600 animate-ping" />
              <span className="text-xs font-bold text-slate-700">Live AI Environment:</span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-mono text-slate-600 border border-slate-200">
                {conditions.trafficLevel} Traffic • {conditions.weatherCondition.replace('_', ' ')} • {conditions.distanceKm} km
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                id="btn-preset-storm"
                onClick={() => applyPreset('storm_traffic')}
                className="rounded-xl border border-rose-200 bg-rose-50/80 px-2.5 py-1 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors flex items-center gap-1"
              >
                <span>🌧</span> Heavy Storm (+5m)
              </button>
              <button
                id="btn-preset-kitchen"
                onClick={() => applyPreset('kitchen_surge')}
                className="rounded-xl border border-amber-200 bg-amber-50/80 px-2.5 py-1 text-xs font-bold text-amber-700 hover:bg-amber-100 transition-colors flex items-center gap-1"
              >
                <span>🍕</span> Kitchen Surge (+8m)
              </button>
              <button
                id="btn-preset-clear"
                onClick={() => applyPreset('sunny_sprint')}
                className="rounded-xl border border-emerald-200 bg-emerald-50/80 px-2.5 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors flex items-center gap-1"
              >
                <span>☀️</span> Clear Sprint (-4m)
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ROUTE 1: HOME */}
        {/* ========================================================================= */}
        {activeTab === 'HOME' && (
          <ErrorBoundary fallbackTitle="Home View Recovery">
            <div className="space-y-8 animate-in fade-in duration-300">
              <CustomerHero />
              
              {/* Standout AI Delivery Prediction Card (Live Intelligence) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                    <BrainCircuit className="h-6 w-6 text-cyan-600" />
                    <span>Active Order Delivery Prediction</span>
                  </h2>
                  <button
                    onClick={() => setActiveTab('TWIN')}
                    className="flex items-center gap-1 text-xs font-bold text-cyan-700 hover:text-cyan-800 bg-cyan-50 hover:bg-cyan-100 px-3 py-1.5 rounded-xl border border-cyan-200 transition-colors"
                  >
                    <span>Full Live Map Tracking</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <AIDeliveryPredictionCard />
              </div>

              {/* Food Discovery Carousels */}
              <FoodDiscoveryCarousels />

              {/* Comprehensive Full Menu & Kitchen Sync */}
              <FoodCatalog />
              
              {/* Digital Twin Corridor Live Preview on Home */}
              <div className="space-y-4 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <BrainCircuit className="h-5 w-5 text-cyan-600" />
                      <span>Live Delivery Digital Twin &amp; Partner Telemetry</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Real-time physics corridor engine predicting courier telemetry and chokepoints
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('TWIN')}
                    className="flex items-center gap-1 text-xs font-bold text-cyan-700 hover:text-cyan-800 bg-cyan-50 hover:bg-cyan-100 px-3 py-1.5 rounded-xl border border-cyan-200 transition-colors"
                  >
                    <span>Full Screen Tracking &amp; Route Battle</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <DeliveryDigitalTwin />
              </div>
            </div>
          </ErrorBoundary>
        )}

        {/* ========================================================================= */}
        {/* ROUTE 2: RESTAURANTS */}
        {/* ========================================================================= */}
        {activeTab === 'RESTAURANTS' && (
          <ErrorBoundary fallbackTitle="Restaurants View Recovery">
            <div className="space-y-6 animate-in fade-in duration-300">
              <RestaurantsView />
            </div>
          </ErrorBoundary>
        )}

        {/* ========================================================================= */}
        {/* ROUTE 3: MY ORDERS */}
        {/* ========================================================================= */}
        {activeTab === 'ORDERS' && (
          <ErrorBoundary fallbackTitle="Orders View Recovery">
            <div className="space-y-6 animate-in fade-in duration-300">
              <MyOrdersView />
            </div>
          </ErrorBoundary>
        )}

        {/* ========================================================================= */}
        {/* ROUTE 4: TRACKING / DIGITAL TWIN */}
        {/* ========================================================================= */}
        {isTrackingActive && (
          <ErrorBoundary fallbackTitle="AI Tracking View Recovery">
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Main Autonomous Digital Twin Simulator */}
              <DeliveryDigitalTwin />

              {/* 2-Column Section: AI Route Battle & Decision Room */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7">
                  <RouteBattle />
                </div>
                <div className="lg:col-span-5">
                  <DecisionRoom />
                </div>
              </div>

              {/* Delivery Health Index */}
              <DeliveryHealthWidget />

              {/* Play While Waiting Gamification Hub */}
              <PlayWhileWaiting />
            </div>
          </ErrorBoundary>
        )}

        {/* ========================================================================= */}
        {/* ROUTE 5: GAMES & PLAY WHILE WAITING */}
        {/* ========================================================================= */}
        {activeTab === 'GAMES' && (
          <ErrorBoundary fallbackTitle="Games Hub Recovery">
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                      <span>🎮</span> Play While Waiting Hub
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Play arcade games while your food is on the way. Earn Delivery Points convertable into food vouchers!
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsWalletOpen(true)}
                      className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-colors"
                    >
                      <Coins className="h-4 w-4" />
                      <span>Rewards Wallet ({user?.deliveryPoints ?? 250} Pts)</span>
                    </button>
                  </div>
                </div>
              </div>

              <PlayWhileWaiting />
              <DeliveryHealthWidget />
            </div>
          </ErrorBoundary>
        )}

        {/* ========================================================================= */}
        {/* ROUTE 6: CITY DELIVERY PULSE */}
        {/* ========================================================================= */}
        {activeTab === 'PULSE' && (
          <ErrorBoundary fallbackTitle="City Pulse Recovery">
            <div className="space-y-6 animate-in fade-in duration-300">
              <CityDeliveryPulse />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7">
                  <RouteBattle />
                </div>
                <div className="lg:col-span-5">
                  <DecisionRoom />
                </div>
              </div>
            </div>
          </ErrorBoundary>
        )}

        {/* ========================================================================= */}
        {/* ROUTE 7: AI ROUTE BATTLE */}
        {/* ========================================================================= */}
        {activeTab === 'ROUTES' && (
          <ErrorBoundary fallbackTitle="Route Battle Recovery">
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-cyan-600" />
                  <span>AI Route Battle &amp; Multi-Corridor Analysis</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Compare optimal, highway bypass, and eco-efficient routes with real-time ETA and confidence scores.
                </p>
              </div>
              <RouteBattle />
              <DeliveryDigitalTwin />
            </div>
          </ErrorBoundary>
        )}

        {/* ========================================================================= */}
        {/* ROUTE 8: AI DECISION ROOM */}
        {/* ========================================================================= */}
        {activeTab === 'DECISION_ROOM' && (
          <ErrorBoundary fallbackTitle="Decision Room Recovery">
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-cyan-600" />
                  <span>AI Decision Room &amp; SHAP Factor Attribution</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Transparent machine learning explanations revealing why every minute of your ETA is calculated.
                </p>
              </div>
              <DecisionRoom />
              <DeliveryHealthWidget />
            </div>
          </ErrorBoundary>
        )}

        {/* ========================================================================= */}
        {/* ROUTE 9: REWARDS WALLET VIEW */}
        {/* ========================================================================= */}
        {activeTab === 'REWARDS' && (
          <ErrorBoundary fallbackTitle="Rewards Recovery">
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                      <Coins className="h-6 w-6 text-amber-500" />
                      <span>Delivery Points &amp; Rewards Wallet</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Convert waiting game points and SLA delay compensations into food order discounts.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsWalletOpen(true)}
                    className="rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors"
                  >
                    Open Wallet Ledger Modal
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                    <span className="text-xs font-semibold text-amber-800">Total Balance</span>
                    <div className="text-2xl font-black text-amber-900 mt-1">
                      {user?.deliveryPoints ?? 250} <span className="text-xs font-bold">Pts</span>
                    </div>
                    <span className="text-[11px] text-amber-700">₹{Math.round((user?.deliveryPoints ?? 250) / 10)} Food Voucher Value</span>
                  </div>

                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
                    <span className="text-xs font-semibold text-emerald-800">Games Won</span>
                    <div className="text-2xl font-black text-emerald-900 mt-1">
                      {user?.totalGamesPlayed ?? 3} <span className="text-xs font-bold">Played</span>
                    </div>
                    <span className="text-[11px] text-emerald-700">+180 Pts Earned</span>
                  </div>

                  <div className="rounded-2xl border border-cyan-200 bg-cyan-50/60 p-4">
                    <span className="text-xs font-semibold text-cyan-800">On-Time Accuracy</span>
                    <div className="text-2xl font-black text-cyan-900 mt-1">
                      94.2% <span className="text-xs font-bold">SLA</span>
                    </div>
                    <span className="text-[11px] text-cyan-700">Guaranteed Compensation</span>
                  </div>
                </div>
              </div>

              <PlayWhileWaiting />
            </div>
          </ErrorBoundary>
        )}

        {/* ========================================================================= */}
        {/* ROUTE 10: FUTURE VIEW */}
        {/* ========================================================================= */}
        {activeTab === 'FUTURE' && (
          <ErrorBoundary fallbackTitle="Future View Recovery">
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-cyan-600" />
                    <span>Future View — AI Delivery Timeline Forecaster</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Inspect predicted arrival milestones, traffic corridor shifts, and chokepoints ahead of time.
                  </p>
                </div>
                <button
                  onClick={() => setIsFutureViewOpen(true)}
                  className="rounded-xl bg-cyan-600 hover:bg-cyan-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors"
                >
                  Open Full Forecaster Modal
                </button>
              </div>
              <DeliveryDigitalTwin />
            </div>
          </ErrorBoundary>
        )}

        {/* ========================================================================= */}
        {/* ROUTE 12: PROFILE */}
        {/* ========================================================================= */}
        {activeTab === 'PROFILE' && (
          <ErrorBoundary fallbackTitle="Profile Recovery">
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                      User Profile &amp; Account Preferences
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Logged in as {user?.displayName || 'Dilip (AI Pilot)'} ({user?.email || 'dilipdhammu2@gmail.com'})
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="rounded-xl bg-cyan-600 hover:bg-cyan-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors"
                  >
                    Manage Account / Edit Profile
                  </button>
                </div>
              </div>
              <MyOrdersView />
            </div>
          </ErrorBoundary>
        )}

        {/* ========================================================================= */}
        {/* ROUTE 13: CHECKOUT */}
        {/* ========================================================================= */}
        {activeTab === 'CHECKOUT' && (
          <ErrorBoundary fallbackTitle="Checkout Recovery">
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs text-center space-y-3">
                <h2 className="text-xl font-bold text-slate-900">Checkout &amp; Order Placement</h2>
                <p className="text-xs text-slate-500">
                  Ready to confirm your order with AI delivery prediction guarantees?
                </p>
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="rounded-xl bg-cyan-600 hover:bg-cyan-700 px-6 py-2.5 text-xs font-bold text-white shadow-xs transition-colors"
                >
                  Open Checkout Modal
                </button>
              </div>
              <FoodCatalog />
            </div>
          </ErrorBoundary>
        )}

      </main>

      {/* Modals and Drawers (Always mounted & state-driven) */}
      <LocationSelectorModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderConfirmedModal />
      <FutureViewModal />
      <RewardsWalletModal />
      <AdminDashboard />
      <AuthModal />
      <DeliveryCompleteReport />

      {/* Mini Game Overlays */}
      {activeGame === 'Delivery Rush' && <DeliveryRushGame />}
      {activeGame === 'Catch the Food' && <CatchTheFoodGame />}
      {activeGame === 'Guess Your ETA' && <GuessYourETAGame />}

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainDashboard />
    </AppProvider>
  );
}
