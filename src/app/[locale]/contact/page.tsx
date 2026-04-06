'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'

export default function ContactPage() {
  const t = useTranslations()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.errors) {
          setErrorMessage(data.errors.map((e: any) => e.message).join(', '))
        } else {
          setErrorMessage(data.error || t('form.error'))
        }
        setStatus('error')
        return
      }

      setStatus('success')
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch {
      setErrorMessage(t('form.error'))
      setStatus('error')
    }
  }

  return (
    <div className="py-12 px-4">
      {/* Hero */}
      <section className="w-full px-4 py-16 md:py-24 bg-gradient-to-r from-honey to-warm-gold">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-dark-brown mb-4">
            {t('pages.contactTitle')}
          </h1>
          <p className="text-lg text-earth-brown">
            {t('pages.contactDescription')}
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="w-full px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          {status === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-sm">
              <p className="text-green-700 font-semibold">{t('form.success')}</p>
            </div>
          )}

          {status === 'error' && errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm">
              <p className="text-red-600 text-sm">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-dark-brown mb-2">
                {t('form.name')}
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
                {t('form.email')}
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

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-dark-brown mb-2">
                {t('form.message')}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-warm-gold focus:ring-1 focus:ring-warm-gold resize-none transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full px-8 py-3 bg-earth-brown text-cream font-semibold rounded-sm hover:bg-dark-brown transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {t('form.sending')}
                </>
              ) : (
                t('form.send')
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
