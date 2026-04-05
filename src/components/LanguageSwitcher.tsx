'use client'

import { useRouter, usePathname } from 'next/navigation'


export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (locale: string) => {
    // Remove current locale prefix and add new one
    const pathWithoutLocale = pathname.replace(/^\/(en|pt|es)/, '')
    const newPath = `/${locale}${pathWithoutLocale || ''}`
    router.push(newPath)
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleLanguageChange('en')}
        className="px-3 py-2 rounded-sm text-sm font-medium hover:bg-honey transition-colors"
        title="English"
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange('pt')}
        className="px-3 py-2 rounded-sm text-sm font-medium hover:bg-honey transition-colors"
        title="Português"
      >
        PT
      </button>
      <button
        onClick={() => handleLanguageChange('es')}
        className="px-3 py-2 rounded-sm text-sm font-medium hover:bg-honey transition-colors"
        title="Español"
      >
        ES
      </button>
    </div>
  )
}
