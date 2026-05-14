'use client'

import { useState, useEffect } from 'react'
import { X, ChevronRight, ChevronLeft, Ruler, Zap, CheckCircle2, TrendingUp } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  productName: string
  availableSizes: string[]
  onSelectSize?: (size: string) => void
}

type BodyType = 'slim' | 'regular' | 'athletic' | 'broad'
type FitPref  = 'slim' | 'true' | 'relaxed' | 'oversized'

const BODY_TYPES: { id: BodyType; label: string; desc: string; svg: string }[] = [
  {
    id: 'slim',
    label: 'Slim',
    desc: 'Lean build',
    svg: `<svg viewBox="0 0 40 80" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="10" rx="6" ry="6"/>
      <path d="M16 18 Q14 30 15 50 Q16 60 16 72 L18 72 L18 50 L20 50 L22 50 L22 72 L24 72 Q24 60 25 50 Q26 30 24 18 Q22 22 20 22 Q18 22 16 18Z"/>
      <path d="M15 20 Q8 28 9 38 L13 36 Q13 28 16 22Z"/>
      <path d="M25 20 Q32 28 31 38 L27 36 Q27 28 24 22Z"/>
    </svg>`,
  },
  {
    id: 'regular',
    label: 'Regular',
    desc: 'Average build',
    svg: `<svg viewBox="0 0 40 80" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="10" rx="6.5" ry="6.5"/>
      <path d="M14 18 Q12 30 13 50 Q14 60 14 72 L17 72 L17 50 L20 50 L23 50 L23 72 L26 72 Q26 60 27 50 Q28 30 26 18 Q23 23 20 23 Q17 23 14 18Z"/>
      <path d="M14 20 Q6 28 7 40 L12 37 Q12 28 15 22Z"/>
      <path d="M26 20 Q34 28 33 40 L28 37 Q28 28 25 22Z"/>
    </svg>`,
  },
  {
    id: 'athletic',
    label: 'Athletic',
    desc: 'Muscular build',
    svg: `<svg viewBox="0 0 40 80" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="10" rx="7" ry="6.5"/>
      <path d="M12 18 Q10 26 12 34 Q13 44 13 52 Q14 62 14 72 L17 72 L17 50 L20 50 L23 50 L23 72 L26 72 Q26 62 27 52 Q27 44 28 34 Q30 26 28 18 Q25 24 20 24 Q15 24 12 18Z"/>
      <path d="M12 20 Q4 26 5 40 L11 36 Q10 27 13 22Z"/>
      <path d="M28 20 Q36 26 35 40 L29 36 Q30 27 27 22Z"/>
    </svg>`,
  },
  {
    id: 'broad',
    label: 'Broad',
    desc: 'Wide build',
    svg: `<svg viewBox="0 0 40 80" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="10" rx="7" ry="6.5"/>
      <path d="M10 18 Q8 26 10 36 Q11 46 12 52 Q13 62 13 72 L17 72 L17 50 L20 50 L23 50 L23 72 L27 72 Q27 62 28 52 Q29 46 30 36 Q32 26 30 18 Q26 25 20 25 Q14 25 10 18Z"/>
      <path d="M10 20 Q2 24 3 40 L10 36 Q9 27 12 22Z"/>
      <path d="M30 20 Q38 24 37 40 L30 36 Q31 27 28 22Z"/>
    </svg>`,
  },
]

const FIT_PREFS: { id: FitPref; label: string; desc: string; icon: string }[] = [
  { id: 'slim',     label: 'Slim Fit',      desc: 'Close to body',     icon: '▮' },
  { id: 'true',     label: 'True to Size',  desc: 'Classic fit',       icon: '▬' },
  { id: 'relaxed',  label: 'Relaxed',       desc: 'Comfortable room',  icon: '▭' },
  { id: 'oversized',label: 'Oversized',     desc: 'Streetwear drop',   icon: '□' },
]

const SIZES_ALL = ['XS','S','M','L','XL','XXL','3XL']

function calcSize(heightCm: number, weightKg: number, bodyType: BodyType, fitPref: FitPref, available: string[]): { size: string; confidence: number; nextSize: string } {
  // Base index from height/weight matrix
  let idx = 2 // default M
  if      (heightCm < 163 && weightKg < 58)  idx = 0
  else if (heightCm < 170 && weightKg < 68)  idx = 1
  else if (heightCm < 178 && weightKg < 80)  idx = 2
  else if (heightCm < 185 && weightKg < 95)  idx = 3
  else if (heightCm < 192 && weightKg < 110) idx = 4
  else if (heightCm < 198 && weightKg < 125) idx = 5
  else idx = 6

  // Body type adjustment
  if (bodyType === 'athletic') idx = Math.min(idx + 1, 6)
  if (bodyType === 'broad')    idx = Math.min(idx + 1, 6)

  // Fit preference adjustment
  if (fitPref === 'slim')      idx = Math.max(idx - 1, 0)
  if (fitPref === 'relaxed')   idx = Math.min(idx + 1, 6)
  if (fitPref === 'oversized') idx = Math.min(idx + 2, 6)

  // Confidence: based on how "centered" the values are in their band
  const bmi = weightKg / Math.pow(heightCm / 100, 2)
  const confidence = bmi < 16 || bmi > 35 ? 78 : bmi < 18 || bmi > 30 ? 88 : 94

  // Map to available sizes
  const targetSize = SIZES_ALL[idx]
  const availableIdx = available.indexOf(targetSize)
  const resolvedIdx  = availableIdx >= 0 ? availableIdx : Math.min(idx, available.length - 1)
  const resolvedSize = available[resolvedIdx]
  const nextSize     = available[Math.min(resolvedIdx + 1, available.length - 1)]

  return { size: resolvedSize, confidence, nextSize }
}

function ftToCm(ft: number, inch: number) { return Math.round(ft * 30.48 + inch * 2.54) }
function lbsToKg(lbs: number) { return Math.round(lbs * 0.453592) }

export default function SizeFinderModal({ isOpen, onClose, productName, availableSizes, onSelectSize }: Props) {
  const [step, setStep]             = useState(0)
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm')
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg')
  const [heightCm, setHeightCm]     = useState(175)
  const [heightFt, setHeightFt]     = useState(5)
  const [heightIn, setHeightIn]     = useState(9)
  const [weightKg, setWeightKg]     = useState(75)
  const [weightLbs, setWeightLbs]   = useState(165)
  const [bodyType, setBodyType]     = useState<BodyType>('regular')
  const [fitPref, setFitPref]       = useState<FitPref>('true')
  const [scanning, setScanning]     = useState(false)
  const [result, setResult]         = useState<ReturnType<typeof calcSize> | null>(null)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    if (!isOpen) { setStep(0); setResult(null); setShowResult(false); setScanning(false) }
  }, [isOpen])

  const finalHeightCm = heightUnit === 'cm' ? heightCm : ftToCm(heightFt, heightIn)
  const finalWeightKg = weightUnit === 'kg' ? weightKg : lbsToKg(weightLbs)

  function runAnalysis() {
    setScanning(true)
    setStep(3)
    setTimeout(() => {
      const r = calcSize(finalHeightCm, finalWeightKg, bodyType, fitPref, availableSizes)
      setResult(r)
      setScanning(false)
      setShowResult(true)
    }, 2800)
  }

  if (!isOpen) return null

  const steps = ['Measurements', 'Body Shape', 'Fit Style', 'Your Size']

  return (
    <div className="size-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="size-modal">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#111118] border-b border-white/[0.07] px-6 py-4 flex items-center justify-between rounded-t-[28px]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center">
              <Zap size={16} className="text-[#00D4FF]" />
            </div>
            <div>
              <p className="font-bold text-sm text-white">AI Size Finder</p>
              <p className="text-[11px] text-white/40">Powered by body analytics</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center transition-colors">
            <X size={14} />
          </button>
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-2 pt-5 pb-1">
          {steps.map((s, i) => (
            <div key={i} className={`step-dot ${i === step ? 'active' : i < step ? 'done' : ''}`} title={s} />
          ))}
        </div>

        <div className="px-6 pb-8 pt-4">

          {/* ─── STEP 0: Measurements ─── */}
          {step === 0 && (
            <div className="space-y-7 animate-fade-up">
              <div>
                <h2 className="text-xl font-black mb-1">Your Measurements</h2>
                <p className="text-white/50 text-sm">Accurate measurements = perfect fit</p>
              </div>

              {/* Height */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold tracking-widest uppercase text-white/60">Height</label>
                  <div className="flex rounded-lg overflow-hidden border border-white/[0.08]">
                    {(['cm','ft'] as const).map(u => (
                      <button key={u} onClick={() => setHeightUnit(u)}
                        className={`px-3 py-1 text-xs font-bold transition-colors ${heightUnit === u ? 'bg-[#D4A017] text-black' : 'text-white/50 hover:text-white'}`}>
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
                {heightUnit === 'cm' ? (
                  <>
                    <div className="text-3xl font-black text-[#D4A017]">{heightCm}<span className="text-base font-normal text-white/40 ml-1">cm</span></div>
                    <input type="range" min={140} max={220} value={heightCm} onChange={e => setHeightCm(+e.target.value)} className="w-full" />
                    <div className="flex justify-between text-[11px] text-white/30"><span>140cm</span><span>220cm</span></div>
                  </>
                ) : (
                  <>
                    <div className="text-3xl font-black text-[#D4A017]">{heightFt}′{heightIn}″</div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-[11px] text-white/40 mb-1 block">Feet</label>
                        <input type="range" min={4} max={7} value={heightFt} onChange={e => setHeightFt(+e.target.value)} className="w-full" />
                      </div>
                      <div className="flex-1">
                        <label className="text-[11px] text-white/40 mb-1 block">Inches</label>
                        <input type="range" min={0} max={11} value={heightIn} onChange={e => setHeightIn(+e.target.value)} className="w-full" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Weight */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold tracking-widest uppercase text-white/60">Weight</label>
                  <div className="flex rounded-lg overflow-hidden border border-white/[0.08]">
                    {(['kg','lbs'] as const).map(u => (
                      <button key={u} onClick={() => setWeightUnit(u)}
                        className={`px-3 py-1 text-xs font-bold transition-colors ${weightUnit === u ? 'bg-[#D4A017] text-black' : 'text-white/50 hover:text-white'}`}>
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
                {weightUnit === 'kg' ? (
                  <>
                    <div className="text-3xl font-black text-[#D4A017]">{weightKg}<span className="text-base font-normal text-white/40 ml-1">kg</span></div>
                    <input type="range" min={40} max={160} value={weightKg} onChange={e => setWeightKg(+e.target.value)} className="w-full" />
                    <div className="flex justify-between text-[11px] text-white/30"><span>40kg</span><span>160kg</span></div>
                  </>
                ) : (
                  <>
                    <div className="text-3xl font-black text-[#D4A017]">{weightLbs}<span className="text-base font-normal text-white/40 ml-1">lbs</span></div>
                    <input type="range" min={90} max={350} value={weightLbs} onChange={e => setWeightLbs(+e.target.value)} className="w-full" />
                    <div className="flex justify-between text-[11px] text-white/30"><span>90 lbs</span><span>350 lbs</span></div>
                  </>
                )}
              </div>

              <button onClick={() => setStep(1)} className="w-full btn-gold py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2">
                Continue <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* ─── STEP 1: Body Shape ─── */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-up">
              <div>
                <h2 className="text-xl font-black mb-1">Your Body Shape</h2>
                <p className="text-white/50 text-sm">Select what best describes your build</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {BODY_TYPES.map(bt => (
                  <button key={bt.id} onClick={() => setBodyType(bt.id)}
                    className={`body-type-btn ${bodyType === bt.id ? 'selected' : ''}`}>
                    <div className={`w-10 h-16 ${bodyType === bt.id ? 'text-[#D4A017]' : 'text-white/40'} transition-colors`}
                      dangerouslySetInnerHTML={{ __html: bt.svg }} />
                    <p className={`text-sm font-bold ${bodyType === bt.id ? 'text-[#D4A017]' : 'text-white'}`}>{bt.label}</p>
                    <p className="text-[11px] text-white/40">{bt.desc}</p>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="flex-1 btn-outline-gold py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2">
                  <ChevronLeft size={16} /> Back
                </button>
                <button onClick={() => setStep(2)} className="flex-1 btn-gold py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2">
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 2: Fit Preference ─── */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-up">
              <div>
                <h2 className="text-xl font-black mb-1">Preferred Fit</h2>
                <p className="text-white/50 text-sm">How do you like your tees to feel?</p>
              </div>

              <div className="space-y-2.5">
                {FIT_PREFS.map(fp => (
                  <button key={fp.id} onClick={() => setFitPref(fp.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${fitPref === fp.id ? 'border-[#D4A017] bg-[#D4A017]/10' : 'border-white/[0.07] hover:border-white/20'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black ${fitPref === fp.id ? 'bg-[#D4A017] text-black' : 'bg-white/[0.06] text-white/60'}`}>
                      {fp.icon}
                    </div>
                    <div className="text-left flex-1">
                      <p className={`font-bold text-sm ${fitPref === fp.id ? 'text-[#D4A017]' : 'text-white'}`}>{fp.label}</p>
                      <p className="text-[12px] text-white/40">{fp.desc}</p>
                    </div>
                    {fitPref === fp.id && <CheckCircle2 size={18} className="text-[#D4A017] flex-shrink-0" />}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 btn-outline-gold py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2">
                  <ChevronLeft size={16} /> Back
                </button>
                <button onClick={runAnalysis} className="flex-1 btn-gold py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2">
                  <Zap size={16} /> Analyze
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 3: AI Result ─── */}
          {step === 3 && (
            <div className="animate-fade-up">
              {scanning && (
                <div className="flex flex-col items-center justify-center py-12 gap-6">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 rounded-full border-2 border-[#00D4FF]/20 animate-pulse-slow" />
                    <div className="absolute inset-2 rounded-full border border-[#00D4FF]/30 animate-spin-slow" />
                    <div className="absolute inset-4 rounded-full border border-[#D4A017]/40 animate-spin-med" style={{ animationDirection: 'reverse' }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Zap size={24} className="text-[#00D4FF]" />
                    </div>
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      <div className="ai-scan-bar" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-white mb-1">Analyzing your body profile...</p>
                    <p className="text-white/40 text-sm">Cross-referencing with 50,000+ fit profiles</p>
                  </div>
                  <div className="w-64 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#D4A017] to-[#00E5CC] rounded-full animate-progress" style={{ '--progress': '100%' } as React.CSSProperties} />
                  </div>
                </div>
              )}

              {showResult && result && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-black mb-1">Your Perfect Fit</h2>
                    <p className="text-white/50 text-sm">{productName}</p>
                  </div>

                  {/* Main result */}
                  <div className="relative border border-[#D4A017]/30 rounded-3xl p-6 bg-[#D4A017]/05 overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4A017]/05 rounded-full blur-3xl" />
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-[11px] font-bold tracking-widest uppercase text-[#D4A017]/70 mb-1">Recommended Size</p>
                          <div className="text-7xl font-black text-[#D4A017]">{result.size}</div>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] text-white/40 mb-2">AI Confidence</p>
                          <div className="text-3xl font-black text-[#00E5CC]">{result.confidence}%</div>
                        </div>
                      </div>
                      <div className="confidence-bar">
                        <div className="confidence-fill" style={{ width: `${result.confidence}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Size comparison */}
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                    {availableSizes.map(s => (
                      <div key={s} className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm border-2 transition-all ${
                        s === result.size     ? 'border-[#D4A017] bg-[#D4A017] text-black shadow-gold-sm' :
                        s === result.nextSize ? 'border-white/20 bg-white/[0.04] text-white/60' : 'border-transparent bg-white/[0.04] text-white/30'
                      }`}>{s}</div>
                    ))}
                  </div>

                  {/* Details */}
                  <div className="glass rounded-2xl p-4 space-y-3">
                    {[
                      { icon: <Ruler size={13} />, label: 'Height', value: `${finalHeightCm} cm` },
                      { icon: <TrendingUp size={13} />, label: 'Weight', value: `${finalWeightKg} kg` },
                      { icon: '🏋️', label: 'Build', value: BODY_TYPES.find(b => b.id === bodyType)?.label ?? '' },
                      { icon: '✂️', label: 'Fit Pref', value: FIT_PREFS.find(f => f.id === fitPref)?.label ?? '' },
                    ].map((row, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-white/50">{typeof row.icon === 'string' ? row.icon : row.icon} {row.label}</span>
                        <span className="font-semibold">{row.value}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[12px] text-white/40 text-center leading-relaxed">
                    💡 This style runs <strong className="text-white/70">true to size</strong>. If between sizes, order <strong className="text-white/70">{result.nextSize}</strong> for a relaxed feel.
                  </p>

                  <div className="flex gap-3">
                    <button onClick={() => { setStep(0); setShowResult(false); setResult(null) }}
                      className="flex-1 btn-outline-gold py-4 rounded-2xl text-sm font-bold">
                      Recalculate
                    </button>
                    {onSelectSize && (
                      <button onClick={() => { onSelectSize(result.size); onClose() }}
                        className="flex-1 btn-gold py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2">
                        <CheckCircle2 size={16} /> Select {result.size}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
