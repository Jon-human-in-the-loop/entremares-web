'use client'

import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

/* ──────────────────────────────────────────────
   COMPONENTE PRINCIPAL: InteractiveAlfajor
   ────────────────────────────────────────────── */

export default function DeconstructedAlfajor() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('pistacheSection')
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // 4 imágenes del alfajor en diferentes posiciones/ángulos
  const frameImages = useMemo(() => [
    '/images/hero/alfajor-1.png',
    '/images/hero/2.png',
    '/images/hero/alfajor-3.png',
    '/images/hero/alfajor-4.png',
  ], [])

  // Mapeo de scroll al índice de imagen
  const frameIndex = useTransform(scrollYProgress, [0, 0.8], [0, 3])
  const [currentFrame, setCurrentFrame] = useState(0)

  useEffect(() => {
    const unsubscribe = frameIndex.onChange((latest) => {
      const idx = Math.min(Math.floor(latest), frameImages.length - 1)
      setCurrentFrame(Math.max(0, idx))
    })
    return unsubscribe
  }, [frameIndex, frameImages.length])

  // 3D mouse tracking para el alfajor
  const mouseRotateX = useSpring((mousePos.y - 50) * -0.12, { stiffness: 50, damping: 20 })
  const mouseRotateY = useSpring((mousePos.x - 50) * 0.12, { stiffness: 50, damping: 20 })

  // Escala del alfajor — zoom suave desde tamaño completo
  const scale = useTransform(scrollYProgress, [0, 0.5, 0.9], [1, 1.15, 1.45])

  // Solo zoom del anillo de nueces/pistachos (sin rotación)
  const explosionScale = useTransform(scrollYProgress, [0, 0.5, 0.9], [1, 1.15, 1.55])

  // Title fade in
  const titleOpacity = useTransform(scrollYProgress, [0.25, 0.5], [0, 1])
  const titleY = useTransform(scrollYProgress, [0.25, 0.5], [40, 0])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 100
    const y = (e.clientY / window.innerHeight) * 100
    setMousePos({ x, y })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: '500vh' }}
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* ── Dark Cinematic Background ── */}
        <div className="absolute inset-0 bg-[#0f0805]" />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(45,27,15,0.8) 0%, rgba(15,8,5,1) 80%)',
          }}
        />

        {/* ── Explosion Ring (Nueces & Pistachos) — solo zoom, sin rotación ── */}
        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
          <motion.div
            style={{ scale: explosionScale }}
            className="absolute inset-0"
          >
            {/* Mobile: vertical explosion — cada imagen tiene su propio contenedor */}
            <div className="absolute inset-0 md:hidden">
              <Image
                src="/images/particles/explosion-vertical.png"
                alt="Frutos secos flotando"
                fill
                quality={100}
                className="object-cover opacity-95"
                sizes="100vw"
              />
            </div>
            {/* Desktop: horizontal explosion */}
            <div className="absolute inset-0 hidden md:block">
              <Image
                src="/images/particles/explosion-horizontal.png"
                alt="Frutos secos flotando"
                fill
                quality={100}
                className="object-cover opacity-95"
                sizes="100vw"
              />
            </div>
          </motion.div>
        </div>

        {/* ── Brand Watermark ── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.025] z-0">
          <h2
            className="font-montserrat font-bold text-white tracking-tighter uppercase select-none"
            style={{ fontSize: 'clamp(2rem, 11vw, 9rem)', whiteSpace: 'normal', wordBreak: 'break-word', textAlign: 'center', lineHeight: '1.2' }}
          >
            ENTREMARES
          </h2>
        </div>

        {/* ── Alfajor Image Sequence ── */}
        <div
          className="relative z-20 w-full h-full flex items-center justify-center"
          style={{ perspective: '1500px' }}
        >
          <motion.div
            style={{
              scale,
              rotateX: mouseRotateX,
              rotateY: mouseRotateY,
              transformStyle: 'preserve-3d',
            }}
            className="relative w-[90vw] h-[90vw] max-w-[380px] max-h-[380px] md:w-[450px] md:h-[450px] md:max-w-none md:max-h-none lg:w-[550px] lg:h-[550px]"
          >
            {/* All 4 frames always mounted — only opacity changes to avoid glitch */}
            {frameImages.map((src, i) => (
              <div
                key={src}
                className="absolute inset-0 transition-opacity duration-150 ease-in-out"
                style={{ opacity: i === currentFrame ? 1 : 0 }}
              >
                <Image
                  src={src}
                  alt={`Alfajor de pistacho vista ${i + 1}`}
                  fill
                  className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.85)]"
                  priority
                  sizes="(max-width: 768px) 90vw, (max-width: 1024px) 450px, 550px"
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Title (fades in on scroll) ── */}
        <motion.div
          className="absolute bottom-[12%] left-0 right-0 z-30 text-center px-8"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          <h3
            className="font-montserrat font-bold text-white tracking-tight mb-3"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 4.5rem)', textShadow: '0 4px 30px rgba(0,0,0,0.8)' }}
          >
            {t('title')}
          </h3>
          <p
            className="font-lato tracking-[0.3em] uppercase"
            style={{ color: '#93C572', textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}
          >
            {t('subtitle')}
          </p>
        </motion.div>

        {/* ── Bottom tagline ── */}
        <div className="absolute bottom-5 left-0 right-0 z-30 text-center px-6">
          <p className="text-white/30 text-[10px] md:text-xs font-lato tracking-[0.2em] uppercase max-w-2xl mx-auto">
            {t('bottomTagline')}
          </p>
        </div>
      </div>
    </section>
  )
}
