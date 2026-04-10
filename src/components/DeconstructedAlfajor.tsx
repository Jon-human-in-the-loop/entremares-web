'use client'

import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

/* ──────────────────────────────────────────────
   DATA & TIPOS
   ────────────────────────────────────────────── */

interface Particle {
  id: number
  x: number
  y: number
  size: number
  rotation: number
  speed: number
  opacity: number
  type: 'pistachio-berry' | 'pistachio-green' | 'crumb'
  driftX: number
  driftY: number
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 6 + Math.random() * 20,
    rotation: Math.random() * 360,
    speed: 0.2 + Math.random() * 0.4,
    opacity: 0.5 + Math.random() * 0.4,
    type: (['pistachio-berry', 'pistachio-green', 'crumb'] as const)[Math.floor(Math.random() * 3)] ?? 'pistachio-berry',
    driftX: (Math.random() - 0.5) * 30,
    driftY: (Math.random() - 0.5) * 30,
  }))
}

/* ──────────────────────────────────────────────
   PARTÍCULA REALISTA (Pistacho / Migas)
   Inspirado en la nueva referencia visual
   ────────────────────────────────────────────── */

function ParticleElement({ p, mouseX, mouseY }: { p: Particle; mouseX: number; mouseY: number }) {
  const dx = (mouseX - 50) * 0.08 * p.speed
  const dy = (mouseY - 50) * 0.08 * p.speed

  // Colors from reference
  const PISTACHO_GREEN = '#98C044'
  const PISTACHO_SKIN = '#6D3F5B'
  const CRUMB_BROWN = '#3D2B1F'

  const getStyle = () => {
    if (p.type === 'pistachio-berry') {
      return {
        background: `radial-gradient(circle at 30% 30%, ${PISTACHO_GREEN} 40%, ${PISTACHO_SKIN} 100%)`,
        borderRadius: '40% 60% 70% 30% / 40% 40% 60% 60%',
      }
    }
    if (p.type === 'pistachio-green') {
      return {
        background: PISTACHO_GREEN,
        borderRadius: '50% 50% 40% 60%',
        boxShadow: `inset -2px -2px 0px rgba(0,0,0,0.1)`,
      }
    }
    return {
      background: CRUMB_BROWN,
      borderRadius: '2px', // tiny specs
      transform: `rotate(${p.rotation}deg)`,
    }
  }

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${p.x}%`,
        top: `${p.y}%`,
        width: p.type === 'crumb' ? p.size * 0.3 : p.size,
        height: p.type === 'crumb' ? p.size * 0.3 : p.size * 1.2,
        opacity: p.opacity,
        ...getStyle(),
      }}
      animate={{
        x: [p.driftX, -p.driftX, p.driftX],
        y: [p.driftY, -p.driftY, p.driftY],
        translateX: -dx * 15,
        translateY: -dy * 15,
        rotate: p.rotation + dx * 20,
      }}
      transition={{
        x: { duration: 10 + p.speed * 5, repeat: Infinity, ease: 'easeInOut' },
        y: { duration: 12 + p.speed * 4, repeat: Infinity, ease: 'easeInOut' },
        translateX: { type: 'spring', stiffness: 35, damping: 25 },
        translateY: { type: 'spring', stiffness: 35, damping: 25 },
      }}
    />
  )
}

/* ──────────────────────────────────────────────
   COMPONENTE PRINCIPAL: InteractiveAlfajor
   ────────────────────────────────────────────── */

export default function DeconstructedAlfajor() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [particles] = useState(() => generateParticles(55))

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Secuencia de imágenes subidas por el usuario
  const frameImages = useMemo(() => [
    '/images/hero/alfajor-1.png',
    '/images/hero/2.png',
    '/images/hero/alfajor-3.png',
    '/images/hero/alfajor-4.png',
    '/images/hero/alfajor-5.png',
  ], [])

  // Mapeo de scroll al índice de la imagen (0 a 4)
  // Dejamos el último tramo (0.8 a 1.0) para el efecto de "alfajor cortado" que falta
  const frameIndex = useTransform(scrollYProgress, [0, 0.75], [0, 4])
  const [currentFrame, setCurrentFrame] = useState(0)

  useEffect(() => {
    const unsubscribe = frameIndex.onChange((latest) => {
      const idx = Math.min(Math.floor(latest), frameImages.length - 1)
      setCurrentFrame(Math.max(0, idx))
    })
    return unsubscribe
  }, [frameIndex, frameImages.length])

  // Parallax y rotación sutil
  const mouseRotateX = useSpring((mousePos.y - 50) * -0.15, { stiffness: 60, damping: 20 })
  const mouseRotateY = useSpring((mousePos.x - 50) * 0.15, { stiffness: 60, damping: 20 })
  
  // Escala imponente al final
  const scale = useTransform(scrollYProgress, [0.7, 0.9], [1, 1.4])
  const opacity = useTransform(scrollYProgress, [0.95, 1], [1, 0.8])

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
      className="relative w-full h-[500vh] bg-[#1a0f08]"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* Cinematic Backdrop */}
        <div className="absolute inset-0 bg-[#140a05]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2D1B0F]/20 via-transparent to-[#1a0f08]" />
        
        {/* Floating Pistachios & Crumbs */}
        <div className="absolute inset-0 z-10 overflow-hidden">
          {particles.map((p) => (
            <ParticleElement key={p.id} p={p} mouseX={mousePos.x} mouseY={mousePos.y} />
          ))}
        </div>

        {/* Brand Background Text (Reduced) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] z-0">
          <h2 className="text-[12vw] font-bold font-montserrat text-white tracking-tighter uppercase select-none">
            ENTREMARES
          </h2>
        </div>

        {/* ── IMAGE SEQUENCE (Movement) ── */}
        <div className="relative z-20 w-full h-full flex items-center justify-center p-12" style={{ perspective: '1500px' }}>
          <motion.div
            style={{
              scale,
              opacity,
              rotateX: mouseRotateX,
              rotateY: mouseRotateY,
              transformStyle: 'preserve-3d',
            }}
            className="relative w-[320px] h-[320px] md:w-[600px] md:h-[600px]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFrame}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.8 }}
                transition={{ duration: 0.1 }}
                className="absolute inset-0"
              >
                <Image
                  src={frameImages[currentFrame] as string}
                  alt={`Alfajor ${currentFrame + 1}`}
                  fill
                  className="object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.9)]"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Title Overlay */}
          <motion.div
            className="absolute bottom-[10%] text-center z-30"
            style={{ 
              opacity: useTransform(scrollYProgress, [0.3, 0.6], [0, 1]),
              y: useTransform(scrollYProgress, [0.3, 0.6], [40, 0])
            }}
          >
            <h3 className="text-4xl md:text-8xl font-montserrat font-bold text-white mb-4 tracking-tighter">
              PISTACHE INTENSO
            </h3>
            <p className="text-pistacho text-lg md:text-2xl font-lato tracking-[0.4em] uppercase opacity-80">
              Artesanía en Movimiento
            </p>
          </motion.div>
        </div>

        {/* Fallback note for the "Cut Half" image */}
        {scrollYProgress.get() > 0.9 && (
          <div className="absolute bottom-4 right-4 text-white/20 text-[10px] uppercase font-lato">
            Esperando imagen: alfajor-cortado.png
          </div>
        )}
      </div>
    </section>
  )
}
