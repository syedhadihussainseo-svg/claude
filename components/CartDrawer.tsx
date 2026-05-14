'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'

export default function CartDrawer() {
  const { state, closeCart, removeItem, updateQty, total, count, toasts } = useCart()

  return (
    <>
      {/* Toast notifications */}
      <div className="fixed bottom-8 left-1/2 z-[4000] flex flex-col gap-2 pointer-events-none" style={{ transform: 'translateX(-50%)' }}>
        {toasts.map(t => (
          <div
            key={t.id}
            className="bg-brand-gold text-brand-black px-7 py-3.5 rounded-full text-sm font-bold whitespace-nowrap shadow-2xl animate-fade-up"
          >
            {t.msg}
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div
        className={`cart-overlay fixed inset-0 z-[1999] bg-black/70 backdrop-blur-sm ${state.isOpen ? 'open' : ''}`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside
        className={`cart-drawer fixed top-0 right-0 bottom-0 z-[2000] w-full max-w-[420px] bg-brand-dark border-l border-brand-border flex flex-col ${state.isOpen ? 'open' : ''}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-6 border-b border-brand-border">
          <div>
            <h2 className="text-lg font-bold">Your Cart</h2>
            <p className="text-sm text-brand-gray mt-0.5">{count} item{count !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={closeCart}
            className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center text-white/60 hover:bg-brand-gold hover:text-brand-black hover:border-brand-gold transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-7 py-4 space-y-4">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16 gap-4">
              <ShoppingBag size={48} className="text-brand-border" />
              <div>
                <p className="font-bold text-lg">Cart is empty</p>
                <p className="text-sm text-brand-gray mt-1">Add some bold pieces!</p>
              </div>
              <button
                onClick={closeCart}
                className="mt-2 bg-brand-gold text-brand-black px-6 py-3 rounded-full text-sm font-bold hover:bg-white transition-all"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            state.items.map(item => (
              <div key={item.id} className="flex gap-4 p-4 bg-brand-card rounded-2xl border border-brand-border group">
                <div className="w-20 h-20 rounded-xl bg-brand-black flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden">
                  {item.customDesign ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.customDesign} alt="custom" className="w-full h-full object-cover" />
                  ) : (
                    '👕'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{item.name}</p>
                  <p className="text-xs text-brand-gray mt-0.5">{item.size} · {item.color}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-brand-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-8 h-8 bg-brand-black hover:bg-brand-gold hover:text-brand-black flex items-center justify-center transition-all"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-8 h-8 bg-brand-black hover:bg-brand-gold hover:text-brand-black flex items-center justify-center transition-all"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="font-bold text-base">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-full bg-brand-black flex items-center justify-center text-brand-gray hover:text-red-400 transition-all flex-shrink-0 mt-1"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="px-7 py-6 border-t border-brand-border space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-brand-gray text-sm">Subtotal</span>
              <span className="text-2xl font-black">${total.toFixed(2)}</span>
            </div>
            <p className="text-xs text-brand-gray">Shipping calculated at checkout. Free over $60.</p>
            <Link
              href="/cart"
              onClick={closeCart}
              className="block w-full bg-brand-gold text-brand-black text-center py-4 rounded-2xl font-bold text-base hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(200,164,90,0.3)] transition-all"
            >
              Checkout — ${total.toFixed(2)} →
            </Link>
            <button
              onClick={closeCart}
              className="block w-full text-center text-brand-gray text-sm hover:text-white transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
