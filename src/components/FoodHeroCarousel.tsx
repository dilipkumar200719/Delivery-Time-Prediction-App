import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Flame } from 'lucide-react';

interface HeroSlide {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  ctaText: string;
  badge: string;
  categoryTrigger?: string;
  image: string;
  bgGradient: string;
  textColor: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide_delicious_smart',
    tag: '⚡ 50% OFF Today',
    title: 'Delicious Food. Delivered Smarter.',
    subtitle: 'Order from top-rated restaurants with dynamic AI time prediction that adapts to live kitchen prep and traffic.',
    ctaText: 'Order Now',
    badge: 'AI Powered Delivery',
    categoryTrigger: 'Biryani',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000&auto=format&fit=crop&q=80',
    bgGradient: 'from-orange-600/90 via-amber-600/80 to-slate-950/70',
    textColor: 'text-white'
  },
  {
    id: 'slide_biryani',
    tag: '🍗 Authentic Dum Rice',
    title: 'Craving Authentic Biryani?',
    subtitle: 'Fragrant saffron basmati, succulent chicken & mutton slow-cooked in sealed clay handis with cooling raita.',
    ctaText: 'Explore Biryanis',
    badge: 'Top Cravings',
    categoryTrigger: 'Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1000&auto=format&fit=crop&q=80',
    bgGradient: 'from-amber-700/90 via-orange-700/80 to-slate-950/70',
    textColor: 'text-white'
  },
  {
    id: 'slide_pizza',
    tag: '🍕 Cheesy & Crispy',
    title: 'Pizza Night Starts Here',
    subtitle: 'Woodfired sourdough crusts loaded with fresh mozzarella, burrata, basil and spicy pepperoni.',
    ctaText: 'View Pizzas',
    badge: 'Flat 40% OFF',
    categoryTrigger: 'Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&auto=format&fit=crop&q=80',
    bgGradient: 'from-red-600/90 via-rose-700/80 to-slate-950/70',
    textColor: 'text-white'
  },
  {
    id: 'slide_burger',
    tag: '🍔 Juicy & Smashed',
    title: 'Fresh Fast Food & Combos',
    subtitle: 'Double-smashed cheddar burgers, crispy fried chicken buckets, peri-peri fries and thick shakes.',
    ctaText: 'Explore Combos',
    badge: 'Under 25 Mins',
    categoryTrigger: 'Burgers',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1000&auto=format&fit=crop&q=80',
    bgGradient: 'from-orange-600/90 via-yellow-700/80 to-slate-950/70',
    textColor: 'text-white'
  },
  {
    id: 'slide_ai_delivery',
    tag: '🤖 Smart Corridor ML',
    title: 'Order Food. Let AI Predict Your Delivery.',
    subtitle: 'Transparent machine learning that calculates real arrival times instead of static guesswork.',
    ctaText: 'Discover Dishes',
    badge: 'On-Time Guaranteed',
    categoryTrigger: 'Healthy',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80',
    bgGradient: 'from-cyan-700/90 via-blue-800/80 to-slate-950/70',
    textColor: 'text-white'
  }
];

export const FoodHeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { setSelectedCategory } = useApp();

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentSlide(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
  };

  const handleCtaClick = (category?: string) => {
    if (category) {
      setSelectedCategory(category);
    }
    const catalogEl = document.getElementById('popular-dishes-section') || document.getElementById('food-catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div
      id="food-hero-carousel-container"
      className="relative overflow-hidden rounded-3xl border border-slate-200/80 shadow-md bg-slate-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Container with Gradient Overlay */}
      <div className="relative h-[320px] sm:h-[380px] lg:h-[420px] w-full overflow-hidden">
        <img
          key={slide.id}
          src={slide.image}
          alt={slide.title}
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 scale-105"
        />

        {/* Gradient Overlay for high text contrast */}
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} backdrop-brightness-75`} />

        {/* Content Box */}
        <div className="relative h-full max-w-7xl mx-auto flex flex-col justify-center px-6 sm:px-10 lg:px-14 z-10">
          <div className="max-w-xl space-y-4">
            
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-3.5 py-1 text-xs font-black text-white shadow-xs">
                <Flame className="h-3.5 w-3.5 text-amber-300 fill-amber-300" />
                <span>{slide.tag}</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-cyan-500/25 border border-cyan-400/40 px-3 py-1 text-xs font-bold text-cyan-200 backdrop-blur-md">
                <Sparkles className="h-3 w-3 text-cyan-300" />
                <span>{slide.badge}</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-sm">
              {slide.title}
            </h2>

            <p className="text-xs sm:text-base text-slate-100/90 font-medium leading-relaxed drop-shadow-xs line-clamp-2 sm:line-clamp-none">
              {slide.subtitle}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                id="btn-hero-order-now"
                onClick={() => handleCtaClick(slide.categoryTrigger)}
                className="flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-black text-slate-900 shadow-lg hover:bg-orange-50 hover:text-orange-600 transition-all hover:scale-105 active:scale-95"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Prev / Next Navigation Arrows */}
        <button
          id="btn-hero-prev"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20 hover:bg-black/60 transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          id="btn-hero-next"
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20 hover:bg-black/60 transition-all"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {HERO_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide
                  ? 'w-7 bg-white shadow-md'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};
