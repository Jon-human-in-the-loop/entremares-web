import { useTranslations } from 'next-intl'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | Entremares',
  description: 'Learn about Entremares heritage and artisanal craftsmanship.',
}

export default function AboutPage() {
  const t = useTranslations('pages')

  return (
    <div className="py-12 px-4">
      {/* Hero Banner */}
      <section className="w-full px-4 py-16 md:py-24 bg-gradient-to-r from-honey to-warm-gold">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-dark-brown mb-4">
            {t('aboutTitle')}
          </h1>
          <p className="text-lg text-earth-brown">
            Heritage, tradition, and artisanal excellence
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="w-full px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl space-y-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark-brown mb-6">
              Our Mission
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              At Entremares, we believe that every alfajor tells a story. We are committed to preserving
              traditional Argentine recipes while bringing them to the world with pride. Each piece is
              handcrafted with the finest ingredients and unwavering attention to detail.
            </p>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark-brown mb-6">
              Artisanal Excellence
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Our artisans use time-honored techniques passed down through generations. We refuse to
              compromise on quality, which is why we use only the finest butter, pure dulce de leche,
              and premium chocolate in every alfajor we create.
            </p>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark-brown mb-6">
              Our Values
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex gap-4">
                <span className="text-warm-gold text-2xl">•</span>
                <div>
                  <strong>Authenticity:</strong> Honoring traditional recipes and methods
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-warm-gold text-2xl">•</span>
                <div>
                  <strong>Quality:</strong> Using only the finest, most premium ingredients
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-warm-gold text-2xl">•</span>
                <div>
                  <strong>Craftsmanship:</strong> Handcrafted with care and attention to detail
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
