'use client';

import dynamic from 'next/dynamic';
import { Locale } from '@/lib/i18n';

const HomePageClient = dynamic(() => import('./HomePageClient'), { ssr: false });

interface HomePageWrapperProps {
  locale: Locale;
}

export default function HomePageWrapper({ locale }: HomePageWrapperProps) {
  return <HomePageClient locale={locale} />;
}