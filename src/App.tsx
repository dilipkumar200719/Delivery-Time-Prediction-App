import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { SplashScreen } from './components/SplashScreen';
import { FoodHeroCarousel } from './components/FoodHeroCarousel';
import { CategoryCarousel } from './components/CategoryCarousel';
import { TopRestaurantsCarousel } from './components/TopRestaurantsCarousel';
import { OffersSection } from './components/OffersSection';
import { PopularDishesSection } from './components/PopularDishesSection';
import { RestaurantDetailPage } from './components/RestaurantDetailPage';
import { RestaurantsView } from './components/RestaurantsView';
import { MyOrdersView } from './components/MyOrdersView';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AIPredictionLab } from './components/AIPredictionLab';
import { RiderDashboard } from './components/RiderDashboard';
import { Footer } from './components/Footer';

// Supporting Modals & Views
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmedModal } from './components/OrderConfirmedModal';
import { CustomerOtpModal } from './components/CustomerOtpModal';
import { FutureViewModal } from './components/FutureViewModal';
import { RewardsWalletModal } from './components/RewardsWalletModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { DeliveryCompleteReport } from './components/DeliveryCompleteReport';
import { LocationSelectorModal } from './components/LocationSelectorModal';
import { AIAssistantChatbot } from './components/AIAssistantChatbot';
import { LiveRecalculationBanner } from './components/LiveRecalculationBanner';
import { ErrorBoundary } from './components/ErrorBoundary';

// Games & Secondary views
import { PlayWhileWaiting } from './components/games/PlayWhileWaiting';
import { DeliveryRushGame } from './components/games/DeliveryRushGame';
import { CatchTheFoodGame } from './components/games/CatchTheFoodGame';
import { GuessYourETAGame } from './components/games/GuessYourETAGame';
import { CityDeliveryPulse } from './components/CityDeliveryPulse';
import { RouteBattle } from './components/RouteBattle';
import { DecisionRoom } from './components/DecisionRoom';
import { DeliveryDigitalTwin } from './components/DeliveryDigitalTwin';
import { DeliveryHealthWidget } from './components/DeliveryHealthWidget';
import { AppTab } from './types';
import { BrainCircuit, Sparkles, ArrowRight, Coins, Eye, MapPin } from 'lucide-react';

const MainDashboard: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const {
    activeTab,
    setActiveTab,
    activeGame,
    setIsWalletOpen,
    setIsFutureViewOpen,
    setIsCheckoutOpen,
    setIsAuthOpen,
    user
  } = useApp();

  // Bi-directional URL Hash Synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const path = window.location.pathname.replace('/', '').toLowerCase();
      const target = hash || path;

      if (target === 'restaurants') setActiveTab('RESTAURANTS');
      else if (target === 'restaurant-detail' || target.startsWith('restaurant/')) setActiveTab('RESTAURANT_DETAIL');
      else if (target === 'offers' || target === 'deals') setActiveTab('OFFERS');
      else if (target === 'orders' || target === 'my-orders') setActiveTab('ORDERS');
      else if (target === 'tracking' || target === 'twin' || target === 'track-order') setActiveTab('TWIN');
      else if (target === 'ai-prediction' || target === 'ai_lab' || target === 'insights' || target === 'ai') setActiveTab('AI_LAB');
      else if (target === 'rider' || target === 'delivery-boy' || target === 'courier') setActiveTab('RIDER');
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

  // Sync state to hash
  useEffect(() => {
    const tabToHash: Record<AppTab, string> = {
      HOME: 'home',
      RESTAURANTS: 'restaurants',
      RESTAURANT_DETAIL: 'restaurant-detail',
      OFFERS: 'offers',
      ORDERS: 'orders',
      TWIN: 'tracking',
      TRACKING: 'tracking',
      AI_LAB: 'ai-prediction',
      INSIGHTS: 'ai-prediction',
      RIDER: 'rider',
      GAMES: 'games',
      PULSE: 'city-pulse',
      ROUTES: 'routes',
      DECISION_ROOM: 'decision-room',
      REWARDS: 'rewards',
      FUTURE: 'future',
      PROFILE: 'profile',
      CHECKOUT: 'checkout',
      ADMIN: 'admin'
    };

    const targetHash = tabToHash[activeTab] || 'home';
    if (window.location.hash.replace('#', '') !== targetHash) {
      window.history.replaceState(null, '', `#${targetHash}`);
    }
  }, [activeTab]);

  const isTrackingActive = activeTab === 'TWIN' || activeTab === 'TRACKING';

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 selection:bg-orange-100 selection:text-orange-900 font-sans flex flex-col justify-between overflow-x-hidden">
      
      {/* 1. Brand Intro Splash Screen (Initial 2.5s) */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      <div>
        {/* Top Sticky Navbar */}
        <Navbar />

        {/* Sticky Real-Time Recalculation Alert Banner */}
        <LiveRecalculationBanner />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8 flex-1">
          
          {/* ========================================================================= */}
          {/* ROUTE 1: FOOD HOMEPAGE (Customer / User default experience) */}
          {/* ========================================================================= */}
          {activeTab === 'HOME' && (
            <ErrorBoundary fallbackTitle="Home View Recovery">
              <div className="space-y-10 animate-in fade-in duration-300">
                {/* 1. Hero Food Carousel */}
                <FoodHeroCarousel />

                {/* 2. Categories Carousel ("What's on your mind? 🍽️") */}
                <CategoryCarousel />

                {/* 3. Top Restaurants Near You ("Top Restaurants Near You 🔥") */}
                <TopRestaurantsCarousel />

                {/* 4. Promotional Offers ("Today's Best Offers 🏷️") */}
                <OffersSection />

                {/* 5. Popular Dishes Grid ("Popular Dishes Near You 🍽️") */}
                <PopularDishesSection />

                {/* 6. AI Delivery Intelligence Spotlight Banner */}
                <section className="relative overflow-hidden rounded-3xl border border-orange-200/80 bg-gradient-to-r from-orange-600 via-amber-600 to-cyan-700 p-6 sm:p-8 text-white shadow-md">
                  <div className="absolute top-0 right-0 -z-0 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 max-w-xl text-center md:text-left">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-black text-white border border-white/30">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>PredictEats AI Engine</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                        AI Predicts. You Enjoy.
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
                        Unlike static timers, our machine learning models calculate real-time kitchen surge, road friction, and corridor chokepoints so you always know when your food arrives.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <button
                        onClick={() => setActiveTab('TWIN')}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-black text-slate-900 shadow-md hover:bg-orange-50 hover:text-orange-600 transition-all hover:scale-105"
                      >
                        <BrainCircuit className="h-4 w-4 text-cyan-600" />
                        <span>Track Active Order</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('AI_LAB')}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-slate-950/60 border border-white/30 px-5 py-3 text-xs font-bold text-white hover:bg-slate-950/80 transition-all"
                      >
                        <span>Explore AI Prediction Lab</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </ErrorBoundary>
          )}

          {/* ========================================================================= */}
          {/* ROUTE 2: RESTAURANT DETAIL VIEW */}
          {/* ========================================================================= */}
          {activeTab === 'RESTAURANT_DETAIL' && (
            <ErrorBoundary fallbackTitle="Restaurant Detail Recovery">
              <RestaurantDetailPage onBack={() => setActiveTab('HOME')} />
            </ErrorBoundary>
          )}

          {/* ========================================================================= */}
          {/* ROUTE 3: RESTAURANTS DIRECTORY */}
          {/* ========================================================================= */}
          {activeTab === 'RESTAURANTS' && (
            <ErrorBoundary fallbackTitle="Restaurants View Recovery">
              <div className="space-y-6 animate-in fade-in duration-300">
                <RestaurantsView />
              </div>
            </ErrorBoundary>
          )}

          {/* ========================================================================= */}
          {/* ROUTE 4: PROMOTIONAL OFFERS */}
          {/* ========================================================================= */}
          {activeTab === 'OFFERS' && (
            <ErrorBoundary fallbackTitle="Offers View Recovery">
              <div className="space-y-8 animate-in fade-in duration-300">
                <OffersSection />
                <PopularDishesSection />
              </div>
            </ErrorBoundary>
          )}

          {/* ========================================================================= */}
          {/* ROUTE 5: MY ORDERS */}
          {/* ========================================================================= */}
          {activeTab === 'ORDERS' && (
            <ErrorBoundary fallbackTitle="Orders View Recovery">
              <div className="space-y-6 animate-in fade-in duration-300">
                <MyOrdersView />
              </div>
            </ErrorBoundary>
          )}

          {/* ========================================================================= */}
          {/* ROUTE 6: TRACK ORDER / DIGITAL TWIN (AI ETA Tracking) */}
          {/* ========================================================================= */}
          {isTrackingActive && (
            <ErrorBoundary fallbackTitle="AI Tracking View Recovery">
              <div className="space-y-8 animate-in fade-in duration-300">
                <CustomerDashboard />

                {/* Physics & Corridor Simulation */}
                <div className="pt-6 border-t border-slate-200 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <BrainCircuit className="h-5 w-5 text-cyan-600" />
                        <span>Deep Physics &amp; Corridor Simulator</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Multi-corridor telemetry and chokepoint simulation engine
                      </p>
                    </div>
                  </div>

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

                  <DeliveryHealthWidget />
                  <PlayWhileWaiting />
                </div>
              </div>
            </ErrorBoundary>
          )}

          {/* ========================================================================= */}
          {/* ROUTE 7: AI PREDICTION LAB */}
          {/* ========================================================================= */}
          {(activeTab === 'AI_LAB' || activeTab === 'INSIGHTS') && (
            <ErrorBoundary fallbackTitle="AI Prediction Lab Recovery">
              <AIPredictionLab />
            </ErrorBoundary>
          )}

          {/* ========================================================================= */}
          {/* ROUTE 8: RIDER / DELIVERY BOY DASHBOARD */}
          {/* ========================================================================= */}
          {activeTab === 'RIDER' && (
            <ErrorBoundary fallbackTitle="Rider Dashboard Recovery">
              <RiderDashboard />
            </ErrorBoundary>
          )}

          {/* ========================================================================= */}
          {/* ROUTE 9: PLAY & EARN GAMES */}
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
                    <button
                      onClick={() => setIsWalletOpen(true)}
                      className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-colors"
                    >
                      <Coins className="h-4 w-4" />
                      <span>Rewards Wallet ({user?.deliveryPoints ?? 250} Pts)</span>
                    </button>
                  </div>
                </div>

                <PlayWhileWaiting />
                <DeliveryHealthWidget />
              </div>
            </ErrorBoundary>
          )}

          {/* ========================================================================= */}
          {/* ROUTE 10: CITY PULSE */}
          {/* ========================================================================= */}
          {activeTab === 'PULSE' && (
            <ErrorBoundary fallbackTitle="City Pulse Recovery">
              <div className="space-y-6 animate-in fade-in duration-300">
                <CityDeliveryPulse />
              </div>
            </ErrorBoundary>
          )}

          {/* ========================================================================= */}
          {/* ROUTE 11: ROUTES */}
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
          {/* ROUTE 12: DECISION ROOM */}
          {/* ========================================================================= */}
          {activeTab === 'DECISION_ROOM' && (
            <ErrorBoundary fallbackTitle="Decision Room Recovery">
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <span>🧠</span>
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
          {/* ROUTE 13: REWARDS WALLET */}
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
                </div>
                <PlayWhileWaiting />
              </div>
            </ErrorBoundary>
          )}

          {/* ========================================================================= */}
          {/* ROUTE 14: FUTURE VIEW */}
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
          {/* ROUTE 15: PROFILE */}
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
          {/* ROUTE 16: CHECKOUT */}
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
                    className="rounded-xl bg-orange-600 hover:bg-orange-700 px-6 py-2.5 text-xs font-bold text-white shadow-xs transition-colors"
                  >
                    Open Checkout Modal
                  </button>
                </div>
                <PopularDishesSection />
              </div>
            </ErrorBoundary>
          )}

        </main>
      </div>

      {/* Global Application Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <LocationSelectorModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderConfirmedModal />
      <CustomerOtpModal />
      <FutureViewModal />
      <RewardsWalletModal />
      <AdminDashboard />
      <AuthModal />
      <DeliveryCompleteReport />

      {/* Global AI Assistant Floating Chatbot */}
      <AIAssistantChatbot />

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
