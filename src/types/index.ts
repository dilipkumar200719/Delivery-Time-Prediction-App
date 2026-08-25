export type TrafficLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'SEVERE';
export type WeatherCondition = 'CLEAR' | 'CLOUDY' | 'RAIN' | 'HEAVY_RAIN' | 'STORM';
export type RoadCondition = 'NORMAL' | 'WET' | 'DAMAGED' | 'BLOCKED';
export type VehicleType = 'BIKE' | 'SCOOTER' | 'EV_BIKE' | 'CAR';
export type VehicleHealth = 'EXCELLENT' | 'GOOD' | 'WARNING' | 'CRITICAL';
export type DriverStatus = 'AVAILABLE' | 'NORMAL' | 'TIRED' | 'FATIGUED';
export type StoreStatus = 'READY' | 'NORMAL' | 'DELAYED';
export type DeliveryStatus = 'ON_TIME' | 'POSSIBLE_DELAY' | 'HIGH_DELAY';
export type OrderStatus = 'CONFIRMED' | 'PREPARING' | 'DRIVER_ASSIGNED' | 'OUT_FOR_DELIVERY' | 'ARRIVING_SOON' | 'DELIVERED';

export type AppTab = 
  | 'HOME' 
  | 'RESTAURANTS' 
  | 'ORDERS' 
  | 'TWIN' 
  | 'TRACKING' 
  | 'GAMES' 
  | 'PULSE' 
  | 'ROUTES' 
  | 'DECISION_ROOM' 
  | 'REWARDS' 
  | 'JUDGE' 
  | 'FUTURE' 
  | 'PROFILE' 
  | 'CHECKOUT';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  restaurantName: string;
  restaurantId: string;
  quantity: number;
  image: string;
  isVeg: boolean;
  prepTime: number;
}

export interface DeliveryConditions {
  distanceKm: number;
  trafficLevel: TrafficLevel;
  weatherCondition: WeatherCondition;
  roadCondition: RoadCondition;
  vehicleType: VehicleType;
  vehicleHealth: VehicleHealth;
  batteryLevel: number; // 0-100%
  timeOfDay: string; // "19:30"
  dayOfWeek: string;
  numberOfItems: number;
  orderSize: 'SMALL' | 'MEDIUM' | 'LARGE';
  restaurantPrepTime: number; // minutes
  driverExperienceYears: number;
  driverStatus: DriverStatus;
  storeStatus: StoreStatus;
  deliveryPriority: 'STANDARD' | 'EXPRESS' | 'RUSH';
}

export interface FactorContribution {
  factor: string;
  label: string;
  impactMinutes: number;
  percentage: number;
  type: 'positive' | 'negative' | 'neutral';
  description: string;
  factorKey?: string;
  factorName?: string;
  explanation?: string;
}

export interface RouteOption {
  id: string;
  name: string;
  distanceKm: number;
  estimatedMinutes: number;
  trafficSummary: string;
  weatherImpact: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  score: number; // 0-100 higher is better
  pathPoints: Array<{ x: number; y: number }>;
  geoCoordinates?: Array<[number, number]>; // [lat, lng] array along Hyderabad road networks
  trafficSegments?: Array<{ coords: Array<[number, number]>; level: TrafficLevel; name: string; delayMin?: number }>;
  isRecommended: boolean;
  highlightReason: string;
}

export interface PredictionResult {
  id: string;
  orderId: string;
  predictedEtaMinutes: number;
  delayProbability: number; // 0.0 - 1.0
  deliveryStatus: DeliveryStatus;
  riskScore: number; // 0 - 100
  confidence: number; // 0.0 - 1.0
  factorContributions: FactorContribution[];
  recommendedRoute: RouteOption;
  availableRoutes: RouteOption[];
  deliveryHealthScore: number;
  explanation: string;
  explanationText?: string;
  createdAt: string;
}

export interface FutureTimelineEvent {
  timeOffsetMin: number;
  title: string;
  status: OrderStatus;
  icon: string;
  description: string;
  projectedTime: string;
  isComplete: boolean;
  isCurrent: boolean;
}

export interface LiveTrackingState {
  orderId: string;
  driverPosition: { x: number; y: number; progress: number }; // progress 0 to 100%
  speedKmh: number;
  distanceRemainingKm: number;
  etaMinutes: number;
  currentRouteId: string;
  status: OrderStatus;
  deliveryHealth: number; // 0-100 score
  riskScore: number;
  vehicleHealth: VehicleHealth;
  batteryLevel: number;
  conditions: DeliveryConditions;
  activeIncidents: Array<{ id: string; type: string; title: string; penaltyMinutes: number; timestamp: string }>;
  isPaused: boolean;
  simulationSpeed: number; // 1x, 2x, 5x
  updatedAt: string;
}

export interface SimulationRecalculationEvent {
  id: string;
  timestamp: string;
  previousEta: number;
  newEta: number;
  reasons: Array<{ description: string; deltaMinutes: number }>;
  triggeredBy: string;
}

export interface UserProfile {
  uid: string;
  id?: string;
  displayName: string;
  email: string;
  role?: 'USER' | 'DRIVER' | 'ADMIN';
  deliveryPoints: number;
  rewardBalanceRupees: number;
  totalDeliveries: number;
  gamesPlayed: number;
  totalGamesPlayed?: number;
  totalVouchersRedeemed?: number;
  onTimeDeliveriesCount?: number;
  createdAt: string;
  lastLoginAt: string;
}

export interface OrderRecord {
  id: string;
  userId: string;
  customerName: string;
  restaurantName: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmountRupees: number;
  status: OrderStatus;
  conditions: DeliveryConditions;
  prediction: PredictionResult;
  actualEtaMinutes?: number;
  startedAt: string;
  deliveredAt?: string;
  delayMinutes?: number;
  delayCompensationPoints?: number;
  pointsEarnedFromGames?: number;
  pointsEarnedFromDelivery?: number;
}

export interface GameSession {
  id: string;
  userId: string;
  orderId: string;
  gameName: 'Delivery Rush' | 'Catch the Food' | 'Guess Your ETA';
  score: number;
  pointsEarned: number;
  rupeeValue: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  startTime: string;
  endTime?: string;
  gameData?: Record<string, any>;
}

export interface RewardTransaction {
  id: string;
  userId: string;
  orderId?: string;
  points: number;
  rupeeValue: number;
  type: 'EARN_GAME' | 'EARN_DELIVERY' | 'DELAY_COMPENSATION' | 'REDEMPTION' | 'BONUS';
  title: string;
  description: string;
  timestamp: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  category: 'PREDICTION' | 'GAMING' | 'DELIVERY' | 'STREAK';
  icon: string;
  progress: number;
  target: number;
  unlocked: boolean;
  unlockedAt?: string;
  rewardPoints: number;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  userName?: string;
  avatarUrl?: string;
  rank: number;
  totalPoints: number;
  gamesPlayed: number;
  accuracyRate: number;
  topGame: string;
}

export interface AdminSettingsConfig {
  pointsPerRupee: number; // 10 points = ₹1, so 100 points = ₹10
  minRedemptionRupees: number; // e.g. 10
  maxDiscountPerOrderRupees: number; // e.g. 50
  maxGameRewardPerSession: number; // e.g. 500 points
  dailyEarningLimitPoints: number; // e.g. 2000 points
  delayCompensationThresholdMinutes: number; // e.g. 2 minutes delay
  delayCompensationPointsPerMinute: number; // e.g. 10 points per min
  autoRecalibrateRoutes: boolean;
  simulationTickRateMs: number;
  trafficWeight?: number;
  weatherWeight?: number;
  delayThresholdMinutes?: number;
}

export interface CityZone {
  id: string;
  name: string;
  status: 'NORMAL' | 'BUSY' | 'HOTSPOT';
  activeCouriers: number;
  rainDetected: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  avgSpeedKmh: number;
  x: number;
  y: number;
}
