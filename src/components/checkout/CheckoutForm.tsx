'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { useRouter } from '@/i18n/routing'
import { Loader2, CheckCircle, ShieldCheck } from 'lucide-react'

export default function CheckoutForm() {
  const t = useTranslations('checkout')
  const cartT = useTranslations('cart')
  const tData = useTranslations('packsData')
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
      <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in-up">
        <div className="w-20 h-20 bg-sage/15 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={40} className="text-sage" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-dark-brown mb-3">
          {t('orderConfirmed')}
        </h2>
        <p className="text-sm text-text-muted font-sans mb-2">{t('orderConfirmedDescription')}</p>
        <p className="text-earth-brown font-serif font-semibold text-lg mb-10">
          Order #{orderId}
        </p>
        <button
          onClick={() => router.push('/')}
          className="btn-pill btn-primary text-sm"
        >
          {t('backToHome')}
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-fade-in-up">
      {/* Shipping Form */}
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-serif font-bold text-dark-brown mb-8">
          {t('shippingDetails')}
        </h2>

        {status === 'error' && errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-sans text-sm">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-sans font-semibold text-dark-brown mb-2 uppercase tracking-wider">
              {t('name')} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-5 py-3.5 bg-warm-white border border-border rounded-lg font-sans text-sm text-dark-brown placeholder:text-text-muted transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-semibold text-dark-brown mb-2 uppercase tracking-wider">
              {t('email')} *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-5 py-3.5 bg-warm-white border border-border rounded-lg font-sans text-sm text-dark-brown placeholder:text-text-muted transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-semibold text-dark-brown mb-2 uppercase tracking-wider">
              {t('phone')} *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-5 py-3.5 bg-warm-white border border-border rounded-lg font-sans text-sm text-dark-brown placeholder:text-text-muted transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-semibold text-dark-brown mb-2 uppercase tracking-wider">
              {t('address')} *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-5 py-3.5 bg-warm-white border border-border rounded-lg font-sans text-sm text-dark-brown placeholder:text-text-muted transition-all duration-300"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans font-semibold text-dark-brown mb-2 uppercase tracking-wider">
                {t('city')} *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-5 py-3.5 bg-warm-white border border-border rounded-lg font-sans text-sm text-dark-brown placeholder:text-text-muted transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-xs font-sans font-semibold text-dark-brown mb-2 uppercase tracking-wider">
                {t('postalCode')} *
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
                className="w-full px-5 py-3.5 bg-warm-white border border-border rounded-lg font-sans text-sm text-dark-brown placeholder:text-text-muted transition-all duration-300"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={status === 'submitting' || items.length === 0}
              className="w-full btn-pill btn-primary text-sm flex items-center justify-center gap-2 !py-4 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {t('processing')}
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  {t('placeOrder')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Order Summary Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl border border-border-light p-7 sticky top-32">
          <h3 className="text-sm font-sans font-semibold text-dark-brown mb-6 uppercase tracking-wider">
            {t('orderSummary')}
          </h3>
          <div className="space-y-4">
            {items.map((item) => {
              const packName = tData.has(`${item.pack.id}.name`) ? tData(`${item.pack.id}.name`) : item.pack.name
              return (
                <div key={item.pack.id} className="flex justify-between text-sm">
                  <div>
                    <span className="text-dark-brown font-sans font-medium text-sm">{packName}</span>
                    <span className="text-text-muted ml-1.5">×{item.quantity}</span>
                  </div>
                  <span className="text-earth-brown font-sans font-medium">
                    {formatPrice(item.pack.price * item.quantity)}
                  </span>
                </div>
              )
            })}
          </div>
          <hr className="my-5 border-border-light" />
          <div className="flex justify-between items-center">
            <span className="font-serif font-bold text-dark-brown">{cartT('total')}</span>
            <span className="text-xl font-serif font-bold text-warm-gold">{formatPrice(totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
