'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'
import type { CartItem, CartState, GiftPack } from '@/types'

type CartAction =
  | { type: 'ADD_ITEM'; pack: GiftPack }
  | { type: 'REMOVE_ITEM'; packId: string }
  | { type: 'INCREMENT'; packId: string }
  | { type: 'DECREMENT'; packId: string }
  | { type: 'CLEAR' }

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
      const item = state.items.find((item) => item.pack.id === action.packId)
      if (!item) return state
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
