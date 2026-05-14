export type ProductCategory = 'Graphic' | 'Essential' | 'Oversized' | 'Limited' | 'Custom'

export interface Product {
  id: string
  name: string
  category: ProductCategory
  price: number
  oldPrice?: number
  badge?: 'new' | 'hot' | 'ai' | 'sale' | 'custom'
  rating: number
  reviews: number
  images: string[]
  colors: { name: string; hex: string }[]
  sizes: string[]
  description: string
  features: string[]
  material: string
  fit: string
  allowCustomDesign: boolean
}

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Void Graphic Tee',
    category: 'Graphic',
    price: 64,
    badge: 'new',
    rating: 4.8,
    reviews: 234,
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1200&q=90',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&q=90',
    ],
    colors: [
      { name: 'Jet Black', hex: '#1a1a1a' },
      { name: 'Chalk White', hex: '#f5f5f0' },
      { name: 'Forest', hex: '#2d4a2d' },
    ],
    sizes: ['XS','S','M','L','XL','XXL'],
    description: 'A bold statement piece for those who speak through art. Heavyweight 280gsm pima cotton with a vintage-washed finish that deepens with every wash.',
    features: ['280gsm Pima Cotton', 'Enzyme Washed', 'Dropped Shoulders', 'Ribbed Collar', 'Pre-shrunk'],
    material: '100% Organic Pima Cotton',
    fit: 'Regular',
    allowCustomDesign: true,
  },
  {
    id: 'p2',
    name: 'Essential White Tee',
    category: 'Essential',
    price: 42,
    badge: 'ai',
    rating: 4.9,
    reviews: 1203,
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1200&q=90',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=90',
    ],
    colors: [
      { name: 'Chalk White', hex: '#f5f5f0' },
      { name: 'Cream', hex: '#f5f0e8' },
      { name: 'Oat', hex: '#d4c5b0' },
    ],
    sizes: ['XS','S','M','L','XL','XXL','3XL'],
    description: 'The tee that goes with everything. A wardrobe cornerstone crafted from the finest organic cotton for an impossibly soft feel that outlasts trends.',
    features: ['220gsm Organic Cotton', 'Zero-twist Yarn', 'Classic Crew Neck', 'Machine Washable', 'GOTS Certified'],
    material: '100% GOTS Organic Cotton',
    fit: 'Classic',
    allowCustomDesign: true,
  },
  {
    id: 'p3',
    name: 'Acid Wave Oversized',
    category: 'Oversized',
    price: 78,
    oldPrice: 110,
    badge: 'hot',
    rating: 4.7,
    reviews: 89,
    images: [
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1200&q=90',
      'https://images.unsplash.com/photo-1565084888279-aca607bb3754?w=1200&q=90',
    ],
    colors: [
      { name: 'Deep Navy', hex: '#2a3a5c' },
      { name: 'Sand', hex: '#c8a882' },
      { name: 'Jet Black', hex: '#1a1a1a' },
    ],
    sizes: ['S','M','L','XL','XXL'],
    description: 'Boxy, bold, and unapologetically oversized. The Acid Wave is built for those who live in the oversized silhouette with a street-art inspired acid-wash effect.',
    features: ['320gsm Fleece-back Jersey', 'Acid Washed', 'Boxy Silhouette', 'Dropped Hem', 'Double-stitched'],
    material: '80% Cotton / 20% Polyester Blend',
    fit: 'Oversized',
    allowCustomDesign: false,
  },
  {
    id: 'p4',
    name: 'Obsidian Drop Tee',
    category: 'Limited',
    price: 89,
    oldPrice: 130,
    badge: 'sale',
    rating: 5.0,
    reviews: 456,
    images: [
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=1200&q=90',
      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=1200&q=90',
    ],
    colors: [
      { name: 'Obsidian', hex: '#0a0a0a' },
      { name: 'Charcoal', hex: '#1a1a1a' },
    ],
    sizes: ['S','M','L','XL'],
    description: 'Limited to 500 pieces worldwide. The Obsidian Drop is the pinnacle of our craft — heavyweight 280gsm pima with a buttery enzyme wash that only gets better.',
    features: ['Limited 500 Pieces', '280gsm Pima Cotton', 'Enzyme Washed', 'Numbered Tag', 'Collector\'s Box'],
    material: '100% Pima Cotton',
    fit: 'Relaxed Drop',
    allowCustomDesign: false,
  },
  {
    id: 'p5',
    name: 'Cosmic Distressed',
    category: 'Graphic',
    price: 69,
    badge: 'new',
    rating: 4.6,
    reviews: 127,
    images: [
      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=1200&q=90',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1200&q=90',
    ],
    colors: [
      { name: 'Space Navy', hex: '#1a1a2e' },
      { name: 'Deep Purple', hex: '#2d1b69' },
      { name: 'Void Black', hex: '#000000' },
    ],
    sizes: ['XS','S','M','L','XL','XXL'],
    description: 'Wear the cosmos. The Cosmic Distressed features a custom-printed galaxy artwork on a distressed canvas tee for a worn-in look fresh out of the box.',
    features: ['260gsm Slub Cotton', 'Distressed Finish', 'DTG Galaxy Print', 'Relaxed Hem', 'Tagless Neck Label'],
    material: '100% Slub Cotton',
    fit: 'Regular',
    allowCustomDesign: false,
  },
  {
    id: 'p6',
    name: 'Linen Blend Relaxed',
    category: 'Essential',
    price: 55,
    badge: undefined,
    rating: 4.8,
    reviews: 321,
    images: [
      'https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?w=1200&q=90',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1200&q=90',
    ],
    colors: [
      { name: 'Sand', hex: '#c8b4a0' },
      { name: 'Butter', hex: '#e8d5b7' },
      { name: 'Warm Tan', hex: '#a08070' },
    ],
    sizes: ['XS','S','M','L','XL','XXL'],
    description: 'Effortless summer dressing. The linen-cotton blend delivers natural breathability with the softness of cotton — the perfect everyday foundation.',
    features: ['55% Linen / 45% Cotton', 'Breathable Weave', 'V-Neck Option', 'Relaxed Silhouette', 'Machine Washable'],
    material: '55% Linen / 45% Organic Cotton',
    fit: 'Relaxed',
    allowCustomDesign: true,
  },
  {
    id: 'p7',
    name: 'Chrome Logo Tee',
    category: 'Limited',
    price: 95,
    oldPrice: 140,
    badge: 'hot',
    rating: 4.9,
    reviews: 78,
    images: [
      'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=1200&q=90',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=1200&q=90',
    ],
    colors: [
      { name: 'Chrome', hex: '#c0c0c0' },
      { name: 'Jet Black', hex: '#1a1a1a' },
    ],
    sizes: ['S','M','L','XL','XXL'],
    description: 'The Chrome Logo is a statement of restraint. A minimal chrome-foil MenZculture logo on our softest supima cotton blank — understated luxury.',
    features: ['300gsm Supima Cotton', 'Chrome Foil Print', 'Reinforced Seams', 'Box Fit', 'Limited Release'],
    material: '100% Supima Cotton',
    fit: 'Box',
    allowCustomDesign: false,
  },
  {
    id: 'p8',
    name: 'Washed Street Tee',
    category: 'Oversized',
    price: 58,
    badge: 'ai',
    rating: 4.7,
    reviews: 512,
    images: [
      'https://images.unsplash.com/photo-1536766768598-e09213fdcf22?w=1200&q=90',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1200&q=90',
    ],
    colors: [
      { name: 'Tobacco', hex: '#8b7355' },
      { name: 'Mahogany', hex: '#5c4033' },
      { name: 'Ash', hex: '#2d2d2d' },
    ],
    sizes: ['S','M','L','XL','XXL','3XL'],
    description: 'The street tee, perfected. A garment-dyed oversized silhouette that looks like it\'s been lived in for years — from the very first wear.',
    features: ['240gsm Ring-spun Cotton', 'Garment Dyed', 'Tonal Stitching', 'Washed Hem', 'No Tags'],
    material: '100% Ring-spun Cotton',
    fit: 'Oversized',
    allowCustomDesign: true,
  },
  {
    id: 'custom-blank',
    name: 'Your Design — Blank Canvas',
    category: 'Custom',
    price: 49,
    badge: 'custom',
    rating: 4.9,
    reviews: 892,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=90',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1200&q=90',
    ],
    colors: [
      { name: 'Chalk White', hex: '#f5f5f0' },
      { name: 'Jet Black', hex: '#1a1a1a' },
      { name: 'Ash Gray', hex: '#9e9e9e' },
      { name: 'Navy', hex: '#1a1a3e' },
      { name: 'Forest', hex: '#2d4a2d' },
      { name: 'Sand', hex: '#c8b4a0' },
    ],
    sizes: ['XS','S','M','L','XL','XXL','3XL'],
    description: 'Print on Demand, your way. Upload your artwork, add text, position your design — then we print, pack, and ship it directly to you or your customers.',
    features: ['220gsm Pima Cotton', 'DTG Printing', 'Vibrant CMYK', 'Ships in 2-4 Days', 'Bulk Discounts'],
    material: '100% Pima Cotton',
    fit: 'Classic',
    allowCustomDesign: true,
  },
]

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id)
}

export const BADGE_LABELS: Record<string, string> = {
  new: 'NEW',
  hot: '🔥 HOT',
  ai: '✦ AI Pick',
  sale: 'SALE',
  custom: '🎨 POD',
}

export const BADGE_STYLES: Record<string, string> = {
  new:    'bg-brand-gold text-brand-black',
  hot:    'bg-brand-orange text-white',
  ai:     'bg-brand-blue/10 text-brand-blue border border-brand-blue/30',
  sale:   'bg-brand-orange/10 text-brand-orange border border-brand-orange/30',
  custom: 'bg-brand-gold/10 text-brand-gold border border-brand-gold/30',
}

export const FAKE_ORDERS: Record<string, { status: string; steps: { label: string; time: string; done: boolean; active: boolean }[]; product: string; eta: string }> = {
  'MZ-001234': {
    status: 'In Transit',
    product: 'Void Graphic Tee (M, Jet Black)',
    eta: 'May 16, 2026',
    steps: [
      { label: 'Order Placed',         time: 'May 12 · 10:23 AM', done: true,  active: false },
      { label: 'Design Confirmed',     time: 'May 12 · 10:45 AM', done: true,  active: false },
      { label: 'Printing & QC',        time: 'May 13 · 2:10 PM',  done: true,  active: false },
      { label: 'Packed & Dispatched',  time: 'May 14 · 9:00 AM',  done: true,  active: true  },
      { label: 'Out for Delivery',     time: 'Est. May 16',        done: false, active: false },
      { label: 'Delivered',            time: 'Est. May 16',        done: false, active: false },
    ],
  },
  'MZ-005678': {
    status: 'Printing',
    product: 'Essential White Tee (L, Chalk White) × 3',
    eta: 'May 18, 2026',
    steps: [
      { label: 'Order Placed',        time: 'May 13 · 4:55 PM',  done: true,  active: false },
      { label: 'Design Confirmed',    time: 'May 13 · 5:10 PM',  done: true,  active: false },
      { label: 'Printing & QC',       time: 'In Progress',        done: false, active: true  },
      { label: 'Packed & Dispatched', time: 'Est. May 15',        done: false, active: false },
      { label: 'Out for Delivery',    time: 'Est. May 18',        done: false, active: false },
      { label: 'Delivered',           time: 'Est. May 18',        done: false, active: false },
    ],
  },
}
