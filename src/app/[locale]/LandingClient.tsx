'use client';

import { useState, useEffect } from 'react';
import { Locale, getDict, dir, locales } from '@/lib/i18n';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

interface LandingClientProps {
  locale: Locale;
}

const localeData: Record<Locale, { flag: string; label: string; nativeLabel: string }> = {
  fr: { flag: '🇫🇷', label: 'Français', nativeLabel: 'Français' },
  ar: { flag: '🇩🇿', label: 'العربية', nativeLabel: 'العربية' },
  en: { flag: '🇬🇧', label: 'English', nativeLabel: 'English' },
};

const timeSlots = [
  { value: '30', label: '30 min' },
  { value: '45', label: '45 min' },
  { value: '60', label: '60 min' },
];

function LandingContent({ locale }: LandingClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dict = getDict(locale);
  const direction = dir[locale];
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<'language' | 'orderType' | 'timeSlot'>(() => {
    if (typeof window !== 'undefined') {
      const urlStep = new URLSearchParams(window.location.search).get('step');
      if (urlStep === 'orderType' || urlStep === 'timeSlot') return urlStep as 'orderType' | 'timeSlot';
    }
    return 'language';
  });
  const [orderType, setOrderType] = useState<'emporter' | 'sur-place' | null>(null);
  const [timeSlot, setTimeSlot] = useState('30');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleLocaleSelect = (newLocale: Locale) => {
    router.push(`/${newLocale}?step=orderType`);
  };

  const handleOrderTypeSelect = (type: 'emporter' | 'sur-place') => {
    setOrderType(type);
    if (type === 'sur-place') {
      setStep('timeSlot');
    } else {
      router.push(`/${locale}/menu?type=emporter`);
    }
  };

  const handleConfirmTime = () => {
    router.push(`/${locale}/menu?type=sur-place&time=${timeSlot}`);
  };

  const goBack = () => {
    if (step === 'timeSlot') setStep('orderType');
    else if (step === 'orderType') setStep('language');
  };

  if (step === 'language') {
    return (
      <main className="min-h-screen bg-bg-primary flex flex-col" dir={direction}>
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-accent-orange flex items-center justify-center overflow-hidden" style={{ backgroundImage: 'url(/logo.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
</div>
          <h1 className="text-3xl sm:text-4xl font-black text-text-cream mb-2 text-center">
            {dict.brand}
          </h1>
          <p className="text-text-muted text-center mb-10 max-w-xs mx-auto">
            {locale === 'ar' ? 'اختر لغتك' : locale === 'en' ? 'Choose your language' : 'Choisissez votre langue'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto w-full">
            {locales.map(l => (
              <button
                key={l}
                onClick={() => handleLocaleSelect(l)}
                className="flex-1 flex flex-col items-center gap-3 p-6 bg-bg-card border-2 rounded-2xl transition-all hover:border-accent-orange hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="text-5xl" aria-hidden="true">{localeData[l].flag}</span>
                <span className="text-xl font-bold text-text-cream">{localeData[l].nativeLabel}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (step === 'orderType') {
    return (
      <main className="min-h-screen bg-bg-primary flex flex-col" dir={direction}>
        <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/95 backdrop-blur-sm border-b border-border-subtle">
          <div className="container mx-auto px-3 py-2.5 flex items-center justify-between">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <div 
                className="w-9 h-9 rounded-full bg-accent-orange flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{ backgroundImage: 'url(/logo.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
              <span className="text-lg font-bold text-text-cream hidden sm:block">{dict.brand}</span>
            </Link>
            <button onClick={goBack} className="text-text-muted text-2xl p-2" aria-label={dict.remove}>←</button>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-12">
          <h1 className="text-2xl sm:text-3xl font-black text-text-cream mb-3 text-center">
            {locale === 'ar' ? 'كيف تريد الطلب؟' : locale === 'en' ? 'How to order?' : 'Comment souhaitez-vous commander ?'}
          </h1>
          <p className="text-text-muted text-center mb-8 max-w-md mx-auto">
            {locale === 'ar' ? 'اختر طريقة الاستلام' : locale === 'en' ? 'Choose pickup method' : 'Choisissez votre mode de retrait'}
          </p>

          <div className="w-full max-w-md space-y-4">
            <button
              onClick={() => handleOrderTypeSelect('emporter')}
              className="w-full bg-bg-card border-2 border-border-subtle rounded-2xl p-6 flex items-center gap-4 hover:border-accent-orange transition-all active:scale-[0.98] text-left"
            >
              <div className="w-14 h-14 rounded-xl bg-accent-orange/20 flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">📦</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-text-cream truncate">{dict.takeawayTitle}</h3>
                <p className="text-text-muted text-sm truncate">{dict.takeawayDesc}</p>
              </div>
              <span className="text-accent-orange text-2xl flex-shrink-0">→</span>
            </button>

            <button
              onClick={() => handleOrderTypeSelect('sur-place')}
              className="w-full bg-bg-card border-2 border-border-subtle rounded-2xl p-6 flex items-center gap-4 hover:border-accent-cheese transition-all active:scale-[0.98] text-left"
            >
              <div className="w-14 h-14 rounded-xl bg-accent-cheese/20 flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">🍽️</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-text-cream truncate">{dict.dineTitle}</h3>
                <p className="text-text-muted text-sm truncate">{dict.dineDesc}</p>
              </div>
              <span className="text-accent-cheese text-2xl flex-shrink-0">→</span>
            </button>
          </div>
        </main>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg-primary flex flex-col" dir={direction}>
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/95 backdrop-blur-sm border-b border-border-subtle">
        <div className="container mx-auto px-3 py-2.5 flex items-center justify-between">
<Link href={`/${locale}`} className="flex items-center gap-2">
              <div 
                className="w-9 h-9 rounded-full bg-accent-orange flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{ backgroundImage: 'url(/logo.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
              <span className="text-lg font-bold text-text-cream hidden sm:block">{dict.brand}</span>
            </Link>
          <button onClick={goBack} className="text-text-muted text-2xl p-2" aria-label={dict.remove}>←</button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-12">
        <h1 className="text-2xl sm:text-3xl font-black text-text-cream mb-3 text-center">
          {locale === 'ar' ? 'متى تريد الحضور؟' : locale === 'en' ? 'When to come?' : 'Pour quand ?'}
        </h1>
        <p className="text-text-muted text-center mb-8 max-w-md mx-auto">
          {locale === 'ar' ? 'اختر وقت الوصول' : locale === 'en' ? 'Choose arrival time' : 'Choisissez votre créneau'}
        </p>

        <div className="w-full max-w-md space-y-4">
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
            className="w-full bg-accent-cheese text-bg-primary py-3.5 rounded-xl font-bold text-lg hover:bg-yellow-500 transition-colors"
          >
            {locale === 'ar' ? 'تأكيد' : locale === 'en' ? 'Confirm' : 'Confirmer'}
          </button>
          <button
            onClick={goBack}
            className="w-full border-2 border-border-subtle text-text-cream py-3 rounded-xl font-medium mt-2 hover:border-accent-cheese transition-colors"
          >
            {locale === 'ar' ? 'رجوع' : locale === 'en' ? 'Back' : 'Retour'}
          </button>
        </div>
      </main>
    </main>
  );
}

export default function LandingClient({ locale }: LandingClientProps) {
  return (
    <Suspense fallback={null}>
      <LandingContent locale={locale} />
    </Suspense>
  );
}