'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/i18n/routing'
import { useCart } from '@/context/CartContext'
import { CheckCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function CheckoutSuccessPage({ searchParams }: { searchParams: { session_id?: string; order_id?: string } }) {
  const router = useRouter()
  const { clear } = useCart()
  const t = useTranslations('checkout')
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    if (!cleared) {
      clear()
      setCleared(true)
    }
  }, [clear, cleared])

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 min-h-[60vh] animate-fade-in-up">
      <div className="w-24 h-24 bg-sage/15 rounded-full flex items-center justify-center mb-6">
        <CheckCircle size={48} className="text-sage" />
      </div>
      <h1 className="text-4xl font-serif font-bold text-dark-brown mb-4 text-center">
        Pago Exitoso
      </h1>
      <p className="text-lg text-text-muted font-sans mb-4 text-center max-w-md">
        Su pago con tarjeta se ha procesado de manera segura. Le hemos enviado un correo electrónico de confirmación con los detalles del pedido.
      </p>
      
      {searchParams.order_id && (
        <p className="text-earth-brown font-serif border border-border-light bg-cream/30 py-3 px-6 rounded-lg font-semibold text-xl mb-10">
          Orden #{searchParams.order_id}
        </p>
      )}

      <button
        onClick={() => router.push('/')}
        className="btn-pill btn-primary text-sm px-8"
      >
        {t('backToHome')}
      </button>
    </div>
  )
}
