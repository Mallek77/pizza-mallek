import { notFound } from 'next/navigation';
import { Locale, locales } from '@/lib/i18n';
import LandingClient from './LandingClient';

interface PageProps {
  params: Promise<{ locale: Locale }>;
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
      title: isAr ? 'مك مالك' : isEn ? 'Mc Mallek' : 'Mc Mallek — Pizza & Burger',
      description: isAr ? 'اختر طريقة الاستلام' : isEn ? 'Choose your order type' : 'Choisissez votre type de commande',
    };
  });
}

export default async function LandingPage({ params }: PageProps) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();

  return <LandingClient locale={locale} />;
}