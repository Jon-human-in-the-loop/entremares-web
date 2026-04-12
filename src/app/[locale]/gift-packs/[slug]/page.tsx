import Image from 'next/image'
import { notFound } from 'next/navigation'
import { GIFT_PACKS } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import AddToCartButton from '@/components/cart/AddToCartButton'
import type { Metadata } from 'next'
import { Link } from '@/i18n/routing'

interface DetailPageProps {
  params: { slug: string; locale: string }
}

export function generateStaticParams() {
  return GIFT_PACKS.map((pack) => ({
    slug: pack.slug,
  }))
}

export async function generateMetadata({ params: { locale, slug } }: DetailPageProps): Promise<Metadata> {
  const pack = GIFT_PACKS.find((p) => p.slug === slug)
  if (!pack) return { title: 'Not Found' }

  const tData = await getTranslations({ locale, namespace: 'packsData' })
  const packName = tData.has(`${pack.id}.name`) ? tData(`${pack.id}.name`) : pack.name
  const packDesc = tData.has(`${pack.id}.description`) ? tData(`${pack.id}.description`) : pack.description

  return {
    title: `${packName} | Entremares`,
    description: packDesc,
  }
}

export default function DetailPage({ params: { locale, slug } }: DetailPageProps) {
  unstable_setRequestLocale(locale)
  const t = useTranslations()
  const tData = useTranslations('packsData')
  const tFlavors = useTranslations('packFlavors')
  const pack = GIFT_PACKS.find((p) => p.slug === slug)

  if (!pack) {
    notFound()
  }

  const badgeLabels: Record<string, string> = {
    mostPopular: t('packDetails.mostPopular'),
    limitedEdition: t('packDetails.limitedEdition'),
  }

  const packName = tData.has(`${pack.id}.name`) ? tData(`${pack.id}.name`) : pack.name
  const packLongDesc = tData.has(`${pack.id}.longDescription`) ? tData(`${pack.id}.longDescription`) : pack.longDescription

  return (
    <div className="py-12 px-4">
      {/* Breadcrumb */}
      <section className="w-full px-4 py-4 border-b border-border-light">
        <div className="mx-auto max-w-4xl text-sm text-text-muted font-sans uppercase tracking-wider text-[11px] font-semibold">
          <Link href="/" className="hover:text-earth-brown transition-colors">{t('nav.home')}</Link>
          <span className="mx-2 text-border">/</span>
          <Link href="/gift-packs" className="hover:text-earth-brown transition-colors">{t('nav.giftPacks')}</Link>
          <span className="mx-2 text-border">/</span>
          <span className="text-earth-brown">{packName}</span>
        </div>
      </section>

      {/* Detail Content */}
      <section className="w-full px-4 py-16 md:py-24 animate-fade-in-up">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            {/* Image */}
            <div>
              <div className="relative aspect-square md:aspect-auto md:h-[600px] bg-gradient-to-br from-honey/40 to-warm-gold/30 rounded-xl overflow-hidden shadow-premium">
                {pack.image ? (
                  <Image src={pack.image} alt={packName} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
                ) : (
                  <div className="h-full flex items-center justify-center text-earth-brown/40 font-serif text-3xl font-bold">
                    {packName}
                  </div>
                )}
                {pack.badge && (
                  <div className="absolute top-6 right-6 bg-dark-brown text-cream px-5 py-2 rounded-pill font-sans text-xs font-semibold tracking-wider uppercase z-10">
                    {badgeLabels[pack.badge] || pack.badge}
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-8 flex flex-col justify-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-dark-brown mb-4">
                  {packName}
                </h1>
                <p className="text-text-muted font-sans text-sm tracking-widest uppercase mb-1">
                  {pack.pieces} {t('packDetails.pieces')}
                </p>
                <div className="w-12 h-0.5 bg-warm-gold mt-6 mb-6"></div>
              </div>

              <div className="pb-4">
                <p className="text-3xl font-serif font-bold text-warm-gold">
                  {formatPrice(pack.price, 'en')}
                </p>
              </div>

              <p className="text-text-secondary leading-relaxed font-sans font-light text-lg">
                {packLongDesc}
              </p>

              {/* Flavors */}
              <div className="pt-4 border-t border-border-light">
                <h3 className="font-sans font-semibold text-dark-brown mb-5 uppercase text-xs tracking-widest">
                  {t('packDetails.flavors')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pack.flavors.map((flavor) => (
                    <div key={flavor.id} className="bg-cream/40 px-4 py-3 border border-border-light rounded-lg">
                      <p className="font-sans font-semibold text-earth-brown text-sm">
                        {tFlavors.has(flavor.id) ? tFlavors(flavor.id) : flavor.name}
                        {flavor.isSignature && (
                          <span className="text-[10px] text-warm-gold ml-2 uppercase tracking-wide">★ Signature</span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="pt-6 border-t border-border-light space-y-3 font-sans text-sm">
                <p className="text-text-secondary">
                  <strong className="text-dark-brown font-semibold uppercase tracking-wider text-[11px] mr-2">{t('packDetails.weight')}:</strong>{' '}
                  <span className="font-light">{pack.weight}</span>
                </p>
                <p className="text-text-secondary leading-relaxed">
                  <strong className="text-dark-brown font-semibold uppercase tracking-wider text-[11px] mr-2">{t('packDetails.ingredients')}:</strong>{' '}
                  <span className="font-light">{pack.ingredients}</span>
                </p>
              </div>

              {/* Add to Cart Button */}
              <div className="pt-6">
                {pack.available && (
                  <AddToCartButton pack={pack} />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
