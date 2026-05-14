'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { ShoppingBag, Heart, Search, Menu, X } from 'lucide-react'

export default function Navbar() {
  const { count, toggleCart } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Collections', href: '/products' },
    { label: 'Shop', href: '/products' },
    { label: 'Design Studio', href: '/design-studio' },
    { label: 'Track Order', href: '/track' },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
          scrolled
            ? 'py-3 bg-brand-black/90 backdrop-blur-xl border-b border-brand-border'
            : 'py-6'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-14 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo.svg" alt="MenZculture" width={200} height={50} priority className="h-10 w-auto" />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-9 list-none">
            {links.map(l => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm font-medium text-white/60 hover:text-white transition-colors relative group"
                >
                  {l.label}
                  <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-brand-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Right icons */}
          <div className="flex items-center gap-3">
            <button
              aria-label="Search"
              className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center text-white/60 hover:text-white hover:border-brand-gold transition-all hidden md:flex"
            >
              <Search size={16} />
            </button>
            <button
              aria-label="Wishlist"
              className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center text-white/60 hover:text-white hover:border-brand-gold transition-all hidden md:flex"
            >
              <Heart size={16} />
            </button>
            <button
              aria-label="Cart"
              onClick={toggleCart}
              className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center text-white/60 hover:bg-brand-gold hover:text-brand-black hover:border-brand-gold transition-all relative"
            >
              <ShoppingBag size={16} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-gold text-brand-black text-[10px] font-bold flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
            <Link
              href="/design-studio"
              className="hidden md:inline-flex items-center gap-2 bg-brand-gold text-brand-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-white transition-all"
            >
              🎨 Create
            </Link>
            {/* Mobile menu toggle */}
            <button
              className="md:hidden w-10 h-10 rounded-full border border-brand-border flex items-center justify-center text-white"
              onClick={() => setMobileOpen(o => !o)}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden mt-2 mx-4 bg-brand-card border border-brand-border rounded-2xl p-6 space-y-4">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block text-white/70 hover:text-white font-medium transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/design-studio"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center bg-brand-gold text-brand-black py-3 rounded-full font-bold"
            >
              🎨 Create Your Design
            </Link>
          </div>
        )}
      </nav>
    </>
  )
}
