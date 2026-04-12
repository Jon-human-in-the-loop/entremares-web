'use client'

import { ShoppingBag } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { useCart } from '@/context/CartContext'

export default function CartIndicator() {
  const { totalItems } = useCart()

  return (
    <Link href="/cart" className="relative group">
      <div className="p-2.5 rounded-lg hover:bg-cream transition-all duration-300 group-hover:scale-105">
        <ShoppingBag size={20} className="text-dark-brown" strokeWidth={1.5} />
        {totalItems > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-warm-gold text-dark-brown rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-sans font-bold shadow-sm animate-fade-in-up">
            {totalItems}
          </span>
        )}
      </div>
    </Link>
  )
}
