import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Locale, getDict, locales, dir } from '@/lib/i18n';
import Header from '@/components/Header';
import ProductGrid from '@/components/ProductGrid';

interface PageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ type?: string; time?: string }>;
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export const instant = false;

export function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  return params.then(({ locale }) => {
    const isAr = locale === 'ar';
    const isEn = locale === 'en';
    return {
      title: isAr ? 'القائمة - مك مالك' : isEn ? 'Menu - Mc Mallek' : 'Menu - Mc Mallek',
      description: isAr ? 'اختر طعامك' : isEn ? 'Choose your food' : 'Choisissez votre nourriture',
    };
  });
}

export default async function MenuPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const sp = await searchParams;
  if (!locales.includes(locale)) notFound();
  const dict = getDict(locale);
  const orderType = sp.type || 'emporter';
  const timeSlot = sp.time || '30';

  const isTakeaway = orderType === 'emporter';
  const typeLabel = isTakeaway ? dict.takeawayTitle : dict.dineTitle;

  return (
    <main className="min-h-screen bg-bg-primary" dir={dir[locale]}>
      <Header locale={locale} />

      <section className="pt-16 sm:pt-20 px-4 pb-3">
        <div className="container mx-auto flex items-center gap-2">
          <Link href={`/${locale}`} className="text-text-muted hover:text-accent-orange p-2 -ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <span className="text-accent-orange text-sm font-medium uppercase flex items-center gap-1">
            {isTakeaway ? '📦' : '🍽️'} {typeLabel}
          </span>
        </div>
      </section>

      <section className="px-4 pb-4">
        <div className="container mx-auto">
          <h1 className="text-2xl sm:text-3xl font-black text-text-cream">
            {locale === 'ar' ? 'القائمة' : locale === 'en' ? 'The Menu' : 'Le Menu'}
          </h1>
          <p className="text-text-muted text-sm mt-0.5">
            {locale === 'ar' ? 'اختر و أضف إلى سلتك' : locale === 'en' ? 'Pick and add to cart' : 'Choisissez et ajoutez au panier'}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-8">
        <ProductGrid locale={locale} orderType={orderType} timeSlot={timeSlot} />
      </section>

      <footer className="bg-bg-secondary border-t border-border-subtle mt-8">
        <div className="container mx-auto px-4 py-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-accent-orange flex items-center justify-center">
              <span className="text-lg font-bold text-white">M</span>
            </div>
            <span className="text-lg font-bold text-text-cream">Mc Mallek</span>
          </div>
          <p className="text-text-muted text-sm mb-1">{dict.madeIn}</p>
          <p className="text-text-muted text-sm mb-1">Draâ Ben Khedda, Tizi Ouzou, Algérie</p>
          <p className="text-text-muted text-sm">📞 05 XX XX XX XX</p>
          <div className="mt-3 text-text-muted text-xs">
            <p>{dict.followUs} — @mcmallek</p>
          </div>
        </div>
      </footer>
    </main>
  );
}