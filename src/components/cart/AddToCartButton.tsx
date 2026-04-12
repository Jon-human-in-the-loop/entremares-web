'use client'

import { useTranslations } from 'next-intl'
import { useCart } from '@/context/CartContext'
import type { GiftPack } from '@/types'
import { ShoppingBag } from 'lucide-react'

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
      className="btn-pill btn-primary flex items-center gap-2 text-sm !py-2.5 !px-5 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
    >
      <ShoppingBag size={15} strokeWidth={2} />
      {t('addToCart')}
    </button>
  )
}
