'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import Link from 'next/link'
import {
  Type, Image as ImageIcon, Shapes, Trash2, Download,
  RotateCcw, ZoomIn, ZoomOut, MoveLeft, AlignCenter,
  Bold, Italic, ShoppingBag, Palette, ChevronLeft, ChevronRight, Layers
} from 'lucide-react'

type Tool = 'select' | 'text' | 'image' | 'shape'
type ShapeType = 'rect' | 'circle' | 'star' | 'arrow'
interface DesignLayer {
  id: string
  type: 'text' | 'image' | 'shape'
  x: number
  y: number
  width: number
  height: number
  content?: string
  src?: string
  fontFamily?: string
  fontSize?: number
  fontBold?: boolean
  fontItalic?: boolean
  color?: string
  shapeType?: ShapeType
  rotation?: number
  opacity?: number
}

const SHIRT_COLORS = [
  { name: 'Chalk White', hex: '#f5f5f0' },
  { name: 'Jet Black',   hex: '#1a1a1a' },
  { name: 'Ash Gray',    hex: '#9e9e9e' },
  { name: 'Navy',        hex: '#1a1a3e' },
  { name: 'Forest',      hex: '#2d4a2d' },
  { name: 'Sand',        hex: '#c8b4a0' },
  { name: 'Crimson',     hex: '#8b0000' },
  { name: 'Royal Blue',  hex: '#1a3a8b' },
]

const SIZES = ['XS','S','M','L','XL','XXL','3XL']
const FONTS = ['Inter', 'Playfair Display', 'Georgia', 'Arial Black', 'Courier New', 'Impact']

function nanoid() { return Math.random().toString(36).slice(2, 9) }

const PRINT_ZONE = { x: 130, y: 110, w: 240, h: 280 }

export default function DesignStudio() {
  const { addItem, showToast } = useCart()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [layers, setLayers] = useState<DesignLayer[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [tool, setTool] = useState<Tool>('select')
  const [shirtColor, setShirtColor] = useState(SHIRT_COLORS[0])
  const [activeSize, setActiveSize] = useState('M')
  const [qty, setQty] = useState(1)
  const [step, setStep] = useState<'design' | 'preview' | 'order'>('design')
  const [textInput, setTextInput] = useState('YOUR TEXT')
  const [textFont, setTextFont] = useState('Inter')
  const [textSize, setTextSize] = useState(28)
  const [textBold, setTextBold] = useState(true)
  const [textItalic, setTextItalic] = useState(false)
  const [textColor, setTextColor] = useState('#C8A45A')
  const [shapeType, setShapeType] = useState<ShapeType>('rect')
  const [shapeColor, setShapeColor] = useState('#C8A45A')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [sidebarSection, setSidebarSection] = useState<'layers' | 'tools'>('tools')
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0, lx: 0, ly: 0 })

  // ---- DRAW CANVAS ----
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width
    const H = canvas.height
    ctx.clearRect(0, 0, W, H)

    // Shirt silhouette (simplified SVG-like path)
    ctx.save()
    ctx.fillStyle = shirtColor.hex
    ctx.beginPath()
    // Shoulder left
    ctx.moveTo(100, 60)
    ctx.lineTo(60, 100)
    ctx.lineTo(30, 80)
    ctx.lineTo(20, 140)
    ctx.lineTo(80, 150)
    ctx.lineTo(80, H - 40)
    ctx.lineTo(W - 80, H - 40)
    ctx.lineTo(W - 80, 150)
    ctx.lineTo(W - 20, 140)
    ctx.lineTo(W - 30, 80)
    ctx.lineTo(W - 60, 100)
    ctx.lineTo(W - 100, 60)
    // Collar (bezier)
    ctx.bezierCurveTo(W - 120, 80, W / 2 + 40, 90, W / 2, 95)
    ctx.bezierCurveTo(W / 2 - 40, 90, 120, 80, 100, 60)
    ctx.closePath()
    ctx.fill()
    // Shirt shadow/shading
    ctx.fillStyle = 'rgba(0,0,0,0.06)'
    ctx.fillRect(80, 150, 60, H - 190)
    ctx.fillRect(W - 140, 150, 60, H - 190)
    ctx.restore()

    // Print zone guide (dashed)
    ctx.save()
    ctx.strokeStyle = 'rgba(200,164,90,0.3)'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.strokeRect(PRINT_ZONE.x, PRINT_ZONE.y, PRINT_ZONE.w, PRINT_ZONE.h)
    ctx.fillStyle = 'rgba(200,164,90,0.04)'
    ctx.fillRect(PRINT_ZONE.x, PRINT_ZONE.y, PRINT_ZONE.w, PRINT_ZONE.h)
    ctx.restore()

    // Draw layers
    layers.forEach(layer => {
      ctx.save()
      ctx.globalAlpha = layer.opacity ?? 1
      const cx = layer.x + layer.width / 2
      const cy = layer.y + layer.height / 2
      if (layer.rotation) {
        ctx.translate(cx, cy)
        ctx.rotate((layer.rotation * Math.PI) / 180)
        ctx.translate(-cx, -cy)
      }

      if (layer.type === 'text') {
        const weight = layer.fontBold ? 'bold' : 'normal'
        const style = layer.fontItalic ? 'italic' : 'normal'
        ctx.font = `${style} ${weight} ${layer.fontSize ?? 28}px "${layer.fontFamily ?? 'Inter'}"`
        ctx.fillStyle = layer.color ?? '#ffffff'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(layer.content ?? '', cx, cy)
      } else if (layer.type === 'image' && layer.src) {
        const img = new window.Image()
        img.src = layer.src
        img.onload = () => {
          ctx.drawImage(img, layer.x, layer.y, layer.width, layer.height)
          if (layer.id === selected) {
            ctx.strokeStyle = '#C8A45A'
            ctx.lineWidth = 2
            ctx.setLineDash([])
            ctx.strokeRect(layer.x - 2, layer.y - 2, layer.width + 4, layer.height + 4)
          }
        }
        if (img.complete) ctx.drawImage(img, layer.x, layer.y, layer.width, layer.height)
      } else if (layer.type === 'shape') {
        ctx.fillStyle = layer.color ?? '#C8A45A'
        if (layer.shapeType === 'circle') {
          ctx.beginPath()
          ctx.ellipse(cx, cy, layer.width / 2, layer.height / 2, 0, 0, Math.PI * 2)
          ctx.fill()
        } else if (layer.shapeType === 'star') {
          drawStar(ctx, cx, cy, 5, layer.width / 2, layer.width / 4)
          ctx.fill()
        } else {
          ctx.fillRect(layer.x, layer.y, layer.width, layer.height)
        }
      }

      // Selection handles
      if (layer.id === selected && layer.type !== 'image') {
        ctx.strokeStyle = '#C8A45A'
        ctx.lineWidth = 2
        ctx.setLineDash([4, 4])
        ctx.strokeRect(layer.x - 4, layer.y - 4, layer.width + 8, layer.height + 8)
        // Corner handles
        ctx.setLineDash([])
        ctx.fillStyle = '#C8A45A'
        const handles = [
          [layer.x - 4, layer.y - 4],
          [layer.x + layer.width + 4, layer.y - 4],
          [layer.x - 4, layer.y + layer.height + 4],
          [layer.x + layer.width + 4, layer.y + layer.height + 4],
        ]
        handles.forEach(([hx, hy]) => {
          ctx.beginPath()
          ctx.arc(hx, hy, 5, 0, Math.PI * 2)
          ctx.fill()
        })
      }
      ctx.restore()
    })
  }, [layers, selected, shirtColor])

  function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outer: number, inner: number) {
    let rot = (Math.PI / 2) * 3
    const step2 = Math.PI / spikes
    ctx.beginPath()
    ctx.moveTo(cx, cy - outer)
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(cx + Math.cos(rot) * outer, cy + Math.sin(rot) * outer)
      rot += step2
      ctx.lineTo(cx + Math.cos(rot) * inner, cy + Math.sin(rot) * inner)
      rot += step2
    }
    ctx.lineTo(cx, cy - outer)
    ctx.closePath()
  }

  useEffect(() => { drawCanvas() }, [drawCanvas])

  // ---- CANVAS INTERACTIONS ----
  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const scaleX = canvasRef.current!.width / rect.width
    const scaleY = canvasRef.current!.height / rect.height
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY }
  }

  const hitTest = (pos: { x: number; y: number }, layer: DesignLayer) =>
    pos.x >= layer.x && pos.x <= layer.x + layer.width &&
    pos.y >= layer.y && pos.y <= layer.y + layer.height

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasPos(e)
    if (tool === 'select') {
      const hit = [...layers].reverse().find(l => hitTest(pos, l))
      setSelected(hit?.id ?? null)
      if (hit) {
        isDragging.current = true
        dragStart.current = { x: pos.x, y: pos.y, lx: hit.x, ly: hit.y }
      }
    } else if (tool === 'text') {
      addTextLayer(pos)
    } else if (tool === 'shape') {
      addShapeLayer(pos)
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current || !selected) return
    const pos = getCanvasPos(e)
    const dx = pos.x - dragStart.current.x
    const dy = pos.y - dragStart.current.y
    setLayers(ls => ls.map(l => l.id === selected ? { ...l, x: dragStart.current.lx + dx, y: dragStart.current.ly + dy } : l))
  }

  const handleCanvasMouseUp = () => { isDragging.current = false }

  // ---- ADD LAYERS ----
  const addTextLayer = (pos?: { x: number; y: number }) => {
    const layer: DesignLayer = {
      id: nanoid(),
      type: 'text',
      x: pos?.x ?? PRINT_ZONE.x + 40,
      y: pos?.y ?? PRINT_ZONE.y + 100,
      width: 160,
      height: textSize + 10,
      content: textInput,
      fontFamily: textFont,
      fontSize: textSize,
      fontBold: textBold,
      fontItalic: textItalic,
      color: textColor,
      opacity: 1,
      rotation: 0,
    }
    setLayers(ls => [...ls, layer])
    setSelected(layer.id)
    setTool('select')
    showToast('✓ Text added!')
  }

  const addShapeLayer = (pos?: { x: number; y: number }) => {
    const layer: DesignLayer = {
      id: nanoid(),
      type: 'shape',
      x: pos?.x ?? PRINT_ZONE.x + 80,
      y: pos?.y ?? PRINT_ZONE.y + 80,
      width: 80,
      height: 80,
      shapeType,
      color: shapeColor,
      opacity: 1,
      rotation: 0,
    }
    setLayers(ls => [...ls, layer])
    setSelected(layer.id)
    setTool('select')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const src = ev.target?.result as string
      const layer: DesignLayer = {
        id: nanoid(),
        type: 'image',
        x: PRINT_ZONE.x + 40,
        y: PRINT_ZONE.y + 40,
        width: 160,
        height: 160,
        src,
        opacity: 1,
        rotation: 0,
      }
      setLayers(ls => [...ls, layer])
      setSelected(layer.id)
      setTool('select')
      showToast('✓ Image added!')
    }
    reader.readAsDataURL(file)
  }

  const selectedLayer = layers.find(l => l.id === selected)

  const updateSelected = (patch: Partial<DesignLayer>) => {
    setLayers(ls => ls.map(l => l.id === selected ? { ...l, ...patch } : l))
  }

  const deleteSelected = () => {
    setLayers(ls => ls.filter(l => l.id !== selected))
    setSelected(null)
  }

  const generatePreview = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    setPreviewUrl(canvas.toDataURL('image/png', 1.0))
    setStep('preview')
  }

  const handleAddToCart = () => {
    const canvas = canvasRef.current
    const design = canvas?.toDataURL('image/png', 0.9) ?? undefined
    addItem({
      productId: 'custom-blank',
      name: `Custom Design Tee`,
      price: 49,
      size: activeSize,
      color: shirtColor.name,
      qty,
      image: design ?? 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      customDesign: design,
    })
    setStep('order')
  }

  return (
    <div className="min-h-screen pt-20 bg-brand-black flex flex-col">
      {/* Top bar */}
      <div className="bg-brand-dark border-b border-brand-border px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/products" className="flex items-center gap-2 text-brand-gray hover:text-white transition-colors text-sm">
            <MoveLeft size={16} /> Back to Shop
          </Link>
          <div className="w-px h-5 bg-brand-border" />
          <div className="flex gap-2">
            {(['design','preview','order'] as const).map((s, i) => (
              <button key={s} onClick={() => s !== 'order' && setStep(s)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-all capitalize ${step === s ? 'bg-brand-gold text-brand-black' : 'text-brand-gray hover:text-white'}`}>
                <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[10px]">{i + 1}</span>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => { setLayers([]); setSelected(null) }} className="text-brand-gray hover:text-white transition-colors text-sm flex items-center gap-1.5">
            <RotateCcw size={14} /> Reset
          </button>
          {step === 'design' && (
            <button onClick={generatePreview}
              disabled={layers.length === 0}
              className="bg-brand-gold text-brand-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              Preview →
            </button>
          )}
          {step === 'preview' && (
            <button onClick={() => setStep('order')} className="bg-brand-gold text-brand-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-white transition-all">
              Order This →
            </button>
          )}
        </div>
      </div>

      {step === 'design' && (
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT SIDEBAR — Tools */}
          <div className="w-72 bg-brand-dark border-r border-brand-border flex flex-col overflow-y-auto scrollbar-thin">
            {/* Sidebar tabs */}
            <div className="flex border-b border-brand-border">
              <button onClick={() => setSidebarSection('tools')} className={`flex-1 py-3 text-xs font-bold tracking-widest uppercase transition-all ${sidebarSection === 'tools' ? 'text-brand-gold border-b-2 border-brand-gold' : 'text-brand-gray hover:text-white'}`}>Tools</button>
              <button onClick={() => setSidebarSection('layers')} className={`flex-1 py-3 text-xs font-bold tracking-widest uppercase transition-all ${sidebarSection === 'layers' ? 'text-brand-gold border-b-2 border-brand-gold' : 'text-brand-gray hover:text-white'}`}>
                Layers {layers.length > 0 && <span className="ml-1 bg-brand-gold text-brand-black text-[9px] rounded-full w-4 h-4 inline-flex items-center justify-center">{layers.length}</span>}
              </button>
            </div>

            {sidebarSection === 'tools' && (
              <div className="p-4 space-y-5">
                {/* Tool select */}
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-brand-gray mb-3">Add Elements</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { t: 'text'  as Tool, icon: <Type size={18} />,       label: 'Text' },
                      { t: 'image' as Tool, icon: <ImageIcon size={18} />,  label: 'Image' },
                      { t: 'shape' as Tool, icon: <Shapes size={18} />,     label: 'Shape' },
                    ].map(({ t, icon, label }) => (
                      <button key={t} onClick={() => { setTool(t); if (t === 'image') fileRef.current?.click() }}
                        className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all text-xs font-bold ${tool === t ? 'border-brand-gold bg-brand-gold/10 text-brand-gold' : 'border-brand-border text-white/60 hover:border-white/30 hover:text-white'}`}>
                        {icon}{label}
                      </button>
                    ))}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>

                {/* Text options */}
                {tool === 'text' && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-brand-gray">Text Options</p>
                    <textarea
                      value={textInput}
                      onChange={e => setTextInput(e.target.value)}
                      className="w-full bg-brand-black border border-brand-border rounded-xl p-3 text-sm text-white placeholder:text-brand-gray resize-none outline-none focus:border-brand-gold/40 transition-colors"
                      rows={2}
                    />
                    <select value={textFont} onChange={e => setTextFont(e.target.value)}
                      className="w-full bg-brand-black border border-brand-border rounded-xl px-3 py-2.5 text-sm text-white outline-none cursor-pointer focus:border-brand-gold/40 transition-colors">
                      {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <div className="flex gap-2 items-center">
                      <div className="flex gap-1 border border-brand-border rounded-xl overflow-hidden">
                        <button onClick={() => setTextBold(b => !b)} className={`px-3 py-2 transition-all ${textBold ? 'bg-brand-gold text-brand-black' : 'text-white/60 hover:text-white'}`}><Bold size={14} /></button>
                        <button onClick={() => setTextItalic(b => !b)} className={`px-3 py-2 transition-all ${textItalic ? 'bg-brand-gold text-brand-black' : 'text-white/60 hover:text-white'}`}><Italic size={14} /></button>
                      </div>
                      <div className="flex-1">
                        <input type="range" min={12} max={72} value={textSize} onChange={e => setTextSize(Number(e.target.value))} className="w-full" />
                        <div className="text-[10px] text-brand-gray text-center mt-0.5">{textSize}px</div>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-widest uppercase text-brand-gray mb-2">Text Color</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {['#C8A45A','#ffffff','#000000','#FF5C00','#00C2FF','#ff0000','#00ff00','#9b59b6'].map(c => (
                          <button key={c} onClick={() => setTextColor(c)}
                            className={`w-7 h-7 rounded-full border-2 transition-all ${textColor === c ? 'border-brand-gold scale-110' : 'border-brand-border'}`}
                            style={{ background: c }} />
                        ))}
                      </div>
                      <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-full h-9 rounded-xl border border-brand-border bg-brand-black cursor-pointer px-1" />
                    </div>
                    <button onClick={() => addTextLayer()}
                      className="w-full bg-brand-gold text-brand-black py-3 rounded-xl font-bold text-sm hover:bg-white transition-all">
                      + Add Text
                    </button>
                  </div>
                )}

                {/* Shape options */}
                {tool === 'shape' && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-brand-gray">Shape Type</p>
                    <div className="grid grid-cols-3 gap-2">
                      {(['rect','circle','star'] as ShapeType[]).map(s => (
                        <button key={s} onClick={() => setShapeType(s)}
                          className={`py-2 rounded-xl border text-xs font-bold capitalize transition-all ${shapeType === s ? 'border-brand-gold bg-brand-gold/10 text-brand-gold' : 'border-brand-border text-white/60 hover:text-white'}`}>
                          {s === 'rect' ? '■ Square' : s === 'circle' ? '● Circle' : '★ Star'}
                        </button>
                      ))}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-widest uppercase text-brand-gray mb-2">Color</p>
                      <input type="color" value={shapeColor} onChange={e => setShapeColor(e.target.value)} className="w-full h-9 rounded-xl border border-brand-border bg-brand-black cursor-pointer px-1" />
                    </div>
                    <button onClick={() => addShapeLayer()}
                      className="w-full bg-brand-gold text-brand-black py-3 rounded-xl font-bold text-sm hover:bg-white transition-all">
                      + Add Shape
                    </button>
                  </div>
                )}

                {/* Shirt color */}
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-brand-gray mb-3">Shirt Color</p>
                  <div className="grid grid-cols-4 gap-2">
                    {SHIRT_COLORS.map(c => (
                      <button key={c.name} onClick={() => setShirtColor(c)} title={c.name}
                        className={`w-full aspect-square rounded-xl border-2 transition-all ${shirtColor.name === c.name ? 'border-brand-gold scale-110 shadow-[0_0_0_3px_rgba(200,164,90,0.2)]' : 'border-brand-border hover:border-white/40'}`}
                        style={{ background: c.hex }} />
                    ))}
                  </div>
                  <p className="text-xs text-brand-gray mt-2 text-center">{shirtColor.name}</p>
                </div>

                {/* Selected layer controls */}
                {selectedLayer && (
                  <div className="bg-brand-black border border-brand-gold/20 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold tracking-widest uppercase text-brand-gold">Selected Layer</p>
                      <button onClick={deleteSelected} className="text-red-400 hover:text-red-300 transition-colors"><Trash2 size={14} /></button>
                    </div>
                    <div>
                      <p className="text-[10px] text-brand-gray mb-1">Opacity</p>
                      <input type="range" min={0.1} max={1} step={0.05} value={selectedLayer.opacity ?? 1}
                        onChange={e => updateSelected({ opacity: Number(e.target.value) })} className="w-full" />
                      <span className="text-[10px] text-brand-gray">{Math.round((selectedLayer.opacity ?? 1) * 100)}%</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-brand-gray mb-1">Rotation</p>
                      <input type="range" min={-180} max={180} value={selectedLayer.rotation ?? 0}
                        onChange={e => updateSelected({ rotation: Number(e.target.value) })} className="w-full" />
                      <span className="text-[10px] text-brand-gray">{selectedLayer.rotation ?? 0}°</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[10px] text-brand-gray mb-1">Width</p>
                        <input type="number" value={Math.round(selectedLayer.width)} onChange={e => updateSelected({ width: Number(e.target.value) })}
                          className="w-full bg-brand-dark border border-brand-border rounded-lg px-2 py-1.5 text-xs text-white outline-none" />
                      </div>
                      <div>
                        <p className="text-[10px] text-brand-gray mb-1">Height</p>
                        <input type="number" value={Math.round(selectedLayer.height)} onChange={e => updateSelected({ height: Number(e.target.value) })}
                          className="w-full bg-brand-dark border border-brand-border rounded-lg px-2 py-1.5 text-xs text-white outline-none" />
                      </div>
                    </div>
                    {selectedLayer.type === 'text' && (
                      <div>
                        <p className="text-[10px] text-brand-gray mb-1">Text Content</p>
                        <input value={selectedLayer.content ?? ''} onChange={e => updateSelected({ content: e.target.value })}
                          className="w-full bg-brand-dark border border-brand-border rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-brand-gold/40 transition-colors" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {sidebarSection === 'layers' && (
              <div className="p-4">
                {layers.length === 0 ? (
                  <div className="text-center py-8 text-brand-gray">
                    <Layers size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No layers yet</p>
                    <p className="text-xs mt-1">Add text, images or shapes</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {[...layers].reverse().map((l, i) => (
                      <div key={l.id} onClick={() => setSelected(l.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${selected === l.id ? 'bg-brand-gold/10 border border-brand-gold/30' : 'bg-brand-black border border-brand-border hover:border-white/20'}`}>
                        <div className="w-8 h-8 rounded-lg bg-brand-dark flex items-center justify-center text-xs">
                          {l.type === 'text' ? 'T' : l.type === 'image' ? '🖼' : '⬛'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold capitalize truncate">
                            {l.type === 'text' ? (l.content?.slice(0, 14) ?? 'Text') : l.type}
                          </p>
                          <p className="text-[10px] text-brand-gray capitalize">{l.type}</p>
                        </div>
                        <button onClick={e => { e.stopPropagation(); setLayers(ls => ls.filter(x => x.id !== l.id)); if (selected === l.id) setSelected(null) }}
                          className="text-brand-gray hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CENTER — Canvas */}
          <div className="flex-1 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,#1a1a1a,#080808)] overflow-hidden relative">
            <div className="text-center select-none">
              <p className="text-[10px] text-brand-gray mb-3 tracking-widest uppercase">
                {tool === 'select' ? 'Click to select · Drag to move' : tool === 'text' ? 'Click canvas to add text' : tool === 'shape' ? 'Click canvas to add shape' : 'Upload an image'}
              </p>
              <canvas
                ref={canvasRef}
                width={500}
                height={580}
                className="studio-canvas rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.8)] border border-brand-border"
                style={{ maxHeight: 'calc(100vh - 200px)', width: 'auto' }}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
              />
              <p className="text-[10px] text-brand-gray mt-3">Gold dashed area = print zone</p>
            </div>
          </div>
        </div>
      )}

      {step === 'preview' && previewUrl && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8">
          <h2 className="font-display font-black text-4xl">Your Design Preview</h2>
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Design Preview" className="max-h-[500px] rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.8)] border border-brand-border" />
          </div>
          <div className="flex gap-4">
            <button onClick={() => setStep('design')} className="border border-brand-border text-white px-8 py-4 rounded-full font-bold hover:border-white/30 transition-all">
              ← Edit Design
            </button>
            <a
              href={previewUrl}
              download="menzculture-design.png"
              className="border border-brand-border text-white px-8 py-4 rounded-full font-bold hover:border-white/30 transition-all flex items-center gap-2"
            >
              <Download size={18} /> Download
            </a>
            <button onClick={() => setStep('order')} className="bg-brand-gold text-brand-black px-8 py-4 rounded-full font-bold hover:bg-white hover:-translate-y-1 transition-all">
              Order This Tee →
            </button>
          </div>
        </div>
      )}

      {step === 'order' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8 max-w-lg mx-auto w-full">
          <h2 className="font-display font-black text-4xl text-center">Almost There!</h2>
          <p className="text-brand-gray text-center">Choose your size and quantity, then add to cart.</p>
          <div className="w-full space-y-6">
            {/* Shirt color display */}
            <div className="flex items-center gap-3 p-4 bg-brand-card border border-brand-border rounded-2xl">
              <div className="w-14 h-14 rounded-xl border border-brand-border" style={{ background: shirtColor.hex }} />
              <div>
                <p className="font-bold">Custom Design Tee</p>
                <p className="text-sm text-brand-gray">{shirtColor.name} · POD Print</p>
              </div>
              <span className="ml-auto text-2xl font-black">$49</span>
            </div>
            {/* Size */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-brand-gray mb-3">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(s => (
                  <button key={s} onClick={() => setActiveSize(s)}
                    className={`w-12 h-12 rounded-xl border-2 font-bold text-sm transition-all ${activeSize === s ? 'border-brand-gold bg-brand-gold/10 text-brand-gold' : 'border-brand-border hover:border-white/40'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            {/* Qty */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-brand-gray mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-brand-border rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-12 h-12 bg-brand-card hover:bg-brand-gold hover:text-brand-black text-xl font-bold transition-all">−</button>
                  <span className="w-14 text-center font-bold text-lg">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="w-12 h-12 bg-brand-card hover:bg-brand-gold hover:text-brand-black text-xl font-bold transition-all">+</button>
                </div>
                <span className="text-brand-gray text-sm">${49 * qty}.00 total</span>
              </div>
            </div>
            <button onClick={handleAddToCart}
              className="w-full bg-brand-gold text-brand-black py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-white hover:shadow-[0_16px_40px_rgba(200,164,90,0.3)] hover:-translate-y-1 transition-all">
              <ShoppingBag size={22} /> Add Custom Tee to Cart — ${49 * qty}
            </button>
            <button onClick={() => setStep('design')} className="w-full text-center text-brand-gray text-sm hover:text-white transition-colors">
              ← Back to Design
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
