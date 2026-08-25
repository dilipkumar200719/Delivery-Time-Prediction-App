export interface FoodItem {
  id: string;
  name: string;
  category: 'Biryani' | 'Pizza' | 'Burgers' | 'Indian' | 'Chinese' | 'Desserts' | 'Drinks' | 'Healthy';
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
  aiStatus: 'OPTIMAL' | 'BUSY' | 'MODERATE';
  discount?: string;
}

export const RESTAURANTS_DATA: Restaurant[] = [
  {
    id: 'rest_spice_route',
    name: 'Spice Route Kitchen',
    cuisine: 'Biryani, North Indian, Mughlai',
    rating: 4.8,
    ratingCount: 2840,
    avgPrepTime: 14,
    distanceKm: 3.4,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
    aiStatus: 'OPTIMAL',
    discount: '20% OFF up to ₹50'
  },
  {
    id: 'rest_artisan_crust',
    name: 'Artisan Crust Pizza Lab',
    cuisine: 'Woodfired Pizza, Italian, Pastas',
    rating: 4.9,
    ratingCount: 3120,
    avgPrepTime: 12,
    distanceKm: 2.8,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    aiStatus: 'OPTIMAL',
    discount: 'Free Delivery'
  },
  {
    id: 'rest_burger_craft',
    name: 'Smash & Craft Burger Co.',
    cuisine: 'Gourmet Burgers, Shakes, Wings',
    rating: 4.7,
    ratingCount: 1950,
    avgPrepTime: 10,
    distanceKm: 4.1,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
    aiStatus: 'MODERATE',
    discount: '₹40 OFF with AI points'
  },
  {
    id: 'rest_dragon_wok',
    name: 'Dragon Wok Asian Bar',
    cuisine: 'Pan-Asian, Dim Sum, Ramen',
    rating: 4.8,
    ratingCount: 1680,
    avgPrepTime: 15,
    distanceKm: 4.6,
    image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=600&auto=format&fit=crop&q=80',
    aiStatus: 'BUSY',
    discount: 'Flat ₹60 OFF'
  },
  {
    id: 'rest_green_harvest',
    name: 'Green Harvest Bowls',
    cuisine: 'Healthy Salads, Protein Bowls, Smoothies',
    rating: 4.9,
    ratingCount: 1240,
    avgPrepTime: 8,
    distanceKm: 2.2,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
    aiStatus: 'OPTIMAL',
    discount: '15% OFF'
  }
];

export const FOOD_CATALOG: FoodItem[] = [
  // Biryani
  {
    id: 'food_biryani_1',
    name: 'Royal Chicken Dum Biryani',
    category: 'Biryani',
    restaurantName: 'Spice Route Kitchen',
    restaurantId: 'rest_spice_route',
    rating: 4.8,
    ratingCount: 1420,
    prepTime: 14,
    price: 249,
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    description: 'Slow-cooked aromatic basmati rice layered with tender marinated chicken, saffron, and house blend spices served with mirchi ka salan.',
    popular: true,
    tags: ['Bestseller', 'Chef Special']
  },
  {
    id: 'food_biryani_2',
    name: 'Hyderabadi Paneer Tikka Biryani',
    category: 'Biryani',
    restaurantName: 'Spice Route Kitchen',
    restaurantId: 'rest_spice_route',
    rating: 4.7,
    ratingCount: 890,
    prepTime: 12,
    price: 229,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80',
    description: 'Charcoal-grilled smoky paneer cubes layered with saffron long grain basmati rice, caramelized onions and fresh mint.',
    tags: ['Must Try']
  },
  {
    id: 'food_biryani_3',
    name: 'Awadhi Mutton Dum Biryani',
    category: 'Biryani',
    restaurantName: 'Spice Route Kitchen',
    restaurantId: 'rest_spice_route',
    rating: 4.9,
    ratingCount: 2150,
    prepTime: 16,
    price: 349,
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=80',
    description: 'Fragrant Lucknowi style dum cooked tender mutton, infused with rose water, kewra, and roasted royal spices.',
    popular: true,
    tags: ['Signature']
  },

  // Pizza
  {
    id: 'food_pizza_1',
    name: 'Burrata Truffle Margherita Pizza',
    category: 'Pizza',
    restaurantName: 'Artisan Crust Pizza Lab',
    restaurantId: 'rest_artisan_crust',
    rating: 4.9,
    ratingCount: 1680,
    prepTime: 11,
    price: 389,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&auto=format&fit=crop&q=80',
    description: 'San Marzano tomato base, artisanal creamy burrata ball, fresh basil, extra virgin olive oil and a drizzle of white truffle oil.',
    popular: true,
    tags: ['Gourmet', 'Top Rated']
  },
  {
    id: 'food_pizza_2',
    name: 'Smoked Peri-Peri Paneer Pizza',
    category: 'Pizza',
    restaurantName: 'Artisan Crust Pizza Lab',
    restaurantId: 'rest_artisan_crust',
    rating: 4.8,
    ratingCount: 1120,
    prepTime: 10,
    price: 299,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
    description: 'Crispy sourdough base topped with smoky peri-peri paneer chunks, bell peppers, jalapeños, and fresh mozzarella.',
    tags: ['Spicy Favorite']
  },
  {
    id: 'food_pizza_3',
    name: 'Woodfired Pepperoni & Sausage Pizza',
    category: 'Pizza',
    restaurantName: 'Artisan Crust Pizza Lab',
    restaurantId: 'rest_artisan_crust',
    rating: 4.9,
    ratingCount: 1840,
    prepTime: 12,
    price: 419,
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600&auto=format&fit=crop&q=80',
    description: 'Generously loaded with Italian pork pepperoni, herb-seasoned sausages, mozzarella, and hot honey drizzle.',
    popular: true,
    tags: ['Bestseller']
  },

  // Burgers
  {
    id: 'food_burger_1',
    name: 'Double Smash Cheddar Burger',
    category: 'Burgers',
    restaurantName: 'Smash & Craft Burger Co.',
    restaurantId: 'rest_burger_craft',
    rating: 4.8,
    ratingCount: 1980,
    prepTime: 10,
    price: 279,
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    description: 'Two crispy smashed beef-style patties, double aged English cheddar, secret sauce, caramelized onions in a brioche bun.',
    popular: true,
    tags: ['Chef Pick']
  },
  {
    id: 'food_burger_2',
    name: 'Crispy Korean Fried Chicken Burger',
    category: 'Burgers',
    restaurantName: 'Smash & Craft Burger Co.',
    restaurantId: 'rest_burger_craft',
    rating: 4.9,
    ratingCount: 1450,
    prepTime: 9,
    price: 269,
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&auto=format&fit=crop&q=80',
    description: 'Ultra-crispy fried chicken thigh glazed in sweet and spicy gochujang, topped with kimchi slaw and kewpie mayo.',
    popular: true,
    tags: ['Spicy']
  },
  {
    id: 'food_burger_3',
    name: 'Truffle Mushroom Melt Veg Burger',
    category: 'Burgers',
    restaurantName: 'Smash & Craft Burger Co.',
    restaurantId: 'rest_burger_craft',
    rating: 4.7,
    ratingCount: 920,
    prepTime: 8,
    price: 239,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1584947897667-0c7f4e8b3ec4?w=600&auto=format&fit=crop&q=80',
    description: 'Crispy mushroom and quinoa patty smothered in melted gouda cheese, truffle aioli, and fresh arugula on brioche.',
    tags: ['Vegetarian']
  },

  // Indian
  {
    id: 'food_indian_1',
    name: 'Old Delhi Butter Chicken & Naan Combo',
    category: 'Indian',
    restaurantName: 'Spice Route Kitchen',
    restaurantId: 'rest_spice_route',
    rating: 4.9,
    ratingCount: 3100,
    prepTime: 13,
    price: 319,
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80',
    description: 'Tandoori roasted chicken in a velvety makhani gravy with cashew paste and fenugreek. Served with 2 butter garlic naans.',
    popular: true,
    tags: ['Classic']
  },
  {
    id: 'food_indian_2',
    name: 'Dal Makhani Royal Thali',
    category: 'Indian',
    restaurantName: 'Spice Route Kitchen',
    restaurantId: 'rest_spice_route',
    rating: 4.8,
    ratingCount: 1650,
    prepTime: 10,
    price: 269,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
    description: 'Slow-simmered black lentils for 24 hours with butter and cream, accompanied by Jeera Rice, Lachha Paratha and gulab jamun.',
    tags: ['Comfort Food']
  },

  // Chinese
  {
    id: 'food_chinese_1',
    name: 'Szechuan Chili Garlic Noodles & Dimsums',
    category: 'Chinese',
    restaurantName: 'Dragon Wok Asian Bar',
    restaurantId: 'rest_dragon_wok',
    rating: 4.8,
    ratingCount: 1280,
    prepTime: 12,
    price: 259,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
    description: 'Hand-pulled wok-tossed noodles in fiery red chili garlic sauce with crunchy greens and 4 steamed crystal dumplings.',
    popular: true,
    tags: ['Wok Fresh']
  },
  {
    id: 'food_chinese_2',
    name: 'Crispy Kung Pao Chicken Rice Bowl',
    category: 'Chinese',
    restaurantName: 'Dragon Wok Asian Bar',
    restaurantId: 'rest_dragon_wok',
    rating: 4.7,
    ratingCount: 940,
    prepTime: 11,
    price: 279,
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&auto=format&fit=crop&q=80',
    description: 'Diced chicken tossed with roasted peanuts, dry red chilies, scallions, and tangy Kung Pao sauce over egg fried rice.',
    tags: ['Spicy']
  },

  // Healthy
  {
    id: 'food_healthy_1',
    name: 'Avocado Quinoa Green Goddess Bowl',
    category: 'Healthy',
    restaurantName: 'Green Harvest Bowls',
    restaurantId: 'rest_green_harvest',
    rating: 4.9,
    ratingCount: 890,
    prepTime: 7,
    price: 299,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    description: 'Organic tricolor quinoa, Hass avocado, edamame, baby spinach, roasted chickpeas, pumpkin seeds with herb tahini dressing.',
    popular: true,
    tags: ['Superfood', 'High Protein']
  },
  {
    id: 'food_healthy_2',
    name: 'Grilled Herb Chicken & Sweet Potato Bowl',
    category: 'Healthy',
    restaurantName: 'Green Harvest Bowls',
    restaurantId: 'rest_green_harvest',
    rating: 4.8,
    ratingCount: 760,
    prepTime: 9,
    price: 329,
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600&auto=format&fit=crop&q=80',
    description: 'Sous-vide grilled chicken breast, roasted spiced sweet potato cubes, steamed broccoli, and avocado lemon vinaigrette.',
    tags: ['45g Protein']
  },

  // Desserts
  {
    id: 'food_dessert_1',
    name: 'Belgian Molten Chocolate Lava Cake',
    category: 'Desserts',
    restaurantName: 'Artisan Crust Pizza Lab',
    restaurantId: 'rest_artisan_crust',
    rating: 4.9,
    ratingCount: 1980,
    prepTime: 8,
    price: 189,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
    description: 'Warm dark Belgian chocolate cake with a gooey flowing ganache center, served with vanilla bean cream.',
    popular: true,
    tags: ['Indulgent']
  },
  {
    id: 'food_dessert_2',
    name: 'Pistachio Saffron Milk Cake',
    category: 'Desserts',
    restaurantName: 'Spice Route Kitchen',
    restaurantId: 'rest_spice_route',
    rating: 4.8,
    ratingCount: 1120,
    prepTime: 6,
    price: 159,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
    description: 'Soft sponge soaked in three evaporated milks infused with Kashmiri saffron and topped with crushed Iranian pistachios.',
    tags: ['Must Try']
  },

  // Drinks
  {
    id: 'food_drink_1',
    name: 'Sparkling Mango Mint Brew',
    category: 'Drinks',
    restaurantName: 'Green Harvest Bowls',
    restaurantId: 'rest_green_harvest',
    rating: 4.7,
    ratingCount: 650,
    prepTime: 4,
    price: 119,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    description: 'Fresh Alphonso mango pulp infused with crushed mint leaves, lime zest, and effervescent sparkling mountain soda.',
    tags: ['Refreshing']
  },
  {
    id: 'food_drink_2',
    name: 'Cold Pressed Hibiscus Berry Cooler',
    category: 'Drinks',
    restaurantName: 'Green Harvest Bowls',
    restaurantId: 'rest_green_harvest',
    rating: 4.8,
    ratingCount: 780,
    prepTime: 4,
    price: 129,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&auto=format&fit=crop&q=80',
    description: 'Organic hibiscus flower brew with wild strawberries, chia seeds, and raw blossom honey. Antioxidant powerhouse.',
    popular: true,
    tags: ['Healthy']
  }
];
