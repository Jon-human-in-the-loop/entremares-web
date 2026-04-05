'use client'

import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export default function CartIndicator() {
  const { totalItems } = useCart()

  return (
    <Link href="/cart" className="relative">
      <button className="p-2 hover:bg-honey rounded-sm transition-colors">
        <ShoppingBag size={20} className="text-earth-brown" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-earth-brown text-cream rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {totalItems}
          </span>
        )}
      </button>
    </Link>
  )
}
