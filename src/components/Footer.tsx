import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default async function Footer() {
  const t = useTranslations('footer')
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-dark-brown text-cream py-12 px-4 mt-16">
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Info */}
          <div>
            <h3 className="mb-4 text-lg font-serif font-bold">{t('brand')}</h3>
            <p className="text-sm text-honey">{t('tagline')}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-serif font-bold">{t('quickLinks')}</h3>
            <ul className="text-sm space-y-2">
              <li>
                <Link href="/" className="hover:text-warm-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/gift-packs" className="hover:text-warm-gold transition-colors">
                  Gift Packs
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-warm-gold transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-serif font-bold">{t('contact')}</h3>
            <p className="text-sm">{t('email')}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-honey pt-8 text-center text-sm text-honey">
          <p>
            © {currentYear} {t('brand')}. {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}
