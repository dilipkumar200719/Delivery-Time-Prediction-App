export interface FoodItem {
  id: string;
  name: string;
  category: 
    | 'Biryani' 
    | 'Pizza' 
    | 'Burgers' 
    | 'South Indian' 
    | 'North Indian' 
    | 'Chinese' 
    | 'Chicken' 
    | 'Rolls & Wraps' 
    | 'Desserts' 
    | 'Beverages' 
    | 'Healthy' 
    | 'Fast Food' 
    | 'Sandwiches' 
    | 'Snacks' 
    | 'Ice Cream';
  restaurantName: string;
  restaurantId: string;
  rating: number;
  ratingCount: number;
  prepTime: number; // in minutes
  price: number; // in INR
  isVeg: boolean;
  image: string;
  description: string;
  tags?: string[];
  popular?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  ratingCount: number;
  avgPrepTime: number;
  distanceKm: number;
  image: string;
  logo?: string;
  aiStatus: 'OPTIMAL' | 'BUSY' | 'MODERATE';
  discount?: string;
  deliveryFee: number;
  location: string;
  featured?: boolean;
}

export const CATEGORIES_DATA: Array<{
  id: string;
  name: FoodItem['category'];
  icon: string;
  image: string;
  tagline: string;
}> = [
  {
    id: 'cat_biryani',
    name: 'Biryani',
    icon: '🍗',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
    tagline: 'Aromatic Handi Dum'
  },
  {
    id: 'cat_pizza',
    name: 'Pizza',
    icon: '🍕',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80',
    tagline: 'Cheesy Woodfired'
  },
  {
    id: 'cat_burgers',
    name: 'Burgers',
    icon: '🍔',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
    tagline: 'Juicy Smashed Patties'
  },
  {
    id: 'cat_south_indian',
    name: 'South Indian',
    icon: '🥞',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80',
    tagline: 'Crispy Dosas & Idlis'
  },
  {
    id: 'cat_north_indian',
    name: 'North Indian',
    icon: '🍛',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&auto=format&fit=crop&q=80',
    tagline: 'Rich Curries & Naan'
  },
  {
    id: 'cat_chinese',
    name: 'Chinese',
    icon: '🍜',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=80',
    tagline: 'Wok Noodles & Dim Sum'
  },
  {
    id: 'cat_chicken',
    name: 'Chicken',
    icon: '🍗',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=80',
    tagline: 'Crispy, Fried & Grilled'
  },
  {
    id: 'cat_rolls',
    name: 'Rolls & Wraps',
    icon: '🌯',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80',
    tagline: 'Kathi Rolls & Frankies'
  },
  {
    id: 'cat_desserts',
    name: 'Desserts',
    icon: '🍰',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=80',
    tagline: 'Cakes, Waffles & Treats'
  },
  {
    id: 'cat_beverages',
    name: 'Beverages',
    icon: '🧋',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500&auto=format&fit=crop&q=80',
    tagline: 'Cold Brews, Shakes & Boba'
  },
  {
    id: 'cat_healthy',
    name: 'Healthy',
    icon: '🥗',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=80',
    tagline: 'Salads & Protein Bowls'
  },
  {
    id: 'cat_fast_food',
    name: 'Fast Food',
    icon: '🍟',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80',
    tagline: 'Fries, Wings & Combos'
  },
  {
    id: 'cat_sandwiches',
    name: 'Sandwiches',
    icon: '🥪',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80',
    tagline: 'Grilled Club Paninis'
  },
  {
    id: 'cat_snacks',
    name: 'Snacks',
    icon: '🥟',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80',
    tagline: 'Samosas, Chaat & Bites'
  },
  {
    id: 'cat_ice_cream',
    name: 'Ice Cream',
    icon: '🍨',
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&auto=format&fit=crop&q=80',
    tagline: 'Artisanal Gelato & Sundaes'
  }
];

export const RESTAURANTS_DATA: Restaurant[] = [
  {
    id: 'rest_kfc',
    name: 'KFC',
    cuisine: 'Burgers • Chicken • Fast Food',
    rating: 4.4,
    ratingCount: 5420,
    avgPrepTime: 12,
    distanceKm: 2.8,
    image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=600&auto=format&fit=crop&q=80',
    logo: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=100&auto=format&fit=crop&q=80',
    aiStatus: 'OPTIMAL',
    discount: '50% OFF up to ₹100',
    deliveryFee: 0,
    location: 'MG Road, City Centre',
    featured: true
  },
  {
    id: 'rest_mcdonalds',
    name: "McDonald's",
    cuisine: 'Burgers • Beverages • Fast Food',
    rating: 4.3,
    ratingCount: 6890,
    avgPrepTime: 10,
    distanceKm: 2.3,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
    logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&auto=format&fit=crop&q=80',
    aiStatus: 'OPTIMAL',
    discount: '40% OFF',
    deliveryFee: 19,
    location: 'Eluru Road Junction',
    featured: true
  },
  {
    id: 'rest_dominos',
    name: "Domino's Pizza",
    cuisine: 'Pizza • Sides • Pastas',
    rating: 4.5,
    ratingCount: 7120,
    avgPrepTime: 14,
    distanceKm: 3.1,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
    logo: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=100&auto=format&fit=crop&q=80',
    aiStatus: 'OPTIMAL',
    discount: '40% OFF up to ₹80',
    deliveryFee: 0,
    location: 'Governorpet High St',
    featured: true
  },
  {
    id: 'rest_paradise',
    name: 'Paradise Biryani',
    cuisine: 'Biryani • Hyderabadi • Mughlai',
    rating: 4.5,
    ratingCount: 9240,
    avgPrepTime: 15,
    distanceKm: 4.2,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    logo: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=100&auto=format&fit=crop&q=80',
    aiStatus: 'MODERATE',
    discount: '20% OFF',
    deliveryFee: 29,
    location: 'Benz Circle Mall',
    featured: true
  },
  {
    id: 'rest_belgian_waffle',
    name: 'The Belgian Waffle Co.',
    cuisine: 'Desserts • Waffles • Shakes',
    rating: 4.3,
    ratingCount: 3410,
    avgPrepTime: 9,
    distanceKm: 1.9,
    image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&auto=format&fit=crop&q=80',
    logo: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&auto=format&fit=crop&q=80',
    aiStatus: 'OPTIMAL',
    discount: '25% OFF',
    deliveryFee: 0,
    location: 'PVP Square Avenue',
    featured: true
  },
  {
    id: 'rest_spice_route',
    name: 'Spice Route Kitchen',
    cuisine: 'North Indian • Biryani • Mughlai',
    rating: 4.8,
    ratingCount: 3840,
    avgPrepTime: 14,
    distanceKm: 3.4,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
    aiStatus: 'OPTIMAL',
    discount: '20% OFF up to ₹50',
    deliveryFee: 19,
    location: 'Ring Road Boulevard',
    featured: true
  },
  {
    id: 'rest_artisan_crust',
    name: 'Artisan Crust Pizza Lab',
    cuisine: 'Woodfired Pizza • Italian • Pastas',
    rating: 4.9,
    ratingCount: 3120,
    avgPrepTime: 12,
    distanceKm: 2.8,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    aiStatus: 'OPTIMAL',
    discount: 'Free Delivery',
    deliveryFee: 0,
    location: 'Autonagar Hub',
    featured: true
  },
  {
    id: 'rest_burger_craft',
    name: 'Smash & Craft Burger Co.',
    cuisine: 'Gourmet Burgers • Shakes • Wings',
    rating: 4.7,
    ratingCount: 2950,
    avgPrepTime: 10,
    distanceKm: 4.1,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
    aiStatus: 'MODERATE',
    discount: '₹40 OFF with AI points',
    deliveryFee: 25,
    location: 'Bunder Road Express',
    featured: true
  },
  {
    id: 'rest_dragon_wok',
    name: 'Dragon Wok Asian Bar',
    cuisine: 'Pan-Asian • Dim Sum • Noodles',
    rating: 4.8,
    ratingCount: 2680,
    avgPrepTime: 15,
    distanceKm: 4.6,
    image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=600&auto=format&fit=crop&q=80',
    aiStatus: 'BUSY',
    discount: 'Flat ₹60 OFF',
    deliveryFee: 35,
    location: 'Governorpet East',
    featured: false
  },
  {
    id: 'rest_green_harvest',
    name: 'Green Harvest Bowls',
    cuisine: 'Healthy Salads • Protein Bowls • Smoothies',
    rating: 4.9,
    ratingCount: 1840,
    avgPrepTime: 8,
    distanceKm: 2.2,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
    aiStatus: 'OPTIMAL',
    discount: '15% OFF',
    deliveryFee: 0,
    location: 'Governorpet Green Square',
    featured: false
  }
];

export const FOOD_CATALOG: FoodItem[] = [
  // Biryani & Indian Main
  {
    id: 'food_biryani_chicken',
    name: 'Chicken Biryani',
    category: 'Biryani',
    restaurantName: 'Paradise Biryani',
    restaurantId: 'rest_paradise',
    rating: 4.8,
    ratingCount: 3420,
    prepTime: 14,
    price: 199,
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    description: 'Authentic Hyderabadi dum biryani cooked with fragrant aged basmati rice, tender chicken, saffron and spices. Served with raita & salan.',
    popular: true,
    tags: ['Bestseller', 'Top Rated']
  },
  {
    id: 'food_paneer_butter_masala',
    name: 'Paneer Butter Masala',
    category: 'North Indian',
    restaurantName: 'Spice Route Kitchen',
    restaurantId: 'rest_spice_route',
    rating: 4.8,
    ratingCount: 2890,
    prepTime: 12,
    price: 189,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80',
    description: 'Velvety tomato and cashew gravy enriched with butter, aromatic dried fenugreek leaves and soft cottage cheese cubes.',
    popular: true,
    tags: ['Must Try', 'Chef Special']
  },
  {
    id: 'food_pizza_margherita',
    name: 'Margherita Pizza',
    category: 'Pizza',
    restaurantName: "Domino's Pizza",
    restaurantId: 'rest_dominos',
    rating: 4.7,
    ratingCount: 4120,
    prepTime: 10,
    price: 249,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&auto=format&fit=crop&q=80',
    description: 'Classic stone-baked pizza loaded with 100% real mozzarella cheese, basil herb seasoning and rich herb tomato sauce.',
    popular: true,
    tags: ['Classic Bestseller']
  },
  {
    id: 'food_burger_chicken',
    name: 'Chicken Burger',
    category: 'Burgers',
    restaurantName: 'KFC',
    restaurantId: 'rest_kfc',
    rating: 4.6,
    ratingCount: 3950,
    prepTime: 9,
    price: 149,
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    description: 'Crispy hand-breaded chicken fillet nestled inside toasted sesame brioche buns with creamy mayo and crunchy iceberg lettuce.',
    popular: true,
    tags: ['Hot & Crispy']
  },
  {
    id: 'food_masala_dosa',
    name: 'Masala Dosa',
    category: 'South Indian',
    restaurantName: 'Spice Route Kitchen',
    restaurantId: 'rest_spice_route',
    rating: 4.9,
    ratingCount: 2650,
    prepTime: 8,
    price: 119,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
    description: 'Golden crispy fermented crepe stuffed with spiced tempered potato masala. Served with hot sambar and three homemade chutneys.',
    popular: true,
    tags: ['Breakfast Favorite']
  },
  {
    id: 'food_veg_fried_rice',
    name: 'Veg Fried Rice',
    category: 'Chinese',
    restaurantName: 'Dragon Wok Asian Bar',
    restaurantId: 'rest_dragon_wok',
    rating: 4.7,
    ratingCount: 1890,
    prepTime: 10,
    price: 139,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80',
    description: 'Wok-tossed long-grain rice with crunchy carrots, cabbage, spring onions, garlic and dark savory soy glaze.',
    popular: true,
    tags: ['Wok Fresh']
  },
  {
    id: 'food_chicken_roll',
    name: 'Chicken Roll',
    category: 'Rolls & Wraps',
    restaurantName: 'Smash & Craft Burger Co.',
    restaurantId: 'rest_burger_craft',
    rating: 4.7,
    ratingCount: 2210,
    prepTime: 8,
    price: 129,
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
    description: 'Flaky layered paratha wrapped around succulent spiced chicken tikka morsels, sliced onions and tangy mint chutney.',
    popular: true,
    tags: ['Quick Bite']
  },
  {
    id: 'food_samosa_pack',
    name: 'Crispy Samosa (2 Pcs)',
    category: 'Snacks',
    restaurantName: 'Spice Route Kitchen',
    restaurantId: 'rest_spice_route',
    rating: 4.8,
    ratingCount: 1740,
    prepTime: 6,
    price: 59,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
    description: 'Flaky golden pastry triangles filled with aromatic spiced potato and green pea filling. Served with tamarind & mint chutney.',
    popular: true,
    tags: ['Evening Special']
  },
  {
    id: 'food_lava_cake',
    name: 'Chocolate Lava Cake',
    category: 'Desserts',
    restaurantName: "Domino's Pizza",
    restaurantId: 'rest_dominos',
    rating: 4.9,
    ratingCount: 4680,
    prepTime: 7,
    price: 169,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
    description: 'Warm chocolate cake crust with a decadent, gooey liquid chocolate truffle core that melts in your mouth.',
    popular: true,
    tags: ['Decadent']
  },
  {
    id: 'food_cold_coffee',
    name: 'Classic Cold Coffee',
    category: 'Beverages',
    restaurantName: "McDonald's",
    restaurantId: 'rest_mcdonalds',
    rating: 4.6,
    ratingCount: 2820,
    prepTime: 5,
    price: 99,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80',
    description: 'Thick and creamy chilled espresso blend churned with vanilla soft ice cream and dark cocoa sprinkles.',
    popular: true,
    tags: ['Chilled Refresher']
  },
  {
    id: 'food_peri_peri_fries',
    name: 'Peri-Peri Crinkle Fries',
    category: 'Fast Food',
    restaurantName: "McDonald's",
    restaurantId: 'rest_mcdonalds',
    rating: 4.7,
    ratingCount: 3100,
    prepTime: 6,
    price: 89,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80',
    description: 'Crispy crinkle cut potatoes shaken with fiery African peri-peri spices and seasoned to golden perfection.',
    popular: true,
    tags: ['Crispy Snack']
  },
  {
    id: 'food_butter_naan',
    name: 'Garlic Butter Naan',
    category: 'North Indian',
    restaurantName: 'Spice Route Kitchen',
    restaurantId: 'rest_spice_route',
    rating: 4.8,
    ratingCount: 1980,
    prepTime: 5,
    price: 45,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
    description: 'Tandoor-baked leavened flatbread brushed with garlic butter and fresh coriander leaves.',
    tags: ['Tandoor Fresh']
  },
  {
    id: 'food_chicken_tikka',
    name: 'Smoky Chicken Tikka',
    category: 'Chicken',
    restaurantName: 'Paradise Biryani',
    restaurantId: 'rest_paradise',
    rating: 4.9,
    ratingCount: 2750,
    prepTime: 12,
    price: 219,
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1599481238640-4c1288750d7a?w=600&auto=format&fit=crop&q=80',
    description: 'Boneless chicken chunks marinated in hung curd, Kashmiri chilies, mustard oil and charcoal roasted on iron skewers.',
    popular: true,
    tags: ['Smoky Grill']
  },
  {
    id: 'food_belgian_waffle',
    name: 'Belgian Nutella Waffle',
    category: 'Desserts',
    restaurantName: 'The Belgian Waffle Co.',
    restaurantId: 'rest_belgian_waffle',
    rating: 4.8,
    ratingCount: 2310,
    prepTime: 9,
    price: 149,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&auto=format&fit=crop&q=80',
    description: 'Freshly baked crispy waffle sandwich stuffed with rich hazelnut Nutella chocolate and dusted with powdered sugar.',
    popular: true,
    tags: ['Sweet Cravings']
  },
  {
    id: 'food_mango_lassi',
    name: 'Alphonso Mango Lassi',
    category: 'Beverages',
    restaurantName: 'Paradise Biryani',
    restaurantId: 'rest_paradise',
    rating: 4.7,
    ratingCount: 1450,
    prepTime: 4,
    price: 79,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&auto=format&fit=crop&q=80',
    description: 'Traditional thick churned yogurt lassi infused with pure Alphonso mango pulp and fragrant green cardamom.',
    tags: ['Summer Special']
  },
  {
    id: 'food_icecream_sundae',
    name: 'Death by Chocolate Sundae',
    category: 'Ice Cream',
    restaurantName: 'The Belgian Waffle Co.',
    restaurantId: 'rest_belgian_waffle',
    rating: 4.9,
    ratingCount: 1820,
    prepTime: 6,
    price: 179,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&auto=format&fit=crop&q=80',
    description: 'Three scoops of dark chocolate and vanilla gelato layered with fudge brownie chunks, hot fudge sauce and roasted peanuts.',
    tags: ['Signature']
  },
  {
    id: 'food_grilled_sandwich',
    name: 'Bombay Masala Cheese Grilled Sandwich',
    category: 'Sandwiches',
    restaurantName: 'Green Harvest Bowls',
    restaurantId: 'rest_green_harvest',
    rating: 4.7,
    ratingCount: 1190,
    prepTime: 8,
    price: 129,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
    description: 'Triple-decker sandwich layered with spiced potato mash, crunchy cucumber, beetroots, cheese and coriander chutney.',
    tags: ['Street Classic']
  },
  {
    id: 'food_quinoa_bowl',
    name: 'Mediterranean Avocado Protein Bowl',
    category: 'Healthy',
    restaurantName: 'Green Harvest Bowls',
    restaurantId: 'rest_green_harvest',
    rating: 4.9,
    ratingCount: 940,
    prepTime: 9,
    price: 269,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
    description: 'Organic tri-color quinoa, sliced hass avocado, roasted chickpeas, cherry tomatoes, cucumbers and lemon tahini dressing.',
    tags: ['Superfood']
  }
];

export const PROMO_OFFERS = [
  {
    code: 'WELCOME50',
    discount: '50% OFF',
    description: 'Use code WELCOME50 on your first food order',
    minOrder: 199,
    maxDiscount: 100,
    bgGradient: 'from-orange-500 to-amber-500',
    icon: '🎉'
  },
  {
    code: 'BIRYANI30',
    discount: '30% OFF',
    description: 'On all handi dum biryanis from Paradise & Spice Route',
    minOrder: 299,
    maxDiscount: 120,
    bgGradient: 'from-rose-500 to-pink-600',
    icon: '🍗'
  },
  {
    code: 'PIZZAFEST',
    discount: 'FLAT ₹100 OFF',
    description: 'On orders above ₹399 from Domino & Artisan Crust',
    minOrder: 399,
    maxDiscount: 100,
    bgGradient: 'from-cyan-600 to-blue-600',
    icon: '🍕'
  },
  {
    code: 'FREEDEL',
    discount: 'FREE DELIVERY',
    description: 'AI-guaranteed free express courier on all carts',
    minOrder: 149,
    maxDiscount: 40,
    bgGradient: 'from-emerald-500 to-teal-600',
    icon: '⚡'
  }
];
