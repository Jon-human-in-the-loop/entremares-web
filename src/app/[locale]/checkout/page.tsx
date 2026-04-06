'use client'

import { useTranslations } from 'next-intl'
import { useCart } from '@/context/CartContext'
import CheckoutForm from '@/components/checkout/CheckoutForm'
import CartEmpty from '@/components/cart/CartEmpty'

export default function CheckoutPage() {
  const t = useTranslations('checkout')
  const { items } = useCart()

  if (items.length === 0) {
    return (
      <div className="py-12 px-4">
        <section className="w-full px-4 py-8 md:py-12">
          <div className="mx-auto max-w-4xl">
            <CartEmpty />
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="py-12 px-4">
      <section className="w-full px-4 py-8 md:py-12">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-dark-brown mb-10 text-center">
            {t('title')}
          </h1>
          <CheckoutForm />
        </div>
      </section>
    </div>
  )
}
