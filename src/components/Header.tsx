'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Locale, locales, dir, getDict } from '@/lib/i18n';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  locale: Locale;
}

export default function Header({ locale }: HeaderProps) {
  const dict = getDict(locale);
  const { cart, openCart, total } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/95 backdrop-blur-sm border-b border-border-subtle">
      <div className="container mx-auto px-3 py-2.5 flex items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-accent-orange flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-white">M</span>
          </div>
          <span className="text-lg font-bold text-text-cream hidden sm:block">
            Mc Mallek
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} />

          <button
            onClick={openCart}
            className="relative p-2 bg-bg-card rounded-full border border-border-subtle"
            aria-label={dict.cart}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-text-cream"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0l2.293-2.293c.63-.63.184-1.707-.707-1.707M9 20h10m-6 0a2 2 0 11-4 0m8 0a2 2 0 11-4 0"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent-orange text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 border-2 border-bg-primary">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    const segments = pathname.split('/').filter(Boolean);
    const rest = segments.slice(1).join('/');
    router.push(`/${newLocale}/${rest}`);
  };

  const labels: Record<Locale, string> = { fr: 'FR', ar: 'AR', en: 'EN' };

  return (
    <div className="flex rounded-lg overflow-hidden border border-border-subtle">
      {locales.map(l => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`px-2.5 py-1.5 text-xs font-bold transition-colors ${
            locale === l
              ? 'bg-accent-orange text-white'
              : 'bg-transparent text-text-muted hover:text-text-cream'
          }`}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}