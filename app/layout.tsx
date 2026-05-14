import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import Cursor from '@/components/Cursor'

export const metadata: Metadata = {
  title: { default: 'MenZculture — Premium Print on Demand', template: '%s | MenZculture' },
  description: 'Premium print-on-demand t-shirts. Design your own, choose your size with AI, and wear your boldest self.',
  keywords: ['print on demand', 'custom t-shirts', 'POD', 'MenZculture', 'premium tees'],
  openGraph: {
    title: 'MenZculture — Premium Print on Demand',
    description: 'Upload your design. We print & ship.',
    siteName: 'MenZculture',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-brand-black text-brand-light antialiased">
        <CartProvider>
          <Cursor />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}
