import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function formatPrice(cents: number, locale: string = 'en'): string {
  const localeMap: Record<string, string> = {
    en: 'en-IE', // EUR format for Ireland/Europe
    pt: 'pt-PT',
    es: 'es-ES',
  }

  return new Intl.NumberFormat(localeMap[locale] || 'en-IE', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100)
}
