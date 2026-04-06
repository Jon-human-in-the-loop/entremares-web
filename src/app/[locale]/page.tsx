import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { GIFT_PACKS } from '@/lib/constants'
import GiftPackCard from '@/components/GiftPackCard'

export default function Home() {
  const t = useTranslations('hero')
  const packsT = useTranslations('packs')
  const brandT = useTranslations('brand')

  return (
    <>
      <main className="w-full">
        {/* Hero Section — Full-width, breathable */}
        <section className="w-full px-6 section-breathe bg-warm-white">
          <div className="mx-auto max-w-5xl text-center">
            <div className="animate-fade-in-up">
              <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-warm-gold mb-6">
                {t('subtitle')}
              </p>
              <h1 className="mb-8 text-5xl md:text-6xl lg:text-8xl font-serif font-bold text-dark-brown leading-[1.05] tracking-tight">
                {t('title')}
              </h1>
            </div>
            <div className="animate-fade-in-up-delay-1">
              <p className="mb-10 text-base md:text-lg text-text-secondary font-sans font-light leading-relaxed max-w-2xl mx-auto">
                {t('description')}
              </p>
            </div>
            <div className="animate-fade-in-up-delay-2 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/gift-packs" className="btn-pill btn-primary text-sm">
                {t('exploreButton')}
              </Link>
              <Link href="/about" className="btn-pill btn-outline text-sm">
                {t('storyButton')}
              </Link>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-24 mx-auto border-t border-honey" />

        {/* Featured Gift Packs */}
        <section className="w-full px-6 section-breathe bg-cream/50">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-warm-gold mb-4">
                {packsT('featured')}
              </p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-dark-brown">
                {packsT('featured')}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {GIFT_PACKS.map((pack, index) => (
                <div
                  key={pack.id}
                  className={`animate-fade-in-up-delay-${Math.min(index + 1, 3)}`}
                >
                  <GiftPackCard pack={pack} variant="compact" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brand Story Section */}
        <section className="w-full px-6 section-breathe bg-warm-white">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-warm-gold mb-4">
              {brandT('heritage')}
            </p>
            <h2 className="mb-10 text-4xl md:text-5xl font-serif font-bold text-dark-brown">
              {brandT('heritage')}
            </h2>
            <p className="mb-8 text-base md:text-lg text-text-secondary font-sans font-light leading-[1.8]">
              {brandT('story')}
            </p>
            <p className="text-base md:text-lg text-text-secondary font-sans font-light leading-[1.8]">
              {brandT('craftsmanship')}
            </p>
            <div className="mt-10">
              <Link href="/about" className="btn-pill btn-outline text-sm">
                {brandT('heritage')} →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
