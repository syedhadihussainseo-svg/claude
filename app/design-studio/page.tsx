'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useCart } from '@/context/CartContext'
import {
  MousePointer2, Type, ImageIcon, Shapes, Sparkles,
  Trash2, Download, RotateCcw, RotateCw,
  Bold, Italic, ShoppingBag, ChevronRight,
  Layers, ZoomIn, ZoomOut,
  Star, Square, Circle, Minus,
  Lock, Unlock, Eye, EyeOff, Copy,
  ArrowUp, ArrowDown,
  AlignLeft, AlignCenter, AlignRight,
  FlipHorizontal, FlipVertical,
  Hexagon, Diamond, Wand2, Grid3x3,
} from 'lucide-react'

// ── Types ────────────────────────────────────────────────────────────────────

type Tool = 'select' | 'text' | 'image' | 'shape' | 'template'
type ShapeKind = 'rect' | 'circle' | 'star' | 'line' | 'triangle' | 'heart' | 'hexagon' | 'diamond'

interface Layer {
  id: string
  type: 'text' | 'image' | 'shape'
  x: number; y: number; w: number; h: number
  locked?: boolean; hidden?: boolean
  flipH?: boolean; flipV?: boolean
  text?: string; src?: string; img?: HTMLImageElement
  font?: string; fontSize?: number; bold?: boolean; italic?: boolean
  textColor?: string; textAlign?: 'left' | 'center' | 'right'
  textShadow?: boolean; textOutline?: boolean; textOutlineColor?: string
  shapeKind?: ShapeKind; fillColor?: string
  rotation?: number; opacity?: number
}

// ── Constants ─────────────────────────────────────────────────────────────────

const SHIRT_COLORS = [
  { name: 'Jet Black',   hex: '#141414' },
  { name: 'Chalk White', hex: '#f5f5f0' },
  { name: 'Ash Gray',    hex: '#8a8a8a' },
  { name: 'Deep Navy',   hex: '#1a2040' },
  { name: 'Forest',      hex: '#1e3a1e' },
  { name: 'Sand',        hex: '#c8a878' },
  { name: 'Crimson',     hex: '#6b0f0f' },
  { name: 'Royal Blue',  hex: '#0f2a6b' },
  { name: 'Burgundy',    hex: '#4a0e20' },
  { name: 'Olive',       hex: '#4a4a1e' },
]

const FONTS = [
  'Inter', 'Impact', 'Arial Black', 'Playfair Display',
  'Georgia', 'Courier New', 'Trebuchet MS', 'Bebas Neue',
]

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']

const COLOR_SWATCHES = [
  '#ffffff', '#141414', '#D4A017', '#F0C040',
  '#00D4FF', '#00E5CC', '#8B5CF6', '#EC4899',
  '#FF4D00', '#22C55E', '#EF4444', '#3B82F6',
]

const AI_PHRASES = [
  'MADE DIFFERENT', 'CULTURE RUNS DEEP', 'NO LIMITS',
  'AUTHENTIC', 'BUILT DIFFERENT', 'LEGACY', 'PRESTIGE', 'HUSTLE',
]

// ── Utilities ─────────────────────────────────────────────────────────────────

function uid() { return Math.random().toString(36).slice(2, 9) }

function lighten(hex: string, amt: number): string {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, Math.min(255, (n >> 16) + amt))
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt))
  const b = Math.max(0, Math.min(255, (n & 0xff) + amt))
  return `rgb(${r},${g},${b})`
}

function isLight(hex: string) { return parseInt(hex.replace('#', ''), 16) > 0x888888 }

// ── Canvas geometry ────────────────────────────────────────────────────────────

const CANVAS_W = 500
const CANVAS_H = 580
const PZ = { x: 155, y: 145, w: 190, h: 230 }

const HANDLE_CURSORS = [
  'nw-resize', 'n-resize', 'ne-resize',
  'w-resize', 'e-resize',
  'sw-resize', 's-resize', 'se-resize',
]

function getHandles(l: Layer): [number, number][] {
  return [
    [l.x - 4,        l.y - 4],
    [l.x + l.w / 2,  l.y - 4],
    [l.x + l.w + 4,  l.y - 4],
    [l.x - 4,        l.y + l.h / 2],
    [l.x + l.w + 4,  l.y + l.h / 2],
    [l.x - 4,        l.y + l.h + 4],
    [l.x + l.w / 2,  l.y + l.h + 4],
    [l.x + l.w + 4,  l.y + l.h + 4],
  ]
}

// ── Draw: Shirt ───────────────────────────────────────────────────────────────

function drawShirt(ctx: CanvasRenderingContext2D, color: string, w: number, h: number) {
  const cx = w / 2
  const bodyTop    = h * 0.20
  const bodyBot    = h * 0.92
  const bodyLeft   = w * 0.20
  const bodyRight  = w * 0.80
  const sleeveTop  = h * 0.08
  const collarW    = w * 0.14
  const collarDepth = h * 0.08

  ctx.save()

  const grad = ctx.createLinearGradient(bodyLeft, bodyTop, bodyRight, bodyBot)
  grad.addColorStop(0,   lighten(color, isLight(color) ? -8  :  15))
  grad.addColorStop(0.4, color)
  grad.addColorStop(1,   lighten(color, isLight(color) ? -15 : -20))
  ctx.fillStyle = grad

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
  ctx.fill()

  ctx.fillStyle = 'rgba(0,0,0,0.06)'
  ctx.beginPath()
  ctx.moveTo(w * 0.02, sleeveTop + h * 0.05)
  ctx.lineTo(w * 0.05, sleeveTop)
  ctx.lineTo(w * 0.27, bodyTop - h * 0.02)
  ctx.lineTo(w * 0.18, bodyTop + h * 0.10)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = 'rgba(0,0,0,0.06)'
  ctx.beginPath()
  ctx.moveTo(w * 0.98, sleeveTop + h * 0.05)
  ctx.lineTo(w * 0.95, sleeveTop)
  ctx.lineTo(w * 0.73, bodyTop - h * 0.02)
  ctx.lineTo(w * 0.82, bodyTop + h * 0.10)
  ctx.closePath()
  ctx.fill()

  // Highlight sheen
  const sheen = ctx.createLinearGradient(bodyLeft, bodyTop, bodyLeft + (bodyRight - bodyLeft) * 0.4, bodyBot)
  sheen.addColorStop(0, 'rgba(255,255,255,0.06)')
  sheen.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = sheen
  ctx.beginPath()
  ctx.moveTo(w * 0.02, sleeveTop + h * 0.05)
  ctx.lineTo(w * 0.05, sleeveTop)
  ctx.lineTo(w * 0.27, bodyTop - h * 0.02)
  ctx.quadraticCurveTo(cx - collarW * 0.3, bodyTop, cx - collarW, bodyTop + collarDepth * 0.4)
  ctx.quadraticCurveTo(cx - collarW * 0.3, bodyTop + collarDepth, cx, bodyTop + collarDepth)
  ctx.lineTo(cx, bodyBot)
  ctx.lineTo(bodyLeft + 10, bodyBot)
  ctx.quadraticCurveTo(bodyLeft + 2, bodyBot, bodyLeft, bodyBot - h * 0.03)
  ctx.lineTo(w * 0.18, bodyTop + h * 0.10)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = isLight(color) ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.08)'
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

// ── Draw: Shapes ──────────────────────────────────────────────────────────────

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, pts = 5) {
  ctx.beginPath()
  for (let i = 0; i < pts * 2; i++) {
    const a = (i * Math.PI) / pts - Math.PI / 2
    const rad = i % 2 === 0 ? r : r * 0.45
    if (i === 0) ctx.moveTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad)
    else ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad)
  }
  ctx.closePath()
}

function drawHexagon(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3 - Math.PI / 6
    if (i === 0) ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
    else ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
  }
  ctx.closePath()
}

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const cx = x + w / 2
  const topY = y + h * 0.25
  ctx.beginPath()
  ctx.moveTo(cx, y + h)
  ctx.bezierCurveTo(cx - w * 0.05, y + h * 0.75, x, y + h * 0.55, x, topY)
  ctx.arc(x + w * 0.25, topY, w * 0.25, Math.PI, 0)
  ctx.arc(x + w * 0.75, topY, w * 0.25, Math.PI, 0)
  ctx.bezierCurveTo(x + w, y + h * 0.55, cx + w * 0.05, y + h * 0.75, cx, y + h)
  ctx.closePath()
}

// ── Draw: Layer ───────────────────────────────────────────────────────────────

function drawLayer(ctx: CanvasRenderingContext2D, l: Layer, sel: boolean) {
  if (l.hidden) return
  ctx.save()
  ctx.globalAlpha = l.opacity ?? 1

  const cx = l.x + l.w / 2
  const cy = l.y + l.h / 2
  ctx.translate(cx, cy)
  ctx.rotate(((l.rotation ?? 0) * Math.PI) / 180)
  if (l.flipH || l.flipV) ctx.scale(l.flipH ? -1 : 1, l.flipV ? -1 : 1)
  ctx.translate(-cx, -cy)

  if (l.type === 'text') {
    const style = `${l.italic ? 'italic ' : ''}${l.bold ? 'bold ' : ''}${l.fontSize ?? 24}px "${l.font ?? 'Inter'}"`
    ctx.font = style
    const align = l.textAlign ?? 'center'
    ctx.textAlign = align
    ctx.textBaseline = 'middle'
    const tx = align === 'left' ? l.x : align === 'right' ? l.x + l.w : cx

    if (l.textShadow) {
      ctx.shadowColor = 'rgba(0,0,0,0.9)'
      ctx.shadowBlur = 10
      ctx.shadowOffsetX = 3
      ctx.shadowOffsetY = 3
    }
    if (l.textOutline) {
      ctx.strokeStyle = l.textOutlineColor ?? '#000000'
      ctx.lineWidth = 3
      ctx.lineJoin = 'round'
      ctx.strokeText(l.text ?? '', tx, cy)
    }
    ctx.fillStyle = l.textColor ?? '#ffffff'
    ctx.fillText(l.text ?? '', tx, cy)
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0

  } else if (l.type === 'image' && l.img) {
    ctx.drawImage(l.img, l.x, l.y, l.w, l.h)

  } else if (l.type === 'shape') {
    ctx.fillStyle = l.fillColor ?? '#D4A017'
    const r = Math.min(l.w, l.h) / 2

    if (l.shapeKind === 'rect') {
      ctx.beginPath(); ctx.roundRect(l.x, l.y, l.w, l.h, 6); ctx.fill()
    } else if (l.shapeKind === 'circle') {
      ctx.beginPath(); ctx.ellipse(cx, cy, l.w / 2, l.h / 2, 0, 0, Math.PI * 2); ctx.fill()
    } else if (l.shapeKind === 'star') {
      drawStar(ctx, cx, cy, r); ctx.fill()
    } else if (l.shapeKind === 'line') {
      ctx.strokeStyle = l.fillColor ?? '#D4A017'
      ctx.lineWidth = 4
      ctx.lineCap = 'round'
      ctx.beginPath(); ctx.moveTo(l.x, cy); ctx.lineTo(l.x + l.w, cy); ctx.stroke()
    } else if (l.shapeKind === 'triangle') {
      ctx.beginPath()
      ctx.moveTo(cx, l.y); ctx.lineTo(l.x + l.w, l.y + l.h); ctx.lineTo(l.x, l.y + l.h)
      ctx.closePath(); ctx.fill()
    } else if (l.shapeKind === 'heart') {
      drawHeart(ctx, l.x, l.y, l.w, l.h); ctx.fill()
    } else if (l.shapeKind === 'hexagon') {
      drawHexagon(ctx, cx, cy, r); ctx.fill()
    } else if (l.shapeKind === 'diamond') {
      ctx.beginPath()
      ctx.moveTo(cx, l.y); ctx.lineTo(l.x + l.w, cy); ctx.lineTo(cx, l.y + l.h); ctx.lineTo(l.x, cy)
      ctx.closePath(); ctx.fill()
    }
  }

  if (sel) {
    ctx.globalAlpha = 1
    ctx.strokeStyle = '#00D4FF'
    ctx.lineWidth = 1.5
    ctx.setLineDash([5, 3])
    ctx.strokeRect(l.x - 3, l.y - 3, l.w + 6, l.h + 6)
    ctx.setLineDash([])

    getHandles(l).forEach(([hx, hy]) => {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(hx - 4, hy - 4, 8, 8)
      ctx.strokeStyle = '#00D4FF'
      ctx.lineWidth = 1.5
      ctx.strokeRect(hx - 4, hy - 4, 8, 8)
    })

    // Rotation handle
    ctx.strokeStyle = '#00D4FF'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(cx, l.y - 3)
    ctx.lineTo(cx, l.y - 18)
    ctx.stroke()
    ctx.fillStyle = '#8B5CF6'
    ctx.beginPath()
    ctx.arc(cx, l.y - 22, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1
    ctx.stroke()

    if (l.locked) {
      ctx.fillStyle = 'rgba(239,68,68,0.8)'
      ctx.fillRect(l.x + l.w - 14, l.y, 14, 14)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 9px Inter'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('🔒', l.x + l.w - 7, l.y + 7)
    }
  }

  ctx.restore()
}

// ── AI Templates ───────────────────────────────────────────────────────────────

const AI_TEMPLATES = [
  {
    name: 'Geometric Gold',
    preview: '◎',
    create: (): Omit<Layer, 'id'>[] => [
      { type: 'shape', x: PZ.x + 30,  y: PZ.y + 25, w: 130, h: 130, shapeKind: 'circle',  fillColor: 'rgba(212,160,23,0.12)', rotation: 0, opacity: 1 },
      { type: 'shape', x: PZ.x + 55,  y: PZ.y + 50, w: 80,  h: 80,  shapeKind: 'star',    fillColor: '#D4A017',               rotation: 0, opacity: 1 },
      { type: 'text',  x: PZ.x + 15,  y: PZ.y + 170,w: 160, h: 32,  text: 'MENZCULTURE',  font: 'Arial Black', fontSize: 16, bold: true, textColor: '#F0C040', rotation: 0, opacity: 1 },
    ],
  },
  {
    name: 'Minimal Type',
    preview: 'T',
    create: (): Omit<Layer, 'id'>[] => [
      { type: 'text',  x: PZ.x + 5,  y: PZ.y + 55,  w: 180, h: 55, text: 'MADE',      font: 'Impact', fontSize: 52, textColor: '#ffffff', rotation: 0, opacity: 1 },
      { type: 'text',  x: PZ.x + 5,  y: PZ.y + 115, w: 180, h: 45, text: 'DIFFERENT', font: 'Impact', fontSize: 36, textColor: '#D4A017', rotation: 0, opacity: 1 },
      { type: 'shape', x: PZ.x + 5,  y: PZ.y + 162, w: 180, h: 3,  shapeKind: 'line', fillColor: '#D4A017', rotation: 0, opacity: 1 },
    ],
  },
  {
    name: 'Street Stars',
    preview: '★',
    create: (): Omit<Layer, 'id'>[] => [
      { type: 'shape', x: PZ.x + 8,  y: PZ.y + 8,  w: 50, h: 50, shapeKind: 'star', fillColor: '#D4A017', rotation: 15,  opacity: 0.85 },
      { type: 'shape', x: PZ.x + 130,y: PZ.y + 15, w: 36, h: 36, shapeKind: 'star', fillColor: '#00D4FF', rotation: -10, opacity: 0.85 },
      { type: 'shape', x: PZ.x + 68, y: PZ.y + 180,w: 28, h: 28, shapeKind: 'star', fillColor: '#FF4D00', rotation: 20,  opacity: 0.9  },
      { type: 'text',  x: PZ.x + 10, y: PZ.y + 90, w: 170,h: 40, text: '★ CULTURE ★', font: 'Arial Black', fontSize: 22, bold: true, textColor: '#ffffff', rotation: 0, opacity: 1 },
    ],
  },
  {
    name: 'Neon Vibes',
    preview: '⚡',
    create: (): Omit<Layer, 'id'>[] => [
      { type: 'shape', x: PZ.x + 20, y: PZ.y + 20,  w: 150, h: 150, shapeKind: 'hexagon', fillColor: 'rgba(139,92,246,0.15)', rotation: 0,  opacity: 1 },
      { type: 'shape', x: PZ.x + 50, y: PZ.y + 50,  w: 90,  h: 90,  shapeKind: 'hexagon', fillColor: 'rgba(0,212,255,0.2)',   rotation: 30, opacity: 1 },
      { type: 'text',  x: PZ.x + 5,  y: PZ.y + 85,  w: 180, h: 40,  text: 'NEON ERA',     font: 'Impact', fontSize: 40, bold: false, textColor: '#00D4FF', textShadow: true, rotation: 0, opacity: 1 },
      { type: 'text',  x: PZ.x + 20, y: PZ.y + 175, w: 150, h: 28,  text: 'MENZCULTURE',  font: 'Arial Black', fontSize: 14, bold: true, textColor: '#8B5CF6', rotation: 0, opacity: 0.9 },
    ],
  },
  {
    name: 'Varsity Bold',
    preview: 'V',
    create: (): Omit<Layer, 'id'>[] => [
      { type: 'shape', x: PZ.x + 20, y: PZ.y + 20,  w: 150, h: 140, shapeKind: 'rect',   fillColor: 'rgba(212,160,23,0.1)', rotation: 0, opacity: 1 },
      { type: 'text',  x: PZ.x + 20, y: PZ.y + 30,  w: 150, h: 100, text: 'M',             font: 'Impact', fontSize: 110, bold: false, textColor: '#D4A017', textOutline: true, textOutlineColor: '#000', rotation: 0, opacity: 1 },
      { type: 'text',  x: PZ.x + 20, y: PZ.y + 165, w: 150, h: 24,  text: 'EST. MMXXIV',   font: 'Georgia', fontSize: 14, bold: false, italic: true, textColor: '#ffffff', rotation: 0, opacity: 0.7 },
    ],
  },
  {
    name: 'Retro Wave',
    preview: '〰',
    create: (): Omit<Layer, 'id'>[] => [
      { type: 'shape', x: PZ.x + 5,  y: PZ.y + 60,  w: 180, h: 3,  shapeKind: 'line',    fillColor: '#EC4899', rotation: 0, opacity: 0.8 },
      { type: 'shape', x: PZ.x + 5,  y: PZ.y + 70,  w: 180, h: 3,  shapeKind: 'line',    fillColor: '#8B5CF6', rotation: 0, opacity: 0.6 },
      { type: 'text',  x: PZ.x + 5,  y: PZ.y + 30,  w: 180, h: 50, text: 'RETRO',         font: 'Impact', fontSize: 48, bold: false, textColor: '#EC4899', textShadow: true, rotation: -3, opacity: 1 },
      { type: 'text',  x: PZ.x + 5,  y: PZ.y + 100, w: 180, h: 36, text: 'WAVE CULTURE',  font: 'Arial Black', fontSize: 18, bold: true, textColor: '#ffffff', rotation: 0, opacity: 1 },
      { type: 'shape', x: PZ.x + 60, y: PZ.y + 155, w: 70,  h: 70, shapeKind: 'diamond',  fillColor: 'rgba(139,92,246,0.25)', rotation: 0, opacity: 1 },
    ],
  },
]

// ── Component ──────────────────────────────────────────────────────────────────

export default function DesignStudio() {
  const { addItem, showToast } = useCart()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileRef   = useRef<HTMLInputElement>(null)

  const [layers,      setLayers]      = useState<Layer[]>([])
  const [selId,       setSelId]       = useState<string | null>(null)
  const [tool,        setTool]        = useState<Tool>('select')
  const [shirtColor,  setShirtColor]  = useState(SHIRT_COLORS[0])
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
  const [snapGrid,    setSnapGrid]    = useState(false)
  const [canvasCursor,setCanvasCursor]= useState<string>('default')
  const [showGridOverlay, setShowGridOverlay] = useState(false)

  const selLayer = layers.find(l => l.id === selId) ?? null
  const dragRef   = useRef<{ id: string; ox: number; oy: number } | null>(null)
  const resizeRef = useRef<{ handleIdx: number; startMx: number; startMy: number; origLayer: Layer } | null>(null)
  const rotateRef = useRef<{ startAngle: number; origRot: number; cx: number; cy: number } | null>(null)

  const snp = useCallback((v: number) => snapGrid ? Math.round(v / 20) * 20 : v, [snapGrid])

  // ── History ────────────────────────────────────────────────────────────────

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

  // ── Keyboard shortcuts ────────────────────────────────────────────────────

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement)?.tagName
      const editing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo() }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); redo() }
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selId) { e.preventDefault(); duplicateLayer() }
      if (!editing && (e.key === 'Delete' || e.key === 'Backspace') && selId) {
        setLayers(ls => { const next = ls.filter(l => l.id !== selId); push(next); return next })
        setSelId(null)
      }
      if (!editing && e.key === '[') { e.preventDefault(); moveLayerDown() }
      if (!editing && e.key === ']') { e.preventDefault(); moveLayerUp() }
      if (!editing && e.key === 'Escape') { setSelId(null); setShowTextBox(false) }
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [undo, redo, selId, push])

  // ── Draw ────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
    ctx.fillStyle = '#1a1a22'
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

    // Background grid
    ctx.strokeStyle = 'rgba(255,255,255,0.025)'
    ctx.lineWidth = 1
    const gridStep = showGridOverlay ? 20 : 40
    for (let x = 0; x < CANVAS_W; x += gridStep) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_H); ctx.stroke()
    }
    for (let y = 0; y < CANVAS_H; y += gridStep) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke()
    }

    drawShirt(ctx, shirtColor.hex, CANVAS_W, CANVAS_H)

    // Print zone
    ctx.setLineDash([6, 4])
    ctx.strokeStyle = 'rgba(0,212,255,0.3)'
    ctx.lineWidth = 1.5
    ctx.strokeRect(PZ.x, PZ.y, PZ.w, PZ.h)
    ctx.setLineDash([])

    if (layers.length === 0) {
      ctx.fillStyle = 'rgba(0,212,255,0.35)'
      ctx.font = '11px Inter'
      ctx.textAlign = 'center'
      ctx.fillText('✦ PRINT ZONE — CLICK A TOOL TO START ✦', PZ.x + PZ.w / 2, PZ.y - 8)
    }

    layers.forEach(l => drawLayer(ctx, l, l.id === selId))
  }, [layers, selId, shirtColor, showGridOverlay])

  // ── Mouse: hit detection helpers ───────────────────────────────────────────

  function hitLayer(mx: number, my: number): Layer | undefined {
    return [...layers].reverse().find(
      l => !l.locked && !l.hidden && mx >= l.x && mx <= l.x + l.w && my >= l.y && my <= l.y + l.h
    )
  }

  function hitHandle(l: Layer, mx: number, my: number): number {
    return getHandles(l).findIndex(([hx, hy]) => Math.hypot(mx - hx, my - hy) < 9)
  }

  function hitRotate(l: Layer, mx: number, my: number): boolean {
    const cx = l.x + l.w / 2
    return Math.hypot(mx - cx, my - (l.y - 22)) < 9
  }

  // ── Mouse events ───────────────────────────────────────────────────────────

  const canvasCoords = (e: React.MouseEvent<HTMLCanvasElement>): [number, number] => {
    const cv = canvasRef.current!
    const rect = cv.getBoundingClientRect()
    return [(e.clientX - rect.left) / zoom, (e.clientY - rect.top) / zoom]
  }

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const [mx, my] = canvasCoords(e)

    if (tool === 'select') {
      // Check rotation handle
      if (selLayer && !selLayer.locked) {
        if (hitRotate(selLayer, mx, my)) {
          const cx = selLayer.x + selLayer.w / 2
          const cy = selLayer.y + selLayer.h / 2
          rotateRef.current = {
            startAngle: Math.atan2(my - cy, mx - cx),
            origRot: selLayer.rotation ?? 0,
            cx, cy,
          }
          return
        }
        // Check resize handles
        const hi = hitHandle(selLayer, mx, my)
        if (hi >= 0) {
          resizeRef.current = { handleIdx: hi, startMx: mx, startMy: my, origLayer: { ...selLayer } }
          return
        }
      }
      // Check layer hit
      const hit = hitLayer(mx, my)
      if (hit) {
        setSelId(hit.id)
        dragRef.current = { id: hit.id, ox: mx - hit.x, oy: my - hit.y }
      } else {
        setSelId(null)
      }
      return
    }

    if (tool === 'text') {
      setTextPos({ x: snp(Math.max(PZ.x, Math.min(mx - 60, PZ.x + PZ.w - 120))), y: snp(Math.max(PZ.y, Math.min(my, PZ.y + PZ.h - 30))) })
      setTextInput('')
      setShowTextBox(true)
      return
    }

    if (tool === 'shape') {
      const x = snp(Math.max(PZ.x, Math.min(mx - 40, PZ.x + PZ.w - 80)))
      const y = snp(Math.max(PZ.y, Math.min(my - 40, PZ.y + PZ.h - 80)))
      const nl: Layer = { id: uid(), type: 'shape', x, y, w: 80, h: 80, shapeKind, fillColor: '#D4A017', rotation: 0, opacity: 1 }
      push([...layers, nl])
      setSelId(nl.id)
      setTool('select')
    }
  }

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const [mx, my] = canvasCoords(e)

    // Rotate
    if (rotateRef.current && selLayer) {
      const { startAngle, origRot, cx, cy } = rotateRef.current
      const angle = Math.atan2(my - cy, mx - cx)
      const delta = ((angle - startAngle) * 180) / Math.PI
      const rot = Math.round(origRot + delta)
      setLayers(ls => ls.map(l => l.id === selLayer.id ? { ...l, rotation: rot } : l))
      return
    }

    // Resize
    if (resizeRef.current && selLayer) {
      const { handleIdx: hi, startMx, startMy, origLayer: ol } = resizeRef.current
      const dx = mx - startMx
      const dy = my - startMy
      let { x, y, w, h } = ol
      if (hi === 0) { x = snp(ol.x + dx); y = snp(ol.y + dy); w = ol.w - dx; h = ol.h - dy }
      else if (hi === 1) { y = snp(ol.y + dy); h = ol.h - dy }
      else if (hi === 2) { y = snp(ol.y + dy); w = ol.w + dx; h = ol.h - dy }
      else if (hi === 3) { x = snp(ol.x + dx); w = ol.w - dx }
      else if (hi === 4) { w = ol.w + dx }
      else if (hi === 5) { x = snp(ol.x + dx); w = ol.w - dx; h = ol.h + dy }
      else if (hi === 6) { h = ol.h + dy }
      else if (hi === 7) { w = ol.w + dx; h = ol.h + dy }
      w = Math.max(20, w); h = Math.max(20, h)
      setLayers(ls => ls.map(l => l.id === selLayer.id ? { ...l, x, y, w, h } : l))
      return
    }

    // Drag
    if (dragRef.current) {
      const { id, ox, oy } = dragRef.current
      setLayers(ls => ls.map(l => l.id === id ? { ...l, x: snp(mx - ox), y: snp(my - oy) } : l))
      return
    }

    // Cursor hint
    if (tool === 'select' && selLayer && !selLayer.locked) {
      if (hitRotate(selLayer, mx, my)) { setCanvasCursor('grab'); return }
      const hi = hitHandle(selLayer, mx, my)
      if (hi >= 0) { setCanvasCursor(HANDLE_CURSORS[hi]); return }
    }
    const hover = hitLayer(mx, my)
    setCanvasCursor(
      tool === 'text' ? 'text' :
      tool !== 'select' ? 'crosshair' :
      hover ? 'move' : 'default'
    )
  }

  const commitDrag = () => {
    if (dragRef.current || resizeRef.current || rotateRef.current) {
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
    resizeRef.current = null
    rotateRef.current = null
  }

  // ── Layer actions ──────────────────────────────────────────────────────────

  const updateSel = (updates: Partial<Layer>) => {
    if (!selId) return
    setLayers(ls => ls.map(l => l.id === selId ? { ...l, ...updates } : l))
  }

  const commitSel = () => {
    setLayers(ls => {
      setHistory(h => [...h.slice(0, histIdx + 1), [...ls]])
      setHistIdx(i => i + 1)
      return ls
    })
  }

  const deleteLayer = (id: string) => {
    push(layers.filter(l => l.id !== id))
    setSelId(null)
  }

  const duplicateLayer = useCallback(() => {
    const sl = layers.find(l => l.id === selId)
    if (!sl) return
    const nl: Layer = { ...sl, id: uid(), x: sl.x + 15, y: sl.y + 15 }
    push([...layers, nl])
    setSelId(nl.id)
  }, [layers, selId, push])

  const moveLayerUp = useCallback(() => {
    if (!selId) return
    const idx = layers.findIndex(l => l.id === selId)
    if (idx >= layers.length - 1) return
    const next = [...layers]
    ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
    push(next)
  }, [layers, selId, push])

  const moveLayerDown = useCallback(() => {
    if (!selId) return
    const idx = layers.findIndex(l => l.id === selId)
    if (idx <= 0) return
    const next = [...layers]
    ;[next[idx], next[idx - 1]] = [next[idx - 1], next[idx]]
    push(next)
  }, [layers, selId, push])

  const alignLayer = (dir: 'left' | 'centerH' | 'right' | 'top' | 'centerV' | 'bottom') => {
    if (!selLayer) return
    const updates: Partial<Layer> = {
      left:    { x: PZ.x },
      centerH: { x: PZ.x + (PZ.w - selLayer.w) / 2 },
      right:   { x: PZ.x + PZ.w - selLayer.w },
      top:     { y: PZ.y },
      centerV: { y: PZ.y + (PZ.h - selLayer.h) / 2 },
      bottom:  { y: PZ.y + PZ.h - selLayer.h },
    }[dir]
    push(layers.map(l => l.id === selId ? { ...l, ...updates } : l))
  }

  // ── Add text / image ───────────────────────────────────────────────────────

  const addText = () => {
    if (!textInput.trim()) { setShowTextBox(false); return }
    const nl: Layer = {
      id: uid(), type: 'text',
      x: textPos.x, y: textPos.y, w: 170, h: 36,
      text: textInput, font: 'Inter', fontSize: 24,
      bold: false, italic: false, textColor: '#ffffff',
      textAlign: 'center', rotation: 0, opacity: 1,
    }
    push([...layers, nl])
    setSelId(nl.id)
    setShowTextBox(false)
    setTool('select')
  }

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

  const applyTemplate = (t: typeof AI_TEMPLATES[0]) => {
    const created = t.create().map(base => ({ ...base, id: uid() } as Layer))
    push([...layers, ...created])
    setSelId(null)
    showToast(`✨ "${t.name}" applied!`)
    setTool('select')
  }

  const aiGenerateText = () => {
    const phrase = AI_PHRASES[Math.floor(Math.random() * AI_PHRASES.length)]
    const nl: Layer = {
      id: uid(), type: 'text',
      x: PZ.x + 10, y: PZ.y + (PZ.h / 2) - 18, w: PZ.w - 20, h: 36,
      text: phrase, font: 'Impact', fontSize: 32,
      textColor: '#D4A017', textAlign: 'center', rotation: 0, opacity: 1, bold: false,
    }
    push([...layers, nl])
    setSelId(nl.id)
    showToast(`✦ AI generated: "${phrase}"`)
    setTool('select')
  }

  const exportPng = () => {
    const cv = canvasRef.current
    if (!cv) return
    const a = document.createElement('a')
    a.download = 'menz-design.png'
    a.href = cv.toDataURL('image/png')
    a.click()
    showToast('✓ Design downloaded!')
  }

  const addToCart = () => {
    if (!activeSize) { showToast('⚠️ Select a size'); return }
    const cv = canvasRef.current
    const design = cv?.toDataURL('image/png')
    addItem({
      productId: 'custom-blank', name: 'Custom Design Tee', price: 49,
      size: activeSize, color: shirtColor.name, qty,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      customDesign: design,
    })
    showToast('✓ Added to cart!')
    setStep(2)
  }

  // ── Toolbar definitions ────────────────────────────────────────────────────

  const TOOLS: { id: Tool; icon: React.ReactNode; label: string }[] = [
    { id: 'select',   icon: <MousePointer2 size={16} />, label: 'Select'    },
    { id: 'text',     icon: <Type size={16} />,          label: 'Text'      },
    { id: 'image',    icon: <ImageIcon size={16} />,     label: 'Image'     },
    { id: 'shape',    icon: <Shapes size={16} />,        label: 'Shapes'    },
    { id: 'template', icon: <Sparkles size={16} />,      label: 'Templates' },
  ]

  const SHAPE_TOOLS: [ShapeKind, React.ReactNode, string][] = [
    ['rect',     <Square size={13} key="r" />,  'Rect'],
    ['circle',   <Circle size={13} key="c" />,  'Circle'],
    ['star',     <Star size={13} key="s" />,    'Star'],
    ['line',     <Minus size={13} key="l" />,   'Line'],
    ['triangle', <span key="t" className="text-sm leading-none">△</span>, 'Triangle'],
    ['heart',    <span key="h" className="text-sm leading-none">♥</span>, 'Heart'],
    ['hexagon',  <Hexagon size={13} key="hex" />, 'Hex'],
    ['diamond',  <Diamond size={13} key="d" />,  'Diamond'],
  ]

  const layerIcon = (l: Layer) =>
    l.type === 'text' ? '📝' : l.type === 'image' ? '🖼' : l.shapeKind === 'star' ? '⭐' : l.shapeKind === 'heart' ? '♥' : '⬡'

  const layerLabel = (l: Layer) =>
    l.type === 'text' ? (l.text?.slice(0, 10) ?? 'Text') :
    l.type === 'image' ? 'Image' : l.shapeKind ?? 'Shape'

  // ── JSX ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#050507] flex flex-col pt-16">

      {/* ── TOP BAR ────────────────────────────────────────────────────────── */}
      <div className="border-b border-white/[0.07] bg-[#0C0C12]/90 backdrop-blur-xl px-4 py-2.5 flex items-center justify-between gap-3 sticky top-16 z-40">

        {/* Steps */}
        <div className="flex items-center gap-1">
          {['Design', 'Preview', 'Order'].map((s, i) => (
            <div key={i} className="flex items-center gap-0.5">
              <button
                onClick={() => i <= 1 && setStep(i)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  step === i ? 'bg-[#D4A017] text-black' : step > i ? 'text-[#D4A017]' : 'text-white/30'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black flex-shrink-0 ${
                  step === i ? 'bg-black/20' : step > i ? 'bg-[#D4A017]/20' : 'bg-white/[0.06]'
                }`}>{i + 1}</span>
                {s}
              </button>
              {i < 2 && <ChevronRight size={11} className="text-white/20" />}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button onClick={undo} title="Undo (Ctrl+Z)" className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center transition-colors">
            <RotateCcw size={13} />
          </button>
          <button onClick={redo} title="Redo (Ctrl+Y)" className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center transition-colors">
            <RotateCw size={13} />
          </button>

          <div className="w-px h-5 bg-white/[0.07]" />

          <button
            onClick={() => { setSnapGrid(s => !s); setShowGridOverlay(s => !s) }}
            title="Toggle Snap to Grid"
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              snapGrid ? 'bg-[#00D4FF]/20 text-[#00D4FF]' : 'bg-white/[0.05] hover:bg-white/[0.1] text-white/50'
            }`}
          >
            <Grid3x3 size={13} />
          </button>

          <div className="w-px h-5 bg-white/[0.07]" />

          <button onClick={() => setZoom(z => Math.max(0.4, +(z - 0.1).toFixed(1)))} className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center transition-colors">
            <ZoomOut size={13} />
          </button>
          <span className="text-xs text-white/40 w-10 text-center tabular-nums">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(2, +(z + 0.1).toFixed(1)))} className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center transition-colors">
            <ZoomIn size={13} />
          </button>

          <div className="w-px h-5 bg-white/[0.07]" />

          <button onClick={exportPng} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold transition-colors">
            <Download size={12} /> Export
          </button>
          <button onClick={() => setStep(1)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#D4A017] text-black text-xs font-bold hover:bg-[#F0C040] transition-colors">
            Preview <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* ── 3-PANEL LAYOUT ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT PANEL ─────────────────────────────────────────────────── */}
        <div className="w-56 border-r border-white/[0.07] bg-[#0C0C12] flex flex-col overflow-y-auto">

          {/* Tools */}
          <div className="p-2.5 space-y-0.5 border-b border-white/[0.07]">
            <p className="text-[9px] font-bold tracking-widest uppercase text-white/25 px-2 mb-2">Tools</p>
            {TOOLS.map(t => (
              <button
                key={t.id}
                onClick={() => { setTool(t.id); if (t.id === 'image') fileRef.current?.click() }}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  tool === t.id
                    ? 'bg-[#D4A017]/15 text-[#D4A017] border border-[#D4A017]/30 shadow-[0_0_10px_rgba(212,160,23,0.12)]'
                    : 'text-white/55 hover:text-white hover:bg-white/[0.05] border border-transparent'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={addImage} />
          </div>

          {/* Shape picker */}
          {tool === 'shape' && (
            <div className="p-2.5 border-b border-white/[0.07]">
              <p className="text-[9px] font-bold tracking-widest uppercase text-white/25 px-1 mb-2">Shape</p>
              <div className="grid grid-cols-2 gap-1.5">
                {SHAPE_TOOLS.map(([k, icon, label]) => (
                  <button
                    key={k}
                    onClick={() => setShapeKind(k)}
                    className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      shapeKind === k
                        ? 'bg-[#D4A017]/15 text-[#D4A017] border border-[#D4A017]/30'
                        : 'text-white/45 hover:text-white border border-white/[0.07] hover:border-white/20'
                    }`}
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Templates */}
          {tool === 'template' && (
            <div className="p-2.5 border-b border-white/[0.07]">
              <p className="text-[9px] font-bold tracking-widest uppercase text-white/25 px-1 mb-2">AI Templates</p>
              <div className="space-y-1.5">
                {AI_TEMPLATES.map(t => (
                  <button
                    key={t.name}
                    onClick={() => applyTemplate(t)}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl border border-white/[0.08] hover:border-[#D4A017]/40 hover:bg-[#D4A017]/[0.05] text-left transition-all group"
                  >
                    <span className="text-base flex-shrink-0 leading-none">{t.preview}</span>
                    <span className="text-xs font-medium text-white/65 group-hover:text-white truncate">{t.name}</span>
                  </button>
                ))}
                <button
                  onClick={aiGenerateText}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 mt-1 rounded-xl bg-gradient-to-r from-[#8B5CF6]/20 to-[#D4A017]/20 border border-[#8B5CF6]/30 text-xs font-bold text-[#8B5CF6] hover:from-[#8B5CF6]/30 hover:to-[#D4A017]/30 transition-all"
                >
                  <Wand2 size={12} /> AI Generate Text
                </button>
                <button
                  onClick={() => applyTemplate(AI_TEMPLATES[Math.floor(Math.random() * AI_TEMPLATES.length)])}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A017]/20 to-[#00D4FF]/20 border border-[#D4A017]/30 text-xs font-bold text-[#D4A017] hover:from-[#D4A017]/30 hover:to-[#00D4FF]/30 transition-all"
                >
                  <Sparkles size={12} /> Random Design
                </button>
              </div>
            </div>
          )}

          {/* Shirt Colors */}
          <div className="p-2.5 border-b border-white/[0.07]">
            <p className="text-[9px] font-bold tracking-widest uppercase text-white/25 px-1 mb-2">Shirt Color</p>
            <div className="grid grid-cols-5 gap-1.5">
              {SHIRT_COLORS.map(c => (
                <button
                  key={c.hex}
                  onClick={() => setShirtColor(c)}
                  title={c.name}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${
                    shirtColor.hex === c.hex
                      ? 'border-[#D4A017] scale-110 shadow-[0_0_10px_rgba(212,160,23,0.4)]'
                      : 'border-transparent hover:border-white/30'
                  }`}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
            <p className="text-[10px] text-white/35 mt-1.5 px-1">{shirtColor.name}</p>
          </div>

          {/* Size */}
          <div className="p-2.5">
            <p className="text-[9px] font-bold tracking-widest uppercase text-white/25 px-1 mb-2">Size</p>
            <div className="flex flex-wrap gap-1.5">
              {SIZES.map(s => (
                <button
                  key={s}
                  onClick={() => setActiveSize(s)}
                  className={`w-9 h-8 rounded-lg text-xs font-bold border transition-all ${
                    activeSize === s
                      ? 'border-[#D4A017] bg-[#D4A017]/10 text-[#D4A017]'
                      : 'border-white/[0.08] text-white/45 hover:border-white/25 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── CENTER: CANVAS ──────────────────────────────────────────────── */}
        <div className="flex-1 relative overflow-hidden bg-[#080810] flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#12121c_0%,#050507_100%)]" />

          <div
            className="relative"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.15s ease' }}
          >
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              className="block rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.9)]"
              style={{ cursor: canvasCursor }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={commitDrag}
              onMouseLeave={commitDrag}
            />

            {/* Text input overlay */}
            {showTextBox && (
              <div style={{ position: 'absolute', left: textPos.x, top: textPos.y - 20 }} className="z-10">
                <input
                  autoFocus
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') addText(); if (e.key === 'Escape') setShowTextBox(false) }}
                  onBlur={addText}
                  placeholder="Type & press Enter…"
                  className="bg-[#111118] border border-[#00D4FF] text-white text-sm px-3 py-1.5 rounded-lg outline-none w-52 shadow-[0_0_20px_rgba(0,212,255,0.25)]"
                />
              </div>
            )}
          </div>

          {/* Tip bar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] px-4 py-1.5 rounded-full text-[11px] text-white/35 whitespace-nowrap pointer-events-none">
            {tool === 'select'   ? 'Click to select · Drag to move · Handle to resize · Purple dot to rotate · [ ] to reorder · Ctrl+D to duplicate'
            : tool === 'text'    ? 'Click canvas to place text'
            : tool === 'image'   ? 'Choose file to upload'
            : tool === 'shape'   ? 'Click to place shape'
            : 'Pick a template to apply'}
          </div>
        </div>

        {/* ── RIGHT PANEL ────────────────────────────────────────────────── */}
        <div className="w-60 border-l border-white/[0.07] bg-[#0C0C12] flex flex-col overflow-y-auto">

          {/* Properties */}
          {selLayer && (
            <div className="p-2.5 border-b border-white/[0.07] space-y-2.5">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-bold tracking-widest uppercase text-white/25">Properties</p>
                <div className="flex gap-1">
                  <button
                    onClick={() => { updateSel({ locked: !selLayer.locked }); commitSel() }}
                    title={selLayer.locked ? 'Unlock' : 'Lock'}
                    className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                      selLayer.locked ? 'text-red-400 bg-red-500/10' : 'text-white/30 hover:text-white'
                    }`}
                  >
                    {selLayer.locked ? <Lock size={11} /> : <Unlock size={11} />}
                  </button>
                  <button
                    onClick={() => { updateSel({ hidden: !selLayer.hidden }); commitSel() }}
                    title={selLayer.hidden ? 'Show' : 'Hide'}
                    className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                      selLayer.hidden ? 'text-white/20' : 'text-white/30 hover:text-white'
                    }`}
                  >
                    {selLayer.hidden ? <EyeOff size={11} /> : <Eye size={11} />}
                  </button>
                  <button onClick={duplicateLayer} title="Duplicate (Ctrl+D)" className="w-6 h-6 rounded flex items-center justify-center text-white/30 hover:text-white transition-colors">
                    <Copy size={11} />
                  </button>
                </div>
              </div>

              {/* Position & Size */}
              <div className="grid grid-cols-2 gap-1.5">
                {[['X', 'x'], ['Y', 'y'], ['W', 'w'], ['H', 'h']].map(([label, key]) => (
                  <div key={key}>
                    <label className="text-[10px] text-white/30 block mb-0.5">{label}</label>
                    <input
                      type="number"
                      value={Math.round(selLayer[key as keyof Layer] as number ?? 0)}
                      onChange={e => updateSel({ [key]: +e.target.value })}
                      onBlur={commitSel}
                      className="w-full bg-[#111118] border border-white/[0.08] rounded-lg px-2 py-1 text-xs text-white focus:border-[#D4A017] outline-none tabular-nums"
                    />
                  </div>
                ))}
              </div>

              {/* Alignment */}
              <div>
                <label className="text-[10px] text-white/30 block mb-1.5">Align in Print Zone</label>
                <div className="grid grid-cols-3 gap-1">
                  {([
                    ['left',    <AlignLeft size={11} key="al" />,    'Align left'],
                    ['centerH', <AlignCenter size={11} key="ac" />,  'Center H'],
                    ['right',   <AlignRight size={11} key="ar" />,   'Align right'],
                  ] as [Parameters<typeof alignLayer>[0], React.ReactNode, string][]).map(([d, icon, title]) => (
                    <button key={d} onClick={() => alignLayer(d)} title={title}
                      className="flex items-center justify-center py-1.5 rounded-lg border border-white/[0.08] text-white/40 hover:text-[#D4A017] hover:border-[#D4A017]/30 transition-all"
                    >{icon}</button>
                  ))}
                  {([
                    ['top',     '⬆', 'Align top'],
                    ['centerV', '↕', 'Center V'],
                    ['bottom',  '⬇', 'Align bottom'],
                  ] as [Parameters<typeof alignLayer>[0], string, string][]).map(([d, icon, title]) => (
                    <button key={d} onClick={() => alignLayer(d)} title={title}
                      className="flex items-center justify-center py-1.5 rounded-lg border border-white/[0.08] text-white/40 hover:text-[#D4A017] hover:border-[#D4A017]/30 transition-all text-xs"
                    >{icon}</button>
                  ))}
                </div>
              </div>

              {/* Text properties */}
              {selLayer.type === 'text' && (
                <>
                  <div>
                    <label className="text-[10px] text-white/30 block mb-1">Font</label>
                    <select
                      value={selLayer.font ?? 'Inter'}
                      onChange={e => { updateSel({ font: e.target.value }); commitSel() }}
                      className="w-full bg-[#111118] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white focus:border-[#D4A017] outline-none"
                    >
                      {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-white/30 flex justify-between mb-1">
                      Font Size <span className="text-white">{selLayer.fontSize ?? 24}px</span>
                    </label>
                    <input type="range" min={8} max={100} value={selLayer.fontSize ?? 24}
                      onChange={e => updateSel({ fontSize: +e.target.value })} onMouseUp={commitSel}
                      className="w-full"
                    />
                  </div>

                  <div className="flex gap-1.5">
                    <button onClick={() => { updateSel({ bold: !selLayer.bold }); commitSel() }}
                      className={`flex-1 py-1.5 rounded-lg border text-xs transition-all flex items-center justify-center ${
                        selLayer.bold ? 'border-[#D4A017] bg-[#D4A017]/10 text-[#D4A017]' : 'border-white/[0.08] text-white/40 hover:text-white'
                      }`}><Bold size={11} /></button>
                    <button onClick={() => { updateSel({ italic: !selLayer.italic }); commitSel() }}
                      className={`flex-1 py-1.5 rounded-lg border text-xs transition-all flex items-center justify-center ${
                        selLayer.italic ? 'border-[#D4A017] bg-[#D4A017]/10 text-[#D4A017]' : 'border-white/[0.08] text-white/40 hover:text-white'
                      }`}><Italic size={11} /></button>
                    <button onClick={() => { updateSel({ textAlign: 'left' }); commitSel() }}
                      className={`flex-1 py-1.5 rounded-lg border text-xs transition-all flex items-center justify-center ${
                        selLayer.textAlign === 'left' ? 'border-[#D4A017] bg-[#D4A017]/10 text-[#D4A017]' : 'border-white/[0.08] text-white/40 hover:text-white'
                      }`}><AlignLeft size={11} /></button>
                    <button onClick={() => { updateSel({ textAlign: 'center' }); commitSel() }}
                      className={`flex-1 py-1.5 rounded-lg border text-xs transition-all flex items-center justify-center ${
                        (!selLayer.textAlign || selLayer.textAlign === 'center') ? 'border-[#D4A017] bg-[#D4A017]/10 text-[#D4A017]' : 'border-white/[0.08] text-white/40 hover:text-white'
                      }`}><AlignCenter size={11} /></button>
                    <button onClick={() => { updateSel({ textAlign: 'right' }); commitSel() }}
                      className={`flex-1 py-1.5 rounded-lg border text-xs transition-all flex items-center justify-center ${
                        selLayer.textAlign === 'right' ? 'border-[#D4A017] bg-[#D4A017]/10 text-[#D4A017]' : 'border-white/[0.08] text-white/40 hover:text-white'
                      }`}><AlignRight size={11} /></button>
                  </div>

                  {/* Text effects */}
                  <div className="flex gap-1.5">
                    <button onClick={() => { updateSel({ textShadow: !selLayer.textShadow }); commitSel() }}
                      className={`flex-1 py-1.5 rounded-lg border text-[10px] font-semibold transition-all ${
                        selLayer.textShadow ? 'border-[#8B5CF6] bg-[#8B5CF6]/10 text-[#8B5CF6]' : 'border-white/[0.08] text-white/40 hover:text-white'
                      }`}>Shadow</button>
                    <button onClick={() => { updateSel({ textOutline: !selLayer.textOutline }); commitSel() }}
                      className={`flex-1 py-1.5 rounded-lg border text-[10px] font-semibold transition-all ${
                        selLayer.textOutline ? 'border-[#00D4FF] bg-[#00D4FF]/10 text-[#00D4FF]' : 'border-white/[0.08] text-white/40 hover:text-white'
                      }`}>Outline</button>
                  </div>

                  {selLayer.textOutline && (
                    <div>
                      <label className="text-[10px] text-white/30 block mb-1">Outline Color</label>
                      <input type="color" value={selLayer.textOutlineColor ?? '#000000'}
                        onChange={e => updateSel({ textOutlineColor: e.target.value })} onBlur={commitSel}
                        className="w-full h-7 rounded-lg border border-white/[0.08] bg-transparent cursor-pointer"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] text-white/30 block mb-1">Text Color</label>
                    <input type="color" value={selLayer.textColor ?? '#ffffff'}
                      onChange={e => updateSel({ textColor: e.target.value })} onBlur={commitSel}
                      className="w-full h-7 rounded-lg border border-white/[0.08] bg-transparent cursor-pointer"
                    />
                    <div className="grid grid-cols-6 gap-1 mt-1.5">
                      {COLOR_SWATCHES.map(c => (
                        <button key={c} onClick={() => { updateSel({ textColor: c }); commitSel() }}
                          className={`w-6 h-6 rounded border-2 transition-all hover:scale-110 ${
                            selLayer.textColor === c ? 'border-[#D4A017] scale-110' : 'border-transparent'
                          }`}
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-white/30 block mb-1">Text</label>
                    <input value={selLayer.text ?? ''} onChange={e => updateSel({ text: e.target.value })} onBlur={commitSel}
                      className="w-full bg-[#111118] border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white focus:border-[#D4A017] outline-none"
                    />
                  </div>
                </>
              )}

              {/* Shape fill */}
              {selLayer.type === 'shape' && (
                <div>
                  <label className="text-[10px] text-white/30 block mb-1">Fill Color</label>
                  <input type="color" value={selLayer.fillColor ?? '#D4A017'}
                    onChange={e => updateSel({ fillColor: e.target.value })} onBlur={commitSel}
                    className="w-full h-7 rounded-lg border border-white/[0.08] bg-transparent cursor-pointer"
                  />
                  <div className="grid grid-cols-6 gap-1 mt-1.5">
                    {COLOR_SWATCHES.map(c => (
                      <button key={c} onClick={() => { updateSel({ fillColor: c }); commitSel() }}
                        className={`w-6 h-6 rounded border-2 transition-all hover:scale-110 ${
                          selLayer.fillColor === c ? 'border-[#D4A017] scale-110' : 'border-transparent'
                        }`}
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Flip buttons */}
              <div className="flex gap-1.5">
                <button onClick={() => { updateSel({ flipH: !selLayer.flipH }); commitSel() }}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border text-[10px] transition-all ${
                    selLayer.flipH ? 'border-[#00E5CC] bg-[#00E5CC]/10 text-[#00E5CC]' : 'border-white/[0.08] text-white/40 hover:text-white'
                  }`}
                ><FlipHorizontal size={11} /> Flip H</button>
                <button onClick={() => { updateSel({ flipV: !selLayer.flipV }); commitSel() }}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border text-[10px] transition-all ${
                    selLayer.flipV ? 'border-[#00E5CC] bg-[#00E5CC]/10 text-[#00E5CC]' : 'border-white/[0.08] text-white/40 hover:text-white'
                  }`}
                ><FlipVertical size={11} /> Flip V</button>
              </div>

              {/* Opacity & Rotation */}
              <div>
                <label className="text-[10px] text-white/30 flex justify-between mb-1">
                  Opacity <span className="text-white">{Math.round((selLayer.opacity ?? 1) * 100)}%</span>
                </label>
                <input type="range" min={10} max={100} value={Math.round((selLayer.opacity ?? 1) * 100)}
                  onChange={e => updateSel({ opacity: +e.target.value / 100 })} onMouseUp={commitSel}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-[10px] text-white/30 flex justify-between mb-1">
                  Rotation <span className="text-white">{selLayer.rotation ?? 0}°</span>
                </label>
                <input type="range" min={-180} max={180} value={selLayer.rotation ?? 0}
                  onChange={e => updateSel({ rotation: +e.target.value })} onMouseUp={commitSel}
                  className="w-full"
                />
              </div>

              <button onClick={() => deleteLayer(selId!)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-red-500/25 text-red-400/80 text-xs hover:bg-red-500/10 hover:border-red-500/40 transition-all"
              >
                <Trash2 size={11} /> Remove Layer
              </button>
            </div>
          )}

          {/* Layers list */}
          <div className="p-2.5 flex-1 min-h-0">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[9px] font-bold tracking-widest uppercase text-white/25">Layers <span className="text-white/15">({layers.length})</span></p>
              <div className="flex gap-1">
                <button onClick={moveLayerUp} title="Move up (])" disabled={!selId} className="w-5 h-5 rounded flex items-center justify-center text-white/25 hover:text-white disabled:opacity-20 transition-colors">
                  <ArrowUp size={11} />
                </button>
                <button onClick={moveLayerDown} title="Move down ([)" disabled={!selId} className="w-5 h-5 rounded flex items-center justify-center text-white/25 hover:text-white disabled:opacity-20 transition-colors">
                  <ArrowDown size={11} />
                </button>
              </div>
            </div>

            {layers.length === 0 ? (
              <p className="text-[11px] text-white/20 text-center py-8 leading-relaxed">
                No layers yet.<br />Use tools to start designing.
              </p>
            ) : (
              <div className="space-y-1">
                {[...layers].reverse().map(l => (
                  <button
                    key={l.id}
                    onClick={() => setSelId(l.id === selId ? null : l.id)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all group ${
                      l.id === selId
                        ? 'bg-[#D4A017]/10 border border-[#D4A017]/30'
                        : 'border border-transparent hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className="text-sm leading-none flex-shrink-0">{layerIcon(l)}</span>
                    <span className={`text-xs truncate flex-1 ${l.hidden ? 'text-white/25 line-through' : 'text-white/55'}`}>
                      {layerLabel(l)}
                    </span>
                    <div className="flex gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      {l.locked && <Lock size={9} className="text-red-400" />}
                      {l.hidden && <EyeOff size={9} className="text-white/30" />}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Qty + Cart */}
          <div className="p-2.5 border-t border-white/[0.07] space-y-2">
            <div className="flex items-center gap-2">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center font-bold transition-colors">−</button>
              <span className="flex-1 text-center font-bold text-sm tabular-nums">{qty}</span>
              <button onClick={() => setQty(q => q + 1)}
                className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center font-bold transition-colors">+</button>
            </div>
            <button onClick={addToCart}
              className="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#D4A017] to-[#F0C040] text-black hover:from-[#F0C040] hover:to-[#D4A017] transition-all shadow-[0_4px_20px_rgba(212,160,23,0.28)] hover:shadow-[0_4px_28px_rgba(212,160,23,0.45)]"
            >
              <ShoppingBag size={14} /> Add to Cart — ${49 * qty}
            </button>
          </div>
        </div>
      </div>

      {/* ── PREVIEW MODAL ──────────────────────────────────────────────────── */}
      {step >= 1 && (
        <div className="fixed inset-0 z-50 bg-[#050507]/95 backdrop-blur-2xl flex items-center justify-center p-6">
          <div className="max-w-xl w-full bg-[#111118] border border-white/[0.08] rounded-3xl p-7 shadow-2xl">
            <h2 className="text-xl font-black mb-5 bg-gradient-to-r from-[#D4A017] to-[#F0C040] bg-clip-text text-transparent">
              Design Preview
            </h2>

            <div className="flex gap-6 items-start">
              <div
                className="w-40 h-48 rounded-2xl border border-white/[0.08] flex flex-col items-center justify-center gap-2 flex-shrink-0 overflow-hidden"
                style={{ background: shirtColor.hex }}
              >
                <div className="text-center">
                  <p className="text-[9px] font-bold tracking-widest uppercase opacity-40"
                    style={{ color: isLight(shirtColor.hex) ? '#000' : '#fff' }}>
                    {shirtColor.name}
                  </p>
                  <p className="text-[9px] opacity-30 mt-1"
                    style={{ color: isLight(shirtColor.hex) ? '#000' : '#fff' }}>
                    {layers.length} layer{layers.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div className="bg-[#0C0C12] border border-[#D4A017]/15 rounded-2xl p-4 space-y-2 text-sm">
                  {[
                    ['Product', 'Custom Design Tee'],
                    ['Color', shirtColor.name],
                    ['Size', activeSize],
                    ['Quantity', String(qty)],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-white/40">{k}</span>
                      <span className={k === 'Size' ? 'font-bold text-[#D4A017]' : 'font-medium'}>{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t border-white/[0.07] pt-2 mt-1">
                    <span className="font-bold">Total</span>
                    <span className="font-black text-[#D4A017] text-base">${49 * qty}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setStep(0)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold border border-[#D4A017]/35 text-[#D4A017] hover:bg-[#D4A017]/10 transition-all"
                  >Edit More</button>
                  <button onClick={addToCart}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#D4A017] to-[#F0C040] text-black hover:from-[#F0C040] hover:to-[#D4A017] transition-all"
                  ><ShoppingBag size={14} /> Order Now</button>
                </div>

                <button onClick={exportPng}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs text-white/30 hover:text-white/60 transition-colors"
                ><Download size={12} /> Download PNG</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
