'use client';

import { useState } from 'react';
import { Locale, getDict, dir } from '@/lib/i18n';
import Header from '@/components/Header';

interface HomePageClientProps {
  locale: Locale;
}

const timeSlots = [
  { value: '30', label: '30 min' },
  { value: '45', label: '45 min' },
  { value: '60', label: '60 min' },
];

export default function HomePageClient({ locale }: HomePageClientProps) {
  const dict = getDict(locale);
  const [orderType, setOrderType] = useState<'emporter' | 'sur-place' | null>(null);
  const [timeSlot, setTimeSlot] = useState('30');
  const [showTimeSelector, setShowTimeSelector] = useState(false);

  const handleOrderTypeSelect = (type: 'emporter' | 'sur-place') => {
    setOrderType(type);
    if (type === 'sur-place') {
      setShowTimeSelector(true);
    } else {
      window.location.href = `/${locale}/menu?type=emporter`;
    }
  };

  const handleConfirmTime = () => {
    window.location.href = `/${locale}/menu?type=sur-place&time=${timeSlot}`;
  };

  return (
    <main className="min-h-screen bg-bg-primary" dir={dir[locale]}>
      <Header locale={locale} />

      <section className="pt-24 sm:pt-32 pb-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-accent-orange flex items-center justify-center flex-shrink-0">
            <span className="text-2xl sm:text-3xl font-bold text-white">M</span>
          </div>
          <span className="text-3xl sm:text-4xl font-black text-text-cream">Mc Mallek</span>
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-text-cream mb-3 leading-tight px-2">
          {locale === 'ar' ? 'الجوع ما يستناش' : locale === 'en' ? 'Hunger waits for no one' : 'LA FAIM N\'ATTEND PAS'}
        </h1>
        <p className="text-text-muted text-base sm:text-lg max-w-md mx-auto px-4">
          {locale === 'ar' ? 'اختر كيف بغيتي ت-commande' : locale === 'en' ? 'How would you like to order?' : 'Comment souhaitez-vous commander ?'}
        </p>
      </section>

      {!showTimeSelector ? (
        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-md mx-auto space-y-3 sm:space-y-4">
            <button
              onClick={() => handleOrderTypeSelect('emporter')}
              className="w-full bg-bg-card border-2 border-border-subtle rounded-3xl p-4 sm:p-6 flex items-center gap-3 sm:gap-4 hover:border-accent-orange transition-all active:scale-[0.98] text-left"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-accent-orange/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl sm:text-3xl">📦</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-text-cream truncate">
                  {dict.takeawayTitle}
                </h3>
                <p className="text-text-muted text-xs sm:text-sm truncate">
                  {dict.takeawayDesc}
                </p>
              </div>
              <span className="text-accent-orange text-xl sm:text-2xl flex-shrink-0">→</span>
            </button>

            <button
              onClick={() => handleOrderTypeSelect('sur-place')}
              className="w-full bg-bg-card border-2 border-border-subtle rounded-3xl p-4 sm:p-6 flex items-center gap-3 sm:gap-4 hover:border-accent-cheese transition-all active:scale-[0.98] text-left"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-accent-cheese/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl sm:text-3xl">🍽️</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-text-cream truncate">
                  {dict.dineTitle}
                </h3>
                <p className="text-text-muted text-xs sm:text-sm truncate">
                  {dict.dineDesc}
                </p>
              </div>
              <span className="text-accent-cheese text-xl sm:text-2xl flex-shrink-0">→</span>
            </button>
          </div>
        </section>
      ) : (
        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-md mx-auto space-y-4">
            <div className="bg-bg-card border-2 border-accent-cheese rounded-3xl p-6">
              <h3 className="text-lg font-bold text-text-cream mb-4 text-center">
                {locale === 'ar' ? 'متى تجي؟' : locale === 'en' ? 'When are you coming?' : 'Pour quand ?'}
              </h3>
              <div className="flex gap-3 justify-center mb-4">
                {timeSlots.map(slot => (
                  <button
                    key={slot.value}
                    onClick={() => setTimeSlot(slot.value)}
                    className={`px-6 py-3 rounded-xl font-bold text-base transition-all min-w-[80px] ${
                      timeSlot === slot.value
                        ? 'bg-accent-cheese text-bg-primary shadow-lg shadow-accent-cheese/30'
                        : 'bg-bg-secondary text-text-cream border border-border-subtle hover:border-accent-cheese'
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
              <button
                onClick={handleConfirmTime}
                className="w-full btn-primary py-3.5 text-lg"
              >
                {locale === 'ar' ? 'تأكيد' : locale === 'en' ? 'Confirm' : 'Confirmer'}
              </button>
              <button
                onClick={() => setShowTimeSelector(false)}
                className="w-full btn-secondary py-2.5 text-sm mt-2"
              >
                {locale === 'ar' ? 'رجوع' : locale === 'en' ? 'Back' : 'Retour'}
              </button>
            </div>
          </div>
        </section>
      )}

      <footer className="bg-bg-secondary border-t border-border-subtle">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-text-muted text-sm">📍 Draâ Ben Khedda, Tizi Ouzou, Algérie</p>
          <p className="text-text-muted text-sm mt-1">📞 05 XX XX XX XX</p>
        </div>
      </footer>
    </main>
  );
}