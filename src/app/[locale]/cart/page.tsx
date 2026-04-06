'use client'

import { useTranslations } from 'next-intl'
import { useCart } from '@/context/CartContext'
import CartSummary from '@/components/cart/CartSummary'
import CartEmpty from '@/components/cart/CartEmpty'

export default function CartPage() {
  const t = useTranslations('cart')
  const { items } = useCart()

  return (
    <div>
      {/* Hero */}
      <section className="w-full px-6 py-16 md:py-20 bg-cream/50">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-warm-gold mb-4">
            Shopping
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-dark-brown">
            {t('cartTitle')}
          </h1>
          {items.length > 0 && (
            <p className="text-sm text-text-muted font-sans mt-3">
              {items.length} {t('items')}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="w-full px-6 section-breathe">
        <div className="mx-auto max-w-4xl">
          {items.length === 0 ? <CartEmpty /> : <CartSummary />}
        </div>
      </section>
    </div>
  )
}
