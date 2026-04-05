import type { Metadata, Viewport } from 'next'
import './globals.css'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
