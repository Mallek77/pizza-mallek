'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Locale, locales } from '@/lib/i18n';

interface LanguageSwitcherProps {
  locale: Locale;
}

const localeData: Record<Locale, { flag: string; nativeLabel: string; alt: string }> = {
  fr: { flag: '🇫🇷', nativeLabel: 'Français', alt: 'Français' },
  ar: { flag: '🇩🇿', nativeLabel: 'العربية', alt: 'العربية' },
  en: { flag: '🇬🇧', nativeLabel: 'English', alt: 'English' },
};

export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    const segments = pathname.split('/').filter(Boolean);
    const rest = segments.slice(1).join('/');
    router.push(`/${newLocale}/${rest}`);
  };

  return (
    <div className="flex rounded-lg overflow-hidden border border-border-subtle" role="group" aria-label="Language selection" dir="ltr">
      {locales.map(l => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`relative flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all min-w-[56px] ${
            locale === l
              ? 'bg-accent-orange text-white shadow-sm'
              : 'bg-transparent text-text-muted hover:text-text-cream hover:bg-bg-secondary'
          }`}
          aria-current={locale === l ? 'true' : 'false'}
          aria-label={localeData[l].alt}
          dir="ltr"
        >
          <span className="text-base" aria-hidden="true">{localeData[l].flag}</span>
          <span className="hidden sm:inline-block">{localeData[l].nativeLabel}</span>
        </button>
      ))}
    </div>
  );
}