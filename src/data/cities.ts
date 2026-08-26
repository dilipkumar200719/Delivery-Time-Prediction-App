import { SupportedCity } from '../types';

export interface CityInfo {
  id: SupportedCity;
  name: string;
  state: string;
  center: [number, number];
  zoom: number;
  restaurantName: string;
  restaurantCuisine: string;
  restaurantRating: number;
  restaurantCoord: [number, number];
  customerCoord: [number, number];
  customerAddress: string;
  popularArea: string;
  tagline: string;
  primaryRoads: string;
  primaryWaypoints: [number, number][];
  alternateWaypoints: [number, number][];
}

export const SUPPORTED_CITIES: Record<SupportedCity, CityInfo> = {
  Vijayawada: {
    id: 'Vijayawada',
    name: 'Vijayawada',
    state: 'Andhra Pradesh',
    center: [16.5062, 80.6480],
    zoom: 14,
    restaurantName: 'Southern Spice Grand',
    restaurantCuisine: 'Andhra Special & Hyderabadi Biryani',
    restaurantRating: 4.8,
    restaurantCoord: [16.5120, 80.6380], // Governorpet / MG Road
    customerCoord: [16.4980, 80.6690],   // Benz Circle / Patamata
    customerAddress: 'Tower 4, Royal Palms, Benz Circle, Vijayawada',
    popularArea: 'Benz Circle & MG Road',
    tagline: 'Krishna River Valley Express Corridor',
    primaryRoads: 'MG Road → Bandar Rd → Benz Circle Flyover',
    primaryWaypoints: [
      [16.5120, 80.6380],
      [16.5095, 80.6435],
      [16.5062, 80.6505],
      [16.5020, 80.6590],
      [16.4980, 80.6690]
    ],
    alternateWaypoints: [
      [16.5120, 80.6380],
      [16.5140, 80.6490],
      [16.5070, 80.6620],
      [16.4980, 80.6690]
    ]
  },
  Hyderabad: {
    id: 'Hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    center: [17.4420, 78.3710],
    zoom: 14,
    restaurantName: 'Paradise & Biryani Co.',
    restaurantCuisine: 'Royal Dum Biryani & Kebabs',
    restaurantRating: 4.9,
    restaurantCoord: [17.4485, 78.3910], // Madhapur Main Road
    customerCoord: [17.4320, 78.3490],   // Gachibowli Financial District
    customerAddress: 'Aura Heights, Financial District, Gachibowli, Hyderabad',
    popularArea: 'Madhapur & HITEC City',
    tagline: 'Cyberabad AI Logistics Corridor',
    primaryRoads: 'Madhapur Main Rd → HITEC City Jn → Mindspace → Gachibowli',
    primaryWaypoints: [
      [17.4485, 78.3910],
      [17.4435, 78.3780],
      [17.4390, 78.3650],
      [17.4350, 78.3560],
      [17.4320, 78.3490]
    ],
    alternateWaypoints: [
      [17.4485, 78.3910],
      [17.4520, 78.3750],
      [17.4410, 78.3520],
      [17.4320, 78.3490]
    ]
  },
  Mumbai: {
    id: 'Mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    center: [19.0650, 72.8500],
    zoom: 14,
    restaurantName: 'Trishna Seafood & Grill',
    restaurantCuisine: 'Coastal & Gourmet Street Food',
    restaurantRating: 4.7,
    restaurantCoord: [19.0596, 72.8295], // Bandra West Linking Road
    customerCoord: [19.0690, 72.8695],   // BKC (Bandra Kurla Complex)
    customerAddress: 'Platina Wing B, BKC Business Avenue, Mumbai',
    popularArea: 'Bandra West & BKC Hub',
    tagline: 'Sea Link & BKC Smart Transit',
    primaryRoads: 'Linking Rd → Bandra Station Rd → BKC Connector Flyover',
    primaryWaypoints: [
      [19.0596, 72.8295],
      [19.0625, 72.8410],
      [19.0660, 72.8550],
      [19.0680, 72.8630],
      [19.0690, 72.8695]
    ],
    alternateWaypoints: [
      [19.0596, 72.8295],
      [19.0540, 72.8450],
      [19.0640, 72.8620],
      [19.0690, 72.8695]
    ]
  },
  Chennai: {
    id: 'Chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    center: [13.0550, 80.2400],
    zoom: 14,
    restaurantName: 'Anjappar Chettinad Kitchen',
    restaurantCuisine: 'Chettinad Special & South Indian',
    restaurantRating: 4.8,
    restaurantCoord: [13.0620, 80.2400], // Nungambakkam High Road
    customerCoord: [13.0418, 80.2341],   // T. Nagar Pondy Bazaar
    customerAddress: 'Lakshmi Enclave, South Boag Road, T. Nagar, Chennai',
    popularArea: 'Nungambakkam & T. Nagar',
    tagline: 'Coromandel Coastal Express Corridor',
    primaryRoads: 'Nungambakkam High Rd → Sterling Rd → Usman Rd → T. Nagar',
    primaryWaypoints: [
      [13.0620, 80.2400],
      [13.0550, 80.2420],
      [13.0490, 80.2385],
      [13.0450, 80.2360],
      [13.0418, 80.2341]
    ],
    alternateWaypoints: [
      [13.0620, 80.2400],
      [13.0590, 80.2490],
      [13.0460, 80.2430],
      [13.0418, 80.2341]
    ]
  }
};
