import { Link } from '@/i18n/routing'
import { useTranslations, useLocale } from 'next-intl'

export default function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')
  const locale = useLocale()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-dark-brown text-cream/80 mt-0">
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-cream font-serif font-bold text-2xl mb-3 tracking-tight">
              Entremares
            </h3>
            <p className="text-sm text-cream/50 font-sans leading-relaxed max-w-xs">
              {t('tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-cream font-sans font-semibold text-xs uppercase tracking-[0.2em] mb-5">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm font-sans text-cream/60 hover:text-warm-gold transition-colors duration-300">
                  {tNav('home')}
                </Link>
              </li>
              <li>
                <Link href="/gift-packs" className="text-sm font-sans text-cream/60 hover:text-warm-gold transition-colors duration-300">
                  {tNav('giftPacks')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm font-sans text-cream/60 hover:text-warm-gold transition-colors duration-300">
                  {tNav('about')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-cream font-sans font-semibold text-xs uppercase tracking-[0.2em] mb-5">
              {t('contact')}
            </h4>
            <p className="text-sm font-sans text-cream/60">{t('email')}</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cream/10">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center">
          <p className="text-xs font-sans text-cream/30 tracking-wider flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2">
            <span>© {currentYear} {t('brand')}. {t('copyright')}</span>
            <span className="hidden sm:inline opacity-50">|</span>
            <span>
              {locale === 'es' ? 'Desarrollado por' : locale === 'pt' ? 'Desenvolvido por' : 'Developed by'}{' '}
              <a 
                href="https://www.vanguardcrux.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-warm-gold font-medium transition-colors"
                title="Vanguard Crux"
              >
                Vanguard Crux
              </a>.
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
