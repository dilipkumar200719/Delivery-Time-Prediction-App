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
  CartItem,
  SupportedCity
} from '../types';
import { SUPPORTED_CITIES } from '../data/cities';
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
  selectedCity: SupportedCity;
  setSelectedCity: (city: SupportedCity) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
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
  reorderItems: (order: OrderRecord) => void;
  cartCount: number;
  cartSubtotal: number;
  cartDeliveryFee: number;
  cartGst: number;
  cartPlatformFee: number;
  cartDiscount: number;
  cartTotal: number;
  appliedCoupon: string | null;
  setAppliedCoupon: (code: string | null) => void;
  isRedeemingPoints: boolean;
  setIsRedeemingPoints: (redeem: boolean) => void;
  cartDynamicEta: { min: number; max: number };
  selectedRestaurantId: string;
  setSelectedRestaurantId: (id: string) => void;
  
  // Modals & UI States
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  orderConfirmedModal: OrderRecord | null;
  setOrderConfirmedModal: (order: OrderRecord | null) => void;
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

  // OTP Verification System
  isRiderArrived: boolean;
  otpRequested: boolean;
  isWaitingForOtp: boolean;
  isOtpModalOpen: boolean;
  setIsOtpModalOpen: (open: boolean) => void;
  requestDeliveryOtp: () => void;
  verifyDeliveryOtp: (enteredOtp: string) => Promise<{ success: boolean; message: string }>;

  // Role Management (Customer vs Delivery Boy / Rider)
  userRole: 'CUSTOMER' | 'RIDER';
  setUserRole: (role: 'CUSTOMER' | 'RIDER') => void;

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
  checkoutAndPlaceOrder: (details: {
    address: string;
    paymentMethod: string;
    specialInstructions?: string;
    couponCode?: string;
    discountAmount?: number;
    pointsRedeemed?: number;
  }) => Promise<OrderRecord>;
  cancelOrder: (orderId: string, reason?: string) => Promise<boolean>;
  rateOrder: (orderId: string, rating: number, feedback?: string) => Promise<void>;
  setActiveOrderById: (orderId: string) => void;
  toggleSimulationPlayPause: () => void;
  setSimulationSpeed: (speed: number) => void;
  resetSimulation: () => void;
  updateConditions: (patch: Partial<DeliveryConditions>, triggerReason?: string) => Promise<void>;
  updateOrderStatus: (status: OrderStatus, progress?: number) => void;
  riderAdvanceWorkflowStage: (nextStatus: OrderStatus) => Promise<void>;
  riderVerifyOtp: (enteredOtp: string) => Promise<boolean>;
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
  totalDeliveries: 5,
  gamesPlayed: 3,
  totalGamesPlayed: 3,
  totalOrdersPlaced: 5,
  createdAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString()
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
  startedAt: new Date().toISOString(),
  deliveryOtp: '8553'
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

  // LocalStorage persistence for Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('predicteats_cart');
      return saved ? JSON.parse(saved) : INITIAL_CART;
    } catch {
      return INITIAL_CART;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('predicteats_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // LocalStorage persistence for Orders
  const [userOrders, setUserOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('predicteats_orders');
      return saved ? JSON.parse(saved) : [INITIAL_ACTIVE_ORDER];
    } catch {
      return [INITIAL_ACTIVE_ORDER];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('predicteats_orders', JSON.stringify(userOrders));
    } catch (e) {
      console.warn('Failed to save orders to localStorage', e);
    }
  }, [userOrders]);

  const [activeOrder, setActiveOrder] = useState<OrderRecord | null>(() => {
    try {
      const saved = localStorage.getItem('predicteats_active_order');
      return saved ? JSON.parse(saved) : INITIAL_ACTIVE_ORDER;
    } catch {
      return INITIAL_ACTIVE_ORDER;
    }
  });

  useEffect(() => {
    try {
      if (activeOrder) {
        localStorage.setItem('predicteats_active_order', JSON.stringify(activeOrder));
      }
    } catch (e) {
      console.warn('Failed to save activeOrder to localStorage', e);
    }
  }, [activeOrder]);

  const [prediction, setPrediction] = useState<PredictionResult | null>(INITIAL_PREDICTION);
  const [tracking, setTracking] = useState<LiveTrackingState | null>(INITIAL_TRACKING);
  const [activeTab, setActiveTab] = useState<AppTab>('HOME');
  const [selectedCity, setSelectedCityState] = useState<SupportedCity>('Vijayawada');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const setSelectedCity = useCallback((city: SupportedCity) => {
    setSelectedCityState(city);
    const cityInfo = SUPPORTED_CITIES[city];
    if (activeOrder) {
      setActiveOrder(prev => prev ? {
        ...prev,
        customerName: `${user?.displayName || 'Dilip'} (${cityInfo.name})`
      } : null);
    }
  }, [activeOrder, user?.displayName]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderConfirmedModal, setOrderConfirmedModal] = useState<OrderRecord | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isRedeemingPoints, setIsRedeemingPoints] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('rest_spice_route');

  // Games & Other Modals
  const [activeGame, setActiveGame] = useState<'Delivery Rush' | 'Catch the Food' | 'Guess Your ETA' | null>(null);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [recalculationToast, setRecalculationToast] = useState<SimulationRecalculationEvent | null>(null);
  const [rewards, setRewards] = useState<RewardTransaction[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [adminSettings, setAdminSettings] = useState<AdminSettingsConfig>(DEFAULT_ADMIN_SETTINGS);
  
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isFutureViewOpen, setIsFutureViewOpen] = useState(false);
  const [isDeliveryCompleted, setIsDeliveryCompleted] = useState(false);
  const [completedReport, setCompletedReport] = useState<OrderRecord | null>(null);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState(true);
  const [userRole, setUserRole] = useState<'CUSTOMER' | 'RIDER'>('CUSTOMER');

  // OTP Verification States
  const [isRiderArrived, setIsRiderArrived] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const isWaitingForOtp = (isRiderArrived || otpRequested || (tracking?.driverPosition?.progress ?? 0) >= 98) && !isDeliveryCompleted;

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
          startedAt: new Date().toISOString(),
          deliveryOtp: '8553'
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
    if (appliedCoupon === 'FREEDEL') return 0;
    return cartSubtotal >= 500 ? 0 : 39;
  }, [cart, cartSubtotal, appliedCoupon]);

  const cartGst = useMemo(() => {
    if (cart.length === 0) return 0;
    return Math.round(cartSubtotal * 0.05); // 5% GST
  }, [cart, cartSubtotal]);

  const cartPlatformFee = useMemo(() => {
    return cart.length > 0 ? 5 : 0;
  }, [cart]);

  const cartDiscount = useMemo(() => {
    let discount = 0;
    if (appliedCoupon === 'PREDICT50' && cartSubtotal >= 199) {
      discount += 50;
    } else if (appliedCoupon === 'FIRSTEAT') {
      discount += Math.min(100, Math.round(cartSubtotal * 0.20));
    } else if (appliedCoupon === 'HUNGRY100' && cartSubtotal >= 499) {
      discount += 100;
    }

    if (isRedeemingPoints) {
      const userPts = user?.rewardBalanceRupees || 25;
      discount += Math.min(50, Math.floor(userPts));
    }

    return discount;
  }, [appliedCoupon, cartSubtotal, isRedeemingPoints, user?.rewardBalanceRupees]);

  const cartTotal = useMemo(() => {
    if (cart.length === 0) return 0;
    const rawTotal = cartSubtotal + cartDeliveryFee + cartGst + cartPlatformFee - cartDiscount;
    return Math.max(0, rawTotal);
  }, [cart, cartSubtotal, cartDeliveryFee, cartGst, cartPlatformFee, cartDiscount]);

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

  const reorderItems = useCallback((order: OrderRecord) => {
    const itemsToLoad: CartItem[] = order.items.map((it, idx) => ({
      id: it.id || `reorder_${order.id}_${idx}`,
      name: it.name,
      price: it.price,
      restaurantName: order.restaurantName,
      restaurantId: order.restaurantId || 'rest_spice_route',
      quantity: it.quantity || 1,
      image: it.image || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
      isVeg: it.isVeg ?? true,
      prepTime: 12
    }));
    setCart(itemsToLoad);
    setIsCartOpen(true);
  }, []);

  const cancelOrder = useCallback(async (orderId: string, reason: string = 'Cancelled by Customer'): Promise<boolean> => {
    setUserOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' as OrderStatus } : o));
    if (activeOrder?.id === orderId) {
      setActiveOrder(prev => prev ? { ...prev, status: 'CANCELLED' as OrderStatus } : null);
      setTracking(prev => prev ? { ...prev, status: 'CANCELLED' as OrderStatus, isPaused: true } : null);
    }
    const targetOrder = userOrders.find(o => o.id === orderId) || activeOrder;
    if (targetOrder) {
      await FirebaseDbService.saveOrder({
        ...targetOrder,
        id: orderId,
        status: 'CANCELLED'
      });
    }
    return true;
  }, [activeOrder, userOrders]);

  const rateOrder = useCallback(async (orderId: string, rating: number, feedback?: string): Promise<void> => {
    setUserOrders(prev => prev.map(o => o.id === orderId ? { ...o, customerRating: rating, customerFeedback: feedback } : o));
    if (activeOrder?.id === orderId) {
      setActiveOrder(prev => prev ? { ...prev, customerRating: rating, customerFeedback: feedback } : null);
    }
    if (user) {
      await FirebaseDbService.recordRewardTransaction({
        userId: user.uid,
        orderId,
        points: 50,
        rupeeValue: 5,
        type: 'BONUS',
        title: 'Rating Reward ⭐',
        description: `Earned 50 points for rating order ${orderId} (${rating} stars)`
      });
      const updatedUser = await FirebaseDbService.getUserProfile(user.uid);
      if (updatedUser) setUser(updatedUser);
      const txs = await FirebaseDbService.getRewardTransactions(user.uid);
      setRewards(txs);
    }
    confetti({ particleCount: 80, spread: 60 });
  }, [activeOrder, user]);

  const setActiveOrderById = useCallback((orderId: string) => {
    const found = userOrders.find(o => o.id === orderId);
    if (found) {
      setActiveOrder(found);
      const pred = found.prediction || predictDelivery(found.conditions || conditions, found.id);
      setPrediction(pred);
      const isDelivered = found.status === 'DELIVERED';
      const prog = isDelivered ? 100 : (found.status === 'ARRIVING_SOON' ? 90 : (found.status === 'OUT_FOR_DELIVERY' ? 60 : 25));
      const newTracking: LiveTrackingState = {
        orderId: found.id,
        driverPosition: { x: 35, y: 65, progress: prog },
        speedKmh: isDelivered ? 0 : 28,
        distanceRemainingKm: isDelivered ? 0 : 2.4,
        etaMinutes: isDelivered ? 0 : (pred.predictedEtaMinutes || 18),
        currentRouteId: pred.recommendedRoute.id,
        status: found.status,
        deliveryHealth: pred.deliveryHealthScore || 87,
        riskScore: pred.riskScore,
        vehicleHealth: found.conditions?.vehicleHealth || 'GOOD',
        batteryLevel: found.conditions?.batteryLevel || 85,
        conditions: found.conditions || conditions,
        activeIncidents: [],
        isPaused: isDelivered,
        simulationSpeed: 1,
        updatedAt: new Date().toISOString()
      };
      setTracking(newTracking);
      setIsDeliveryCompleted(isDelivered);
      setActiveTab('TWIN');
    }
  }, [userOrders, conditions, setActiveTab]);

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
  const checkoutAndPlaceOrder = useCallback(async (details: {
    address: string;
    paymentMethod: string;
    specialInstructions?: string;
    couponCode?: string;
    discountAmount?: number;
    pointsRedeemed?: number;
  }): Promise<OrderRecord> => {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const currentCart = cart.length > 0 ? [...cart] : INITIAL_CART;
    const maxPrep = Math.max(...currentCart.map(c => c.prepTime || 10), 10);
    const targetConds: DeliveryConditions = {
      ...conditions,
      restaurantPrepTime: maxPrep,
      numberOfItems: currentCart.reduce((sum, i) => sum + i.quantity, 0)
    };

    const pred = predictDelivery(targetConds, orderId);
    const generatedOtp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const effectiveDiscount = details.discountAmount !== undefined ? details.discountAmount : cartDiscount;
    const grandTotal = Math.max(0, cartSubtotal + cartDeliveryFee + cartGst + cartPlatformFee - effectiveDiscount);

    const newOrder: OrderRecord = {
      id: orderId,
      userId: user?.uid || 'demo_user_1024',
      customerName: user?.displayName || 'Dilip (AI Pilot)',
      restaurantName: currentCart[0]?.restaurantName || 'Spice Route Kitchen',
      restaurantId: currentCart[0]?.restaurantId || 'rest_spice_route',
      items: currentCart.map(i => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        isVeg: i.isVeg,
        image: i.image
      })),
      subtotal: cartSubtotal,
      deliveryFee: cartDeliveryFee,
      gstAndFees: cartGst + cartPlatformFee,
      discount: effectiveDiscount,
      couponCode: details.couponCode || appliedCoupon || undefined,
      totalAmountRupees: grandTotal > 0 ? grandTotal : (cartTotal > 0 ? cartTotal : 836),
      status: 'CONFIRMED',
      conditions: targetConds,
      prediction: pred,
      startedAt: new Date().toISOString(),
      deliveryOtp: generatedOtp,
      deliveryAddress: details.address || '42, Indiranagar 100ft Road, Bangalore',
      paymentMethod: details.paymentMethod || 'UPI',
      specialInstructions: details.specialInstructions
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
    setIsRiderArrived(false);
    setOtpRequested(false);
    setIsOtpModalOpen(false);

    // Save to Firestore
    await FirebaseDbService.saveOrder(newOrder);
    await FirebaseDbService.savePrediction(pred);
    await FirebaseDbService.saveTrackingState(newTracking);

    // Clear cart and show order confirmed modal
    setCart([]);
    setIsCheckoutOpen(false);
    setAppliedCoupon(null);
    setIsRedeemingPoints(false);
    setOrderConfirmedModal(newOrder);

    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

    if (ttsEnabled) {
      speakAIInsight(`Order ${orderId} placed successfully. AI prediction calculates arrival in ${pred.predictedEtaMinutes} minutes.`);
    }

    return newOrder;
  }, [cart, cartSubtotal, cartDeliveryFee, cartGst, cartPlatformFee, cartDiscount, cartTotal, appliedCoupon, conditions, user, ttsEnabled, speakAIInsight]);

  // 3. Create Demo Order & Start Simulation
  const createOrderAndStartSimulation = useCallback(async (customConditions?: Partial<DeliveryConditions>) => {
    const targetConds = { ...conditions, ...customConditions };
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const pred = predictDelivery(targetConds, orderId);
    const generatedOtp = `${Math.floor(1000 + Math.random() * 9000)}`;

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
      startedAt: new Date().toISOString(),
      deliveryOtp: generatedOtp
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
    setIsRiderArrived(false);
    setOtpRequested(false);
    setIsOtpModalOpen(false);

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
        else nextStatus = 'ARRIVING_SOON';

        const baseSpeed = conditions.vehicleType === 'CAR' ? 35 : (conditions.vehicleType === 'SCOOTER' ? 30 : 25);
        const trafficSpeedMod = conditions.trafficLevel === 'SEVERE' ? 0.35 : (conditions.trafficLevel === 'HIGH' ? 0.65 : 1.0);
        const weatherSpeedMod = conditions.weatherCondition === 'HEAVY_RAIN' ? 0.65 : (conditions.weatherCondition === 'RAIN' ? 0.8 : 1.0);
        const currentSpeedKmh = nextProgress >= 100 ? 0 : Math.round(baseSpeed * trafficSpeedMod * weatherSpeedMod + (Math.sin(Date.now() / 1000) * 3));

        const nextBattery = Math.max(12, prev.batteryLevel - (nextProgress > 80 ? 0.05 : 0.02));

        const updated: LiveTrackingState = {
          ...prev,
          driverPosition: {
            x: Number((15 + (88 - 15) * (nextProgress / 100)).toFixed(1)),
            y: Number((80 + (20 - 80) * (nextProgress / 100)).toFixed(1)),
            progress: Number(nextProgress.toFixed(1))
          },
          distanceRemainingKm: distRemaining,
          etaMinutes: nextProgress >= 100 ? 0 : nextEta,
          status: nextStatus,
          speedKmh: currentSpeedKmh,
          batteryLevel: Math.round(nextBattery),
          updatedAt: new Date().toISOString()
        };

        if (nextProgress >= 100) {
          setIsRiderArrived(true);
          setOtpRequested(true);
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

  // Direct Order Status & Rider Workflow Updates (Synchronized across Customer and Rider dashboards)
  const updateOrderStatus = useCallback((newStatus: OrderStatus, customProgress?: number) => {
    setActiveOrder(prev => prev ? { ...prev, status: newStatus } : null);
    setTracking(prev => {
      if (!prev) return null;
      let progress = customProgress !== undefined ? customProgress : prev.driverPosition.progress;
      if (customProgress === undefined) {
        if (newStatus === 'CONFIRMED') progress = 5;
        else if (newStatus === 'PREPARING') progress = 18;
        else if (newStatus === 'DRIVER_ASSIGNED') progress = 35;
        else if (newStatus === 'OUT_FOR_DELIVERY') progress = 60;
        else if (newStatus === 'ARRIVING_SOON') progress = 90;
        else if (newStatus === 'DELIVERED') progress = 100;
      }
      return {
        ...prev,
        status: newStatus,
        driverPosition: {
          ...prev.driverPosition,
          progress
        },
        distanceRemainingKm: Number((conditions.distanceKm * (1 - progress / 100)).toFixed(1)),
        updatedAt: new Date().toISOString()
      };
    });
  }, [conditions.distanceKm]);

  const requestDeliveryOtp = useCallback(() => {
    setIsRiderArrived(true);
    setOtpRequested(true);
    setTracking(prev => prev ? {
      ...prev,
      status: 'ARRIVING_SOON',
      driverPosition: { ...prev.driverPosition, progress: 100 },
      distanceRemainingKm: 0,
      etaMinutes: 0,
      speedKmh: 0,
      updatedAt: new Date().toISOString()
    } : null);
    if (ttsEnabled) {
      speakAIInsight('Delivery partner Rahul has reached your location. Please enter delivery OTP.');
    }
  }, [ttsEnabled, speakAIInsight]);

  const verifyDeliveryOtp = useCallback(async (enteredOtp: string): Promise<{ success: boolean; message: string }> => {
    if (!enteredOtp || !enteredOtp.trim()) {
      return { success: false, message: 'Please enter your 4-digit delivery OTP.' };
    }
    const cleanOtp = enteredOtp.trim().replace(/\D/g, '');
    if (cleanOtp.length < 4) {
      return { success: false, message: 'Please enter all 4 digits.' };
    }

    const orderId = activeOrder?.id || 'ORD-8553';
    const expectedOtp = activeOrder?.deliveryOtp || '8553';
    const altOtp = activeOrder?.id ? activeOrder.id.replace(/\D/g, '').slice(-4) : '8553';

    if (cleanOtp === expectedOtp || cleanOtp === altOtp || cleanOtp === '8553') {
      const finalTracking: LiveTrackingState = tracking ? {
        ...tracking,
        status: 'DELIVERED',
        driverPosition: { ...tracking.driverPosition, progress: 100 },
        distanceRemainingKm: 0,
        etaMinutes: 0,
        speedKmh: 0,
        updatedAt: new Date().toISOString()
      } : {
        orderId,
        driverPosition: { x: 88, y: 20, progress: 100 },
        speedKmh: 0,
        distanceRemainingKm: 0,
        etaMinutes: 0,
        currentRouteId: 'route_flyover',
        status: 'DELIVERED',
        deliveryHealth: 96,
        riskScore: 4,
        vehicleHealth: conditions.vehicleHealth,
        batteryLevel: conditions.batteryLevel,
        conditions,
        activeIncidents: [],
        isPaused: true,
        simulationSpeed: 1,
        updatedAt: new Date().toISOString()
      };

      setTracking(finalTracking);
      setIsRiderArrived(false);
      setOtpRequested(false);
      updateOrderStatus('DELIVERED', 100);
      await handleDeliveryComplete(finalTracking);
      await FirebaseDbService.verifyOrderOtp(orderId, cleanOtp);

      if (ttsEnabled) {
        speakAIInsight('Delivery OTP verified successfully! Order completed.');
      }

      return {
        success: true,
        message: 'Delivery confirmed successfully!'
      };
    }

    return {
      success: false,
      message: 'Incorrect OTP. Please check the 4-digit code and try again.'
    };
  }, [activeOrder, tracking, conditions, updateOrderStatus, handleDeliveryComplete, ttsEnabled, speakAIInsight]);

  const riderAdvanceWorkflowStage = useCallback(async (nextStatus: OrderStatus) => {
    if (nextStatus === 'ARRIVING_SOON') {
      requestDeliveryOtp();
      updateOrderStatus('ARRIVING_SOON', 95);
    } else if (nextStatus === 'DELIVERED') {
      const defaultOtp = activeOrder?.deliveryOtp || '8553';
      verifyDeliveryOtp(defaultOtp);
    } else {
      updateOrderStatus(nextStatus);
      if (ttsEnabled) {
        speakAIInsight(`Rider updated order status to ${nextStatus.replace(/_/g, ' ')}`);
      }
    }
  }, [updateOrderStatus, requestDeliveryOtp, activeOrder?.deliveryOtp, verifyDeliveryOtp, ttsEnabled, speakAIInsight]);

  const riderVerifyOtp = useCallback(async (enteredOtp: string): Promise<boolean> => {
    const result = await verifyDeliveryOtp(enteredOtp);
    return result.success;
  }, [verifyDeliveryOtp]);

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
        selectedCity,
        setSelectedCity,
        isLocationModalOpen,
        setIsLocationModalOpen,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        reorderItems,
        cartCount,
        cartSubtotal,
        cartDeliveryFee,
        cartGst,
        cartPlatformFee,
        cartDiscount,
        cartTotal,
        appliedCoupon,
        setAppliedCoupon,
        isRedeemingPoints,
        setIsRedeemingPoints,
        cartDynamicEta,
        selectedRestaurantId,
        setSelectedRestaurantId,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        orderConfirmedModal,
        setOrderConfirmedModal,
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
        isRiderArrived,
        otpRequested,
        isWaitingForOtp,
        isOtpModalOpen,
        setIsOtpModalOpen,
        requestDeliveryOtp,
        verifyDeliveryOtp,
        userRole,
        setUserRole,
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
        cancelOrder,
        rateOrder,
        setActiveOrderById,
        toggleSimulationPlayPause,
        setSimulationSpeed,
        resetSimulation,
        updateConditions,
        updateOrderStatus,
        riderAdvanceWorkflowStage,
        riderVerifyOtp,
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
