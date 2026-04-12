'use client'

import Image from 'next/image'
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
  const tData = useTranslations('packsData')
  const tFlavors = useTranslations('packFlavors')

  const badgeLabels: Record<string, string> = {
    mostPopular: t('mostPopular'),
    limitedEdition: t('limitedEdition'),
  }

  // Get translated content based on ID, fallback to DB content
  const packName = tData.has(`${pack.id}.name`) ? tData(`${pack.id}.name`) : pack.name
  const packDescription = tData.has(`${pack.id}.description`) ? tData(`${pack.id}.description`) : pack.description

  if (variant === 'compact') {
    return (
      <Link href={`/gift-packs/${pack.slug}`}>
        <div className="card-premium group cursor-pointer h-full flex flex-col">
          {/* Image with hover zoom */}
          <div className="relative img-hover-zoom aspect-[4/3] bg-gradient-to-br from-honey/40 to-warm-gold/30 shrink-0 overflow-hidden">
            {pack.image ? (
              <Image src={pack.image} alt={packName} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
            ) : (
              <div className="h-full flex items-center justify-center">
                <span className="text-earth-brown/30 text-sm font-sans font-medium px-4 text-center">{packName}</span>
              </div>
            )}
            {pack.badge && (
              <div className="absolute top-4 right-4 bg-dark-brown/90 backdrop-blur-sm text-cream px-4 py-1.5 rounded-pill text-[11px] font-sans font-semibold tracking-wider uppercase z-10">
                {badgeLabels[pack.badge] || pack.badge}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-6 flex flex-col flex-grow">
            <h3 className="mb-2 text-lg font-serif font-semibold text-dark-brown group-hover:text-earth-brown transition-colors">
              {packName}
            </h3>
            <p className="mb-4 text-sm text-text-secondary leading-relaxed line-clamp-2">
              {packDescription}
            </p>

            {/* Price */}
            <div className="mt-auto">
              <p className="text-warm-gold font-serif font-bold text-xl">
                {pack.available ? formatPrice(pack.price, 'en') : t('outOfStock')}
              </p>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Default variant — full card
  return (
    <div className="card-premium group h-full flex flex-col">
      {/* Image with hover zoom */}
      <Link href={`/gift-packs/${pack.slug}`} className="block relative img-hover-zoom aspect-[4/3] bg-gradient-to-br from-honey/40 to-warm-gold/30 shrink-0 overflow-hidden">
        {pack.image ? (
          <Image src={pack.image} alt={packName} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        ) : (
          <div className="h-full flex items-center justify-center">
            <span className="text-earth-brown/30 text-sm font-sans font-medium px-4 text-center">{packName}</span>
          </div>
        )}
        {pack.badge && (
          <div className="absolute top-4 right-4 bg-dark-brown/90 backdrop-blur-sm text-cream px-4 py-1.5 rounded-pill text-[11px] font-sans font-semibold tracking-wider uppercase z-10">
            {badgeLabels[pack.badge] || pack.badge}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <Link href={`/gift-packs/${pack.slug}`} className="block">
          <h3 className="mb-2 text-lg font-serif font-semibold text-dark-brown group-hover:text-earth-brown transition-colors">
            {packName}
          </h3>
          <p className="mb-4 text-sm text-text-secondary leading-relaxed">
            {packDescription}
          </p>
        </Link>

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
                {tFlavors.has(flavor.id) ? tFlavors(flavor.id) : flavor.name}
              </span>
            ))}
          </div>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between pt-4 border-t border-border-light mt-auto">
          <p className="text-warm-gold font-serif font-bold text-xl">
            {pack.available ? formatPrice(pack.price, 'en') : t('outOfStock')}
          </p>
          {pack.available && (
            <AddToCartButton pack={pack} onAddToCart={onAddToCart} />
          )}
        </div>
      </div>
    </div>
  )
}
