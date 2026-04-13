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
    <div className="pb-12">
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
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-cream drop-shadow-lg">
            {t('title')}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="w-full px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl space-y-12 text-center animate-fade-in-up-delay-1">
          <p className="text-earth-brown leading-relaxed text-xl md:text-2xl font-serif whitespace-pre-line">
            {t('content.p1')}
          </p>
          <div className="w-12 h-px bg-warm-gold mx-auto"></div>
          <p className="text-gray-700 leading-relaxed text-lg font-sans font-light whitespace-pre-line">
            {t('content.p2')}
          </p>
          <p className="text-gray-700 leading-relaxed text-lg font-sans font-light whitespace-pre-line">
            {t('content.p3')}
          </p>
        </div>
      </section>
    </div>
  )
}
