'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'

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
}

interface Tooltip {
  id: string
  label: string
  description: string
  x: string     // CSS left position
  y: string     // CSS top position
}

/* ──────────────────────────────────────────────
   DATA
   ────────────────────────────────────────────── */

const TOOLTIPS: Tooltip[] = [
  {
    id: 'cobertura',
    label: '+',
    description: 'COBERTURA DE CHOCOLATE DE AUTOR: CHOCOLATE BLANCO CON UN TOQUE DE PISTACHO PARA UN ACABADO PERFECTO',
    x: '65%',
    y: '18%',
  },
  {
    id: 'relleno',
    label: '+',
    description: 'CREMA DE PISTACHO ARTESANAL: ELABORADA CON PISTACHOS FRESCOS Y DULCE DE LECHE DE ALTA CALIDAD',
    x: '30%',
    y: '48%',
  },
  {
    id: 'pistacho',
    label: '+',
    description: 'PISTACHO INTENSO: PISTACHOS DE ORIGEN SELECCIONADO PARA UN SABOR AUTÉNTICO Y POTENTE',
    x: '70%',
    y: '72%',
  },
]

const PARTICLE_TYPES = ['pistachio', 'nut', 'crumb'] as const

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 4 + Math.random() * 14,
    rotation: Math.random() * 360,
    speed: 0.3 + Math.random() * 0.7,
    opacity: 0.25 + Math.random() * 0.5,
    type: PARTICLE_TYPES[Math.floor(Math.random() * PARTICLE_TYPES.length)] ?? 'pistachio',
  }))
}

/* ──────────────────────────────────────────────
   PARTÍCULA INDIVIDUAL
   ────────────────────────────────────────────── */

function ParticleElement({ p, mouseX, mouseY }: { p: Particle; mouseX: number; mouseY: number }) {
  const dx = (mouseX - p.x) * 0.04 * p.speed
  const dy = (mouseY - p.y) * 0.04 * p.speed
  const colors: Record<string, string> = {
    pistachio: '#93C572',
    nut: '#C49A6C',
    crumb: '#7A6248',
  }

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${p.x}%`,
        top: `${p.y}%`,
        width: p.size,
        height: p.size,
        backgroundColor: colors[p.type],
        opacity: p.opacity,
        filter: `blur(${p.size > 10 ? 1 : 0}px)`,
      }}
      animate={{
        x: -dx,
        y: -dy,
        rotate: p.rotation + dx * 2,
      }}
      transition={{ type: 'spring', stiffness: 50, damping: 20 }}
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
      {/* Pulse ring */}
      <div className="tooltip-pulse" />

      {/* Marker button */}
      <button
        className="tooltip-marker"
        aria-label={`Info: ${tooltip.id}`}
      >
        <span className="text-sm font-bold leading-none">+</span>
      </button>

      {/* Tooltip popup */}
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
   CAPA DEL ALFAJOR
   ────────────────────────────────────────────── */

interface LayerProps {
  color: string
  yOffset: number       // px offset when fully deconstructed
  imageHint: string     // placeholder hint for image
  imagePath: string     // future path
  scrollProgress: any   // MotionValue
}

import Image from 'next/image'

function AlfajorLayer({ color, yOffset, imageHint, imagePath, scrollProgress }: LayerProps) {
  const y = useTransform(scrollProgress, [0, 0.3, 0.7, 1], [0, yOffset, yOffset, 0])
  const springY = useSpring(y, { stiffness: 80, damping: 20 })

  return (
    <motion.div
      className="alfajor-layer"
      style={{
        y: springY,
        backgroundColor: color,
      }}
    >
      <Image 
        src={imagePath} 
        alt={imageHint}
        fill
        className="object-contain"
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
  const [particles] = useState(() => generateParticles(35))

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Mouse tracking for parallax + particles
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    el.addEventListener('mousemove', handleMouseMove)
    return () => el.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  // 3D rotation from mouse position
  const rotateX = useSpring((mousePos.y - 50) * -0.15, { stiffness: 60, damping: 18 })
  const rotateY = useSpring((mousePos.x - 50) * 0.15, { stiffness: 60, damping: 18 })

  const layers = [
    {
      color: 'transparent',
      yOffset: -120,
      imageHint: 'Capa superior',
      imagePath: '/images/hero/alfajor-capa-superior.webp',
    },
    {
      color: 'transparent',
      yOffset: 0,
      imageHint: 'Relleno crema',
      imagePath: '/images/hero/alfajor-relleno.webp',
    },
    {
      color: 'transparent',
      yOffset: 120,
      imageHint: 'Capa inferior',
      imagePath: '/images/hero/alfajor-capa-inferior-con-relleno.webp',
    },
  ]

  return (
    <section
      ref={sectionRef}
      id="alfajor-deconstruido"
      className="deconstructed-section"
    >
      {/* ── Background gradient ── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(180deg, #E9DCC9 0%, #C4A882 30%, #7A5A3A 65%, #2D1B0F 100%)',
        }}
      />

      {/* ── Particles ── */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <ParticleElement key={p.id} p={p} mouseX={mousePos.x} mouseY={mousePos.y} />
        ))}
      </div>

      {/* ── Brand text behind alfajor ── */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <h2 className="brand-watermark">
          ENTRE MARES
        </h2>
      </div>

      {/* ── Alfajor 3D construct ── */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen py-20" style={{ perspective: '1200px' }}>
        <motion.div
          className="alfajor-construct"
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Layers */}
          {layers.map((layer, idx) => (
            <AlfajorLayer
              key={idx.toString()}
              scrollProgress={scrollYProgress}
              {...layer}
            />
          ))}

          {/* Tooltips */}
          {TOOLTIPS.map((tt) => (
            <TooltipMarker key={tt.id} tooltip={tt} />
          ))}
        </motion.div>

        {/* Title below */}
        <motion.div
          className="mt-16 text-center z-30 relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-5xl font-montserrat font-bold text-white tracking-tight mb-4">
            PISTACHE INTENSO
          </h3>
          <p className="text-white/60 text-sm md:text-base font-lato tracking-[0.25em] uppercase">
            Un bocado de tradición, un toque de autor
          </p>
        </motion.div>
      </div>

      {/* ── Bottom tagline ── */}
      <div className="absolute bottom-8 left-0 right-0 z-30 text-center px-8">
        <p className="text-white/50 text-xs md:text-sm font-lato tracking-[0.2em] uppercase max-w-3xl mx-auto leading-relaxed">
          ENTRE MARES: DONDE LA PASIÓN POR EL DULCE DE LECHE SE ENCUENTRA CON LA INNOVACIÓN ARTESANAL
        </p>
      </div>
    </section>
  )
}
