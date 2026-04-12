'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Loader2, Send } from 'lucide-react'

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
    <div>
      {/* Hero */}
      <section className="w-full px-6 py-20 md:py-28 bg-cream/50">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-warm-gold mb-4 animate-fade-in-up">
            {t('pages.contact')}
          </p>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-dark-brown mb-6 animate-fade-in-up-delay-1">
            {t('pages.contactTitle')}
          </h1>
          <p className="text-base md:text-lg text-text-secondary font-sans font-light max-w-xl mx-auto animate-fade-in-up-delay-2">
            {t('pages.contactDescription')}
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="w-full px-6 section-breathe">
        <div className="mx-auto max-w-xl">
          {status === 'success' && (
            <div className="mb-8 p-5 bg-sage/10 border border-sage/30 rounded-lg animate-fade-in-up">
              <p className="text-sage font-sans font-semibold text-sm">{t('form.success')}</p>
            </div>
          )}

          {status === 'error' && errorMessage && (
            <div className="mb-8 p-5 bg-red-50 border border-red-200 rounded-lg animate-fade-in-up">
              <p className="text-red-600 font-sans text-sm">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-sans font-semibold text-dark-brown mb-2 uppercase tracking-wider">
                {t('form.name')}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-5 py-3.5 bg-warm-white border border-border rounded-lg font-sans text-sm text-dark-brown placeholder:text-text-muted transition-all duration-300"
                placeholder={t('form.namePlaceholder')}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-sans font-semibold text-dark-brown mb-2 uppercase tracking-wider">
                {t('form.email')}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-5 py-3.5 bg-warm-white border border-border rounded-lg font-sans text-sm text-dark-brown placeholder:text-text-muted transition-all duration-300"
                placeholder={t('form.emailPlaceholder')}
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-sans font-semibold text-dark-brown mb-2 uppercase tracking-wider">
                {t('form.message')}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-5 py-3.5 bg-warm-white border border-border rounded-lg font-sans text-sm text-dark-brown placeholder:text-text-muted resize-none transition-all duration-300"
                placeholder={t('form.messagePlaceholder')}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full btn-pill btn-primary text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {t('form.sending')}
                </>
              ) : (
                <>
                  <Send size={15} />
                  {t('form.send')}
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
