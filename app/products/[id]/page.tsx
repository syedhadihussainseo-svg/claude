'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { getProduct, PRODUCTS, BADGE_LABELS, BADGE_STYLES } from '@/lib/products'
import { Heart, ShoppingBag, Ruler, Truck, RefreshCw, Shield, ChevronRight, Eye, Zap } from 'lucide-react'
import SizeFinderModal from '@/components/SizeFinderModal'

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const product = getProduct(id)
  const { addItem, showToast } = useCart()

  const [activeImg, setActiveImg] = useState(0)
  const [activeColor, setActiveColor] = useState(0)
  const [activeSize, setActiveSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState<'desc' | 'details' | 'reviews'>('desc')
  const [uploadedDesign, setUploadedDesign] = useState<string | null>(null)
  const [sizeFinderOpen, setSizeFinderOpen] = useState(false)
  const uploadRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    document.title = product ? `${product.name} | MenZculture` : 'Product | MenZculture'
  }, [product])

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-24">
        <p className="text-6xl">🤷</p>
        <h1 className="text-2xl font-black">Product not found</h1>
        <Link href="/products" className="bg-brand-gold text-brand-black px-6 py-3 rounded-full font-bold hover:bg-white transition-all">
          Browse All Products
        </Link>
      </div>
    )
  }

  const handleDesignUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      setUploadedDesign(ev.target?.result as string)
      showToast('✓ Design uploaded!')
    }
    reader.readAsDataURL(file)
  }

  const handleAddToCart = () => {
    if (!activeSize) { showToast('⚠️ Please select a size'); return }
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: activeSize,
      color: product.colors[activeColor]?.name ?? 'Default',
      qty,
      image: product.images[0],
      customDesign: uploadedDesign ?? undefined,
    })
  }

  const related = PRODUCTS.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4)

  return (
    <div className="hero-gradient pt-24 min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-14 py-4">
        <div className="flex items-center gap-2 text-sm text-brand-gray">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href="/products" className="hover:text-white transition-colors">Products</Link>
          <ChevronRight size={14} />
          <span className="text-white">{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-14 py-8">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden bg-brand-card border border-brand-border">
              <Image src={product.images[activeImg] ?? product.images[0]} alt={product.name} fill className="object-cover" priority />
              {uploadedDesign && (
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={uploadedDesign} alt="design overlay" className="w-32 h-32 object-contain opacity-80 drop-shadow-lg" style={{ mixBlendMode: 'multiply' }} />
                </div>
              )}
              {product.badge && (
                <span className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${BADGE_STYLES[product.badge]}`}>
                  {BADGE_LABELS[product.badge]}
                </span>
              )}
              <button onClick={() => showToast('❤️ Added to wishlist!')} className="absolute top-4 right-4 w-11 h-11 rounded-full bg-black/70 backdrop-blur border border-brand-border flex items-center justify-center text-white/70 hover:bg-brand-gold hover:text-brand-black transition-all">
                <Heart size={18} />
              </button>
            </div>
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`relative w-20 aspect-square rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? 'border-brand-gold' : 'border-brand-border hover:border-white/30'}`}>
                    <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-7">
            <div>
              <p className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-2">{product.category} · {product.fit} Fit</p>
              <h1 className="font-display font-black text-[clamp(32px,3.5vw,52px)] leading-tight tracking-tight">{product.name}</h1>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-yellow-400 text-base">{'★'.repeat(Math.round(product.rating))}</span>
                <span className="text-brand-gray text-sm">{product.rating} ({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-black text-gold-gradient">${product.price}</span>
              {product.oldPrice && (
                <>
                  <span className="text-xl text-brand-gray line-through">${product.oldPrice}</span>
                  <span className="bg-brand-orange/10 text-brand-orange border border-brand-orange/20 px-2.5 py-1 rounded-full text-xs font-bold">
                    SAVE ${product.oldPrice - product.price}
                  </span>
                </>
              )}
            </div>

            {/* Colors */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-brand-gray mb-3">
                Color — <span className="text-white">{product.colors[activeColor]?.name}</span>
              </p>
              <div className="flex gap-3">
                {product.colors.map((c, i) => (
                  <button key={i} onClick={() => setActiveColor(i)}
                    title={c.name}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${i === activeColor ? 'border-brand-gold scale-110 shadow-[0_0_0_3px_rgba(200,164,90,0.2)]' : 'border-brand-border hover:border-white/50'}`}
                    style={{ background: c.hex }} />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold tracking-widest uppercase text-brand-gray">
                  Size{activeSize ? ` — ${activeSize}` : ''}
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setSizeFinderOpen(true)} className="text-xs text-[#00D4FF] hover:underline flex items-center gap-1 font-semibold">
                    <Zap size={11} /> AI Size Finder
                  </button>
                  <button className="text-xs text-brand-gray hover:text-white flex items-center gap-1">
                    <Ruler size={12} /> Size Guide
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setActiveSize(s)}
                    className={`w-14 h-12 rounded-xl border-2 font-bold text-sm transition-all ${
                      activeSize === s
                        ? 'border-brand-gold bg-brand-gold/10 text-brand-gold'
                        : 'border-brand-border hover:border-white/40'
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Design Upload */}
            {product.allowCustomDesign && (
              <div className="bg-brand-gold/06 border border-brand-gold/20 rounded-2xl p-5">
                <p className="text-sm font-bold mb-1 flex items-center gap-2">🎨 Add Your Design <span className="text-[10px] bg-brand-gold/10 border border-brand-gold/20 text-brand-gold rounded-full px-2 py-0.5 font-bold tracking-wide">POD</span></p>
                <p className="text-xs text-brand-gray mb-4">Upload your artwork and we'll print it on this blank. PNG, SVG, or AI file recommended.</p>
                <input ref={uploadRef} type="file" accept="image/*,.svg,.ai,.pdf" className="hidden" onChange={handleDesignUpload} />
                <div className="flex gap-3">
                  <button onClick={() => uploadRef.current?.click()}
                    className="flex-1 border border-brand-gold/30 text-brand-gold py-2.5 rounded-xl text-sm font-bold hover:bg-brand-gold/10 transition-all">
                    {uploadedDesign ? '✓ Design Ready — Change' : '📁 Upload Design'}
                  </button>
                  <Link href="/design-studio" className="flex-1 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold py-2.5 rounded-xl text-sm font-bold text-center hover:bg-brand-gold/20 transition-all">
                    Open Studio →
                  </Link>
                </div>
              </div>
            )}

            {/* Qty + Add */}
            <div className="flex gap-4">
              <div className="flex items-center border border-brand-border rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-12 h-14 bg-brand-card hover:bg-brand-gold hover:text-brand-black text-lg font-bold transition-all">−</button>
                <span className="w-14 h-14 flex items-center justify-center font-bold text-lg">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-12 h-14 bg-brand-card hover:bg-brand-gold hover:text-brand-black text-lg font-bold transition-all">+</button>
              </div>
              <button onClick={handleAddToCart}
                className="flex-1 btn-gold font-bold text-base rounded-2xl hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(200,164,90,0.3)] transition-all flex items-center justify-center gap-2">
                <ShoppingBag size={20} />
                Add to Cart — ${(product.price * qty).toFixed(2)}
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: <Truck size={16} />, label: 'Free shipping', sub: 'Over $60' },
                { icon: <RefreshCw size={16} />, label: '30-day returns', sub: 'Hassle-free' },
                { icon: <Shield size={16} />, label: 'Quality print', sub: 'Guaranteed' },
              ].map((b, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-1 p-3 bg-brand-card border border-brand-border rounded-xl">
                  <div className="text-brand-gold">{b.icon}</div>
                  <p className="text-xs font-bold leading-tight">{b.label}</p>
                  <p className="text-[10px] text-brand-gray">{b.sub}</p>
                </div>
              ))}
            </div>

            {/* Material */}
            <p className="text-xs text-brand-gray">Material: <span className="text-white">{product.material}</span></p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-20">
          <div className="flex border-b border-brand-border gap-0 mb-8">
            {(['desc','details','reviews'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-6 py-4 text-sm font-bold capitalize border-b-2 transition-all ${tab === t ? 'border-brand-gold text-white' : 'border-transparent text-brand-gray hover:text-white'}`}>
                {t === 'desc' ? 'Description' : t === 'details' ? 'Details & Care' : 'Reviews'}
              </button>
            ))}
          </div>
          {tab === 'desc' && (
            <div className="max-w-2xl">
              <p className="text-white/70 text-base leading-relaxed mb-6">{product.description}</p>
              <div className="flex flex-wrap gap-2">
                {product.features.map(f => (
                  <span key={f} className="px-3 py-1.5 bg-brand-card border border-brand-border rounded-full text-sm text-white/70">✓ {f}</span>
                ))}
              </div>
            </div>
          )}
          {tab === 'details' && (
            <div className="max-w-lg space-y-3">
              {[
                { k: 'Material', v: product.material },
                { k: 'Fit', v: `${product.fit} Fit` },
                { k: 'Care', v: 'Machine wash cold, tumble dry low' },
                { k: 'Origin', v: 'Made in Portugal' },
                { k: 'Print', v: 'Direct-to-Garment (DTG)' },
              ].map(row => (
                <div key={row.k} className="flex justify-between py-3 border-b border-brand-border">
                  <span className="text-brand-gray text-sm">{row.k}</span>
                  <span className="text-sm font-medium">{row.v}</span>
                </div>
              ))}
            </div>
          )}
          {tab === 'reviews' && (
            <div className="space-y-4 max-w-2xl">
              {[
                { name: 'Alex M.', rating: 5, text: 'Absolutely love it. The print quality is next level and the fit was perfect thanks to the AI size finder.', date: 'May 2026' },
                { name: 'Jordan K.', rating: 5, text: 'Ships fast, quality is incredible. Been wearing it for 3 months, color hasn\'t faded at all.', date: 'Apr 2026' },
                { name: 'Sam R.', rating: 4, text: 'Great tee overall. The material is super soft. Sizing runs a tiny bit large but the AI warned me about that.', date: 'Mar 2026' },
              ].map((r, i) => (
                <div key={i} className="bg-brand-card border border-brand-border rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-gold to-brand-orange flex items-center justify-center text-brand-black font-black text-sm">
                        {r.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{r.name}</p>
                        <p className="text-xs text-brand-gray">Verified Buyer</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-yellow-400 text-sm">{'★'.repeat(r.rating)}</span>
                      <span className="text-xs text-brand-gray ml-2">{r.date}</span>
                    </div>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display font-black text-3xl mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map(p => (
                <div key={p.id} className="product-card bg-brand-card border border-brand-border rounded-[18px] overflow-hidden group cursor-pointer">
                  <Link href={`/products/${p.id}`}>
                    <div className="relative aspect-[3/4] overflow-hidden bg-brand-dark">
                      <Image src={p.images[0]} alt={p.name} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                      <button className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 w-9 h-9 rounded-full bg-black/80 backdrop-blur border border-brand-border flex items-center justify-center text-white/70 hover:bg-brand-gold hover:text-brand-black transition-all">
                        <Eye size={14} />
                      </button>
                    </div>
                    <div className="p-4">
                      <p className="font-bold text-sm">{p.name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-black">${p.price}</span>
                        <span className="text-xs text-yellow-400">{'★'.repeat(Math.round(p.rating))}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <SizeFinderModal
        isOpen={sizeFinderOpen}
        onClose={() => setSizeFinderOpen(false)}
        productName={product.name}
        availableSizes={product.sizes}
        onSelectSize={(size) => { setActiveSize(size); setSizeFinderOpen(false) }}
      />
    </div>
  )
}
