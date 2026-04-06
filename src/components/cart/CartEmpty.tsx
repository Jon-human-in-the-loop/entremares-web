'use client'

import { useTranslations } from 'next-intl'
import { ShoppingBag } from 'lucide-react'
import { Link } from '@/i18n/routing'

export default function CartEmpty() {
  const t = useTranslations('cart')
  const navT = useTranslations('nav')

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-24 h-24 bg-cream rounded-full flex items-center justify-center mb-8">
        <ShoppingBag size={40} className="text-earth-brown/40" />
      </div>
      <h2 className="text-2xl font-serif font-bold text-dark-brown mb-3">
        {t('cartEmpty')}
      </h2>
      <p className="text-gray-500 mb-8 text-center max-w-sm">
        {t('emptyDescription')}
      </p>
      <Link
        href="/gift-packs"
        className="px-8 py-3 bg-earth-brown text-cream font-semibold rounded-sm hover:bg-dark-brown transition-colors"
      >
        {navT('giftPacks')}
      </Link>
    </div>
  )
}
