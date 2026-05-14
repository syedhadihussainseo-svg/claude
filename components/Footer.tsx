import Link from 'next/link'
import Image from 'next/image'

const cols = [
  {
    title: 'Shop',
    links: [
      { label: 'New Arrivals', href: '/products' },
      { label: 'Bestsellers', href: '/products' },
      { label: 'Graphic Tees', href: '/products?cat=Graphic' },
      { label: 'Essentials', href: '/products?cat=Essential' },
      { label: 'Limited Edition', href: '/products?cat=Limited' },
      { label: 'Design Your Own', href: '/design-studio' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Size Guide', href: '#' },
      { label: 'Shipping Info', href: '#' },
      { label: 'Returns & Exchanges', href: '#' },
      { label: 'Track My Order', href: '/track' },
      { label: 'FAQ', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About MenZculture', href: '#' },
      { label: 'Sustainability', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Affiliates', href: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-brand-dark border-t border-brand-border pt-20 pb-10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand col */}
          <div className="lg:col-span-2">
            <Image src="/logo.svg" alt="MenZculture" width={220} height={55} className="h-12 w-auto mb-5" />
            <p className="text-brand-gray text-sm leading-relaxed max-w-xs">
              Premium print-on-demand t-shirts for the bold. Upload your design, choose your blank, and we ship it to the world.
            </p>
            <div className="flex gap-3 mt-6">
              {['ig', 'tk', 'tw', 'yt'].map(s => (
                <a
                  key={s}
                  href="#"
                  className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center text-brand-gray hover:border-brand-gold hover:text-brand-gold text-xs font-bold transition-all uppercase"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
          {/* Links */}
          {cols.map(col => (
            <div key={col.title}>
              <h4 className="text-xs font-bold tracking-[1.5px] uppercase text-white mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-brand-gray hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-brand-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-brand-gray text-sm">© 2026 MenZculture. All rights reserved. Crafted for bold humans.</p>
          <div className="flex gap-2 flex-wrap justify-center">
            {['VISA', 'MC', 'AMEX', 'APPLE PAY', 'G PAY', 'KLARNA'].map(p => (
              <span key={p} className="bg-brand-card border border-brand-border px-2.5 py-1 rounded text-[10px] font-bold text-brand-gray">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
