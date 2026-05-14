'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FAKE_ORDERS } from '@/lib/products'
import { Package, Truck, CheckCircle, Clock, MapPin, Printer, ArrowRight, RotateCcw } from 'lucide-react'

const STEP_ICONS = [
  <Clock key="clock" size={18} />,
  <CheckCircle key="check1" size={18} />,
  <Printer key="printer" size={18} />,
  <Package key="package" size={18} />,
  <Truck key="truck" size={18} />,
  <CheckCircle key="check2" size={18} />,
]

function TrackingResult({ orderNum }: { orderNum: string }) {
  const order = FAKE_ORDERS[orderNum]
  const [filled, setFilled] = useState(0)
  const doneCount = order.steps.filter(s => s.done).length

  useEffect(() => {
    const target = Math.min((doneCount / (order.steps.length - 1)) * 100, 100)
    const t = setTimeout(() => setFilled(target), 400)
    return () => clearTimeout(t)
  }, [doneCount, order.steps.length])

  return (
    <div className="animate-fade-up">
      {/* Header card */}
      <div className="bg-brand-card border border-brand-border rounded-3xl p-8 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold tracking-widest uppercase text-brand-gold">Order {orderNum}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                order.status === 'Delivered' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                order.status === 'In Transit' ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20' :
                'bg-brand-orange/10 text-brand-orange border border-brand-orange/20'
              }`}>
                {order.status}
              </span>
            </div>
            <p className="font-bold text-lg">{order.product}</p>
            <p className="text-brand-gray text-sm mt-1 flex items-center gap-1.5"><Clock size={13} /> Estimated Delivery: <strong className="text-white">{order.eta}</strong></p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 border border-brand-border rounded-full text-sm font-bold text-white/60 hover:text-white hover:border-white/30 transition-all">
              Contact Support
            </button>
            <button className="px-5 py-2.5 bg-brand-gold text-brand-black rounded-full text-sm font-bold hover:bg-white transition-all">
              Download Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-brand-card border border-brand-border rounded-3xl p-8 mb-6">
        <h3 className="font-bold text-lg mb-8">Order Progress</h3>
        <div className="relative pl-14">
          {/* Timeline line */}
          <div className="timeline-line" />
          <div className="timeline-line-fill" style={{ height: `${filled}%` }} />

          {order.steps.map((step, i) => (
            <div key={i} className={`relative flex items-start gap-5 mb-8 last:mb-0 transition-all duration-500 ${step.done || step.active ? 'opacity-100' : 'opacity-40'}`}
              style={{ transitionDelay: `${i * 120}ms` }}>
              {/* Icon */}
              <div className={`absolute -left-14 w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-500 ${
                step.done
                  ? 'bg-brand-gold border-brand-gold text-brand-black'
                  : step.active
                    ? 'bg-brand-blue/20 border-brand-blue text-brand-blue animate-pulse'
                    : 'bg-brand-black border-brand-border text-brand-gray'
              }`}>
                {STEP_ICONS[i]}
              </div>
              {/* Content */}
              <div className="flex-1 pb-8 last:pb-0">
                <div className="flex items-center justify-between">
                  <p className={`font-bold text-base ${step.active ? 'text-brand-blue' : step.done ? 'text-white' : 'text-brand-gray'}`}>
                    {step.label}
                    {step.active && (
                      <span className="ml-2 text-[10px] bg-brand-blue/15 text-brand-blue border border-brand-blue/20 rounded-full px-2 py-0.5 font-bold tracking-wide uppercase">
                        In Progress
                      </span>
                    )}
                  </p>
                  <span className="text-xs text-brand-gray">{step.time}</span>
                </div>
                {/* Extra detail for active step */}
                {step.active && step.label === 'Printing & QC' && (
                  <div className="mt-3 bg-brand-black rounded-xl p-4 border border-brand-border">
                    <p className="text-xs text-brand-gray mb-2">Print Queue Progress</p>
                    <div className="h-1.5 bg-brand-border rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand-gold to-brand-orange rounded-full" style={{ width: '65%', transition: 'width 1s ease' }} />
                    </div>
                    <p className="text-xs text-brand-gray mt-1.5">65% complete · Est. 2 hours</p>
                  </div>
                )}
                {step.active && step.label === 'Packed & Dispatched' && (
                  <div className="mt-3 bg-brand-black rounded-xl p-4 border border-brand-border">
                    <p className="text-xs text-brand-gray mb-1">Carrier: DHL Express</p>
                    <p className="text-xs font-bold text-brand-gold">Tracking: DHL-9876543210</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map placeholder */}
      <div className="bg-brand-card border border-brand-border rounded-3xl p-8 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-lg">Live Location</h3>
          <span className="flex items-center gap-1.5 text-xs text-green-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> LIVE
          </span>
        </div>
        <div className="relative h-56 bg-brand-black rounded-2xl border border-brand-border overflow-hidden">
          {/* Simulated map */}
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(rgba(200,164,90,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,164,90,0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          {/* Route line */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 240" preserveAspectRatio="none">
            <path d="M 40 200 Q 100 120 160 140 Q 220 160 280 100 Q 320 70 360 60" stroke="#C8A45A" strokeWidth="2" fill="none" strokeDasharray="6,4" opacity="0.5" />
            {/* Origin */}
            <circle cx="40" cy="200" r="6" fill="#888" />
            <text x="50" y="215" fontSize="12" fill="#888">Origin</text>
            {/* Current */}
            <circle cx="240" cy="120" r="8" fill="#00C2FF" className="animate-pulse" />
            <circle cx="240" cy="120" r="16" fill="none" stroke="#00C2FF" strokeWidth="1.5" opacity="0.4" />
            <text x="250" y="115" fontSize="11" fill="#00C2FF" fontWeight="bold">Your Package</text>
            {/* Destination */}
            <circle cx="360" cy="60" r="8" fill="#C8A45A" />
            <text x="320" y="50" fontSize="12" fill="#C8A45A" fontWeight="bold">Destination</text>
          </svg>
          <div className="absolute bottom-4 left-4 flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-brand-blue"><span className="w-2 h-2 rounded-full bg-brand-blue" /> In Transit</span>
            <span className="flex items-center gap-1 text-brand-gold"><span className="w-2 h-2 rounded-full bg-brand-gold" /> Destination</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-5">
          {[
            { icon: <MapPin size={16} />, label: 'Current Location', val: 'Frankfurt Hub, DE' },
            { icon: <Truck size={16} />, label: 'Carrier', val: 'DHL Express' },
            { icon: <Clock size={16} />, label: 'Est. Arrival', val: order.eta },
          ].map((info, i) => (
            <div key={i} className="bg-brand-black rounded-xl p-4 border border-brand-border">
              <div className="text-brand-gold mb-1.5">{info.icon}</div>
              <p className="text-[11px] text-brand-gray">{info.label}</p>
              <p className="text-sm font-bold mt-0.5">{info.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Order details */}
      <div className="bg-brand-card border border-brand-border rounded-3xl p-8">
        <h3 className="font-bold text-lg mb-5">Delivery Address</h3>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold flex-shrink-0">
            <MapPin size={18} />
          </div>
          <div>
            <p className="font-bold">John Doe</p>
            <p className="text-brand-gray text-sm mt-0.5">123 Bold Street, Apt 4B</p>
            <p className="text-brand-gray text-sm">New York, NY 10001</p>
            <p className="text-brand-gray text-sm">United States</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TrackPage() {
  const [orderNum, setOrderNum] = useState('')
  const [searching, setSearching] = useState(false)
  const [found, setFound] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSearching(true)
    setFound(null)
    setTimeout(() => {
      setSearching(false)
      const key = orderNum.trim().toUpperCase()
      if (FAKE_ORDERS[key]) {
        setFound(key)
      } else {
        setError('Order not found. Try MZ-001234 or MZ-005678 as demo orders.')
      }
    }, 1200)
  }

  return (
    <div className="min-h-screen pt-28 pb-24 bg-brand-black">
      <div className="max-w-[800px] mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-gold/06 border border-brand-gold/15 rounded-full px-4 py-1.5 text-[11px] font-bold text-brand-gold tracking-widest uppercase mb-5">
            Live Tracking
          </div>
          <h1 className="font-display font-black text-[clamp(40px,5vw,64px)] leading-none tracking-tight mb-4">
            Track Your Order
          </h1>
          <p className="text-brand-gray text-base">Enter your order number to see real-time status, location, and estimated delivery.</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="bg-brand-card border border-brand-border rounded-3xl p-8 mb-6">
          <label className="block text-sm font-bold mb-3">Order Number</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={orderNum}
              onChange={e => setOrderNum(e.target.value)}
              placeholder="e.g. MZ-001234"
              className="flex-1 bg-brand-black border border-brand-border rounded-2xl px-5 py-4 text-base text-white placeholder:text-brand-gray outline-none focus:border-brand-gold/40 transition-colors font-mono tracking-widest"
              required
            />
            <button
              type="submit"
              disabled={searching}
              className="bg-brand-gold text-brand-black px-8 py-4 rounded-2xl font-bold text-base hover:bg-white transition-all disabled:opacity-60 flex items-center gap-2 whitespace-nowrap"
            >
              {searching ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-brand-black border-t-transparent animate-spin" />
                  Searching...
                </>
              ) : (
                <>Track <ArrowRight size={18} /></>
              )}
            </button>
          </div>
          {error && (
            <p className="text-red-400 text-sm mt-3 flex items-center gap-2">
              ⚠️ {error}
            </p>
          )}
          {/* Demo hint */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-brand-gray">Demo orders:</span>
            {Object.keys(FAKE_ORDERS).map(k => (
              <button key={k} type="button" onClick={() => setOrderNum(k)}
                className="text-xs text-brand-gold hover:underline font-bold">{k}</button>
            ))}
          </div>
        </form>

        {/* Result */}
        {found && <TrackingResult orderNum={found} />}

        {/* If no order yet */}
        {!found && !searching && !error && (
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            {[
              { icon: '📦', title: 'Print & Pack', desc: 'We print your design and inspect quality before packing.' },
              { icon: '🚚', title: 'Fast Dispatch', desc: 'Orders dispatched same-day if placed before 2PM.' },
              { icon: '📍', title: 'Live Tracking', desc: 'Real-time courier updates from our fulfilment centre to your door.' },
            ].map((card, i) => (
              <div key={i} className="bg-brand-card border border-brand-border rounded-2xl p-6 text-center">
                <div className="text-3xl mb-3">{card.icon}</div>
                <p className="font-bold text-sm mb-1">{card.title}</p>
                <p className="text-xs text-brand-gray leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-brand-gray text-sm mb-3">Don't have an order yet?</p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-brand-gold text-brand-black px-7 py-3.5 rounded-full font-bold hover:bg-white transition-all">
            Shop Now <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
