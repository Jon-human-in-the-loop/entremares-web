'use client'

import { useTranslations } from 'next-intl'
import { useCart } from '@/context/CartContext'
import CartSummary from '@/components/cart/CartSummary'
import CartEmpty from '@/components/cart/CartEmpty'

export default function CartPage() {
  const t = useTranslations('cart')
  const { items } = useCart()

  if (items.length === 0) {
    return (
      <div className="py-12 px-4">
        <section className="w-full px-4 py-8 md:py-12">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-dark-brown mb-8 text-center">
              {t('cartTitle')}
            </h1>
            <CartEmpty />
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="py-12 px-4">
      <section className="w-full px-4 py-8 md:py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-dark-brown mb-8 text-center">
            {t('cartTitle')}
          </h1>
          <p className="text-center text-gray-500 mb-10">
            {items.length} {t('items')}
          </p>
          <CartSummary />
        </div>
      </section>
    </div>
  )
}
