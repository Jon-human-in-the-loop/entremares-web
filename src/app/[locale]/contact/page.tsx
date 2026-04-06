'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export default function ContactPage() {
  const t = useTranslations()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: Phase 3 - Send email via API endpoint
    setSubmitted(true)
    setFormData({ name: '', email: '', message: '' })
    setTimeout(() => setSubmitted(false), 5000)
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
          {submitted && (
            <div className="mb-6 p-4 bg-cream border-2 border-earth-brown rounded-sm">
              <p className="text-earth-brown font-semibold">{t('form.success')}</p>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-warm-gold"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-warm-gold"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-warm-gold resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-8 py-3 bg-earth-brown text-cream font-semibold rounded-sm hover:bg-dark-brown transition-colors"
            >
              {t('form.send')}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
