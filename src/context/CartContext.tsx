'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import type { CartItem, CartState, GiftPack } from '@/types'

const STORAGE_KEY = 'entremares-cart'

type CartAction =
  | { type: 'ADD_ITEM'; pack: GiftPack }
  | { type: 'REMOVE_ITEM'; packId: string }
  | { type: 'INCREMENT'; packId: string }
  | { type: 'DECREMENT'; packId: string }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; items: CartItem[] }

type CartContextValue = CartState & {
  addItem: (pack: GiftPack) => void
  removeItem: (packId: string) => void
  increment: (packId: string) => void
  decrement: (packId: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find((item) => item.pack.id === action.pack.id)
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.pack.id === action.pack.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { pack: action.pack, quantity: 1 }],
      }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.pack.id !== action.packId),
      }
    case 'INCREMENT': {
      return {
        ...state,
        items: state.items.map((item) =>
          item.pack.id === action.packId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      }
    }
    case 'DECREMENT': {
      const item = state.items.find((item) => item.pack.id === action.packId)
      if (!item || item.quantity <= 1) {
        return {
          ...state,
          items: state.items.filter((item) => item.pack.id !== action.packId),
        }
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.pack.id === action.packId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      }
    }
    case 'CLEAR':
      return { items: [], totalItems: 0, totalPrice: 0 }
    case 'HYDRATE':
      return { ...state, items: action.items }
    default:
      return state
  }
}

function computeTotals(items: CartItem[]): { totalItems: number; totalPrice: number } {
  return items.reduce(
    (acc, item) => ({
      totalItems: acc.totalItems + item.quantity,
      totalPrice: acc.totalPrice + item.pack.price * item.quantity,
    }),
    { totalItems: 0, totalPrice: 0 }
  )
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalPrice: 0,
  })

  // Hydrate cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          dispatch({ type: 'HYDRATE', items: parsed })
        }
      }
    } catch {
      // Ignore corrupted localStorage
    }
  }, [])

  // Sync cart to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
    } catch {
      // Ignore write errors
    }
  }, [state.items])

  const totals = computeTotals(state.items)

  const value: CartContextValue = {
    items: state.items,
    totalItems: totals.totalItems,
    totalPrice: totals.totalPrice,
    addItem: (pack) => dispatch({ type: 'ADD_ITEM', pack }),
    removeItem: (packId) => dispatch({ type: 'REMOVE_ITEM', packId }),
    increment: (packId) => dispatch({ type: 'INCREMENT', packId }),
    decrement: (packId) => dispatch({ type: 'DECREMENT', packId }),
    clear: () => dispatch({ type: 'CLEAR' }),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
