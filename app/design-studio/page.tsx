'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useCart } from '@/context/CartContext'
import {
  MousePointer2, Type, ImageIcon, Shapes, Sparkles,
  Trash2, Download, RotateCcw, RotateCw,
  Bold, Italic, ShoppingBag, ChevronRight,
  Layers, ZoomIn, ZoomOut,
  Star, Square, Circle, Minus
} from 'lucide-react'

type Tool = 'select' | 'text' | 'image' | 'shape' | 'template'
type ShapeKind = 'rect' | 'circle' | 'star' | 'line'

interface Layer {
  id: string
  type: 'text' | 'image' | 'shape'
  x: number
  y: number
  w: number
  h: number
  text?: string
  src?: string
  img?: HTMLImageElement
  font?: string
  fontSize?: number
  bold?: boolean
  italic?: boolean
  textColor?: string
  shapeKind?: ShapeKind
  fillColor?: string
  rotation?: number
  opacity?: number
}

const SHIRT_COLORS = [
  { name: 'Chalk White',  hex: '#f5f5f0' },
  { name: 'Jet Black',    hex: '#141414' },
  { name: 'Ash Gray',     hex: '#8a8a8a' },
  { name: 'Deep Navy',    hex: '#1a2040' },
  { name: 'Forest',       hex: '#1e3a1e' },
  { name: 'Sand',         hex: '#c8a878' },
  { name: 'Crimson',      hex: '#6b0f0f' },
  { name: 'Royal Blue',   hex: '#0f2a6b' },
  { name: 'Burgundy',     hex: '#4a0e20' },
  { name: 'Olive',        hex: '#4a4a1e' },
]

const FONTS = ['Inter', 'Playfair Display', 'Georgia', 'Arial Black', 'Courier New', 'Impact', 'Trebuchet MS']
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']

function uid() { return Math.random().toString(36).slice(2, 9) }

const CANVAS_W = 500
const CANVAS_H = 580
const PZ = { x: 155, y: 145, w: 190, h: 230 }

function lighten(hex: string, amt: number): string {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, Math.min(255, (n >> 16) + amt))
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt))
  const b = Math.max(0, Math.min(255, (n & 0xff) + amt))
  return `rgb(${r},${g},${b})`
}

function drawShirt(ctx: CanvasRenderingContext2D, color: string, w: number, h: number) {
  const cx = w / 2
  const bodyTop    = h * 0.20
  const bodyBot    = h * 0.92
  const bodyLeft   = w * 0.20
  const bodyRight  = w * 0.80
  const sleeveTop  = h * 0.08
  const collarW    = w * 0.14
  const collarDepth = h * 0.08

  const isLight = parseInt(color.replace('#', ''), 16) > 0x888888

  ctx.save()

  // Main gradient fill
  const grad = ctx.createLinearGradient(bodyLeft, bodyTop, bodyRight, bodyBot)
  grad.addColorStop(0,   lighten(color, isLight ? -8  :  15))
  grad.addColorStop(0.4, color)
  grad.addColorStop(1,   lighten(color, isLight ? -15 : -20))
  ctx.fillStyle = grad

  ctx.beginPath()
  // Left sleeve tip
  ctx.moveTo(w * 0.02, sleeveTop + h * 0.05)
  ctx.lineTo(w * 0.05, sleeveTop)
  // Left sleeve top to left shoulder
  ctx.lineTo(w * 0.27, bodyTop - h * 0.02)
  // Left collar
  ctx.quadraticCurveTo(cx - collarW * 0.3, bodyTop, cx - collarW, bodyTop + collarDepth * 0.4)
  ctx.quadraticCurveTo(cx - collarW * 0.3, bodyTop + collarDepth, cx, bodyTop + collarDepth)
  // Right collar
  ctx.quadraticCurveTo(cx + collarW * 0.3, bodyTop + collarDepth, cx + collarW, bodyTop + collarDepth * 0.4)
  ctx.quadraticCurveTo(cx + collarW * 0.3, bodyTop, w * 0.73, bodyTop - h * 0.02)
  // Right sleeve
  ctx.lineTo(w * 0.95, sleeveTop)
  ctx.lineTo(w * 0.98, sleeveTop + h * 0.05)
  ctx.lineTo(w * 0.82, bodyTop + h * 0.10)
  // Right body
  ctx.lineTo(bodyRight, bodyBot - h * 0.03)
  ctx.quadraticCurveTo(bodyRight - 2, bodyBot, bodyRight - 10, bodyBot)
  ctx.lineTo(bodyLeft + 10, bodyBot)
  ctx.quadraticCurveTo(bodyLeft + 2, bodyBot, bodyLeft, bodyBot - h * 0.03)
  // Left body back to sleeve
  ctx.lineTo(w * 0.18, bodyTop + h * 0.10)
  ctx.closePath()
  ctx.fill()

  // Left sleeve shading
  ctx.fillStyle = 'rgba(0,0,0,0.06)'
  ctx.beginPath()
  ctx.moveTo(w * 0.02, sleeveTop + h * 0.05)
  ctx.lineTo(w * 0.05, sleeveTop)
  ctx.lineTo(w * 0.27, bodyTop - h * 0.02)
  ctx.lineTo(w * 0.18, bodyTop + h * 0.10)
  ctx.closePath()
  ctx.fill()

  // Right sleeve shading
  ctx.fillStyle = 'rgba(0,0,0,0.06)'
  ctx.beginPath()
  ctx.moveTo(w * 0.98, sleeveTop + h * 0.05)
  ctx.lineTo(w * 0.95, sleeveTop)
  ctx.lineTo(w * 0.73, bodyTop - h * 0.02)
  ctx.lineTo(w * 0.82, bodyTop + h * 0.10)
  ctx.closePath()
  ctx.fill()

  // Shirt outline
  ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.08)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(w * 0.02, sleeveTop + h * 0.05)
  ctx.lineTo(w * 0.05, sleeveTop)
  ctx.lineTo(w * 0.27, bodyTop - h * 0.02)
  ctx.quadraticCurveTo(cx - collarW * 0.3, bodyTop, cx - collarW, bodyTop + collarDepth * 0.4)
  ctx.quadraticCurveTo(cx - collarW * 0.3, bodyTop + collarDepth, cx, bodyTop + collarDepth)
  ctx.quadraticCurveTo(cx + collarW * 0.3, bodyTop + collarDepth, cx + collarW, bodyTop + collarDepth * 0.4)
  ctx.quadraticCurveTo(cx + collarW * 0.3, bodyTop, w * 0.73, bodyTop - h * 0.02)
  ctx.lineTo(w * 0.95, sleeveTop)
  ctx.lineTo(w * 0.98, sleeveTop + h * 0.05)
  ctx.lineTo(w * 0.82, bodyTop + h * 0.10)
  ctx.lineTo(bodyRight, bodyBot - h * 0.03)
  ctx.quadraticCurveTo(bodyRight - 2, bodyBot, bodyRight - 10, bodyBot)
  ctx.lineTo(bodyLeft + 10, bodyBot)
  ctx.quadraticCurveTo(bodyLeft + 2, bodyBot, bodyLeft, bodyBot - h * 0.03)
  ctx.lineTo(w * 0.18, bodyTop + h * 0.10)
  ctx.closePath()
  ctx.stroke()

  ctx.restore()
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, points = 5) {
  ctx.beginPath()
  for (let i = 0; i < points * 2; i++) {
    const a = (i * Math.PI) / points - Math.PI / 2
    const rad = i % 2 === 0 ? r : r * 0.45
    if (i === 0) ctx.moveTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad)
    else ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad)
  }
  ctx.closePath()
}

function drawLayer(ctx: CanvasRenderingContext2D, l: Layer, sel: boolean) {
  ctx.save()
  ctx.globalAlpha = l.opacity ?? 1
  const cx = l.x + l.w / 2
  const cy = l.y + l.h / 2
  ctx.translate(cx, cy)
  ctx.rotate(((l.rotation ?? 0) * Math.PI) / 180)
  ctx.translate(-cx, -cy)

  if (l.type === 'text') {
    const style = `${l.italic ? 'italic ' : ''}${l.bold ? 'bold ' : ''}${l.fontSize ?? 24}px "${l.font ?? 'Inter'}"`
    ctx.font = style
    ctx.fillStyle = l.textColor ?? '#ffffff'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.fillText(l.text ?? '', cx, cy)
  } else if (l.type === 'image' && l.img) {
    ctx.drawImage(l.img, l.x, l.y, l.w, l.h)
  } else if (l.type === 'shape') {
    ctx.fillStyle = l.fillColor ?? '#D4A017'
    if (l.shapeKind === 'rect') {
      ctx.beginPath()
      ctx.roundRect(l.x, l.y, l.w, l.h, 6)
      ctx.fill()
    } else if (l.shapeKind === 'circle') {
      ctx.beginPath()
      ctx.ellipse(cx, cy, l.w / 2, l.h / 2, 0, 0, Math.PI * 2)
      ctx.fill()
    } else if (l.shapeKind === 'star') {
      drawStar(ctx, cx, cy, Math.min(l.w, l.h) / 2)
      ctx.fill()
    } else if (l.shapeKind === 'line') {
      ctx.strokeStyle = l.fillColor ?? '#D4A017'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(l.x, cy)
      ctx.lineTo(l.x + l.w, cy)
      ctx.stroke()
    }
  }

  if (sel) {
    ctx.globalAlpha = 1
    ctx.strokeStyle = '#00D4FF'
    ctx.lineWidth = 1.5
    ctx.setLineDash([4, 3])
    ctx.strokeRect(l.x - 2, l.y - 2, l.w + 4, l.h + 4)
    ctx.setLineDash([])
    const handles = [
      [l.x - 2,         l.y - 2],
      [l.x + l.w / 2,   l.y - 2],
      [l.x + l.w + 2,   l.y - 2],
      [l.x - 2,         l.y + l.h / 2],
      [l.x + l.w + 2,   l.y + l.h / 2],
      [l.x - 2,         l.y + l.h + 2],
      [l.x + l.w / 2,   l.y + l.h + 2],
      [l.x + l.w + 2,   l.y + l.h + 2],
    ]
    handles.forEach(([hx, hy]) => {
      ctx.fillStyle = '#00D4FF'
      ctx.beginPath()
      ctx.arc(hx, hy, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#050507'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(hx, hy, 4, 0, Math.PI * 2)
      ctx.stroke()
    })
  }
  ctx.restore()
}

const AI_TEMPLATES = [
  {
    name: 'Geometric Gold',
    create: (): Omit<Layer, 'id'>[] => [
      { type: 'shape', x: PZ.x + 30,  y: PZ.y + 30,  w: 130, h: 130, shapeKind: 'circle', fillColor: 'rgba(212,160,23,0.15)', rotation: 0,   opacity: 1   },
      { type: 'shape', x: PZ.x + 55,  y: PZ.y + 55,  w: 80,  h: 80,  shapeKind: 'star',   fillColor: '#D4A017',               rotation: 0,   opacity: 1   },
      { type: 'text',  x: PZ.x + 20,  y: PZ.y + 170, w: 150, h: 32,  text: 'MENZCULTURE', font: 'Arial Black', fontSize: 16, bold: true, textColor: '#F0C040', rotation: 0, opacity: 1 },
    ],
  },
  {
    name: 'Minimal Type',
    create: (): Omit<Layer, 'id'>[] => [
      { type: 'text',  x: PZ.x + 10,  y: PZ.y + 60,  w: 170, h: 50, text: 'MADE',      font: 'Impact', fontSize: 52, bold: false, textColor: '#ffffff', rotation: 0, opacity: 1 },
      { type: 'text',  x: PZ.x + 10,  y: PZ.y + 115, w: 170, h: 50, text: 'DIFFERENT', font: 'Impact', fontSize: 36, bold: false, textColor: '#D4A017', rotation: 0, opacity: 1 },
      { type: 'shape', x: PZ.x + 10,  y: PZ.y + 160, w: 170, h: 2,  shapeKind: 'line', fillColor: '#D4A017', rotation: 0, opacity: 1 },
    ],
  },
  {
    name: 'Street Stars',
    create: (): Omit<Layer, 'id'>[] => [
      { type: 'shape', x: PZ.x + 10,  y: PZ.y + 10,  w: 50,  h: 50,  shapeKind: 'star', fillColor: '#D4A017', rotation: 15,  opacity: 0.8 },
      { type: 'shape', x: PZ.x + 130, y: PZ.y + 20,  w: 36,  h: 36,  shapeKind: 'star', fillColor: '#00D4FF', rotation: -10, opacity: 0.8 },
      { type: 'shape', x: PZ.x + 70,  y: PZ.y + 180, w: 28,  h: 28,  shapeKind: 'star', fillColor: '#FF4D00', rotation: 20,  opacity: 0.9 },
      { type: 'text',  x: PZ.x + 15,  y: PZ.y + 90,  w: 160, h: 40,  text: '★ CULTURE ★', font: 'Arial Black', fontSize: 22, bold: true, textColor: '#ffffff', rotation: 0, opacity: 1 },
    ],
  },
]

export default function DesignStudio() {
  const { addItem, showToast } = useCart()
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const fileRef    = useRef<HTMLInputElement>(null)

  const [layers,      setLayers]      = useState<Layer[]>([])
  const [selId,       setSelId]       = useState<string | null>(null)
  const [tool,        setTool]        = useState<Tool>('select')
  const [shirtColor,  setShirtColor]  = useState(SHIRT_COLORS[1])
  const [activeSize,  setActiveSize]  = useState('M')
  const [qty,         setQty]         = useState(1)
  const [zoom,        setZoom]        = useState(1)
  const [step,        setStep]        = useState(0)
  const [history,     setHistory]     = useState<Layer[][]>([[]])
  const [histIdx,     setHistIdx]     = useState(0)
  const [shapeKind,   setShapeKind]   = useState<ShapeKind>('rect')
  const [showTextBox, setShowTextBox] = useState(false)
  const [textInput,   setTextInput]   = useState('')
  const [textPos,     setTextPos]     = useState({ x: 200, y: 250 })

  const selLayer = layers.find(l => l.id === selId) ?? null
  const dragRef  = useRef<{ id: string; ox: number; oy: number } | null>(null)

  // ── History helpers ──────────────────────────────────────────────────────────
  const push = useCallback((newLayers: Layer[]) => {
    setHistory(h => {
      const next = h.slice(0, histIdx + 1)
      return [...next, newLayers]
    })
    setHistIdx(i => i + 1)
    setLayers(newLayers)
  }, [histIdx])

  const undo = useCallback(() => {
    if (histIdx <= 0) return
    const idx = histIdx - 1
    setHistIdx(idx)
    setHistory(h => { setLayers(h[idx] ?? []); return h })
    setSelId(null)
  }, [histIdx])

  const redo = useCallback(() => {
    setHistory(h => {
      if (histIdx >= h.length - 1) return h
      const idx = histIdx + 1
      setHistIdx(idx)
      setLayers(h[idx] ?? [])
      return h
    })
    setSelId(null)
  }, [histIdx])

  // ── Keyboard shortcuts ───────────────────────────────────────────────────────
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo() }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); redo() }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selId &&
          document.activeElement?.tagName !== 'INPUT' &&
          document.activeElement?.tagName !== 'TEXTAREA' &&
          document.activeElement?.tagName !== 'SELECT') {
        setLayers(ls => { const next = ls.filter(l => l.id !== selId); push(next); return next })
        setSelId(null)
      }
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [undo, redo, selId, push])

  // ── Draw ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)

    // Background
    ctx.fillStyle = '#1a1a22'
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

    // Subtle grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)'
    ctx.lineWidth = 1
    for (let x = 0; x < CANVAS_W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_H); ctx.stroke()
    }
    for (let y = 0; y < CANVAS_H; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke()
    }

    drawShirt(ctx, shirtColor.hex, CANVAS_W, CANVAS_H)

    // Print zone dashed
    ctx.setLineDash([6, 4])
    ctx.strokeStyle = 'rgba(0,212,255,0.25)'
    ctx.lineWidth = 1.5
    ctx.strokeRect(PZ.x, PZ.y, PZ.w, PZ.h)
    ctx.setLineDash([])

    if (layers.length === 0) {
      ctx.fillStyle = 'rgba(0,212,255,0.3)'
      ctx.font = '11px Inter'
      ctx.textAlign = 'center'
      ctx.fillText('PRINT ZONE', PZ.x + PZ.w / 2, PZ.y - 8)
    }

    layers.forEach(l => drawLayer(ctx, l, l.id === selId))
  }, [layers, selId, shirtColor])

  // ── Canvas mouse events ──────────────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const cv = canvasRef.current
    if (!cv) return
    const rect = cv.getBoundingClientRect()
    const mx = (e.clientX - rect.left) / zoom
    const my = (e.clientY - rect.top) / zoom

    if (tool === 'select') {
      const hit = [...layers].reverse().find(l => mx >= l.x && mx <= l.x + l.w && my >= l.y && my <= l.y + l.h)
      if (hit) {
        setSelId(hit.id)
        dragRef.current = { id: hit.id, ox: mx - hit.x, oy: my - hit.y }
      } else {
        setSelId(null)
      }
      return
    }

    if (tool === 'text') {
      setTextPos({
        x: Math.max(PZ.x, Math.min(mx - 60, PZ.x + PZ.w - 120)),
        y: Math.max(PZ.y, Math.min(my, PZ.y + PZ.h - 30)),
      })
      setTextInput('')
      setShowTextBox(true)
      return
    }

    if (tool === 'shape') {
      const x = Math.max(PZ.x, Math.min(mx - 40, PZ.x + PZ.w - 80))
      const y = Math.max(PZ.y, Math.min(my - 40, PZ.y + PZ.h - 80))
      const nl: Layer = { id: uid(), type: 'shape', x, y, w: 80, h: 80, shapeKind, fillColor: '#D4A017', rotation: 0, opacity: 1 }
      const next = [...layers, nl]
      push(next)
      setSelId(nl.id)
      setTool('select')
    }
  }

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragRef.current || tool !== 'select') return
    const cv = canvasRef.current
    if (!cv) return
    const rect = cv.getBoundingClientRect()
    const mx = (e.clientX - rect.left) / zoom
    const my = (e.clientY - rect.top) / zoom
    const { id, ox, oy } = dragRef.current
    setLayers(ls => ls.map(l => l.id === id ? { ...l, x: mx - ox, y: my - oy } : l))
  }

  const onMouseUp = () => {
    if (dragRef.current) {
      // Commit drag to history
      setLayers(ls => {
        setHistory(h => {
          const next = h.slice(0, histIdx + 1)
          return [...next, [...ls]]
        })
        setHistIdx(i => i + 1)
        return ls
      })
    }
    dragRef.current = null
  }

  // ── Add text ─────────────────────────────────────────────────────────────────
  const addText = () => {
    if (!textInput.trim()) { setShowTextBox(false); return }
    const nl: Layer = {
      id: uid(), type: 'text',
      x: textPos.x, y: textPos.y, w: 160, h: 36,
      text: textInput, font: 'Inter', fontSize: 24,
      bold: false, italic: false, textColor: '#ffffff', rotation: 0, opacity: 1,
    }
    push([...layers, nl])
    setSelId(nl.id)
    setShowTextBox(false)
    setTool('select')
  }

  // ── Add image ────────────────────────────────────────────────────────────────
  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    const img = document.createElement('img')
    img.onload = () => {
      const aspect = img.naturalWidth / img.naturalHeight
      const w = Math.min(160, PZ.w - 20)
      const h = w / aspect
      const nl: Layer = {
        id: uid(), type: 'image',
        x: PZ.x + (PZ.w - w) / 2, y: PZ.y + (PZ.h - h) / 2, w, h,
        src: url, img, rotation: 0, opacity: 1,
      }
      push([...layers, nl])
      setSelId(nl.id)
      setTool('select')
    }
    img.src = url
    e.target.value = ''
  }

  // ── Apply AI template ────────────────────────────────────────────────────────
  const applyTemplate = (t: typeof AI_TEMPLATES[0]) => {
    const created = t.create().map(base => ({ ...base, id: uid() } as Layer))
    push([...layers, ...created])
    setSelId(null)
    showToast(`✨ "${t.name}" applied!`)
    setTool('select')
  }

  // ── Update selected layer ─────────────────────────────────────────────────────
  const updateSel = (updates: Partial<Layer>) => {
    if (!selId) return
    setLayers(ls => ls.map(l => l.id === selId ? { ...l, ...updates } : l))
  }

  const commitSel = () => {
    setLayers(ls => {
      setHistory(h => {
        const next = h.slice(0, histIdx + 1)
        return [...next, [...ls]]
      })
      setHistIdx(i => i + 1)
      return ls
    })
  }

  // ── Delete layer ─────────────────────────────────────────────────────────────
  const deleteLayer = (id: string) => {
    push(layers.filter(l => l.id !== id))
    setSelId(null)
  }

  // ── Export PNG ───────────────────────────────────────────────────────────────
  const exportPng = () => {
    const cv = canvasRef.current
    if (!cv) return
    const a = document.createElement('a')
    a.download = 'menz-design.png'
    a.href = cv.toDataURL('image/png')
    a.click()
    showToast('✓ Design downloaded!')
  }

  // ── Add to Cart ──────────────────────────────────────────────────────────────
  const addToCart = () => {
    if (!activeSize) { showToast('⚠️ Select a size'); return }
    const cv = canvasRef.current
    const design = cv?.toDataURL('image/png')
    addItem({
      productId: 'custom-blank',
      name: 'Custom Design Tee',
      price: 49,
      size: activeSize,
      color: shirtColor.name,
      qty,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      customDesign: design,
    })
    showToast('✓ Added to cart!')
    setStep(2)
  }

  const TOOLS: { id: Tool; icon: React.ReactNode; label: string }[] = [
    { id: 'select',   icon: <MousePointer2 size={18} />, label: 'Select'    },
    { id: 'text',     icon: <Type size={18} />,          label: 'Text'      },
    { id: 'image',    icon: <ImageIcon size={18} />,     label: 'Image'     },
    { id: 'shape',    icon: <Shapes size={18} />,        label: 'Shapes'    },
    { id: 'template', icon: <Sparkles size={18} />,      label: 'Templates' },
  ]

  return (
    <div className="min-h-screen bg-[#050507] flex flex-col pt-16">

      {/* ── TOP BAR ──────────────────────────────────────────────────────────── */}
      <div className="border-b border-white/[0.07] bg-[#0C0C12]/80 backdrop-blur-xl px-6 py-3 flex items-center justify-between gap-4 sticky top-16 z-40">

        {/* Step indicator */}
        <div className="flex items-center gap-1">
          {['Design', 'Preview', 'Order'].map((s, i) => (
            <div key={i} className="flex items-center gap-1">
              <button
                onClick={() => i <= 1 && setStep(i)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  step === i ? 'bg-[#D4A017] text-black' : step > i ? 'text-[#D4A017]' : 'text-white/30'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  step === i ? 'bg-black/20' : step > i ? 'bg-[#D4A017]/20' : 'bg-white/[0.06]'
                }`}>{i + 1}</span>
                {s}
              </button>
              {i < 2 && <ChevronRight size={12} className="text-white/20" />}
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            title="Undo (Ctrl+Z)"
            className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center transition-colors"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={redo}
            title="Redo (Ctrl+Y)"
            className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center transition-colors"
          >
            <RotateCw size={14} />
          </button>

          <div className="w-px h-5 bg-white/[0.07]" />

          <button
            onClick={() => setZoom(z => Math.max(0.5, +(z - 0.1).toFixed(1)))}
            className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center transition-colors"
          >
            <ZoomOut size={14} />
          </button>
          <span className="text-xs text-white/40 w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(z => Math.min(2, +(z + 0.1).toFixed(1)))}
            className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center transition-colors"
          >
            <ZoomIn size={14} />
          </button>

          <div className="w-px h-5 bg-white/[0.07]" />

          <button
            onClick={exportPng}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold transition-colors"
          >
            <Download size={13} /> Export
          </button>
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#D4A017] text-black text-xs font-bold hover:bg-[#F0C040] transition-colors"
          >
            Preview <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* ── MAIN 3-PANEL AREA ────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT: TOOLS ──────────────────────────────────────────────────── */}
        <div className="w-56 border-r border-white/[0.07] bg-[#0C0C12] flex flex-col overflow-y-auto">

          {/* Tool buttons */}
          <div className="p-3 space-y-1 border-b border-white/[0.07]">
            <p className="text-[10px] font-bold tracking-widest uppercase text-white/30 px-2 mb-2">Tools</p>
            {TOOLS.map(t => (
              <button
                key={t.id}
                onClick={() => {
                  setTool(t.id)
                  if (t.id === 'image') fileRef.current?.click()
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  tool === t.id
                    ? 'bg-[#D4A017]/15 text-[#D4A017] border border-[#D4A017]/30 shadow-[0_0_12px_rgba(212,160,23,0.15)]'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.05] border border-transparent'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={addImage} />
          </div>

          {/* Shape sub-tools */}
          {tool === 'shape' && (
            <div className="p-3 border-b border-white/[0.07]">
              <p className="text-[10px] font-bold tracking-widest uppercase text-white/30 px-1 mb-2">Shape</p>
              <div className="grid grid-cols-2 gap-2">
                {([
                  ['rect',   <Square size={14} key="rect" />, 'rect'],
                  ['circle', <Circle size={14} key="circle" />, 'circle'],
                  ['star',   <Star size={14} key="star" />, 'star'],
                  ['line',   <Minus size={14} key="line" />, 'line'],
                ] as [ShapeKind, React.ReactNode, string][]).map(([k, icon, label]) => (
                  <button
                    key={k}
                    onClick={() => setShapeKind(k)}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                      shapeKind === k
                        ? 'bg-[#D4A017]/15 text-[#D4A017] border border-[#D4A017]/30'
                        : 'text-white/50 hover:text-white border border-white/[0.07] hover:border-white/20'
                    }`}
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AI Templates */}
          {tool === 'template' && (
            <div className="p-3 space-y-2 border-b border-white/[0.07]">
              <p className="text-[10px] font-bold tracking-widest uppercase text-white/30 px-1 mb-2">AI Templates</p>
              {AI_TEMPLATES.map(t => (
                <button
                  key={t.name}
                  onClick={() => applyTemplate(t)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-white/[0.08] hover:border-[#D4A017]/40 hover:bg-[#D4A017]/[0.05] text-left transition-all group"
                >
                  <Sparkles size={13} className="text-[#D4A017] flex-shrink-0" />
                  <span className="text-xs font-medium text-white/70 group-hover:text-white">{t.name}</span>
                </button>
              ))}
              <div className="mt-3 pt-3 border-t border-white/[0.07]">
                <button
                  onClick={() => applyTemplate(AI_TEMPLATES[Math.floor(Math.random() * AI_TEMPLATES.length)])}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A017]/20 to-[#00D4FF]/20 border border-[#D4A017]/30 text-xs font-bold text-[#D4A017] hover:from-[#D4A017]/30 hover:to-[#00D4FF]/30 transition-all"
                >
                  <Sparkles size={13} /> AI Suggest Design
                </button>
              </div>
            </div>
          )}

          {/* Shirt Colors */}
          <div className="p-3 border-b border-white/[0.07]">
            <p className="text-[10px] font-bold tracking-widest uppercase text-white/30 px-1 mb-2">Shirt Color</p>
            <div className="grid grid-cols-5 gap-1.5">
              {SHIRT_COLORS.map(c => (
                <button
                  key={c.hex}
                  onClick={() => setShirtColor(c)}
                  title={c.name}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${
                    shirtColor.hex === c.hex
                      ? 'border-[#D4A017] scale-110 shadow-[0_0_12px_rgba(212,160,23,0.4)]'
                      : 'border-transparent hover:border-white/30'
                  }`}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
            <p className="text-[11px] text-white/40 mt-2 px-1">{shirtColor.name}</p>
          </div>

          {/* Size selector */}
          <div className="p-3">
            <p className="text-[10px] font-bold tracking-widest uppercase text-white/30 px-1 mb-2">Size</p>
            <div className="flex flex-wrap gap-1.5">
              {SIZES.map(s => (
                <button
                  key={s}
                  onClick={() => setActiveSize(s)}
                  className={`w-10 h-9 rounded-lg text-xs font-bold border transition-all ${
                    activeSize === s
                      ? 'border-[#D4A017] bg-[#D4A017]/10 text-[#D4A017]'
                      : 'border-white/[0.08] text-white/50 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── CENTER: CANVAS ──────────────────────────────────────────────────── */}
        <div className="flex-1 relative overflow-hidden bg-[#080810] flex items-center justify-center">
          {/* Radial gradient background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#12121c_0%,#050507_100%)]" />

          <div
            className="relative"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
              transition: 'transform 0.2s ease',
            }}
          >
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              className="block rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.8)]"
              style={{
                cursor:
                  tool === 'select' ? 'default'
                  : tool === 'text'   ? 'text'
                  : 'crosshair',
              }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
            />

            {/* Inline text input overlay */}
            {showTextBox && (
              <div
                style={{ position: 'absolute', left: textPos.x, top: textPos.y - 18 }}
                className="z-10"
              >
                <input
                  autoFocus
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') addText()
                    if (e.key === 'Escape') setShowTextBox(false)
                  }}
                  onBlur={addText}
                  placeholder="Type & press Enter"
                  className="bg-[#111118] border border-[#00D4FF] text-white text-sm px-3 py-1.5 rounded-lg outline-none w-48 shadow-[0_0_16px_rgba(0,212,255,0.3)]"
                />
              </div>
            )}
          </div>

          {/* Tip bar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/[0.05] backdrop-blur-sm border border-white/[0.07] px-4 py-2 rounded-full text-xs text-white/40 whitespace-nowrap">
            {tool === 'select'   ? 'Click to select · Drag to move · Delete key to remove'
            : tool === 'text'    ? 'Click on canvas to place text'
            : tool === 'image'   ? 'Choose a file to upload onto the shirt'
            : tool === 'shape'   ? 'Click on canvas to add shape'
            : 'Click a template to apply it to the canvas'}
          </div>
        </div>

        {/* ── RIGHT: PROPERTIES + LAYERS ─────────────────────────────────────── */}
        <div className="w-56 border-l border-white/[0.07] bg-[#0C0C12] flex flex-col overflow-y-auto">

          {/* Properties panel — shown when a layer is selected */}
          {selLayer && (
            <div className="p-3 border-b border-white/[0.07] space-y-3">
              <p className="text-[10px] font-bold tracking-widest uppercase text-white/30">Properties</p>

              {/* Text properties */}
              {selLayer.type === 'text' && (
                <>
                  <div>
                    <label className="text-[11px] text-white/40 block mb-1">Font</label>
                    <select
                      value={selLayer.font ?? 'Inter'}
                      onChange={e => { updateSel({ font: e.target.value }); commitSel() }}
                      className="w-full bg-[#111118] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white focus:border-[#D4A017] outline-none"
                    >
                      {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-white/40 flex justify-between mb-1">
                      <span>Font Size</span>
                      <span className="text-white">{selLayer.fontSize ?? 24}px</span>
                    </label>
                    <input
                      type="range" min={10} max={80}
                      value={selLayer.fontSize ?? 24}
                      onChange={e => updateSel({ fontSize: +e.target.value })}
                      onMouseUp={commitSel}
                      className="w-full"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => { updateSel({ bold: !selLayer.bold }); commitSel() }}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center justify-center ${
                        selLayer.bold ? 'border-[#D4A017] bg-[#D4A017]/10 text-[#D4A017]' : 'border-white/[0.08] text-white/50 hover:text-white'
                      }`}
                    >
                      <Bold size={12} />
                    </button>
                    <button
                      onClick={() => { updateSel({ italic: !selLayer.italic }); commitSel() }}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center justify-center ${
                        selLayer.italic ? 'border-[#D4A017] bg-[#D4A017]/10 text-[#D4A017]' : 'border-white/[0.08] text-white/50 hover:text-white'
                      }`}
                    >
                      <Italic size={12} />
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] text-white/40 block mb-1">Color</label>
                    <input
                      type="color"
                      value={selLayer.textColor ?? '#ffffff'}
                      onChange={e => updateSel({ textColor: e.target.value })}
                      onBlur={commitSel}
                      className="w-full h-8 rounded-lg border border-white/[0.08] bg-transparent cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-white/40 block mb-1">Text Content</label>
                    <input
                      value={selLayer.text ?? ''}
                      onChange={e => updateSel({ text: e.target.value })}
                      onBlur={commitSel}
                      className="w-full bg-[#111118] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white focus:border-[#D4A017] outline-none"
                    />
                  </div>
                </>
              )}

              {/* Shape properties */}
              {selLayer.type === 'shape' && (
                <div>
                  <label className="text-[11px] text-white/40 block mb-1">Fill Color</label>
                  <input
                    type="color"
                    value={selLayer.fillColor ?? '#D4A017'}
                    onChange={e => updateSel({ fillColor: e.target.value })}
                    onBlur={commitSel}
                    className="w-full h-8 rounded-lg border border-white/[0.08] bg-transparent cursor-pointer"
                  />
                </div>
              )}

              {/* Common: opacity + rotation */}
              <div>
                <label className="text-[11px] text-white/40 flex justify-between mb-1">
                  <span>Opacity</span>
                  <span className="text-white">{Math.round((selLayer.opacity ?? 1) * 100)}%</span>
                </label>
                <input
                  type="range" min={10} max={100}
                  value={Math.round((selLayer.opacity ?? 1) * 100)}
                  onChange={e => updateSel({ opacity: +e.target.value / 100 })}
                  onMouseUp={commitSel}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-[11px] text-white/40 flex justify-between mb-1">
                  <span>Rotation</span>
                  <span className="text-white">{selLayer.rotation ?? 0}°</span>
                </label>
                <input
                  type="range" min={-180} max={180}
                  value={selLayer.rotation ?? 0}
                  onChange={e => updateSel({ rotation: +e.target.value })}
                  onMouseUp={commitSel}
                  className="w-full"
                />
              </div>

              <button
                onClick={() => deleteLayer(selId!)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-red-500/30 text-red-400 text-xs hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={12} /> Remove Layer
              </button>
            </div>
          )}

          {/* Layers list */}
          <div className="p-3 flex-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold tracking-widest uppercase text-white/30">Layers</p>
              <Layers size={12} className="text-white/20" />
            </div>

            {layers.length === 0 ? (
              <p className="text-[11px] text-white/20 text-center py-6 leading-relaxed">
                No layers yet.<br />Add text, images or shapes.
              </p>
            ) : (
              [...layers].reverse().map(l => (
                <button
                  key={l.id}
                  onClick={() => setSelId(l.id)}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg mb-1 text-left transition-all ${
                    l.id === selId
                      ? 'bg-[#D4A017]/10 border border-[#D4A017]/30'
                      : 'border border-transparent hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="text-sm leading-none">
                    {l.type === 'text' ? '📝' : l.type === 'image' ? '🖼' : '⬡'}
                  </span>
                  <span className="text-xs text-white/60 truncate flex-1">
                    {l.type === 'text'
                      ? (l.text?.slice(0, 12) ?? 'Text')
                      : l.type === 'image' ? 'Image'
                      : l.shapeKind ?? 'Shape'}
                  </span>
                </button>
              ))
            )}
          </div>

          {/* Quantity + Add to Cart */}
          <div className="p-3 border-t border-white/[0.07] space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center font-bold text-sm transition-colors"
              >
                −
              </button>
              <span className="flex-1 text-center font-bold text-sm">{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center font-bold text-sm transition-colors"
              >
                +
              </button>
            </div>
            <button
              onClick={addToCart}
              className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4A017] to-[#F0C040] text-black hover:from-[#F0C040] hover:to-[#D4A017] transition-all shadow-[0_4px_20px_rgba(212,160,23,0.3)] hover:shadow-[0_4px_28px_rgba(212,160,23,0.5)]"
            >
              <ShoppingBag size={15} /> Add to Cart — ${49 * qty}
            </button>
          </div>
        </div>
      </div>

      {/* ── PREVIEW OVERLAY (step 1) ─────────────────────────────────────────── */}
      {step >= 1 && (
        <div className="fixed inset-0 z-50 bg-[#050507]/95 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-[#111118] border border-white/[0.08] rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-black mb-6 bg-gradient-to-r from-[#D4A017] to-[#F0C040] bg-clip-text text-transparent">
              Design Preview
            </h2>

            <div className="flex gap-8 items-start">
              {/* Shirt summary swatch */}
              <div
                className="w-48 h-56 rounded-2xl border border-white/[0.08] flex items-center justify-center flex-shrink-0"
                style={{ background: shirtColor.hex }}
              >
                <span className="text-[10px] font-bold tracking-widest uppercase opacity-50"
                  style={{ color: parseInt(shirtColor.hex.replace('#',''),16) > 0x888888 ? '#000' : '#fff' }}>
                  Preview
                </span>
              </div>

              {/* Order summary */}
              <div className="flex-1 space-y-4">
                <div className="bg-[#0C0C12] border border-[#D4A017]/20 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Product</span>
                    <span className="font-semibold">Custom Design Tee</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Color</span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full inline-block border border-white/20" style={{ background: shirtColor.hex }} />
                      {shirtColor.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Size</span>
                    <span className="font-bold text-[#D4A017]">{activeSize}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Quantity</span>
                    <span>{qty}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-white/[0.07] pt-2 mt-2">
                    <span className="font-bold">Total</span>
                    <span className="font-black text-[#D4A017]">${49 * qty}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(0)}
                    className="flex-1 py-3 rounded-xl text-sm font-bold border border-[#D4A017]/40 text-[#D4A017] hover:bg-[#D4A017]/10 transition-all"
                  >
                    Edit More
                  </button>
                  <button
                    onClick={addToCart}
                    className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4A017] to-[#F0C040] text-black hover:from-[#F0C040] hover:to-[#D4A017] transition-all"
                  >
                    <ShoppingBag size={15} /> Order Now
                  </button>
                </div>

                <button
                  onClick={exportPng}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs text-white/40 hover:text-white/70 transition-colors"
                >
                  <Download size={13} /> Download PNG
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
