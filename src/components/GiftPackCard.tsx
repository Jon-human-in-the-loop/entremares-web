'use client'

import { formatPrice } from '@/lib/utils'
import type { GiftPack } from '@/types'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import AddToCartButton from './cart/AddToCartButton'

interface GiftPackCardProps {
  pack: GiftPack
  variant?: 'default' | 'compact'
  onAddToCart?: (pack: GiftPack) => void
}

export default function GiftPackCard({
  pack,
  variant = 'default',
  onAddToCart,
}: GiftPackCardProps) {
  const t = useTranslations('packDetails')

  const badgeLabels: Record<string, string> = {
    mostPopular: t('mostPopular'),
    limitedEdition: t('limitedEdition'),
  }

  if (variant === 'compact') {
    return (
      <Link href={`/gift-packs/${pack.slug}`}>
        <div className="card-premium group cursor-pointer">
          {/* Image with hover zoom */}
          <div className="relative img-hover-zoom aspect-[4/3] bg-gradient-to-br from-honey/40 to-warm-gold/30">
            {pack.badge && (
              <div className="absolute top-4 right-4 bg-dark-brown/90 backdrop-blur-sm text-cream px-4 py-1.5 rounded-pill text-[11px] font-sans font-semibold tracking-wider uppercase z-10">
                {badgeLabels[pack.badge] || pack.badge}
              </div>
            )}
            <div className="h-full flex items-center justify-center">
              <span className="text-earth-brown/30 text-sm font-sans font-medium">{pack.name}</span>
            </div>
          </div>

          {/* Info */}
          <div className="p-6">
            <h3 className="mb-2 text-lg font-serif font-semibold text-dark-brown group-hover:text-earth-brown transition-colors">
              {pack.name}
            </h3>
            <p className="mb-4 text-sm text-text-secondary leading-relaxed line-clamp-2">
              {pack.description}
            </p>

            {/* Price */}
            <p className="text-warm-gold font-serif font-bold text-xl">
              {pack.available ? formatPrice(pack.price, 'en') : t('outOfStock')}
            </p>
          </div>
        </div>
      </Link>
    )
  }

  // Default variant — full card
  return (
    <div className="card-premium group">
      {/* Image with hover zoom */}
      <div className="relative img-hover-zoom aspect-[4/3] bg-gradient-to-br from-honey/40 to-warm-gold/30">
        {pack.badge && (
          <div className="absolute top-4 right-4 bg-dark-brown/90 backdrop-blur-sm text-cream px-4 py-1.5 rounded-pill text-[11px] font-sans font-semibold tracking-wider uppercase z-10">
            {badgeLabels[pack.badge] || pack.badge}
          </div>
        )}
        <div className="h-full flex items-center justify-center">
          <span className="text-earth-brown/30 text-sm font-sans font-medium">{pack.name}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="mb-2 text-lg font-serif font-semibold text-dark-brown">
          {pack.name}
        </h3>
        <p className="mb-4 text-sm text-text-secondary leading-relaxed">
          {pack.description}
        </p>

        {/* Flavors */}
        <div className="mb-5">
          <p className="text-[11px] font-sans font-semibold text-earth-brown mb-2.5 uppercase tracking-wider">
            {t('flavors')}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {pack.flavors.map((flavor) => (
              <span
                key={flavor.id}
                className="text-xs font-sans bg-cream text-earth-brown px-3 py-1 rounded-pill"
              >
                {flavor.name}
              </span>
            ))}
          </div>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between pt-4 border-t border-border-light">
          <p className="text-warm-gold font-serif font-bold text-xl">
            {pack.available ? formatPrice(pack.price, 'en') : t('outOfStock')}
          </p>
          {pack.available && onAddToCart && (
            <AddToCartButton pack={pack} onAddToCart={onAddToCart} />
          )}
        </div>
      </div>
    </div>
  )
}
