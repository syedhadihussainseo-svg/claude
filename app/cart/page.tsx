'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { Trash2, Plus, Minus, ArrowRight, Tag, Shield, Truck, RotateCcw } from 'lucide-react'

export default function CartPage() {
  const { state, removeItem, updateQty, total, clearCart, showToast } = useCart()
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [checkingOut, setCheckingOut] = useState(false)

  const discount = couponApplied ? total * 0.15 : 0
  const shipping = total - discount >= 60 ? 0 : 7.99
  const finalTotal = total - discount + shipping

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'MENZ15') {
      setCouponApplied(true)
      showToast('🎉 15% discount applied!')
    } else {
      showToast('⚠️ Invalid coupon code')
    }
  }

  const handleCheckout = () => {
    setCheckingOut(true)
    setTimeout(() => {
      showToast('✓ Order placed! Check your email.')
      clearCart()
      setCheckingOut(false)
    }, 2000)
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="text-6xl">🛍️</div>
        <h1 className="font-display font-black text-4xl">Your cart is empty</h1>
        <p className="text-brand-gray text-base">Add some bold pieces to get started.</p>
        <div className="flex gap-4">
          <Link href="/products" className="bg-brand-gold text-brand-black px-8 py-4 rounded-full font-bold hover:bg-white transition-all">
            Shop Collection
          </Link>
          <Link href="/design-studio" className="border border-brand-border text-white px-8 py-4 rounded-full font-bold hover:border-white/30 transition-all">
            🎨 Design Your Own
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 pb-24 bg-brand-black">
      <div className="max-w-[1200px] mx-auto px-6 md:px-14">
        <div className="flex items-center justify-between mb-12">
          <h1 className="font-display font-black text-[clamp(36px,4vw,56px)] leading-none tracking-tight">Your Cart</h1>
          <button onClick={clearCart} className="flex items-center gap-2 text-brand-gray hover:text-white text-sm transition-colors">
            <RotateCcw size={14} /> Clear All
          </button>
        </div>

        <div className="grid lg:grid-cols-[1fr,380px] gap-10">
          {/* Items */}
          <div className="space-y-4">
            {state.items.map(item => (
              <div key={item.id} className="flex gap-5 bg-brand-card border border-brand-border rounded-2xl p-5 group">
                <div className="w-24 h-24 rounded-xl bg-brand-dark flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden border border-brand-border">
                  {item.customDesign ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.customDesign} alt="design" className="w-full h-full object-cover" />
                  ) : '👕'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-base">{item.name}</p>
                      <p className="text-sm text-brand-gray mt-0.5">{item.size} · {item.color}</p>
                      {item.customDesign && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-gold bg-brand-gold/08 border border-brand-gold/20 rounded-full px-2 py-0.5 mt-1.5">
                          🎨 Custom Print
                        </span>
                      )}
                    </div>
                    <button onClick={() => removeItem(item.id)} className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full bg-brand-black flex items-center justify-center text-brand-gray hover:text-red-400 transition-all flex-shrink-0">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-brand-border rounded-xl overflow-hidden">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-10 h-10 bg-brand-black hover:bg-brand-gold hover:text-brand-black flex items-center justify-center transition-all"><Minus size={13} /></button>
                      <span className="w-10 text-center font-bold">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-10 h-10 bg-brand-black hover:bg-brand-gold hover:text-brand-black flex items-center justify-center transition-all"><Plus size={13} /></button>
                    </div>
                    <span className="font-black text-xl">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue shopping */}
            <Link href="/products" className="flex items-center gap-2 text-brand-gray hover:text-white text-sm transition-colors py-2">
              ← Continue Shopping
            </Link>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="bg-brand-card border border-brand-border rounded-3xl p-7">
              <h2 className="font-bold text-lg mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-gray">Subtotal</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-sm text-green-400">
                    <span>Discount (15%)</span>
                    <span>−${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-brand-gray">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-400 font-bold' : 'font-bold'}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-brand-gray">Add ${(60 - (total - discount)).toFixed(2)} more for free shipping</p>
                )}
              </div>
              <div className="border-t border-brand-border pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="text-2xl font-black">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="flex gap-2 mb-6">
                <div className="flex-1 flex items-center border border-brand-border rounded-xl overflow-hidden">
                  <Tag size={14} className="text-brand-gray ml-3 flex-shrink-0" />
                  <input
                    type="text"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                    placeholder="Coupon code"
                    className="flex-1 bg-transparent px-3 py-3 text-sm text-white placeholder:text-brand-gray outline-none"
                  />
                </div>
                <button onClick={applyCoupon} disabled={couponApplied}
                  className="px-4 py-3 bg-brand-gold text-brand-black rounded-xl font-bold text-sm hover:bg-white transition-all disabled:opacity-50">
                  Apply
                </button>
              </div>
              <p className="text-xs text-brand-gray mb-4 text-center">Try <strong className="text-brand-gold">MENZ15</strong> for 15% off</p>

              <button onClick={handleCheckout} disabled={checkingOut}
                className="w-full bg-brand-gold text-brand-black py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-white hover:shadow-[0_16px_40px_rgba(200,164,90,0.3)] hover:-translate-y-1 transition-all disabled:opacity-70">
                {checkingOut ? (
                  <>
                    <div className="w-5 h-5 rounded-full border-2 border-brand-black border-t-transparent animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Checkout <ArrowRight size={20} /></>
                )}
              </button>
            </div>

            {/* Trust */}
            <div className="bg-brand-card border border-brand-border rounded-2xl p-5 space-y-3">
              {[
                { icon: <Shield size={15} />, text: 'Secure 256-bit SSL checkout' },
                { icon: <Truck size={15} />, text: 'Free shipping on orders over $60' },
                { icon: <RotateCcw size={15} />, text: '30-day hassle-free returns' },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-brand-gray">
                  <span className="text-brand-gold">{t.icon}</span>
                  {t.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
