'use client'

import { useTranslations } from 'next-intl'
import GiftPackCard from '@/components/GiftPackCard'
import { GIFT_PACKS } from '@/lib/constants'
import { useCart } from '@/context/CartContext'

export default function GiftPacksPage() {
  const t = useTranslations()
  useCart()

  const handleAddToCart = (pack: any) => {
    // Toast or notification could be added here in Phase 3
    console.log(`Added ${pack.name} to cart`)
  }

  return (
    <div className="py-12 px-4">
      {/* Hero */}
      <section className="w-full px-4 py-16 md:py-24 bg-gradient-to-r from-honey to-warm-gold">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-dark-brown mb-4">
            {t('packs.featured')}
          </h1>
          <p className="text-lg text-earth-brown">
            Discover our curated selection of artisanal gift packs
          </p>
        </div>
      </section>

      {/* Listing */}
      <section className="w-full px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {GIFT_PACKS.map((pack) => (
              <GiftPackCard
                key={pack.id}
                pack={pack}
                variant="default"
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
