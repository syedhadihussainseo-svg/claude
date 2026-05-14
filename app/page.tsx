'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { PRODUCTS, BADGE_LABELS, BADGE_STYLES } from '@/lib/products'
import { ArrowRight, Zap, Cpu, Layers, Eye, ChevronRight } from 'lucide-react'

// ---- REVEAL HOOK ----
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    const io = new IntersectionObserver(
      entries => entries.forEach((e, i) => {
        if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 70)
      }),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

// ---- HERO ----
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_65%_40%,rgba(200,164,90,0.07)_0%,transparent_70%),radial-gradient(ellipse_50%_50%_at_20%_80%,rgba(0,194,255,0.04)_0%,transparent_60%)]" />
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* Animated dots */}
      <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse-slow" />
      <div className="absolute top-1/2 right-1/3 w-1 h-1 rounded-full bg-brand-blue animate-pulse-slow" style={{ animationDelay: '1s' }} />
      <div className="absolute top-3/4 right-1/5 w-1 h-1 rounded-full bg-brand-gold/50 animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-14 pt-28 pb-16 grid md:grid-cols-2 gap-16 items-center w-full">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/20 rounded-full px-4 py-1.5 text-[11px] font-bold text-brand-gold tracking-widest uppercase mb-8 animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
            New Collection 2026
          </div>
          <h1 className="font-display font-black leading-[0.93] tracking-tight text-[clamp(52px,5.8vw,92px)] mb-7 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Wear Your<br />
            <span className="text-gold-gradient">Boldest</span><br />
            <span className="italic text-white/30">Self.</span>
          </h1>
          <p className="text-white/50 text-lg leading-relaxed max-w-[440px] mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Premium print-on-demand tees crafted for those who dare to stand out. Upload your design, get AI-fitted, and wear what you mean.
          </p>
          <div className="flex flex-wrap gap-4 mb-14 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link href="/products" className="inline-flex items-center gap-2 bg-brand-gold text-brand-black px-9 py-4 rounded-full font-bold text-base hover:bg-white hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(200,164,90,0.3)] transition-all">
              Explore Collection <ArrowRight size={18} />
            </Link>
            <Link href="/design-studio" className="inline-flex items-center gap-2 border border-brand-border text-white px-9 py-4 rounded-full font-semibold text-base hover:border-white/30 hover:bg-white/5 transition-all">
              🎨 Design Yours
            </Link>
          </div>
          {/* Stats */}
          <div className="flex gap-10 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            {[
              { num: '50K+', label: 'Happy Customers' },
              { num: '200+', label: 'Designs' },
              { num: '4.9★', label: 'Avg Rating' },
            ].map(s => (
              <div key={s.label} className="border-l-2 border-brand-gold pl-4">
                <div className="text-2xl font-black">{s.num}</div>
                <div className="text-xs text-brand-gray mt-0.5 tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Hero image with floating badges */}
        <div className="relative animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="relative aspect-[3/4] rounded-[20px] overflow-hidden border border-brand-border">
            <Image
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=90"
              alt="MenZculture Hero"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            {/* AI badge */}
            <div className="absolute top-5 right-5 flex items-center gap-2 bg-black/70 backdrop-blur-xl border border-brand-blue/30 rounded-full px-4 py-2 text-[11px] font-bold text-brand-blue">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />AI STYLED
            </div>
          </div>
          {/* Floating badge 1 */}
          <div className="absolute -left-8 top-10 glass rounded-2xl p-4 animate-float hidden md:block">
            <p className="text-[10px] text-brand-gray font-medium tracking-wide mb-1">TODAY'S TOP PICK</p>
            <p className="font-bold text-base">Obsidian Drop Tee</p>
            <p className="text-[11px] text-brand-gold mt-0.5">Limited Edition</p>
          </div>
          {/* Floating badge 2 */}
          <div className="absolute -right-8 bottom-20 glass rounded-2xl p-4 animate-float hidden md:block" style={{ animationDelay: '-2s' }}>
            <p className="text-[10px] text-brand-gray mb-1">CUSTOMER RATING</p>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-sm">★★★★★</span>
              <span className="font-black text-lg">4.9</span>
            </div>
            <p className="text-[11px] text-brand-gray">2,340 reviews</p>
          </div>
          {/* Floating badge 3 */}
          <div className="absolute -left-8 bottom-32 glass rounded-2xl p-4 animate-float hidden md:block" style={{ animationDelay: '-1s' }}>
            <p className="text-[10px] text-brand-gray mb-0.5">MATERIAL</p>
            <p className="font-bold text-brand-blue text-sm">100% Pima</p>
            <p className="text-[10px] text-brand-gray">Organic Cotton</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ---- MARQUEE ----
function Marquee() {
  const items = ['Free Shipping Over $60', 'AI Size Recommendation', 'Premium Organic Cotton', '30-Day Returns', '200+ Exclusive Designs', 'Same-Day Dispatch', 'Print on Demand', 'Ships Worldwide']
  const doubled = [...items, ...items]
  return (
    <div className="bg-brand-gold overflow-hidden py-5">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-6 px-8 text-sm font-bold text-brand-black uppercase tracking-widest flex-shrink-0">
            {item}
            <span className="w-1.5 h-1.5 rounded-full bg-brand-black/30" />
          </span>
        ))}
      </div>
    </div>
  )
}

// ---- CATEGORIES ----
const categories = [
  { name: 'Graphic Tees', count: 84, img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=85', cat: 'Graphic' },
  { name: 'Essentials',   count: 56, img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=85', cat: 'Essential' },
  { name: 'Oversized',    count: 38, img: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=85', cat: 'Oversized' },
  { name: 'Custom POD',   count: 999, img: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=85', cat: 'Custom' },
]

// ---- PRODUCT CARD ----
function ProductCard({ product }: { product: typeof PRODUCTS[0] }) {
  const { addItem, showToast } = useCart()
  const [activeColor, setActiveColor] = useState(0)

  return (
    <div className="product-card bg-brand-card border border-brand-border rounded-[18px] overflow-hidden group cursor-pointer">
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-dark">
        <Image src={product.images[0]} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
        {product.images[1] && (
          <Image src={product.images[1]} alt={product.name} fill className="object-cover product-img-back" />
        )}
        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${BADGE_STYLES[product.badge]}`}>
            {BADGE_LABELS[product.badge]}
          </span>
        )}
        {/* Action buttons */}
        <div className="product-actions absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={() => showToast('❤️ Added to wishlist!')}
            className="w-9 h-9 rounded-full bg-black/80 backdrop-blur border border-brand-border flex items-center justify-center text-white/70 hover:bg-brand-gold hover:text-brand-black hover:border-brand-gold transition-all text-sm"
          >♡</button>
          <Link href={`/products/${product.id}`}>
            <button className="w-9 h-9 rounded-full bg-black/80 backdrop-blur border border-brand-border flex items-center justify-center text-white/70 hover:bg-brand-gold hover:text-brand-black hover:border-brand-gold transition-all">
              <Eye size={14} />
            </button>
          </Link>
        </div>
        {/* Quick add */}
        <button
          onClick={() => addItem({ productId: product.id, name: product.name, price: product.price, size: 'M', color: product.colors[activeColor]?.name ?? 'Default', qty: 1, image: product.images[0] })}
          className="product-quick-add absolute bottom-0 left-0 right-0 bg-brand-gold text-brand-black py-3.5 text-sm font-bold tracking-wide"
        >
          + Add to Cart
        </button>
      </div>
      <Link href={`/products/${product.id}`}>
        <div className="p-5">
          <p className="font-bold text-sm mb-0.5">{product.name}</p>
          <p className="text-xs text-brand-gray mb-3">{product.category}</p>
          {/* Colors */}
          <div className="flex gap-1.5 mb-3">
            {product.colors.map((c, i) => (
              <button
                key={i}
                onClick={e => { e.preventDefault(); setActiveColor(i) }}
                className={`w-4 h-4 rounded-full border-2 transition-all ${i === activeColor ? 'border-white scale-125' : 'border-transparent'}`}
                style={{ background: c.hex }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-black">${product.price}</span>
              {product.oldPrice && <span className="text-sm text-brand-gray line-through ml-2">${product.oldPrice}</span>}
            </div>
            <div className="flex items-center gap-1 text-xs text-brand-gray">
              <span className="text-yellow-400">{'★'.repeat(Math.round(product.rating))}</span>
              <span>({product.reviews})</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

// ---- AI SECTION ----
function AISection() {
  const [scanning, setScanning] = useState(false)
  const [uploadedImg, setUploadedImg] = useState<string | null>(null)
  const [result, setResult] = useState<{ size: string; conf: number } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      setUploadedImg(ev.target?.result as string)
      setResult(null)
      runScan()
    }
    reader.readAsDataURL(file)
  }

  const runScan = () => {
    setScanning(true)
    setResult(null)
    const sizes = ['XS','S','M','L','XL']
    let i = 0
    const iv = setInterval(() => {
      i++
      if (i > 18) {
        clearInterval(iv)
        setScanning(false)
        setResult({ size: 'M', conf: 97 })
      }
    }, 130)
  }

  const aiFeatures = [
    { icon: <Cpu size={22} />, title: 'AI Size Predictor', desc: 'Upload a photo or enter measurements. Our model predicts your perfect fit with 97% accuracy.' },
    { icon: <Layers size={22} />, title: 'Style DNA Matcher', desc: 'Answer 3 questions. We surface designs you\'ll actually love based on your style fingerprint.' },
    { icon: <Eye size={22} />, title: 'Virtual Try-On', desc: 'See any t-shirt on your photo before buying. Powered by real-time AI cloth simulation.' },
    { icon: <Zap size={22} />, title: 'Outfit Generator', desc: 'Get complete outfit ideas built around any tee, tailored to your wardrobe and occasion.' },
  ]

  return (
    <section className="py-32 bg-brand-black relative overflow-hidden" id="ai">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(0,194,255,0.04),transparent_70%)]" />
      <div className="max-w-[1400px] mx-auto px-6 md:px-14 relative z-10">
        <div className="section-tag reveal mb-5 inline-flex items-center gap-2 bg-brand-gold/06 border border-brand-gold/15 rounded-full px-4 py-1.5 text-[11px] font-bold text-brand-gold tracking-widest uppercase">
          Powered by AI
        </div>
        <h2 className="font-display font-black text-[clamp(36px,3.5vw,56px)] leading-tight tracking-tight mb-4 reveal">
          Smart Shopping.<br /><span className="text-gold-gradient">Perfect Fit.</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-16 mt-16 items-center">
          <div>
            <p className="text-white/50 text-base leading-relaxed mb-10 reveal">
              Our AI analyzes thousands of data points to recommend your perfect size, predict how garments will look on your body type, and curate styles made for you.
            </p>
            <div className="space-y-4">
              {aiFeatures.map((f, i) => (
                <div key={i} className="flex gap-5 p-5 bg-brand-card border border-brand-border rounded-2xl hover:border-brand-blue/20 hover:translate-x-2 transition-all cursor-pointer reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="w-12 h-12 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue flex-shrink-0">
                    {f.icon}
                  </div>
                  <div>
                    <p className="font-bold text-base mb-1">{f.title}</p>
                    <p className="text-sm text-brand-gray leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Size Finder widget */}
          <div className="bg-brand-card border border-brand-border rounded-3xl p-8 reveal-right">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg">AI Size Finder</h3>
              <span className="flex items-center gap-1.5 bg-brand-blue/10 border border-brand-blue/30 rounded-full px-3 py-1 text-[11px] font-bold text-brand-blue">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />LIVE
              </span>
            </div>
            <div className="bg-brand-black rounded-2xl p-6 border border-brand-border">
              {/* Scan line */}
              <div className={`h-0.5 bg-gradient-to-r from-transparent via-brand-blue to-transparent mb-5 ${scanning ? 'animate-scan' : 'opacity-20'}`} />
              {/* Body preview */}
              <div className="relative aspect-square rounded-xl bg-gradient-to-br from-brand-blue/08 to-brand-gold/04 border border-brand-blue/15 flex items-center justify-center text-[64px] mb-5 overflow-hidden">
                {uploadedImg ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={uploadedImg} alt="upload" className="w-full h-full object-cover" />
                ) : (
                  '🧍'
                )}
                {scanning && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-blue/10 to-transparent animate-pulse" />
                )}
              </div>
              {/* Result */}
              <div className="bg-brand-gold/08 border border-brand-gold/20 rounded-xl p-4 text-center mb-4">
                <p className="text-[10px] font-bold tracking-widest uppercase text-brand-gold mb-1">
                  {scanning ? 'Analyzing...' : result ? 'Recommended Size' : 'Upload to Start'}
                </p>
                <p className="text-5xl font-black text-brand-gold leading-none my-2">
                  {scanning ? (
                    <span className="animate-pulse">?</span>
                  ) : result ? result.size : '—'}
                </p>
                <p className="text-xs text-brand-gray">
                  {result ? `${result.conf}% confidence match` : 'Based on your measurements'}
                </p>
              </div>
              {/* Sizes */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {['S','M','L','XL'].map(s => (
                  <button key={s} className={`py-2 rounded-lg text-sm font-bold border transition-all ${result?.size === s ? 'border-brand-gold bg-brand-gold/10 text-brand-gold' : 'border-brand-border hover:border-white/30'}`}>
                    {s}{result?.size === s ? ' ✓' : ''}
                  </button>
                ))}
              </div>
              <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              <button
                onClick={() => inputRef.current?.click()}
                className="w-full bg-brand-gold text-brand-black py-3.5 rounded-xl font-bold text-sm hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(200,164,90,0.25)] transition-all"
              >
                📸 Upload Photo for AI Scan
              </button>
              <button
                onClick={runScan}
                className="w-full mt-2 border border-brand-border text-white py-3 rounded-xl text-sm font-medium hover:border-white/30 transition-all"
              >
                Manual Scan
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ---- LOOKBOOK ----
const lookbookItems = [
  { img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&q=85', title: 'Urban Minimalist', span: true },
  { img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=85',  title: 'Street Bold' },
  { img: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&q=85', title: 'Clean Core' },
  { img: 'https://images.unsplash.com/photo-1536766768598-e09213fdcf22?w=800&q=85', title: 'Vintage Wash' },
  { img: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=800&q=85',  title: 'Drop Culture' },
]

// ---- TESTIMONIALS ----
const reviews = [
  { name: 'James W.', city: 'NYC', text: 'The AI size finder is genuinely magic. I've been buying the wrong size online for years. This got it right first time. The fabric quality is insane.', stars: 5, initial: 'J' },
  { name: 'Sofia R.', city: 'LA',  text: 'I ordered the Obsidian tee skeptically — $89 for a t-shirt felt crazy. It\'s hands down the best tee I own. Worth every cent. Already ordered three more.', stars: 5, initial: 'S' },
  { name: 'Marcus C.', city: 'Chicago', text: 'The virtual try-on feature blew my mind. Saw exactly how the oversized graphic tee would look before buying. Arrived in 2 days. MENZ is on another level.', stars: 5, initial: 'M' },
]

// ---- HOME PAGE ----
export default function HomePage() {
  useReveal()
  const featured = PRODUCTS.slice(0, 4)

  return (
    <>
      <HeroSection />
      <Marquee />

      {/* Categories */}
      <section className="py-28 bg-brand-black" id="categories">
        <div className="max-w-[1400px] mx-auto px-6 md:px-14">
          <div className="inline-flex items-center gap-2 bg-brand-gold/06 border border-brand-gold/15 rounded-full px-4 py-1.5 text-[11px] font-bold text-brand-gold tracking-widest uppercase mb-5 reveal">Collections</div>
          <h2 className="font-display font-black text-[clamp(36px,3.5vw,56px)] leading-tight tracking-tight mb-16 reveal">
            Shop by <em>Style</em>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {categories.map((c, i) => (
              <Link key={c.name} href={c.cat === 'Custom' ? '/design-studio' : `/products?cat=${c.cat}`}>
                <div className="cat-card relative rounded-[18px] overflow-hidden aspect-[3/4] bg-brand-card border border-brand-border cursor-pointer reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                  <Image src={c.img} alt={c.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-xl font-black mb-0.5">{c.name}</p>
                    <p className="text-sm text-white/50">{c.count === 999 ? 'Unlimited' : `${c.count} styles`}</p>
                  </div>
                  <div className="cat-arrow absolute top-4 right-4 w-9 h-9 rounded-full bg-brand-gold text-brand-black flex items-center justify-center">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-28 bg-brand-dark" id="products">
        <div className="max-w-[1400px] mx-auto px-6 md:px-14">
          <div className="flex items-end justify-between mb-16">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-gold/06 border border-brand-gold/15 rounded-full px-4 py-1.5 text-[11px] font-bold text-brand-gold tracking-widest uppercase mb-5 reveal">New Arrivals</div>
              <h2 className="font-display font-black text-[clamp(36px,3.5vw,56px)] leading-tight tracking-tight reveal">Trending Now</h2>
            </div>
            <Link href="/products" className="hidden md:inline-flex items-center gap-2 border border-brand-border text-white/70 hover:text-white hover:border-white/30 px-6 py-3 rounded-full text-sm font-semibold transition-all reveal">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Featured Drop Banner */}
      <section className="bg-gradient-to-r from-[#0f0f00] to-[#0d0d0a] border-y border-brand-gold/10 py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-14">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="reveal-left">
              <p className="text-[11px] font-bold tracking-widest uppercase text-brand-gold mb-4">★ Staff Pick of the Month</p>
              <h2 className="font-display font-black text-[clamp(40px,4.5vw,72px)] leading-none tracking-tight mb-6">
                The <span className="text-gold-gradient">Obsidian</span><br />Drop Collection
              </h2>
              <p className="text-white/50 text-base leading-relaxed max-w-[440px] mb-8">
                Limited to 500 pieces worldwide. Heavyweight 280gsm pima cotton, enzyme-washed for a buttery soft finish that only gets better with every wash.
              </p>
              <div className="flex items-baseline gap-4 mb-10">
                <span className="text-5xl font-black text-brand-gold">$89</span>
                <span className="text-xl text-brand-gray line-through">$130</span>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/products/p4" className="inline-flex items-center gap-2 bg-brand-gold text-brand-black px-8 py-4 rounded-full font-bold hover:bg-white hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(200,164,90,0.3)] transition-all">
                  Shop Now <ArrowRight size={18} />
                </Link>
                <Link href="/design-studio" className="inline-flex items-center gap-2 border border-brand-border text-white px-8 py-4 rounded-full font-semibold hover:border-white/30 transition-all">
                  🎨 Customise It
                </Link>
              </div>
            </div>
            <div className="relative reveal-right">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-brand-card">
                <Image src="https://images.unsplash.com/photo-1562157873-818bc0726f68?w=1000&q=90" alt="Obsidian Drop" fill className="object-cover" />
              </div>
              <div className="absolute top-6 right-6 bg-brand-gold text-brand-black px-4 py-2 rounded-full text-sm font-black">
                ⚡ Only 37 Left
              </div>
            </div>
          </div>
        </div>
      </section>

      <AISection />

      {/* Lookbook */}
      <section className="py-28 bg-brand-dark overflow-hidden" id="lookbook">
        <div className="max-w-[1400px] mx-auto px-6 md:px-14">
          <div className="inline-flex items-center gap-2 bg-brand-gold/06 border border-brand-gold/15 rounded-full px-4 py-1.5 text-[11px] font-bold text-brand-gold tracking-widest uppercase mb-5 reveal">Visual Stories</div>
          <h2 className="font-display font-black text-[clamp(36px,3.5vw,56px)] leading-tight tracking-tight mb-16 reveal">The Lookbook</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5" style={{ gridTemplateRows: 'auto auto' }}>
            {lookbookItems.map((item, i) => (
              <div key={i} className={`relative rounded-[18px] overflow-hidden cursor-pointer group reveal ${item.span ? 'row-span-2' : ''}`} style={{ minHeight: item.span ? '520px' : '250px', transitionDelay: `${i * 70}ms` }}>
                <Image src={item.img} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                  <p className="font-black text-xl mb-3">{item.title}</p>
                  <Link href="/products" className="inline-flex items-center gap-2 bg-brand-gold text-brand-black px-4 py-2 rounded-full text-xs font-bold">
                    Shop the Look →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-28 bg-brand-black">
        <div className="max-w-[1400px] mx-auto px-6 md:px-14 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-gold/06 border border-brand-gold/15 rounded-full px-4 py-1.5 text-[11px] font-bold text-brand-gold tracking-widest uppercase mb-5 reveal">How It Works</div>
          <h2 className="font-display font-black text-[clamp(36px,3.5vw,56px)] leading-tight tracking-tight mb-20 reveal">From Click to Delivered</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 relative">
            <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-[1px] bg-brand-border" />
            {[
              { n: '01', title: 'Browse & Discover', desc: 'Explore 200+ designs or start your custom POD creation in the Design Studio.' },
              { n: '02', title: 'AI Fit Check',      desc: 'Upload a photo or enter measurements. Get your exact size before checkout.' },
              { n: '03', title: 'Secure Checkout',   desc: 'One-click payment with Apple Pay, Google Pay, card, or BNPL.' },
              { n: '04', title: 'Fast Delivery',     desc: 'Same-day dispatch on orders before 2PM. Real-time tracking to your door.' },
            ].map((step, i) => (
              <div key={i} className="text-center reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="w-16 h-16 rounded-full border-2 border-brand-border hover:border-brand-gold hover:bg-brand-gold/10 flex items-center justify-center text-xl font-black text-brand-gold mx-auto mb-6 relative z-10 bg-brand-black transition-all">
                  {step.n}
                </div>
                <p className="font-bold text-base mb-2">{step.title}</p>
                <p className="text-sm text-brand-gray leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-28 bg-brand-dark">
        <div className="max-w-[1400px] mx-auto px-6 md:px-14">
          <div className="inline-flex items-center gap-2 bg-brand-gold/06 border border-brand-gold/15 rounded-full px-4 py-1.5 text-[11px] font-bold text-brand-gold tracking-widest uppercase mb-5 reveal">What People Say</div>
          <h2 className="font-display font-black text-[clamp(36px,3.5vw,56px)] leading-tight tracking-tight mb-16 reveal">Loved by 50,000+</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <div key={i} className="bg-brand-card border border-brand-border rounded-3xl p-8 hover:-translate-y-2 hover:border-brand-gold/10 transition-all cursor-pointer reveal group relative overflow-hidden" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-gold to-brand-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
                <div className="text-yellow-400 text-sm tracking-widest mb-4">{'★'.repeat(r.stars)}</div>
                <p className="text-4xl text-brand-gold mb-3 font-display">"</p>
                <p className="text-white/80 text-sm leading-relaxed mb-6">{r.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-gold to-brand-orange flex items-center justify-center text-brand-black font-black text-lg flex-shrink-0">
                    {r.initial}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{r.name}</p>
                    <p className="text-xs text-brand-gray">Verified Buyer · {r.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-28 bg-brand-black">
        <div className="max-w-[1400px] mx-auto px-6 md:px-14">
          <div className="bg-brand-card border border-brand-border rounded-[32px] p-16 text-center relative overflow-hidden reveal">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_100%,rgba(200,164,90,0.06),transparent_70%)]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-brand-gold/06 border border-brand-gold/15 rounded-full px-4 py-1.5 text-[11px] font-bold text-brand-gold tracking-widest uppercase mb-6">Exclusive Access</div>
              <h2 className="font-display font-black text-[clamp(32px,3.5vw,52px)] leading-tight tracking-tight mb-4">Be First to the Drop</h2>
              <p className="text-white/50 text-base mb-10">Get early access to new collections, exclusive discounts, and AI style tips.</p>
              <form
                className="flex flex-col sm:flex-row gap-3 max-w-[480px] mx-auto mb-8"
                onSubmit={e => { e.preventDefault(); alert('🎁 Welcome! Check your email for 15% off!') }}
              >
                <input
                  type="email" required placeholder="Your email address"
                  className="flex-1 bg-brand-dark border border-brand-border rounded-full px-6 py-4 text-sm text-white placeholder:text-brand-gray focus:border-brand-gold/40 outline-none transition-colors"
                />
                <button type="submit" className="bg-brand-gold text-brand-black px-8 py-4 rounded-full font-bold text-sm hover:bg-white transition-all whitespace-nowrap">
                  Subscribe →
                </button>
              </form>
              <div className="flex flex-wrap gap-8 justify-center text-sm text-brand-gray">
                <span>🎁 15% off first order</span>
                <span>⚡ Early drop access</span>
                <span>🚫 No spam, ever</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
