import { notFound } from 'next/navigation'
import { GIFT_PACKS } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import AddToCartButton from '@/components/cart/AddToCartButton'
import type { Metadata } from 'next'

interface DetailPageProps {
  params: { slug: string; locale: string }
}

export function generateStaticParams() {
  return GIFT_PACKS.map((pack) => ({
    slug: pack.slug,
  }))
}

export function generateMetadata({ params }: DetailPageProps): Metadata {
  const pack = GIFT_PACKS.find((p) => p.slug === params.slug)
  if (!pack) return { title: 'Not Found' }

  return {
    title: `${pack.name} | Entremares`,
    description: pack.description,
  }
}

export default function DetailPage({ params }: DetailPageProps) {
  const t = useTranslations()
  const pack = GIFT_PACKS.find((p) => p.slug === params.slug)

  if (!pack) {
    notFound()
  }

  const badgeLabels: Record<string, string> = {
    mostPopular: t('packDetails.mostPopular'),
    limitedEdition: t('packDetails.limitedEdition'),
  }

  return (
    <div className="py-12 px-4">
      {/* Breadcrumb */}
      <section className="w-full px-4 py-4 border-b border-honey">
        <div className="mx-auto max-w-4xl text-sm text-gray-600">
          <a href="/" className="hover:text-earth-brown">Home</a>
          {' / '}
          <a href="/gift-packs" className="hover:text-earth-brown">Gift Packs</a>
          {' / '}
          <span className="text-earth-brown font-semibold">{pack.name}</span>
        </div>
      </section>

      {/* Detail Content */}
      <section className="w-full px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Image */}
            <div>
              <div className="relative h-96 bg-gradient-to-b from-honey to-warm-gold rounded-sm overflow-hidden">
                {pack.badge && (
                  <div className="absolute top-4 right-4 bg-earth-brown text-cream px-4 py-2 rounded-sm font-bold">
                    {badgeLabels[pack.badge] || pack.badge}
                  </div>
                )}
                <div className="h-full flex items-center justify-center text-gray-300">
                  {pack.name}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-dark-brown mb-2">
                  {pack.name}
                </h1>
                <p className="text-earth-brown text-lg">
                  {pack.pieces} {t('packDetails.pieces')}
                </p>
              </div>

              <div className="border-t border-honey pt-6">
                <p className="text-3xl font-bold text-warm-gold">
                  {formatPrice(pack.price, 'en')}
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed text-lg">
                {pack.longDescription}
              </p>

              {/* Flavors */}
              <div>
                <h3 className="font-semibold text-dark-brown mb-3 uppercase text-sm">
                  {t('packDetails.flavors')}
                </h3>
                <div className="space-y-3">
                  {pack.flavors.map((flavor) => (
                    <div key={flavor.id} className="bg-cream p-3 rounded-sm">
                      <p className="font-semibold text-earth-brown">
                        {flavor.name}
                        {flavor.isSignature && (
                          <span className="text-xs text-warm-gold ml-2">★ Signature</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-600">{flavor.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="border-t border-honey pt-6 space-y-2">
                <p>
                  <strong className="text-dark-brown">{t('packDetails.weight')}:</strong>{' '}
                  {pack.weight}
                </p>
                <p>
                  <strong className="text-dark-brown">{t('packDetails.ingredients')}:</strong>{' '}
                  {pack.ingredients}
                </p>
              </div>

              {/* Add to Cart Button */}
              {pack.available && (
                <AddToCartButton pack={pack} />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
