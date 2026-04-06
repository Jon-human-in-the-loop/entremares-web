'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale()

  const handleLanguageChange = (locale: 'en' | 'pt' | 'es') => {
    router.replace(pathname, { locale })
  }

  const locales = [
    { code: 'en' as const, label: 'EN', title: 'English' },
    { code: 'pt' as const, label: 'PT', title: 'Português' },
    { code: 'es' as const, label: 'ES', title: 'Español' },
  ]

  return (
    <div className="flex gap-1">
      {locales.map((loc) => (
        <button
          key={loc.code}
          onClick={() => handleLanguageChange(loc.code)}
          className={`px-3 py-2 rounded-sm text-sm font-medium transition-colors ${
            currentLocale === loc.code
              ? 'bg-earth-brown text-cream'
              : 'hover:bg-honey text-earth-brown'
          }`}
          title={loc.title}
        >
          {loc.label}
        </button>
      ))}
    </div>
  )
}
