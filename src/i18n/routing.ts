import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'pt', 'es'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Always include locale in URL
  localePrefix: 'always',
})

// Locale-aware navigation utilities
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)

