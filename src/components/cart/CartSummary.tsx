'use client'

import { useTranslations } from 'next-intl'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { Minus, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function CartSummary() {
  const t = useTranslations('cart')
  const { items, totalPrice, increment, decrement, removeItem } = useCart()

  return (
    <div className="w-full">
      {/* Items table */}
      <div className="bg-warm-white rounded-sm shadow-md overflow-hidden">
        {/* Header - desktop */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-cream text-sm font-semibold text-dark-brown uppercase tracking-wide">
          <div className="col-span-5">{t('product')}</div>
          <div className="col-span-2 text-center">{t('price')}</div>
          <div className="col-span-3 text-center">{t('quantity')}</div>
          <div className="col-span-2 text-right">{t('subtotal')}</div>
        </div>

        {/* Items */}
        {items.map((item) => (
          <div
            key={item.pack.id}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-6 py-5 border-b border-gray-100 last:border-b-0"
          >
            {/* Product info */}
            <div className="md:col-span-5 flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-b from-honey to-warm-gold rounded-sm flex-shrink-0 flex items-center justify-center">
                <span className="text-xs text-gray-400 text-center leading-tight">{item.pack.name}</span>
              </div>
              <div>
                <Link href={`/gift-packs/${item.pack.slug}`} className="font-serif font-bold text-dark-brown hover:text-earth-brown transition-colors">
                  {item.pack.name}
                </Link>
                <p className="text-xs text-gray-500 mt-1">{item.pack.pieces} {t('pieces')}</p>
              </div>
            </div>

            {/* Price */}
            <div className="md:col-span-2 text-center">
              <span className="md:hidden text-sm text-gray-500 mr-2">{t('price')}:</span>
              <span className="text-earth-brown font-medium">{formatPrice(item.pack.price)}</span>
            </div>

            {/* Quantity controls */}
            <div className="md:col-span-3 flex items-center justify-center gap-3">
              <button
                onClick={() => decrement(item.pack.id)}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-sm hover:bg-cream transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center font-semibold text-dark-brown">{item.quantity}</span>
              <button
                onClick={() => increment(item.pack.id)}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-sm hover:bg-cream transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
              <button
                onClick={() => removeItem(item.pack.id)}
                className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors ml-2"
                aria-label="Remove item"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Subtotal */}
            <div className="md:col-span-2 text-right">
              <span className="md:hidden text-sm text-gray-500 mr-2">{t('subtotal')}:</span>
              <span className="font-semibold text-warm-gold text-lg">
                {formatPrice(item.pack.price * item.quantity)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-6 bg-warm-white rounded-sm shadow-md px-6 py-6">
        <div className="flex items-center justify-between">
          <span className="text-xl font-serif font-bold text-dark-brown">{t('total')}</span>
          <span className="text-2xl font-bold text-warm-gold">{formatPrice(totalPrice)}</span>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-end">
          <Link
            href="/gift-packs"
            className="px-6 py-3 border-2 border-earth-brown text-earth-brown font-semibold rounded-sm hover:bg-honey transition-colors text-center"
          >
            {t('continueShopping')}
          </Link>
          <Link
            href="/checkout"
            className="px-8 py-3 bg-earth-brown text-cream font-semibold rounded-sm hover:bg-dark-brown transition-colors text-center"
          >
            {t('checkout')}
          </Link>
        </div>
      </div>
    </div>
  )
}
