import type { Metadata } from "next";
import "./globals.css";
import { Locale, dir } from '@/lib/i18n';
import { CartProvider } from '@/context/CartContext';

export function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  return params.then(({ locale }) => {
    const isAr = locale === 'ar';
    return {
      title: isAr ? 'بيتزا و برغر في ذراع بن خدة | مك مالك' : 'Pizza & Burger à Draâ Ben Khedda | Mc Mallek',
      description: isAr ? 'أفضل بيتزا و برجر في ذراع بن خدة. توصيل سريع.' : 'Les meilleures pizzas et burgers à Draâ Ben Khedda. Livraison rapide.',
      openGraph: {
        title: isAr ? 'مك مالك - بيتزا و برجر' : 'Mc Mallek - Pizza & Burger',
        description: isAr ? 'الجوع ما يستناش' : 'La faim n\'attend pas',
        type: 'website',
        locale: isAr ? 'ar_DZ' : 'fr_DZ',
      },
    };
  });
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}