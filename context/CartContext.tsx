'use client'

import React, { createContext, useContext, useReducer, useCallback, useState } from 'react'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  size: string
  color: string
  qty: number
  image: string
  customDesign?: string // base64 or URL
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD'; item: CartItem }
  | { type: 'REMOVE'; id: string }
  | { type: 'UPDATE_QTY'; id: string; qty: number }
  | { type: 'CLEAR' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const key = `${action.item.productId}-${action.item.size}-${action.item.color}`
      const existing = state.items.find(i => `${i.productId}-${i.size}-${i.color}` === key)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            `${i.productId}-${i.size}-${i.color}` === key ? { ...i, qty: i.qty + action.item.qty } : i
          ),
        }
      }
      return { ...state, items: [...state.items, action.item] }
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.id !== action.id) }
    case 'UPDATE_QTY':
      return {
        ...state,
        items: action.qty <= 0
          ? state.items.filter(i => i.id !== action.id)
          : state.items.map(i => i.id === action.id ? { ...i, qty: action.qty } : i),
      }
    case 'CLEAR':
      return { ...state, items: [] }
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }
    case 'OPEN_CART':
      return { ...state, isOpen: true }
    case 'CLOSE_CART':
      return { ...state, isOpen: false }
    default:
      return state
  }
}

interface ToastMessage { id: number; msg: string }

interface CartContextValue {
  state: CartState
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  total: number
  count: number
  toasts: ToastMessage[]
  showToast: (msg: string) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false })
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = useCallback((msg: string) => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2800)
  }, [])

  const addItem = useCallback((item: Omit<CartItem, 'id'>) => {
    dispatch({ type: 'ADD', item: { ...item, id: `${item.productId}-${item.size}-${item.color}-${Date.now()}` } })
    dispatch({ type: 'OPEN_CART' })
    showToast('✓ Added to cart!')
  }, [showToast])

  const removeItem = useCallback((id: string) => dispatch({ type: 'REMOVE', id }), [])
  const updateQty  = useCallback((id: string, qty: number) => dispatch({ type: 'UPDATE_QTY', id, qty }), [])
  const clearCart  = useCallback(() => dispatch({ type: 'CLEAR' }), [])
  const toggleCart = useCallback(() => dispatch({ type: 'TOGGLE_CART' }), [])
  const openCart   = useCallback(() => dispatch({ type: 'OPEN_CART' }), [])
  const closeCart  = useCallback(() => dispatch({ type: 'CLOSE_CART' }), [])

  const total = state.items.reduce((s, i) => s + i.price * i.qty, 0)
  const count = state.items.reduce((s, i) => s + i.qty, 0)

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQty, clearCart, toggleCart, openCart, closeCart, total, count, toasts, showToast }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
