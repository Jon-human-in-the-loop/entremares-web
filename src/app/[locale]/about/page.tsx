import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { unstable_setRequestLocale } from 'next-intl/server'

export function generateMetadata() {
  return {
    title: 'Our Story | Entremares',
    description: 'Learn about Entremares heritage and handcrafted quality.',
  }
}

export default function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale)
  const t = useTranslations('aboutPage')

  return (
    <div className="py-12 px-4">
      {/* Hero Banner */}
      <section className="relative w-full px-4 py-32 md:py-48 overflow-hidden">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/about-hero.jpg" 
            alt="Nuestra Historia - Entremares" 
            fill 
            className="object-cover"
            priority
          />
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-dark-brown/60"></div>
        </div>

        <div className="relative mx-auto max-w-4xl text-center animate-fade-in-up z-10 px-4">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-cream mb-4 drop-shadow-lg">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl text-cream font-sans drop-shadow-lg font-medium max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="w-full px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl space-y-16">
          <div className="animate-fade-in-up-delay-1">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark-brown mb-6">
              {t('mission.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg font-sans font-light">
              {t('mission.description')}
            </p>
          </div>

          <div className="animate-fade-in-up-delay-2">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark-brown mb-6">
              {t('excellence.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg font-sans font-light">
              {t('excellence.description')}
            </p>
          </div>

          <div className="animate-fade-in-up-delay-3">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark-brown mb-6">
              {t('values.title')}
            </h2>
            <ul className="space-y-6 text-gray-700 font-sans font-light">
              <li className="flex gap-4 items-start">
                <span className="text-warm-gold text-2xl leading-none mt-1">•</span>
                <div>
                  <strong className="text-dark-brown font-semibold">{t('values.authenticity.title')}:</strong> {t('values.authenticity.desc')}
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <span className="text-warm-gold text-2xl leading-none mt-1">•</span>
                <div>
                  <strong className="text-dark-brown font-semibold">{t('values.quality.title')}:</strong> {t('values.quality.desc')}
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <span className="text-warm-gold text-2xl leading-none mt-1">•</span>
                <div>
                  <strong className="text-dark-brown font-semibold">{t('values.craftsmanship.title')}:</strong> {t('values.craftsmanship.desc')}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
