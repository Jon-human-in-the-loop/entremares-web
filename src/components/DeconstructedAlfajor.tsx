'use client'

import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

/* ──────────────────────────────────────────────
   PARTÍCULAS — Ahora son imágenes PNG reales
   ────────────────────────────────────────────── */

interface Particle {
  id: number
  x: number
  y: number
  size: number
  rotation: number
  speed: number
  imageSrc: string
  driftX: number
  driftY: number
  flipX: boolean
}

const PARTICLE_IMAGES = [
  '/images/particles/pistachio-1.png',
  '/images/particles/pistachio-2.png',
  '/images/particles/crumbs.png',
]

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 20 + Math.random() * 45, // 20px to 65px
    rotation: Math.random() * 360,
    speed: 0.15 + Math.random() * 0.35,
    imageSrc: PARTICLE_IMAGES[Math.floor(Math.random() * PARTICLE_IMAGES.length)] ?? PARTICLE_IMAGES[0],
    driftX: (Math.random() - 0.5) * 25,
    driftY: (Math.random() - 0.5) * 25,
    flipX: Math.random() > 0.5,
  }))
}

/* ──────────────────────────────────────────────
   PARTÍCULA INDIVIDUAL — Imagen real flotante
   ────────────────────────────────────────────── */

function ParticleElement({ p, mouseX, mouseY }: { p: Particle; mouseX: number; mouseY: number }) {
  const dx = (mouseX - 50) * 0.06 * p.speed
  const dy = (mouseY - 50) * 0.06 * p.speed

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${p.x}%`,
        top: `${p.y}%`,
        width: p.size,
        height: p.size,
        scaleX: p.flipX ? -1 : 1,
      }}
      animate={{
        x: [p.driftX, -p.driftX, p.driftX],
        y: [p.driftY, -p.driftY, p.driftY],
        translateX: -dx * 18,
        translateY: -dy * 18,
        rotate: [p.rotation, p.rotation + 15, p.rotation - 10, p.rotation],
      }}
      transition={{
        x: { duration: 12 + p.speed * 6, repeat: Infinity, ease: 'easeInOut' },
        y: { duration: 14 + p.speed * 5, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 16 + p.speed * 4, repeat: Infinity, ease: 'easeInOut' },
        translateX: { type: 'spring', stiffness: 30, damping: 25 },
        translateY: { type: 'spring', stiffness: 30, damping: 25 },
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={p.imageSrc}
        alt=""
        width={p.size}
        height={p.size}
        className="w-full h-full object-contain"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
        loading="lazy"
      />
    </motion.div>
  )
}

/* ──────────────────────────────────────────────
   COMPONENTE PRINCIPAL
   ────────────────────────────────────────────── */

export default function DeconstructedAlfajor() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [particles] = useState(() => generateParticles(28))

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

  // 3D mouse tracking
  const mouseRotateX = useSpring((mousePos.y - 50) * -0.12, { stiffness: 50, damping: 20 })
  const mouseRotateY = useSpring((mousePos.x - 50) * 0.12, { stiffness: 50, damping: 20 })

  // Scale up as user scrolls deeper
  const scale = useTransform(scrollYProgress, [0, 0.5, 0.8], [0.9, 1, 1.15])

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
        <div className="absolute inset-0 bg-[#140a04]" />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(45,27,15,0.6) 0%, rgba(20,10,4,1) 70%)',
          }}
        />

        {/* ── Floating Pistachios & Crumbs (Real images) ── */}
        <div className="absolute inset-0 z-10 overflow-hidden">
          {particles.map((p) => (
            <ParticleElement key={p.id} p={p} mouseX={mousePos.x} mouseY={mousePos.y} />
          ))}
        </div>

        {/* ── Brand Watermark ── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.025] z-0">
          <h2
            className="font-montserrat font-bold text-white tracking-tighter uppercase select-none"
            style={{ fontSize: 'clamp(2.5rem, 11vw, 9rem)' }}
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
            className="relative w-[280px] h-[280px] md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFrame}
                initial={{ opacity: 0.85 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.85 }}
                transition={{ duration: 0.08 }}
                className="absolute inset-0"
              >
                <Image
                  src={frameImages[currentFrame] as string}
                  alt={`Alfajor de pistacho vista ${currentFrame + 1}`}
                  fill
                  className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.85)]"
                  priority
                  sizes="(max-width: 768px) 280px, (max-width: 1024px) 450px, 550px"
                />
              </motion.div>
            </AnimatePresence>
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
            PISTACHE INTENSO
          </h3>
          <p
            className="font-lato tracking-[0.3em] uppercase"
            style={{ color: '#93C572', textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}
          >
            Artesanía en Movimiento
          </p>
        </motion.div>

        {/* ── Bottom tagline ── */}
        <div className="absolute bottom-5 left-0 right-0 z-30 text-center px-6">
          <p className="text-white/30 text-[10px] md:text-xs font-lato tracking-[0.2em] uppercase max-w-2xl mx-auto">
            ENTRE MARES · ALFAJORES PREMIUM ARTESANALES
          </p>
        </div>
      </div>
    </section>
  )
}
