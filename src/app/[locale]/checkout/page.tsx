'use client'

import { useTranslations } from 'next-intl'
import { useCart } from '@/context/CartContext'
import CheckoutForm from '@/components/checkout/CheckoutForm'
import CartEmpty from '@/components/cart/CartEmpty'

export default function CheckoutPage() {
  const t = useTranslations('checkout')
  const { items } = useCart()

  return (
    <div>
      {/* Hero */}
      <section className="w-full px-6 py-16 md:py-20 bg-cream/50">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-warm-gold mb-4">
            Secure Checkout
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-dark-brown">
            {t('title')}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="w-full px-6 section-breathe">
        <div className="mx-auto max-w-5xl">
          {items.length === 0 ? <CartEmpty /> : <CheckoutForm />}
        </div>
      </section>
    </div>
  )
}
