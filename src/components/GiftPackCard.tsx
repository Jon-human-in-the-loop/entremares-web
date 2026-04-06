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
        <div className="bg-warm-white p-6 rounded-sm shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          {/* Image Placeholder with Badge */}
          <div className="relative mb-4 h-48 bg-gradient-to-b from-honey to-warm-gold rounded-sm overflow-hidden">
            {pack.badge && (
              <div className="absolute top-3 right-3 bg-earth-brown text-cream px-3 py-1 rounded-sm text-xs font-bold">
                {badgeLabels[pack.badge] || pack.badge}
              </div>
            )}
            <div className="h-full flex items-center justify-center text-gray-300 text-sm">
              {pack.name}
            </div>
          </div>

          {/* Info */}
          <h3 className="mb-2 text-xl font-serif font-bold text-dark-brown">
            {pack.name}
          </h3>
          <p className="mb-4 text-gray-700 text-sm leading-relaxed">{pack.description}</p>

          {/* Price */}
          <p className="text-warm-gold font-semibold text-lg">
            {pack.available ? formatPrice(pack.price, 'en') : t('outOfStock')}
          </p>
        </div>
      </Link>
    )
  }

  // Default variant
  return (
    <div className="bg-warm-white p-6 rounded-sm shadow-md hover:shadow-lg transition-shadow">
      {/* Image Placeholder with Badge */}
      <div className="relative mb-4 h-48 bg-gradient-to-b from-honey to-warm-gold rounded-sm overflow-hidden">
        {pack.badge && (
          <div className="absolute top-3 right-3 bg-earth-brown text-cream px-3 py-1 rounded-sm text-xs font-bold">
            {badgeLabels[pack.badge] || pack.badge}
          </div>
        )}
        <div className="h-full flex items-center justify-center text-gray-300 text-sm">
          {pack.name}
        </div>
      </div>

      {/* Info */}
      <h3 className="mb-2 text-xl font-serif font-bold text-dark-brown">{pack.name}</h3>
      <p className="mb-3 text-gray-700 text-sm leading-relaxed">{pack.description}</p>

      {/* Flavors */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-earth-brown mb-2 uppercase">
          {t('flavors')}
        </p>
        <div className="flex flex-wrap gap-2">
          {pack.flavors.map((flavor) => (
            <span
              key={flavor.id}
              className="text-xs bg-cream text-earth-brown px-2 py-1 rounded-sm"
            >
              {flavor.name}
            </span>
          ))}
        </div>
      </div>

      {/* Price and Button */}
      <div className="flex items-center justify-between">
        <p className="text-warm-gold font-semibold text-lg">
          {pack.available ? formatPrice(pack.price, 'en') : t('outOfStock')}
        </p>
        {pack.available && onAddToCart && (
          <AddToCartButton pack={pack} onAddToCart={onAddToCart} />
        )}
      </div>
    </div>
  )
}
