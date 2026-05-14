'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ mx: 0, my: 0, rx: 0, ry: 0 })

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const onMove = (e: MouseEvent) => {
      pos.current.mx = e.clientX
      pos.current.my = e.clientY
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px'
        cursorRef.current.style.top  = e.clientY + 'px'
      }
    }

    let raf: number
    const animate = () => {
      pos.current.rx += (pos.current.mx - pos.current.rx) * 0.12
      pos.current.ry += (pos.current.my - pos.current.ry) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = pos.current.rx + 'px'
        ringRef.current.style.top  = pos.current.ry + 'px'
      }
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    const grow = () => {
      if (cursorRef.current) { cursorRef.current.style.width = '22px'; cursorRef.current.style.height = '22px' }
      if (ringRef.current)   { ringRef.current.style.width = '58px'; ringRef.current.style.height = '58px' }
    }
    const shrink = () => {
      if (cursorRef.current) { cursorRef.current.style.width = '10px'; cursorRef.current.style.height = '10px' }
      if (ringRef.current)   { ringRef.current.style.width = '38px'; ringRef.current.style.height = '38px' }
    }

    document.querySelectorAll('a, button, [role=button]').forEach(el => {
      el.addEventListener('mouseenter', grow)
      el.addEventListener('mouseleave', shrink)
    })

    window.addEventListener('mousemove', onMove)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <>
      <div id="mz-cursor" ref={cursorRef} />
      <div id="mz-ring" ref={ringRef} />
    </>
  )
}
