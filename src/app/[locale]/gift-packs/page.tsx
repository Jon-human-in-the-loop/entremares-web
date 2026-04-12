'use client'

import { useTranslations } from 'next-intl'
import GiftPackCard from '@/components/GiftPackCard'
import { GIFT_PACKS } from '@/lib/constants'

export default function GiftPacksPage() {
  const t = useTranslations()

  return (
    <div>
      {/* Hero */}
      <section className="w-full px-6 py-20 md:py-28 bg-cream/50">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-warm-gold mb-4 animate-fade-in-up">
            {t('packs.subtitle')}
          </p>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-dark-brown mb-6 animate-fade-in-up-delay-1">
            {t('packs.featured')}
          </h1>
          <p className="text-base md:text-lg text-text-secondary font-sans font-light max-w-xl mx-auto animate-fade-in-up-delay-2">
            {t('packs.description')}
          </p>
        </div>
      </section>

      {/* Listing */}
      <section className="w-full px-6 section-breathe">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {GIFT_PACKS.map((pack) => (
              <GiftPackCard
                key={pack.id}
                pack={pack}
                variant="default"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
