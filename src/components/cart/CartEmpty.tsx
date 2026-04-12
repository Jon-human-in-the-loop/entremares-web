'use client'

import { useTranslations } from 'next-intl'
import { ShoppingBag } from 'lucide-react'
import { Link } from '@/i18n/routing'

export default function CartEmpty() {
  const t = useTranslations('cart')
  const navT = useTranslations('nav')

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in-up">
      <div className="w-24 h-24 bg-cream rounded-full flex items-center justify-center mb-8">
        <ShoppingBag size={36} className="text-honey" strokeWidth={1.5} />
      </div>
      <h2 className="text-2xl font-serif font-bold text-dark-brown mb-3">
        {t('cartEmpty')}
      </h2>
      <p className="text-sm text-text-muted font-sans mb-10 text-center max-w-sm leading-relaxed">
        {t('emptyDescription')}
      </p>
      <Link href="/gift-packs" className="btn-pill btn-primary text-sm">
        {navT('giftPacks')}
      </Link>
    </div>
  )
}
