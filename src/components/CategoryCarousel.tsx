import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES_DATA } from '../data/foodCatalog';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CategoryCarousel: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useApp();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (catName: string) => {
    if (selectedCategory === catName) {
      setSelectedCategory('ALL');
    } else {
      setSelectedCategory(catName);
    }
    const target = document.getElementById('popular-dishes-section') || document.getElementById('food-catalog-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="category-carousel-section" className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <span>What's on your mind?</span>
            <span className="text-xl">🍽️</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Explore 15+ handcrafted culinary categories with AI delivery guarantees
          </p>
        </div>

        {/* Scroll Arrows */}
        <div className="flex items-center gap-1.5">
          <button
            id="btn-category-scroll-left"
            onClick={() => scroll('left')}
            aria-label="Scroll categories left"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            id="btn-category-scroll-right"
            onClick={() => scroll('right')}
            aria-label="Scroll categories right"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Category List */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto pb-3 pt-1 scroll-smooth no-scrollbar"
      >
        {CATEGORIES_DATA.map(category => {
          const isSelected = selectedCategory === category.name;
          return (
            <button
              key={category.id}
              id={`cat-card-${category.id}`}
              onClick={() => handleSelectCategory(category.name)}
              className="flex flex-col items-center flex-shrink-0 group text-center focus:outline-hidden transition-transform duration-200 hover:-translate-y-1"
            >
              {/* Circular Food Image */}
              <div
                className={`relative h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden p-1 transition-all duration-300 ${
                  isSelected
                    ? 'ring-4 ring-orange-500 ring-offset-2 scale-105 shadow-md'
                    : 'border-2 border-slate-200/80 group-hover:border-orange-300 group-hover:shadow-md'
                }`}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="h-full w-full object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Category Name */}
              <span
                className={`mt-2 text-xs sm:text-sm font-bold tracking-tight max-w-[90px] truncate transition-colors ${
                  isSelected ? 'text-orange-600' : 'text-slate-800 group-hover:text-orange-600'
                }`}
              >
                {category.name}
              </span>

              {/* Tagline */}
              <span className="text-[10px] text-slate-400 font-medium hidden sm:block max-w-[85px] truncate">
                {category.tagline}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
