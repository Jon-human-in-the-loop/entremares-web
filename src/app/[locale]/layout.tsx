import type { Metadata, Viewport } from 'next'
import '../globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CartProvider } from '@/context/CartContext'

export const metadata: Metadata = {
  title: 'Entremares - Premium Artisanal Alfajores',
  description: 'Discover premium artisanal alfajores gift packs with a rich heritage of craftsmanship.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Entremares - Premium Artisanal Alfajores',
    description: 'Discover premium artisanal alfajores gift packs with a rich heritage of craftsmanship.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { children, params } = props;
  const resolvedParams = await params;
  
  if (!routing.locales.includes(resolvedParams.locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={resolvedParams.locale}>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <Header />
            <div className="min-h-[calc(100vh-200px)] bg-warm-white">
              {children}
            </div>
            <Footer />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
