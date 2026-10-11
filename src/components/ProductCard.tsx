'use client';

import { Locale, getDict } from '@/lib/i18n';
import { useState, useEffect } from 'react';

interface ProductCardProps {
  locale: Locale;
  product: {
    id: string;
    name: string;
    displayName: string;
    translationKey?: string;
    description: string;
    price: number;
    image: string;
    category: string;
  };
  onAddToCart: (product: any) => void;
}

export default function ProductCard({ locale, product, onAddToCart }: ProductCardProps) {
  const dict = getDict(locale);
  const [imgSrc, setImgSrc] = useState<string>(product.image);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  // Category-specific card styles
  const getCardStyles = (category: string) => {
    switch (category) {
      case 'pizzas':
        return 'aspect-[4/3] min-h-[200px]'; // Wide for pizzas
      case 'burgers':
        return 'aspect-[3/4] min-h-[280px]'; // Tall for burgers
      case 'sandwiches':
      case 'paninis':
        return 'aspect-[1/1] min-h-[220px]'; // Square for sandwiches
      case 'sides':
        return 'aspect-[16/9] min-h-[160px]'; // Wide for sides
      case 'drinks':
        return 'aspect-[1/2] min-h-[240px]'; // Tall for drinks
      default:
        return 'aspect-[1/1] min-h-[200px]';
    }
  };

  const handleError = () => {
    setHasError(true);
    setImgSrc('/images/placeholder.svg');
  };

  const translationKey = product.translationKey || product.id;
  const displayName = product.translationKey ? dict[translationKey] || product.displayName : product.displayName;
  const description = product.translationKey ? dict[`${translationKey}_desc`] || product.description : product.description;

  return (
    <article 
      className={`group relative overflow-hidden rounded-2xl ${getCardStyles(product.category)}`}
      style={{ direction }}
    >
      <div className="absolute inset-0 z-0">
        <picture>
          <source srcSet={product.image} type="image/webp" />
          <img
            src={product.image.replace('.webp', '.jpg')}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => {}}
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex-1" />
        
        <div className="p-3 sm:p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className={`text-left ${direction === 'rtl' ? 'text-right' : ''}`}>
            <h3 className="font-black text-white text-base sm:text-lg md:text-xl lg:text-2xl leading-tight truncate max-w-[80%]">
              {product.translationKey ? dict[product.translationKey] || product.displayName : product.displayName}
            </h3>
            <p className="text-white/80 text-sm sm:text-base line-clamp-2 mt-1 max-w-[80%]">
              {product.translationKey ? dict[`${product.translationKey}_desc`] || product.description : product.description}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3 flex-shrink-0">
            <span className="text-white font-bold text-lg sm:text-xl md:text-2xl whitespace-nowrap">
              {product.price} <span className="text-base font-normal">DA</span>
            </span>
            <button
              onClick={() => onAddToCart(product)}
              className="bg-accent-orange text-white px-4 sm:px-5 md:px-6 py-2.5 md:py-3 rounded-full font-bold transition-all hover:bg-accent-tomato active:scale-[0.96] focus:outline-none focus:ring-2 focus:ring-accent-cheese focus:ring-offset-2 focus:ring-offset-bg-primary"
              aria-label={`${dict.addToCart} ${product.translationKey ? dict[product.translationKey] || product.displayName : product.displayName}`}
            >
              <span className="text-lg" aria-hidden="true">+</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}