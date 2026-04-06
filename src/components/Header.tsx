'use client'

import { usePathname } from '@/i18n/routing'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import CartIndicator from './cart/CartIndicator'
import LanguageSwitcher from './LanguageSwitcher'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const pathname = usePathname()
  const t = useTranslations('nav')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: t('home'), href: '/' as const },
    { label: t('giftPacks'), href: '/gift-packs' as const },
    { label: t('about'), href: '/about' as const },
    { label: t('contact'), href: '/contact' as const },
  ]

  const isActive = (href: string) => {
    return pathname === href || (href !== '/' && pathname.startsWith(href))
  }

  return (
    <header className="sticky top-0 z-50 bg-warm-white/95 backdrop-blur-sm border-b border-honey">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="font-serif font-bold text-2xl text-dark-brown">
          Entremares
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'text-dark-brown border-b-2 border-warm-gold'
                  : 'text-earth-brown hover:text-dark-brown'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Side: Language Switcher + Cart */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <CartIndicator />

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-honey rounded-sm transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X size={20} className="text-earth-brown" />
            ) : (
              <Menu size={20} className="text-earth-brown" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-honey bg-cream">
          <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-dark-brown'
                    : 'text-earth-brown hover:text-dark-brown'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
