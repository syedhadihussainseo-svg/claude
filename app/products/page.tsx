'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { PRODUCTS, BADGE_LABELS, BADGE_STYLES, ProductCategory } from '@/lib/products'
import { Eye, Heart, SlidersHorizontal, Grid3X3, List, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

const CATS: (ProductCategory | 'All')[] = ['All', 'Graphic', 'Essential', 'Oversized', 'Limited', 'Custom']
const SORTS = ['Newest', 'Price: Low', 'Price: High', 'Best Rated', 'Most Reviewed']

function ProductCard({ p, view }: { p: typeof PRODUCTS[0]; view: 'grid' | 'list' }) {
  const { addItem, showToast } = useCart()
  const [activeColor, setActiveColor] = useState(0)

  if (view === 'list') {
    return (
      <div className="flex gap-6 bg-brand-card border border-brand-border rounded-2xl overflow-hidden hover:border-brand-gold/10 transition-all group p-4">
        <Link href={`/products/${p.id}`} className="relative w-40 flex-shrink-0 aspect-square rounded-xl overflow-hidden bg-brand-dark">
          <Image src={p.images[0]} alt={p.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        </Link>
        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
          <div>
            {p.badge && (
              <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase mb-2 ${BADGE_STYLES[p.badge]}`}>
                {BADGE_LABELS[p.badge]}
              </span>
            )}
            <Link href={`/products/${p.id}`}>
              <h3 className="font-black text-lg hover:text-brand-gold transition-colors">{p.name}</h3>
            </Link>
            <p className="text-sm text-brand-gray mt-1">{p.category} · {p.material}</p>
            <p className="text-sm text-white/60 mt-2 line-clamp-2">{p.description}</p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black">${p.price}</span>
              {p.oldPrice && <span className="text-base text-brand-gray line-through">${p.oldPrice}</span>}
              <span className="flex items-center gap-1 text-xs text-brand-gray">
                <span className="text-yellow-400">★</span> {p.rating} ({p.reviews})
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => showToast('❤️ Added to wishlist!')}
                className="w-10 h-10 rounded-xl border border-brand-border flex items-center justify-center text-white/50 hover:text-brand-gold hover:border-brand-gold transition-all"
              ><Heart size={16} /></button>
              <button
                onClick={() => addItem({ productId: p.id, name: p.name, price: p.price, size: 'M', color: p.colors[0]?.name ?? 'Default', qty: 1, image: p.images[0] })}
                className="bg-brand-gold text-brand-black px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-white transition-all"
              >Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="product-card bg-brand-card border border-brand-border rounded-[18px] overflow-hidden group cursor-pointer">
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-dark">
        <Image src={p.images[0]} alt={p.name} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
        {p.images[1] && <Image src={p.images[1]} alt={p.name} fill className="object-cover product-img-back" />}
        {p.badge && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${BADGE_STYLES[p.badge]}`}>
            {BADGE_LABELS[p.badge]}
          </span>
        )}
        <div className="product-actions absolute top-3 right-3 flex flex-col gap-2">
          <button onClick={() => showToast('❤️ Added to wishlist!')} className="w-9 h-9 rounded-full bg-black/80 backdrop-blur border border-brand-border flex items-center justify-center text-white/70 hover:bg-brand-gold hover:text-brand-black transition-all"><Heart size={14} /></button>
          <Link href={`/products/${p.id}`}><button className="w-9 h-9 rounded-full bg-black/80 backdrop-blur border border-brand-border flex items-center justify-center text-white/70 hover:bg-brand-gold hover:text-brand-black transition-all"><Eye size={14} /></button></Link>
        </div>
        <button
          onClick={() => addItem({ productId: p.id, name: p.name, price: p.price, size: 'M', color: p.colors[activeColor]?.name ?? 'Default', qty: 1, image: p.images[0] })}
          className="product-quick-add absolute bottom-0 left-0 right-0 bg-brand-gold text-brand-black py-3.5 text-sm font-bold tracking-wide"
        >+ Add to Cart</button>
      </div>
      <Link href={`/products/${p.id}`}>
        <div className="p-5">
          <p className="font-bold text-sm mb-0.5">{p.name}</p>
          <p className="text-xs text-brand-gray mb-3">{p.category}</p>
          <div className="flex gap-1.5 mb-3">
            {p.colors.map((c, i) => (
              <button key={i} onClick={e => { e.preventDefault(); setActiveColor(i) }}
                className={`w-4 h-4 rounded-full border-2 transition-all ${i === activeColor ? 'border-white scale-125' : 'border-transparent'}`}
                style={{ background: c.hex }} />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-black">${p.price}</span>
              {p.oldPrice && <span className="text-sm text-brand-gray line-through ml-2">${p.oldPrice}</span>}
            </div>
            <div className="flex items-center gap-1 text-xs text-brand-gray">
              <span className="text-yellow-400">{'★'.repeat(Math.round(p.rating))}</span>
              <span>({p.reviews})</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

function ProductsContent() {
  const params = useSearchParams()
  const initialCat = (params.get('cat') as ProductCategory | null) ?? 'All'
  const [activeCat, setActiveCat] = useState<ProductCategory | 'All'>(initialCat)
  const [sort, setSort] = useState('Newest')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [priceMax, setPriceMax] = useState(200)
  const [showFilters, setShowFilters] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  let filtered = activeCat === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCat)
  filtered = filtered.filter(p => p.price <= priceMax)
  if (sort === 'Price: Low')     filtered = [...filtered].sort((a, b) => a.price - b.price)
  if (sort === 'Price: High')    filtered = [...filtered].sort((a, b) => b.price - a.price)
  if (sort === 'Best Rated')     filtered = [...filtered].sort((a, b) => b.rating - a.rating)
  if (sort === 'Most Reviewed')  filtered = [...filtered].sort((a, b) => b.reviews - a.reviews)

  return (
    <div className={`transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Hero */}
      <div className="pt-28 pb-16 bg-brand-dark border-b border-brand-border">
        <div className="max-w-[1400px] mx-auto px-6 md:px-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-brand-gold text-sm font-bold tracking-widest uppercase mb-3">Shop</p>
              <h1 className="font-display font-black text-[clamp(40px,5vw,72px)] leading-none tracking-tight">All Collections</h1>
              <p className="text-brand-gray mt-3 text-base">{filtered.length} styles available</p>
            </div>
            <Link href="/design-studio" className="inline-flex items-center gap-2 bg-brand-gold text-brand-black px-7 py-3.5 rounded-full font-bold hover:bg-white transition-all self-start md:self-auto">
              🎨 Design Custom Tee <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-14 py-12">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap gap-2">
            {CATS.map(c => (
              <button key={c} onClick={() => setActiveCat(c)}
                className={`px-5 py-2 rounded-full text-sm font-bold border transition-all ${activeCat === c ? 'bg-brand-gold text-brand-black border-brand-gold' : 'border-brand-border text-white/50 hover:border-white/30 hover:text-white'}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowFilters(f => !f)} className="flex items-center gap-2 px-4 py-2 rounded-full border border-brand-border text-sm text-white/60 hover:text-white hover:border-white/30 transition-all">
              <SlidersHorizontal size={14} /> Filters
            </button>
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="bg-brand-card border border-brand-border rounded-full px-4 py-2 text-sm text-white/70 outline-none cursor-pointer">
              {SORTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="flex border border-brand-border rounded-full overflow-hidden">
              <button onClick={() => setView('grid')} className={`w-9 h-9 flex items-center justify-center transition-all ${view === 'grid' ? 'bg-brand-gold text-brand-black' : 'text-white/50 hover:text-white'}`}><Grid3X3 size={14} /></button>
              <button onClick={() => setView('list')} className={`w-9 h-9 flex items-center justify-center transition-all ${view === 'list' ? 'bg-brand-gold text-brand-black' : 'text-white/50 hover:text-white'}`}><List size={14} /></button>
            </div>
          </div>
        </div>

        {/* Advanced filters panel */}
        {showFilters && (
          <div className="bg-brand-card border border-brand-border rounded-2xl p-6 mb-8 grid md:grid-cols-3 gap-6">
            <div>
              <label className="text-xs font-bold tracking-widest uppercase text-brand-gray mb-3 block">Max Price: ${priceMax}</label>
              <input type="range" min={30} max={200} value={priceMax} onChange={e => setPriceMax(Number(e.target.value))} className="w-full" />
              <div className="flex justify-between text-xs text-brand-gray mt-1"><span>$30</span><span>$200</span></div>
            </div>
            <div>
              <label className="text-xs font-bold tracking-widest uppercase text-brand-gray mb-3 block">Material</label>
              <div className="flex flex-wrap gap-2">
                {['Cotton', 'Organic', 'Linen Blend', 'Supima'].map(m => (
                  <button key={m} className="px-3 py-1.5 rounded-full border border-brand-border text-xs text-white/60 hover:border-brand-gold hover:text-brand-gold transition-all">{m}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold tracking-widest uppercase text-brand-gray mb-3 block">Fit</label>
              <div className="flex flex-wrap gap-2">
                {['Classic', 'Relaxed', 'Oversized', 'Box'].map(f => (
                  <button key={f} className="px-3 py-1.5 rounded-full border border-brand-border text-xs text-white/60 hover:border-brand-gold hover:text-brand-gold transition-all">{f}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Grid / List */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🤷</p>
            <p className="text-xl font-bold mb-2">No products found</p>
            <p className="text-brand-gray">Try adjusting your filters</p>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map(p => <ProductCard key={p.id} p={p} view="grid" />)}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map(p => <ProductCard key={p.id} p={p} view="list" />)}
          </div>
        )}

        {/* POD Banner */}
        <div className="mt-20 bg-brand-card border border-brand-gold/15 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-brand-gold font-bold text-sm tracking-widest uppercase mb-2">Print on Demand</p>
            <h3 className="font-display font-black text-2xl md:text-3xl mb-2">Don't see your vibe?</h3>
            <p className="text-brand-gray text-base">Upload your own design and we'll print it on any of our premium blanks.</p>
          </div>
          <Link href="/design-studio" className="flex-shrink-0 inline-flex items-center gap-2 bg-brand-gold text-brand-black px-8 py-4 rounded-full font-bold hover:bg-white hover:-translate-y-1 transition-all">
            Open Design Studio <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 rounded-full border-2 border-brand-gold border-t-transparent animate-spin" /></div>}>
      <ProductsContent />
    </Suspense>
  )
}
