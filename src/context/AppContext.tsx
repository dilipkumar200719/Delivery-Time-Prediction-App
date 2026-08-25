import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  UserProfile,
  OrderRecord,
  PredictionResult,
  LiveTrackingState,
  DeliveryConditions,
  GameSession,
  RewardTransaction,
  AchievementItem,
  LeaderboardEntry,
  AdminSettingsConfig,
  SimulationRecalculationEvent,
  OrderStatus,
  RouteOption,
  AppTab,
  CartItem
} from '../types';
import { FoodItem } from '../data/foodCatalog';
import { predictDelivery } from '../ml/deliveryML';
import { FirebaseDbService, DEFAULT_ADMIN_SETTINGS } from '../services/firebaseDb';
import confetti from 'canvas-confetti';

interface AppContextType {
  user: UserProfile | null;
  activeOrder: OrderRecord | null;
  userOrders: OrderRecord[];
  prediction: PredictionResult | null;
  tracking: LiveTrackingState | null;
  conditions: DeliveryConditions;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (item: FoodItem | CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDeliveryFee: number;
  cartTotal: number;
  cartDynamicEta: { min: number; max: number };
  
  // Modals & UI States
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  orderConfirmedModal: OrderRecord | null;
  setOrderConfirmedModal: (order: OrderRecord | null) => void;
  isJudgeModeOpen: boolean;
  setIsJudgeModeOpen: (open: boolean) => void;
  isWalletOpen: boolean;
  setIsWalletOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isFutureViewOpen: boolean;
  setIsFutureViewOpen: (open: boolean) => void;
  isDeliveryCompleted: boolean;
  setIsDeliveryCompleted: (completed: boolean) => void;
  completedReport: OrderRecord | null;
  ttsEnabled: boolean;
  setTtsEnabled: (enabled: boolean) => void;
  isDbConnected: boolean;

  // Games & Simulation
  activeGame: 'Delivery Rush' | 'Catch the Food' | 'Guess Your ETA' | null;
  gameSession: GameSession | null;
  recalculationToast: SimulationRecalculationEvent | null;
  rewards: RewardTransaction[];
  achievements: AchievementItem[];
  leaderboard: LeaderboardEntry[];
  adminSettings: AdminSettingsConfig;
  
  // Actions
  predictNow: (customConditions?: Partial<DeliveryConditions>) => Promise<PredictionResult>;
  createOrderAndStartSimulation: (customConditions?: Partial<DeliveryConditions>) => Promise<void>;
  checkoutAndPlaceOrder: (details: { address: string; paymentMethod: string; specialInstructions?: string }) => Promise<OrderRecord>;
  toggleSimulationPlayPause: () => void;
  setSimulationSpeed: (speed: number) => void;
  resetSimulation: () => void;
  updateConditions: (patch: Partial<DeliveryConditions>, triggerReason?: string) => Promise<void>;
  selectRoute: (routeId: string) => void;
  openGame: (gameName: 'Delivery Rush' | 'Catch the Food' | 'Guess Your ETA') => void;
  closeGame: () => void;
  submitGameScore: (score: number, elapsedSeconds: number, extraData?: any) => Promise<number>;
  redeemReward: (rupeeAmount: number) => Promise<boolean>;
  claimDelayCompensation: () => Promise<boolean>;
  speakAIInsight: (text: string) => void;
  loginUser: (email: string, displayName: string) => Promise<void>;
  logoutUser: () => void;
}

const DEFAULT_CONDITIONS: DeliveryConditions = {
  distanceKm: 4.2,
  trafficLevel: 'HIGH',
  weatherCondition: 'RAIN',
  roadCondition: 'WET',
  vehicleType: 'BIKE',
  vehicleHealth: 'GOOD',
  batteryLevel: 85,
  timeOfDay: '19:45',
  dayOfWeek: 'Friday',
  numberOfItems: 3,
  orderSize: 'MEDIUM',
  restaurantPrepTime: 8,
  driverExperienceYears: 3,
  driverStatus: 'AVAILABLE',
  storeStatus: 'NORMAL',
  deliveryPriority: 'STANDARD'
};

const INITIAL_CART: CartItem[] = [
  {
    id: 'food_biryani_1',
    name: 'Royal Chicken Dum Biryani',
    price: 249,
    restaurantName: 'Spice Route Kitchen',
    restaurantId: 'rest_spice_route',
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    isVeg: false,
    prepTime: 14
  },
  {
    id: 'food_pizza_2',
    name: 'Smoked Peri-Peri Paneer Pizza',
    price: 299,
    restaurantName: 'Artisan Crust Pizza Lab',
    restaurantId: 'rest_artisan_crust',
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    prepTime: 10
  }
];

const DEFAULT_USER: UserProfile = {
  uid: 'demo_user_1024',
  email: 'dilipdhammu2@gmail.com',
  displayName: 'Dilip (AI Pilot)',
  deliveryPoints: 250,
  rewardBalanceRupees: 25,
  totalGamesPlayed: 3,
  totalOrdersPlaced: 5,
  createdAt: new Date().toISOString()
};

const INITIAL_PREDICTION: PredictionResult = predictDelivery(DEFAULT_CONDITIONS, 'ORD-8553');

const INITIAL_ACTIVE_ORDER: OrderRecord = {
  id: 'ORD-8553',
  userId: DEFAULT_USER.uid,
  customerName: DEFAULT_USER.displayName,
  restaurantName: 'Spice Route Kitchen',
  items: [
    { name: 'Royal Chicken Dum Biryani', quantity: 2, price: 249 },
    { name: 'Smoked Peri-Peri Paneer Pizza', quantity: 1, price: 299 }
  ],
  totalAmountRupees: 836,
  status: 'OUT_FOR_DELIVERY',
  conditions: DEFAULT_CONDITIONS,
  prediction: INITIAL_PREDICTION,
  startedAt: new Date().toISOString()
};

const INITIAL_TRACKING: LiveTrackingState = {
  orderId: INITIAL_ACTIVE_ORDER.id,
  driverPosition: { x: 35, y: 65, progress: 32 },
  speedKmh: 28,
  distanceRemainingKm: 2.8,
  etaMinutes: INITIAL_PREDICTION.predictedEtaMinutes || 18,
  currentRouteId: INITIAL_PREDICTION.recommendedRoute.id,
  status: 'OUT_FOR_DELIVERY',
  deliveryHealth: INITIAL_PREDICTION.deliveryHealthScore || 87,
  riskScore: INITIAL_PREDICTION.riskScore,
  vehicleHealth: DEFAULT_CONDITIONS.vehicleHealth,
  batteryLevel: DEFAULT_CONDITIONS.batteryLevel,
  conditions: DEFAULT_CONDITIONS,
  activeIncidents: [
    { id: 'inc_1', type: 'traffic', title: 'Traffic Corridor Congestion', penaltyMinutes: 3, timestamp: '2m ago' }
  ],
  isPaused: false,
  simulationSpeed: 1,
  updatedAt: new Date().toISOString()
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_USER);
  const [conditions, setConditions] = useState<DeliveryConditions>(DEFAULT_CONDITIONS);
  const [activeOrder, setActiveOrder] = useState<OrderRecord | null>(INITIAL_ACTIVE_ORDER);
  const [userOrders, setUserOrders] = useState<OrderRecord[]>([INITIAL_ACTIVE_ORDER]);
  const [prediction, setPrediction] = useState<PredictionResult | null>(INITIAL_PREDICTION);
  const [tracking, setTracking] = useState<LiveTrackingState | null>(INITIAL_TRACKING);
  const [activeTab, setActiveTab] = useState<AppTab>('HOME');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Cart & Modals
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderConfirmedModal, setOrderConfirmedModal] = useState<OrderRecord | null>(null);

  // Games & Other Modals
  const [activeGame, setActiveGame] = useState<'Delivery Rush' | 'Catch the Food' | 'Guess Your ETA' | null>(null);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [recalculationToast, setRecalculationToast] = useState<SimulationRecalculationEvent | null>(null);
  const [rewards, setRewards] = useState<RewardTransaction[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [adminSettings, setAdminSettings] = useState<AdminSettingsConfig>(DEFAULT_ADMIN_SETTINGS);
  
  const [isJudgeModeOpen, setIsJudgeModeOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isFutureViewOpen, setIsFutureViewOpen] = useState(false);
  const [isDeliveryCompleted, setIsDeliveryCompleted] = useState(false);
  const [completedReport, setCompletedReport] = useState<OrderRecord | null>(null);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState(true);

  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize User, Firestore Sync & Initial State
  useEffect(() => {
    async function init() {
      try {
        const initialUser = await FirebaseDbService.createOrUpdateUser({
          uid: 'demo_user_1024',
          email: 'dilipdhammu2@gmail.com',
          displayName: 'Dilip (AI Pilot)'
        });
        setUser(initialUser);

        // Load initial prediction
        const initialPred = predictDelivery(DEFAULT_CONDITIONS, 'ORD-8553');
        setPrediction(initialPred);

        // Load initial active order
        const initialOrder: OrderRecord = {
          id: 'ORD-8553',
          userId: initialUser.uid,
          customerName: initialUser.displayName,
          restaurantName: 'Spice Route Kitchen',
          items: [
            { name: 'Royal Chicken Dum Biryani', quantity: 2, price: 249 },
            { name: 'Smoked Peri-Peri Paneer Pizza', quantity: 1, price: 299 }
          ],
          totalAmountRupees: 836,
          status: 'OUT_FOR_DELIVERY',
          conditions: DEFAULT_CONDITIONS,
          prediction: initialPred,
          startedAt: new Date().toISOString()
        };
        setActiveOrder(initialOrder);

        // Initial Live Tracking State
        const initialTracking: LiveTrackingState = {
          orderId: initialOrder.id,
          driverPosition: { x: 35, y: 65, progress: 32 },
          speedKmh: 28,
          distanceRemainingKm: 2.8,
          etaMinutes: initialPred.predictedEtaMinutes || 18,
          currentRouteId: initialPred.recommendedRoute.id,
          status: 'OUT_FOR_DELIVERY',
          deliveryHealth: initialPred.deliveryHealthScore || 87,
          riskScore: initialPred.riskScore,
          vehicleHealth: DEFAULT_CONDITIONS.vehicleHealth,
          batteryLevel: DEFAULT_CONDITIONS.batteryLevel,
          conditions: DEFAULT_CONDITIONS,
          activeIncidents: [
            { id: 'inc_1', type: 'traffic', title: 'Traffic Corridor Congestion', penaltyMinutes: 3, timestamp: '2m ago' }
          ],
          isPaused: false,
          simulationSpeed: 1,
          updatedAt: new Date().toISOString()
        };
        setTracking(initialTracking);

        // Load User Orders from Firestore
        const savedOrders = await FirebaseDbService.getUserOrders(initialUser.uid);
        if (savedOrders && savedOrders.length > 0) {
          setUserOrders(savedOrders);
        } else {
          setUserOrders([initialOrder]);
        }

        // Persist to Firestore
        await FirebaseDbService.saveOrder(initialOrder);
        await FirebaseDbService.savePrediction(initialPred);
        await FirebaseDbService.saveTrackingState(initialTracking);

        // Load Rewards & Gamification data
        const txs = await FirebaseDbService.getRewardTransactions(initialUser.uid);
        setRewards(txs);
        const achs = await FirebaseDbService.getUserAchievements(initialUser.uid);
        setAchievements(achs);
        const board = await FirebaseDbService.getLeaderboard();
        setLeaderboard(board);
        const settings = await FirebaseDbService.getAdminSettings();
        setAdminSettings(settings);
      } catch (err) {
        console.warn('Initialization error:', err);
      }
    }

    init();
  }, []);

  // Cart Calculations
  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [cart]);

  const cartDeliveryFee = useMemo(() => {
    if (cart.length === 0) return 0;
    return cartSubtotal >= 500 ? 0 : 39;
  }, [cart, cartSubtotal]);

  const cartTotal = useMemo(() => {
    return cartSubtotal + cartDeliveryFee;
  }, [cartSubtotal, cartDeliveryFee]);

  const cartDynamicEta = useMemo(() => {
    if (cart.length === 0) return { min: 18, max: 22 };
    const maxItemPrep = Math.max(...cart.map(c => c.prepTime || 10), 10);
    const transitTime = Math.round(conditions.distanceKm * 2.8);
    const trafficDelay = conditions.trafficLevel === 'SEVERE' ? 5 : (conditions.trafficLevel === 'HIGH' ? 3 : 0);
    const weatherDelay = conditions.weatherCondition === 'HEAVY_RAIN' ? 4 : (conditions.weatherCondition === 'RAIN' ? 2 : 0);
    const base = maxItemPrep + transitTime + trafficDelay + weatherDelay;
    return { min: Math.max(14, base - 2), max: Math.max(18, base + 3) };
  }, [cart, conditions]);

  // Cart Actions
  const addToCart = useCallback((item: FoodItem | CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      const newItem: CartItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        restaurantName: item.restaurantName,
        restaurantId: (item as any).restaurantId || 'rest_spice_route',
        quantity: 1,
        image: item.image,
        isVeg: item.isVeg,
        prepTime: item.prepTime || 12
      };
      return [...prev, newItem];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const updateCartQuantity = useCallback((itemId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === itemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Text-To-Speech Narration
  const speakAIInsight = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }, []);

  // 1. One-Tap Prediction
  const predictNow = useCallback(async (customConditions?: Partial<DeliveryConditions>): Promise<PredictionResult> => {
    const targetConds = { ...conditions, ...customConditions };
    setConditions(targetConds);
    
    const pred = predictDelivery(targetConds, activeOrder?.id || `ORD-${Math.floor(1000 + Math.random() * 9000)}`);
    setPrediction(pred);

    if (activeOrder) {
      const updatedOrder = { ...activeOrder, conditions: targetConds, prediction: pred };
      setActiveOrder(updatedOrder);
      await FirebaseDbService.saveOrder(updatedOrder);
    }
    await FirebaseDbService.savePrediction(pred);

    if (ttsEnabled) {
      speakAIInsight(`Prediction updated. Estimated arrival in ${pred.predictedEtaMinutes} minutes with ${Math.round((1 - pred.delayProbability) * 100)}% on-time confidence.`);
    }

    return pred;
  }, [conditions, activeOrder, ttsEnabled, speakAIInsight]);

  // 2. Checkout & Real Order Placement (Persisted to Firestore)
  const checkoutAndPlaceOrder = useCallback(async (details: { address: string; paymentMethod: string; specialInstructions?: string }): Promise<OrderRecord> => {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const currentCart = cart.length > 0 ? [...cart] : INITIAL_CART;
    const maxPrep = Math.max(...currentCart.map(c => c.prepTime || 10), 10);
    const targetConds: DeliveryConditions = {
      ...conditions,
      restaurantPrepTime: maxPrep,
      numberOfItems: currentCart.reduce((sum, i) => sum + i.quantity, 0)
    };

    const pred = predictDelivery(targetConds, orderId);

    const newOrder: OrderRecord = {
      id: orderId,
      userId: user?.uid || 'demo_user_1024',
      customerName: user?.displayName || 'Dilip (AI Pilot)',
      restaurantName: currentCart[0]?.restaurantName || 'Spice Route Kitchen',
      items: currentCart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
      totalAmountRupees: cartTotal > 0 ? cartTotal : 836,
      status: 'CONFIRMED',
      conditions: targetConds,
      prediction: pred,
      startedAt: new Date().toISOString()
    };

    const newTracking: LiveTrackingState = {
      orderId,
      driverPosition: { x: 15, y: 80, progress: 0 },
      speedKmh: 0,
      distanceRemainingKm: targetConds.distanceKm,
      etaMinutes: pred.predictedEtaMinutes,
      currentRouteId: pred.recommendedRoute.id,
      status: 'CONFIRMED',
      deliveryHealth: pred.deliveryHealthScore,
      riskScore: pred.riskScore,
      vehicleHealth: targetConds.vehicleHealth,
      batteryLevel: targetConds.batteryLevel,
      conditions: targetConds,
      activeIncidents: [],
      isPaused: false,
      simulationSpeed: 1,
      updatedAt: new Date().toISOString()
    };

    setConditions(targetConds);
    setPrediction(pred);
    setActiveOrder(newOrder);
    setTracking(newTracking);
    setUserOrders(prev => [newOrder, ...prev.filter(o => o.id !== newOrder.id)]);
    setIsDeliveryCompleted(false);
    setCompletedReport(null);

    // Save to Firestore
    await FirebaseDbService.saveOrder(newOrder);
    await FirebaseDbService.savePrediction(pred);
    await FirebaseDbService.saveTrackingState(newTracking);

    // Clear cart and show order confirmed modal
    setCart([]);
    setIsCheckoutOpen(false);
    setOrderConfirmedModal(newOrder);

    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

    if (ttsEnabled) {
      speakAIInsight(`Order ${orderId} placed successfully. AI prediction calculates arrival in ${pred.predictedEtaMinutes} minutes.`);
    }

    return newOrder;
  }, [cart, cartTotal, conditions, user, ttsEnabled, speakAIInsight]);

  // 3. Create Demo Order & Start Simulation
  const createOrderAndStartSimulation = useCallback(async (customConditions?: Partial<DeliveryConditions>) => {
    const targetConds = { ...conditions, ...customConditions };
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const pred = predictDelivery(targetConds, orderId);

    const newOrder: OrderRecord = {
      id: orderId,
      userId: user?.uid || 'demo_user_1024',
      customerName: user?.displayName || 'Customer',
      restaurantName: 'Spice Route Kitchen',
      items: [
        { name: 'Royal Chicken Dum Biryani', quantity: 2, price: 249 },
        { name: 'Smoked Peri-Peri Paneer Pizza', quantity: 1, price: 299 }
      ],
      totalAmountRupees: 836,
      status: 'OUT_FOR_DELIVERY',
      conditions: targetConds,
      prediction: pred,
      startedAt: new Date().toISOString()
    };

    const newTracking: LiveTrackingState = {
      orderId,
      driverPosition: { x: 25, y: 72, progress: 15 },
      speedKmh: 30,
      distanceRemainingKm: targetConds.distanceKm,
      etaMinutes: pred.predictedEtaMinutes,
      currentRouteId: pred.recommendedRoute.id,
      status: 'OUT_FOR_DELIVERY',
      deliveryHealth: pred.deliveryHealthScore,
      riskScore: pred.riskScore,
      vehicleHealth: targetConds.vehicleHealth,
      batteryLevel: targetConds.batteryLevel,
      conditions: targetConds,
      activeIncidents: [],
      isPaused: false,
      simulationSpeed: 1,
      updatedAt: new Date().toISOString()
    };

    setConditions(targetConds);
    setPrediction(pred);
    setActiveOrder(newOrder);
    setTracking(newTracking);
    setUserOrders(prev => [newOrder, ...prev.filter(o => o.id !== newOrder.id)]);
    setIsDeliveryCompleted(false);
    setCompletedReport(null);

    await FirebaseDbService.saveOrder(newOrder);
    await FirebaseDbService.savePrediction(pred);
    await FirebaseDbService.saveTrackingState(newTracking);
  }, [conditions, user]);

  // 4. Condition Shifts & Live AI Recalculation
  const updateConditions = useCallback(async (patch: Partial<DeliveryConditions>, triggerReason: string = 'Environmental update') => {
    const oldPred = prediction || predictDelivery(conditions);
    const newConds = { ...conditions, ...patch };
    setConditions(newConds);

    const newPred = predictDelivery(newConds, activeOrder?.id);
    setPrediction(newPred);

    const reasons: Array<{ description: string; deltaMinutes: number }> = [];
    if (patch.trafficLevel && patch.trafficLevel !== conditions.trafficLevel) {
      const diff = patch.trafficLevel === 'SEVERE' ? 5 : (patch.trafficLevel === 'HIGH' ? 3 : -2);
      reasons.push({ description: `Traffic shifted to ${patch.trafficLevel}`, deltaMinutes: diff });
    }
    if (patch.weatherCondition && patch.weatherCondition !== conditions.weatherCondition) {
      const diff = (patch.weatherCondition === 'HEAVY_RAIN' || patch.weatherCondition === 'STORM') ? 4 : (patch.weatherCondition === 'RAIN' ? 2 : -2);
      reasons.push({ description: `Weather shifted to ${patch.weatherCondition.replace('_', ' ')}`, deltaMinutes: diff });
    }
    if (patch.distanceKm && patch.distanceKm !== conditions.distanceKm) {
      const diff = Math.round((patch.distanceKm - conditions.distanceKm) * 2.8);
      reasons.push({ description: `Route distance updated to ${patch.distanceKm} km`, deltaMinutes: diff });
    }
    if (newPred.recommendedRoute.id !== oldPred.recommendedRoute.id) {
      reasons.push({ description: `AI optimized route switch to ${newPred.recommendedRoute.name}`, deltaMinutes: -3 });
    }

    if (reasons.length === 0) {
      const delta = newPred.predictedEtaMinutes - oldPred.predictedEtaMinutes;
      reasons.push({ description: triggerReason, deltaMinutes: delta });
    }

    const toast: SimulationRecalculationEvent = {
      id: `RECALC-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      previousEta: oldPred.predictedEtaMinutes,
      newEta: newPred.predictedEtaMinutes,
      reasons,
      triggeredBy: triggerReason
    };
    setRecalculationToast(toast);

    if (activeOrder) {
      await FirebaseDbService.saveSimulationEvent(activeOrder.id, {
        eventType: 'RECALCULATION',
        title: `AI ETA Recalculated: ${oldPred.predictedEtaMinutes}m -> ${newPred.predictedEtaMinutes}m`,
        impactMinutes: newPred.predictedEtaMinutes - oldPred.predictedEtaMinutes,
        description: reasons.map(r => `${r.description} (${r.deltaMinutes > 0 ? '+' : ''}${r.deltaMinutes} min)`).join(', ')
      });
    }

    if (tracking) {
      const updatedTracking: LiveTrackingState = {
        ...tracking,
        etaMinutes: newPred.predictedEtaMinutes,
        deliveryHealth: newPred.deliveryHealthScore,
        riskScore: newPred.riskScore,
        currentRouteId: newPred.recommendedRoute.id,
        conditions: newConds,
        updatedAt: new Date().toISOString()
      };
      setTracking(updatedTracking);
      await FirebaseDbService.saveTrackingState(updatedTracking);
    }

    if (ttsEnabled) {
      speakAIInsight(`AI recalculation triggered. New predicted ETA is ${newPred.predictedEtaMinutes} minutes.`);
    }

    setTimeout(() => {
      setRecalculationToast(null);
    }, 6500);
  }, [conditions, prediction, activeOrder, tracking, ttsEnabled, speakAIInsight]);

  // 5. Route Selection
  const selectRoute = useCallback((routeId: string) => {
    if (!prediction) return;
    const chosenRoute = prediction.availableRoutes.find(r => r.id === routeId);
    if (!chosenRoute) return;

    const delta = chosenRoute.estimatedMinutes - prediction.predictedEtaMinutes;
    setRecalculationToast({
      id: `ROUTE-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      previousEta: prediction.predictedEtaMinutes,
      newEta: chosenRoute.estimatedMinutes,
      reasons: [{ description: `Switched route to ${chosenRoute.name}`, deltaMinutes: delta }],
      triggeredBy: 'Route Battle Selection'
    });

    if (tracking) {
      setTracking(prev => prev ? {
        ...prev,
        currentRouteId: routeId,
        etaMinutes: chosenRoute.estimatedMinutes
      } : null);
    }
  }, [prediction, tracking]);

  // 6. Simulation Ticks
  useEffect(() => {
    if (!tracking || tracking.isPaused || isDeliveryCompleted) {
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
      return;
    }

    const intervalMs = Math.max(300, Math.round(adminSettings.simulationTickRateMs / (tracking.simulationSpeed || 1)));

    simulationIntervalRef.current = setInterval(async () => {
      setTracking(prev => {
        if (!prev || prev.isPaused) return prev;

        const currentProgress = prev.driverPosition.progress;
        if (currentProgress >= 100) return prev;

        const step = 1.0 * (prev.simulationSpeed || 1);
        const nextProgress = Math.min(100, currentProgress + step);
        const distRemaining = Math.max(0, Number((conditions.distanceKm * (1 - nextProgress / 100)).toFixed(1)));
        const nextEta = Math.max(1, Math.round(prev.etaMinutes * (1 - step / 100)));

        let nextStatus: OrderStatus = prev.status;
        if (nextProgress < 15) nextStatus = 'PREPARING';
        else if (nextProgress < 35) nextStatus = 'DRIVER_ASSIGNED';
        else if (nextProgress < 85) nextStatus = 'OUT_FOR_DELIVERY';
        else if (nextProgress < 100) nextStatus = 'ARRIVING_SOON';
        else nextStatus = 'DELIVERED';

        const baseSpeed = conditions.vehicleType === 'CAR' ? 35 : (conditions.vehicleType === 'SCOOTER' ? 30 : 25);
        const trafficSpeedMod = conditions.trafficLevel === 'SEVERE' ? 0.35 : (conditions.trafficLevel === 'HIGH' ? 0.65 : 1.0);
        const weatherSpeedMod = conditions.weatherCondition === 'HEAVY_RAIN' ? 0.65 : (conditions.weatherCondition === 'RAIN' ? 0.8 : 1.0);
        const currentSpeedKmh = Math.round(baseSpeed * trafficSpeedMod * weatherSpeedMod + (Math.sin(Date.now() / 1000) * 3));

        const nextBattery = Math.max(12, prev.batteryLevel - (nextProgress > 80 ? 0.05 : 0.02));

        const updated: LiveTrackingState = {
          ...prev,
          driverPosition: {
            x: Number((15 + (88 - 15) * (nextProgress / 100)).toFixed(1)),
            y: Number((80 + (20 - 80) * (nextProgress / 100)).toFixed(1)),
            progress: Number(nextProgress.toFixed(1))
          },
          distanceRemainingKm: distRemaining,
          etaMinutes: nextEta,
          status: nextStatus,
          speedKmh: currentSpeedKmh,
          batteryLevel: Math.round(nextBattery),
          updatedAt: new Date().toISOString()
        };

        if (nextProgress >= 100 && prev.status !== 'DELIVERED') {
          setTimeout(() => {
            handleDeliveryComplete(updated);
          }, 100);
        }

        return updated;
      });
    }, intervalMs);

    return () => {
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
    };
  }, [tracking?.isPaused, tracking?.simulationSpeed, conditions, adminSettings, isDeliveryCompleted]);

  // Delivery Completion Handler
  const handleDeliveryComplete = useCallback(async (finalTracking: LiveTrackingState) => {
    setIsDeliveryCompleted(true);
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

    if (activeGame) {
      setActiveGame(null);
    }

    const predictedEta = prediction?.predictedEtaMinutes || 18;
    const actualEta = Math.max(12, predictedEta + (conditions.trafficLevel === 'SEVERE' ? 4 : (conditions.weatherCondition === 'HEAVY_RAIN' ? 3 : 1)));
    const delayMinutes = Math.max(0, actualEta - predictedEta);

    let compensationPoints = 0;
    if (delayMinutes >= adminSettings.delayCompensationThresholdMinutes) {
      compensationPoints = delayMinutes * adminSettings.delayCompensationPointsPerMinute + 20;
    }

    const completedOrder: OrderRecord = {
      ...(activeOrder || {
        id: 'ORD-8553',
        userId: user?.uid || 'demo_user_1024',
        customerName: user?.displayName || 'Customer',
        restaurantName: 'Spice Route Kitchen',
        items: [],
        totalAmountRupees: 836,
        status: 'DELIVERED',
        conditions,
        prediction: prediction!,
        startedAt: new Date().toISOString()
      }),
      status: 'DELIVERED',
      actualEtaMinutes: actualEta,
      deliveredAt: new Date().toISOString(),
      delayMinutes,
      delayCompensationPoints: compensationPoints,
      pointsEarnedFromDelivery: 100
    };

    setCompletedReport(completedOrder);
    await FirebaseDbService.saveOrder(completedOrder);

    if (user) {
      await FirebaseDbService.recordRewardTransaction({
        userId: user.uid,
        orderId: completedOrder.id,
        points: 100,
        rupeeValue: 10,
        type: 'EARN_DELIVERY',
        title: 'Delivery Complete Reward',
        description: `Earned 100 Delivery Points for completing order ${completedOrder.id}`
      });

      if (compensationPoints > 0) {
        await FirebaseDbService.recordRewardTransaction({
          userId: user.uid,
          orderId: completedOrder.id,
          points: compensationPoints,
          rupeeValue: Math.round(compensationPoints / 10),
          type: 'DELAY_COMPENSATION',
          title: 'AI Delay Compensation',
          description: `Delivery arrived ${delayMinutes}m past prediction. Awarded ${compensationPoints} pts (₹${Math.round(compensationPoints / 10)})`
        });
      }

      await FirebaseDbService.updateAchievementProgress(user.uid, 'first_delivery', 1);

      const updatedUser = await FirebaseDbService.getUserProfile(user.uid);
      if (updatedUser) setUser(updatedUser);
      const txs = await FirebaseDbService.getRewardTransactions(user.uid);
      setRewards(txs);
      const achs = await FirebaseDbService.getUserAchievements(user.uid);
      setAchievements(achs);
    }
  }, [prediction, conditions, activeOrder, user, activeGame, adminSettings]);

  // Simulation Controls
  const toggleSimulationPlayPause = useCallback(() => {
    setTracking(prev => prev ? { ...prev, isPaused: !prev.isPaused } : null);
  }, []);

  const setSimulationSpeed = useCallback((speed: number) => {
    setTracking(prev => prev ? { ...prev, simulationSpeed: speed } : null);
  }, []);

  const resetSimulation = useCallback(() => {
    setIsDeliveryCompleted(false);
    setCompletedReport(null);
    createOrderAndStartSimulation(conditions);
  }, [conditions, createOrderAndStartSimulation]);

  // Games Hub
  const openGame = useCallback((gameName: 'Delivery Rush' | 'Catch the Food' | 'Guess Your ETA') => {
    setActiveGame(gameName);
    const session: GameSession = {
      id: `GAME-${Date.now()}`,
      userId: user?.uid || 'demo_user_1024',
      orderId: activeOrder?.id || 'ORD-8553',
      gameName,
      score: 0,
      pointsEarned: 0,
      rupeeValue: 0,
      status: 'ACTIVE',
      startTime: new Date().toISOString()
    };
    setGameSession(session);
    FirebaseDbService.saveGameSession(session);
  }, [user, activeOrder]);

  const closeGame = useCallback(() => {
    setActiveGame(null);
    setGameSession(null);
  }, []);

  const submitGameScore = useCallback(async (score: number, elapsedSeconds: number, extraData?: any): Promise<number> => {
    if (!user || !activeGame) return 0;

    let pointsEarned = 0;
    if (activeGame === 'Delivery Rush' || activeGame === 'Catch the Food') {
      pointsEarned = Math.min(adminSettings.maxGameRewardPerSession, Math.round(score));
    } else if (activeGame === 'Guess Your ETA') {
      const diff = extraData?.difference ?? 2;
      if (diff === 0) pointsEarned = 150;
      else if (diff <= 2) pointsEarned = 100;
      else if (diff <= 5) pointsEarned = 50;
      else pointsEarned = 20;
    }

    const rupeeValue = Math.round(pointsEarned / adminSettings.pointsPerRupee);

    await FirebaseDbService.recordGameScore(user.uid, user.displayName, activeGame, score, pointsEarned);
    await FirebaseDbService.recordRewardTransaction({
      userId: user.uid,
      orderId: activeOrder?.id,
      points: pointsEarned,
      rupeeValue,
      type: 'EARN_GAME',
      title: `${activeGame} Score Reward`,
      description: `Scored ${score} in ${activeGame} -> earned ${pointsEarned} Delivery Points (₹${rupeeValue})`
    });

    if (activeGame === 'Delivery Rush' && score >= 300) {
      await FirebaseDbService.updateAchievementProgress(user.uid, 'delivery_pro', score);
    }
    if (activeGame === 'Catch the Food' && score >= 200) {
      await FirebaseDbService.updateAchievementProgress(user.uid, 'food_catcher', score);
    }
    if (activeGame === 'Guess Your ETA' && (extraData?.difference === 0 || extraData?.difference === 1)) {
      await FirebaseDbService.updateAchievementProgress(user.uid, 'perfect_predictor', 1);
    }

    const updatedUser = await FirebaseDbService.getUserProfile(user.uid);
    if (updatedUser) {
      setUser(updatedUser);
      await FirebaseDbService.syncUserToLeaderboard(updatedUser, activeGame);
    }
    const txs = await FirebaseDbService.getRewardTransactions(user.uid);
    setRewards(txs);
    const achs = await FirebaseDbService.getUserAchievements(user.uid);
    setAchievements(achs);
    const board = await FirebaseDbService.getLeaderboard();
    setLeaderboard(board);

    confetti({ particleCount: 80, spread: 60, origin: { y: 0.5 } });
    return pointsEarned;
  }, [user, activeGame, activeOrder, adminSettings]);

  const redeemReward = useCallback(async (rupeeAmount: number): Promise<boolean> => {
    if (!user) return false;
    const requiredPoints = rupeeAmount * adminSettings.pointsPerRupee;

    if (user.deliveryPoints < requiredPoints) {
      alert(`Insufficient Delivery Points! You need ${requiredPoints} points to redeem ₹${rupeeAmount}.`);
      return false;
    }

    await FirebaseDbService.recordRewardTransaction({
      userId: user.uid,
      orderId: activeOrder?.id,
      points: requiredPoints,
      rupeeValue: rupeeAmount,
      type: 'REDEMPTION',
      title: `Redeemed ₹${rupeeAmount} Order Discount`,
      description: `Converted ${requiredPoints} Delivery Points into ₹${rupeeAmount} food discount voucher`
    });

    const updatedUser = await FirebaseDbService.getUserProfile(user.uid);
    if (updatedUser) setUser(updatedUser);
    const txs = await FirebaseDbService.getRewardTransactions(user.uid);
    setRewards(txs);

    confetti({ particleCount: 100, spread: 70 });
    return true;
  }, [user, activeOrder, adminSettings]);

  const claimDelayCompensation = useCallback(async (): Promise<boolean> => {
    if (!user || !completedReport || !completedReport.delayCompensationPoints) return false;

    const points = completedReport.delayCompensationPoints;
    const rupees = Math.round(points / adminSettings.pointsPerRupee);

    await FirebaseDbService.recordRewardTransaction({
      userId: user.uid,
      orderId: completedReport.id,
      points,
      rupeeValue: rupees,
      type: 'DELAY_COMPENSATION',
      title: 'Claimed AI Delay Compensation',
      description: `Guaranteed on-time SLA breach compensation for order ${completedReport.id}`
    });

    const updatedUser = await FirebaseDbService.getUserProfile(user.uid);
    if (updatedUser) setUser(updatedUser);
    const txs = await FirebaseDbService.getRewardTransactions(user.uid);
    setRewards(txs);

    setCompletedReport(prev => prev ? { ...prev, delayCompensationPoints: 0 } : null);
    confetti({ particleCount: 90, spread: 60 });
    return true;
  }, [user, completedReport, adminSettings]);

  const loginUser = useCallback(async (email: string, displayName: string) => {
    const uid = `user_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const profile = await FirebaseDbService.createOrUpdateUser({
      uid,
      email,
      displayName
    });
    setUser(profile);
    const txs = await FirebaseDbService.getRewardTransactions(uid);
    setRewards(txs);
    const achs = await FirebaseDbService.getUserAchievements(uid);
    setAchievements(achs);
    setIsAuthOpen(false);
  }, []);

  const logoutUser = useCallback(() => {
    loginUser('guest@predicteats.ai', 'Guest Predictor');
  }, [loginUser]);

  return (
    <AppContext.Provider
      value={{
        user,
        activeOrder,
        userOrders,
        prediction,
        tracking,
        conditions,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDeliveryFee,
        cartTotal,
        cartDynamicEta,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        orderConfirmedModal,
        setOrderConfirmedModal,
        isJudgeModeOpen,
        setIsJudgeModeOpen,
        isWalletOpen,
        setIsWalletOpen,
        isAuthOpen,
        setIsAuthOpen,
        isAdminOpen,
        setIsAdminOpen,
        isFutureViewOpen,
        setIsFutureViewOpen,
        isDeliveryCompleted,
        setIsDeliveryCompleted,
        completedReport,
        ttsEnabled,
        setTtsEnabled,
        isDbConnected,
        activeGame,
        gameSession,
        recalculationToast,
        rewards,
        achievements,
        leaderboard,
        adminSettings,
        predictNow,
        createOrderAndStartSimulation,
        checkoutAndPlaceOrder,
        toggleSimulationPlayPause,
        setSimulationSpeed,
        resetSimulation,
        updateConditions,
        selectRoute,
        openGame,
        closeGame,
        submitGameScore,
        redeemReward,
        claimDelayCompensation,
        speakAIInsight,
        loginUser,
        logoutUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
