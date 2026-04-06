import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { GIFT_PACKS } from '@/lib/constants'
import GiftPackCard from '@/components/GiftPackCard'

export default function Home() {
  const t = useTranslations('hero')
  const packsT = useTranslations('packs')
  const brandT = useTranslations('brand')

  return (
    <>
      <main className="w-full">
        {/* Hero Section */}
        <section className="w-full px-4 py-16 md:py-24 lg:py-32 bg-warm-white">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-6 text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-dark-brown leading-tight">
              {t('title')}
            </h1>
            <p className="mb-4 text-lg md:text-xl text-earth-brown font-light">
              {t('subtitle')}
            </p>
            <p className="mb-8 text-base md:text-lg text-gray-700 leading-relaxed max-w-2xl">
              {t('description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/gift-packs" className="block text-center px-8 py-3 bg-earth-brown text-cream font-semibold rounded-sm hover:bg-dark-brown transition-colors duration-200">
                {t('exploreButton')}
              </Link>
              <Link href="/about" className="block text-center px-8 py-3 border-2 border-earth-brown text-earth-brown font-semibold rounded-sm hover:bg-honey transition-colors duration-200">
                {t('storyButton')}
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Gift Packs Preview */}
        <section className="w-full px-4 py-16 md:py-24 bg-cream">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-4xl md:text-5xl font-serif font-bold text-dark-brown text-center">
              {packsT('featured')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {GIFT_PACKS.map((pack) => (
                <GiftPackCard key={pack.id} pack={pack} variant="compact" />
              ))}
            </div>
          </div>
        </section>

        {/* Brand Story Section */}
        <section className="w-full px-4 py-16 md:py-24 bg-warm-white">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-4xl md:text-5xl font-serif font-bold text-dark-brown">
              {brandT('heritage')}
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="mb-6 text-gray-700 leading-relaxed">
                {brandT('story')}
              </p>
              <p className="mb-6 text-gray-700 leading-relaxed">
                {brandT('craftsmanship')}
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
