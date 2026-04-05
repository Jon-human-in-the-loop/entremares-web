'use client'

import { useTranslations } from 'next-intl'
import { useCart } from '@/context/CartContext'
import type { GiftPack } from '@/types'

interface AddToCartButtonProps {
  pack: GiftPack
  onAddToCart?: (pack: GiftPack) => void
}

export default function AddToCartButton({ pack, onAddToCart }: AddToCartButtonProps) {
  const t = useTranslations('cart')
  const { addItem } = useCart()

  const handleClick = () => {
    addItem(pack)
    onAddToCart?.(pack)
  }

  return (
    <button
      onClick={handleClick}
      disabled={!pack.available}
      className="px-4 py-2 bg-earth-brown text-cream rounded-sm font-semibold hover:bg-dark-brown transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {t('addToCart')}
    </button>
  )
}
