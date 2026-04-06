'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle } from 'lucide-react'

export default function CheckoutForm() {
  const t = useTranslations('checkout')
  const cartT = useTranslations('cart')
  const { items, totalPrice, clear } = useCart()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [orderId, setOrderId] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/cart/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipping: formData,
          items,
          total: totalPrice,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.errors) {
          setErrorMessage(data.errors.map((e: any) => e.message).join(', '))
        } else {
          setErrorMessage(data.error || 'Something went wrong')
        }
        setStatus('error')
        return
      }

      setOrderId(data.orderId)
      setStatus('success')
      clear()
    } catch {
      setErrorMessage('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-dark-brown mb-3">
          {t('orderConfirmed')}
        </h2>
        <p className="text-gray-600 mb-2">{t('orderConfirmedDescription')}</p>
        <p className="text-earth-brown font-semibold text-lg mb-8">
          Order #{orderId}
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-earth-brown text-cream font-semibold rounded-sm hover:bg-dark-brown transition-colors"
        >
          {t('backToHome')}
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Shipping Form */}
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-serif font-bold text-dark-brown mb-6">
          {t('shippingDetails')}
        </h2>

        {status === 'error' && errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm">
            <p className="text-red-600 text-sm">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-dark-brown mb-2">
              {t('name')} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-warm-gold focus:ring-1 focus:ring-warm-gold transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-dark-brown mb-2">
              {t('email')} *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-warm-gold focus:ring-1 focus:ring-warm-gold transition-colors"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-dark-brown mb-2">
              {t('phone')} *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-warm-gold focus:ring-1 focus:ring-warm-gold transition-colors"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-dark-brown mb-2">
              {t('address')} *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-warm-gold focus:ring-1 focus:ring-warm-gold transition-colors"
            />
          </div>

          {/* City + Postal Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-dark-brown mb-2">
                {t('city')} *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-warm-gold focus:ring-1 focus:ring-warm-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-brown mb-2">
                {t('postalCode')} *
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-warm-gold focus:ring-1 focus:ring-warm-gold transition-colors"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'submitting' || items.length === 0}
            className="w-full px-8 py-4 bg-earth-brown text-cream font-semibold rounded-sm hover:bg-dark-brown transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
          >
            {status === 'submitting' ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                {t('processing')}
              </>
            ) : (
              t('placeOrder')
            )}
          </button>
        </form>
      </div>

      {/* Order Summary Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-cream rounded-sm p-6 sticky top-24">
          <h3 className="text-lg font-serif font-bold text-dark-brown mb-4">
            {t('orderSummary')}
          </h3>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.pack.id} className="flex justify-between text-sm">
                <div>
                  <span className="text-dark-brown font-medium">{item.pack.name}</span>
                  <span className="text-gray-500 ml-1">×{item.quantity}</span>
                </div>
                <span className="text-earth-brown font-medium">
                  {formatPrice(item.pack.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <hr className="my-4 border-honey" />
          <div className="flex justify-between items-center">
            <span className="font-serif font-bold text-dark-brown">{cartT('total')}</span>
            <span className="text-xl font-bold text-warm-gold">{formatPrice(totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
