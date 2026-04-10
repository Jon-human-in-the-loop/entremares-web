'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

/* ──────────────────────────────────────────────
   TIPOS
   ────────────────────────────────────────────── */

interface Particle {
  id: number
  x: number
  y: number
  size: number
  rotation: number
  speed: number
  opacity: number
  type: 'pistachio' | 'nut' | 'crumb'
  shape: 'circle' | 'oval' | 'irregular'
  driftX: number
  driftY: number
}

interface Tooltip {
  id: string
  description: string
  x: string
  y: string
}

/* ──────────────────────────────────────────────
   DATA
   ────────────────────────────────────────────── */

const TOOLTIPS: Tooltip[] = [
  {
    id: 'cobertura',
    description: 'COBERTURA DE CHOCOLATE DE AUTOR: CHOCOLATE BLANCO CON UN TOQUE DE PISTACHO PARA UN ACABADO PERFECTO',
    x: '68%',
    y: '25%',
  },
  {
    id: 'relleno',
    description: 'CREMA DE PISTACHO ARTESANAL: ELABORADA CON PISTACHOS FRESCOS Y DULCE DE LECHE DE ALTA CALIDAD',
    x: '28%',
    y: '50%',
  },
  {
    id: 'pistacho',
    description: 'PISTACHO INTENSO: PISTACHOS DE ORIGEN SELECCIONADO PARA UN SABOR AUTÉNTICO Y POTENTE',
    x: '72%',
    y: '75%',
  },
]

const PARTICLE_TYPES = ['pistachio', 'nut', 'crumb'] as const
const PARTICLE_SHAPES = ['circle', 'oval', 'irregular'] as const

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 8 + Math.random() * 28,
    rotation: Math.random() * 360,
    speed: 0.3 + Math.random() * 0.7,
    opacity: 0.15 + Math.random() * 0.45,
    type: PARTICLE_TYPES[Math.floor(Math.random() * PARTICLE_TYPES.length)] ?? 'pistachio',
    shape: PARTICLE_SHAPES[Math.floor(Math.random() * PARTICLE_SHAPES.length)] ?? 'circle',
    driftX: (Math.random() - 0.5) * 40,
    driftY: (Math.random() - 0.5) * 30,
  }))
}

/* ──────────────────────────────────────────────
   PARTÍCULA INDIVIDUAL — Más grande y visible
   ────────────────────────────────────────────── */

function ParticleElement({ p, mouseX, mouseY }: { p: Particle; mouseX: number; mouseY: number }) {
  const dx = (mouseX - p.x) * 0.06 * p.speed
  const dy = (mouseY - p.y) * 0.06 * p.speed

  const colors: Record<string, string> = {
    pistachio: '#93C572',
    nut: '#C49A6C',
    crumb: '#7A6248',
  }

  const borderRadii: Record<string, string> = {
    circle: '50%',
    oval: '50% 50% 40% 60%',
    irregular: '45% 55% 60% 40% / 50% 40% 60% 50%',
  }

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${p.x}%`,
        top: `${p.y}%`,
        width: p.size,
        height: p.shape === 'oval' ? p.size * 0.6 : p.size,
        backgroundColor: colors[p.type],
        opacity: p.opacity,
        borderRadius: borderRadii[p.shape],
        boxShadow: `0 0 ${p.size * 0.5}px ${colors[p.type]}33`,
        filter: p.size > 20 ? 'blur(1.5px)' : 'none',
      }}
      animate={{
        x: [p.driftX, -p.driftX, p.driftX],
        y: [p.driftY, -p.driftY, p.driftY],
        rotate: [p.rotation, p.rotation + 60, p.rotation],
        translateX: -dx,
        translateY: -dy,
      }}
      transition={{
        x: { duration: 8 + p.speed * 4, repeat: Infinity, ease: 'easeInOut' },
        y: { duration: 10 + p.speed * 3, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 12 + p.speed * 5, repeat: Infinity, ease: 'easeInOut' },
        translateX: { type: 'spring', stiffness: 40, damping: 20 },
        translateY: { type: 'spring', stiffness: 40, damping: 20 },
      }}
    />
  )
}

/* ──────────────────────────────────────────────
   TOOLTIP INTERACTIVO
   ────────────────────────────────────────────── */

function TooltipMarker({ tooltip }: { tooltip: Tooltip }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="absolute z-30 group"
      style={{ left: tooltip.x, top: tooltip.y }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((prev) => !prev)}
    >
      <div className="tooltip-pulse" />
      <button className="tooltip-marker" aria-label={`Info: ${tooltip.id}`}>
        <span className="text-sm font-bold leading-none">+</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="tooltip-popup"
            initial={{ opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.92 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <p className="text-xs font-lato leading-relaxed tracking-wide text-white/90">
              {tooltip.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ──────────────────────────────────────────────
   CAPA DEL ALFAJOR — Cada una se mueve independientemente
   ────────────────────────────────────────────── */

interface LayerProps {
  color: string
  yOffset: number
  imageHint: string
  imagePath: string
  scrollProgress: any
  zIndex: number
}

function AlfajorLayer({ yOffset, imageHint, imagePath, scrollProgress, zIndex }: LayerProps) {
  // Each layer starts stacked (0) → separates to yOffset → returns to 0
  const y = useTransform(
    scrollProgress,
    [0, 0.15, 0.5, 0.85, 1],
    [0, yOffset * 0.3, yOffset, yOffset * 0.3, 0]
  )
  const springY = useSpring(y, { stiffness: 60, damping: 25 })
  const scale = useTransform(scrollProgress, [0, 0.3, 0.7, 1], [1, 1.05, 1.05, 1])

  return (
    <motion.div
      className="alfajor-layer"
      style={{
        y: springY,
        scale,
        zIndex,
      }}
    >
      <Image
        src={imagePath}
        alt={imageHint}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 80vw, 40vw"
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
  const [particles] = useState(() => generateParticles(50))

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  // 3D rotation from mouse position
  const rotateX = useSpring((mousePos.y - 50) * -0.12, { stiffness: 50, damping: 20 })
  const rotateY = useSpring((mousePos.x - 50) * 0.12, { stiffness: 50, damping: 20 })

  // Brand text opacity: fades out as layers separate
  const brandOpacity = useTransform(scrollYProgress, [0, 0.3], [0.07, 0.03])

  // Title fade in
  const titleOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1])

  const layers = [
    {
      color: 'transparent',
      yOffset: -280,
      imageHint: 'Capa superior del alfajor',
      imagePath: '/images/hero/alfajor-capa-superior.webp',
      zIndex: 10,
    },
    {
      color: 'transparent',
      yOffset: 0,
      imageHint: 'Relleno de crema de pistacho',
      imagePath: '/images/hero/alfajor-relleno.webp',
      zIndex: 5,
    },
    {
      color: 'transparent',
      yOffset: 320,
      imageHint: 'Capa inferior del alfajor',
      imagePath: '/images/hero/alfajor-capa-inferior-con-relleno.webp',
      zIndex: 1,
    },
  ]

  return (
    <section
      ref={sectionRef}
      id="alfajor-deconstruido"
      className="relative w-full"
      style={{ height: '500vh' }}
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* ── Background gradient ── */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(180deg, #E9DCC9 0%, #C4A882 30%, #7A5A3A 65%, #2D1B0F 100%)',
          }}
        />

        {/* ── Floating Particles ── */}
        <div className="absolute inset-0 z-[5] overflow-hidden pointer-events-none">
          {particles.map((p) => (
            <ParticleElement key={p.id} p={p} mouseX={mousePos.x} mouseY={mousePos.y} />
          ))}
        </div>

        {/* ── Brand text behind alfajor ── */}
        <motion.div
          className="absolute inset-0 z-[8] flex items-center justify-center pointer-events-none"
          style={{ opacity: brandOpacity }}
        >
          <h2
            className="font-montserrat font-bold text-white text-center leading-none whitespace-nowrap select-none tracking-[0.06em] uppercase"
            style={{ fontSize: 'clamp(2.5rem, 10vw, 9rem)' }}
          >
            ENTRE MARES
          </h2>
        </motion.div>

        {/* ── Alfajor 3D construct ── */}
        <div
          className="absolute inset-0 z-[15] flex items-center justify-center"
          style={{ perspective: '1200px' }}
        >
          <motion.div
            className="relative"
            style={{
              width: 'clamp(260px, 40vw, 500px)',
              height: 'clamp(260px, 40vw, 500px)',
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }}
          >
            {layers.map((layer, idx) => (
              <AlfajorLayer
                key={idx.toString()}
                scrollProgress={scrollYProgress}
                {...layer}
              />
            ))}

            {TOOLTIPS.map((tt) => (
              <TooltipMarker key={tt.id} tooltip={tt} />
            ))}
          </motion.div>
        </div>

        {/* ── Title (fades in on scroll) ── */}
        <motion.div
          className="absolute bottom-[15%] left-0 right-0 z-[20] text-center px-8"
          style={{ opacity: titleOpacity }}
        >
          <h3
            className="font-montserrat font-bold text-white tracking-tight mb-3 drop-shadow-2xl"
            style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}
          >
            PISTACHE INTENSO
          </h3>
          <p className="text-white/70 text-sm md:text-base font-lato tracking-[0.25em] uppercase drop-shadow-md">
            Un bocado de tradición, un toque de autor
          </p>
        </motion.div>

        {/* ── Bottom tagline ── */}
        <div className="absolute bottom-6 left-0 right-0 z-[20] text-center px-8">
          <p className="text-white/40 text-xs font-lato tracking-[0.18em] uppercase max-w-2xl mx-auto leading-relaxed">
            ENTRE MARES: DONDE LA PASIÓN POR EL DULCE DE LECHE SE ENCUENTRA CON LA INNOVACIÓN ARTESANAL
          </p>
        </div>
      </div>
    </section>
  )
}
