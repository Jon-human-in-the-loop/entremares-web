'use client'

import { useTranslations } from 'next-intl'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Link } from '@/i18n/routing'

export default function CartSummary() {
  const t = useTranslations('cart')
  const tData = useTranslations('packsData')
  const { items, totalPrice, increment, decrement, removeItem } = useCart()

  return (
    <div className="w-full animate-fade-in-up">
      {/* Items */}
      <div className="bg-white rounded-xl border border-border-light overflow-hidden">
        {/* Header — desktop */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-cream/60 text-[11px] font-sans font-semibold text-text-muted uppercase tracking-[0.15em]">
          <div className="col-span-5">{t('product')}</div>
          <div className="col-span-2 text-center">{t('price')}</div>
          <div className="col-span-3 text-center">{t('quantity')}</div>
          <div className="col-span-2 text-right">{t('subtotal')}</div>
        </div>

        {items.map((item) => {
          const packName = tData.has(`${item.pack.id}.name`) ? tData(`${item.pack.id}.name`) : item.pack.name

          return (
            <div
              key={item.pack.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-6 py-6 border-b border-border-light last:border-b-0 group hover:bg-cream/30 transition-colors duration-300"
            >
              {/* Product */}
              <div className="md:col-span-5 flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-honey/30 to-warm-gold/20 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <span className="text-[10px] text-earth-brown/40 font-sans text-center leading-tight">{packName}</span>
                </div>
                <div>
                  <Link href={`/gift-packs/${item.pack.slug}`} className="font-serif font-semibold text-dark-brown hover:text-earth-brown transition-colors text-sm">
                    {packName}
                  </Link>
                  <p className="text-[11px] text-text-muted font-sans mt-0.5">{item.pack.pieces} {t('pieces')}</p>
                </div>
              </div>

              {/* Price */}
              <div className="md:col-span-2 text-center">
                <span className="md:hidden text-[11px] text-text-muted font-sans mr-2">{t('price')}:</span>
                <span className="text-sm text-text-secondary font-sans">{formatPrice(item.pack.price)}</span>
              </div>

              {/* Quantity */}
              <div className="md:col-span-3 flex items-center justify-center gap-2">
                <button
                  onClick={() => decrement(item.pack.id)}
                  className="w-8 h-8 flex items-center justify-center border border-border rounded-lg hover:bg-cream hover:border-honey transition-all duration-200"
                  aria-label="Decrease quantity"
                >
                  <Minus size={13} />
                </button>
                <span className="w-8 text-center font-sans font-semibold text-dark-brown text-sm">{item.quantity}</span>
                <button
                  onClick={() => increment(item.pack.id)}
                  className="w-8 h-8 flex items-center justify-center border border-border rounded-lg hover:bg-cream hover:border-honey transition-all duration-200"
                  aria-label="Increase quantity"
                >
                  <Plus size={13} />
                </button>
                <button
                  onClick={() => removeItem(item.pack.id)}
                  className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 ml-1"
                  aria-label="Remove item"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Subtotal */}
              <div className="md:col-span-2 text-right">
                <span className="md:hidden text-[11px] text-text-muted font-sans mr-2">{t('subtotal')}:</span>
                <span className="font-serif font-bold text-warm-gold text-lg">
                  {formatPrice(item.pack.price * item.quantity)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Total */}
      <div className="mt-8 bg-white rounded-xl border border-border-light px-6 py-7">
        <div className="flex items-center justify-between">
          <span className="text-lg font-serif font-bold text-dark-brown">{t('total')}</span>
          <span className="text-2xl font-serif font-bold text-warm-gold">{formatPrice(totalPrice)}</span>
        </div>
        <div className="mt-7 flex flex-col sm:flex-row gap-4 justify-end">
          <Link href="/gift-packs" className="btn-pill btn-outline text-sm text-center">
            {t('continueShopping')}
          </Link>
          <Link href="/checkout" className="btn-pill btn-primary text-sm text-center">
            {t('checkout')}
          </Link>
        </div>
      </div>
    </div>
  )
}
