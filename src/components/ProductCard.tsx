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

  // Inject styles on client side only
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'product-card-styles';
    style.textContent = `
      @container product-card (max-width: 280px) {
        .product-card { min-height: 420px; }
        .btn-text { display: none !important; }
      }
      @container product-card (min-width: 281px) and (max-width: 380px) {
        .product-card { min-height: 480px; }
        .btn-text { display: none !important; }
      }
      @container product-card (min-width: 381px) and (max-width: 480px) {
        .product-card { min-height: 560px; }
        .btn-text { display: inline-block !important; }
      }
      @container product-card (min-width: 481px) {
        .product-card { min-height: 640px; }
        .btn-text { display: inline-block !important; }
      }
      .btn-add-to-cart {
        background: var(--accent-orange); color: white; border: none;
        font-weight: 700; border-radius: 999px; transition: all 0.15s ease;
        min-height: 44px;
      }
      .btn-add-to-cart:hover { background: var(--accent-tomato); transform: translateY(-1px); }
      .btn-add-to-cart:active { transform: scale(0.96); }
      .btn-add-to-cart:focus-visible { outline: 2px solid var(--accent-cheese); outline-offset: 2px; }
      .icon-plus { font-size: 1.25em; line-height: 1; display: flex; align-items: center; justify-content: center; }
    `;
    document.head.appendChild(style);
    return () => { const s = document.getElementById('product-card-styles'); if (s) s.remove(); };
  }, []);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc('/images/placeholder.svg');
    }
  };

  const fallbackToJpg = () => {
    if (imgSrc.endsWith('.webp')) {
      setImgSrc(imgSrc.replace('.webp', '.jpg'));
    }
  };

  // Get translated name and description
  const translationKey = product.translationKey || product.id;
  const displayName = product.translationKey ? dict[translationKey] || product.displayName : product.displayName;
  const description = product.translationKey ? dict[`${translationKey}_desc`] || product.description : product.description;

  return (
    <article 
      className="product-card group relative overflow-hidden rounded-2xl"
      style={{ containerName: 'product-card', containerType: 'inline-size' }}
    >
      {/* Image layer - simple, reliable */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source srcSet={imgSrc} type="image/webp" />
          <img
            src={imgSrc.replace('.webp', '.jpg')}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={handleError}
          />
        </picture>
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Content layer - description bottom-left, price bottom-right, button centered */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Spacer to push content to bottom */}
        <div className="flex-1" />
        
        {/* Bottom content: description left, price right */}
        <div className="p-3 sm:p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Description bottom-left */}
          <div className="text-left">
            <h3 className="font-black text-white text-base sm:text-lg md:text-xl lg:text-2xl leading-tight truncate max-w-[80%]">
              {displayName}
            </h3>
            <p className="text-white/80 text-sm sm:text-base line-clamp-2 mt-1 max-w-[80%]">
              {description}
            </p>
          </div>
          
          {/* Price bottom-right + Add button */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3 flex-shrink-0">
            <span className="text-white font-bold text-lg sm:text-xl md:text-2xl whitespace-nowrap">
              {product.price} <span className="text-base font-normal">DA</span>
            </span>
            <button
              onClick={() => onAddToCart(product)}
              className="btn-add-to-cart flex items-center justify-center gap-1.5 px-4 sm:px-5 md:px-6 py-2.5 md:py-3 rounded-full flex-shrink-0"
              aria-label={`Ajouter ${displayName} au panier`}
            >
              <span className="icon-plus" aria-hidden="true">+</span>
              <span className="btn-text hidden sm:inline-block text-sm sm:text-base font-bold uppercase tracking-wide">
                {dict.addToCart}
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}