'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

/* ──────────────────────────────────────────────
   DATA & TIPOS
   ────────────────────────────────────────────── */

interface Fragment {
  id: number
  x: number
  y: number
  size: number
  rotation: number
  speed: number
  opacity: number
  type: 'pistachio' | 'nut' | 'crumb'
  points: string // for polygon clip-path
}

function generateFragments(count: number): Fragment[] {
  return Array.from({ length: count }, (_, i) => {
    // Generate a random jagged polygon shape
    const pointsCount = 5 + Math.floor(Math.random() * 4)
    const pts = Array.from({ length: pointsCount }, () => {
      const px = Math.floor(Math.random() * 100)
      const py = Math.floor(Math.random() * 100)
      return `${px}% ${py}%`
    }).join(', ')

    return {
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 10 + Math.random() * 25,
      rotation: Math.random() * 360,
      speed: 0.2 + Math.random() * 0.5,
      opacity: 0.4 + Math.random() * 0.5,
      type: (['pistachio', 'nut', 'crumb'] as const)[Math.floor(Math.random() * 3)],
      points: `polygon(${pts})`,
    }
  })
}

/* ──────────────────────────────────────────────
   FRAGMENTO FÍSICO (Nueces/Pistachos)
   No más luces, ahora son trozos sólidos y rugosos
   ────────────────────────────────────────────── */

function FragmentElement({ f, mouseX, mouseY }: { f: Fragment; mouseX: number; mouseY: number }) {
  const dx = (mouseX - 50) * 0.05 * f.speed
  const dy = (mouseY - 50) * 0.05 * f.speed

  const colors = {
    pistachio: '#6B8E23', // Verde oliva/pistacho
    nut: '#5D4037',      // Marrón nuez
    crumb: '#3E2723',    // Migas oscuras
  }

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${f.x}%`,
        top: `${f.y}%`,
        width: f.size,
        height: f.size,
        backgroundColor: colors[f.type],
        opacity: f.opacity,
        clipPath: f.points, // Forma irregular
        // Sin sombras brillantes ni desenfoque excesivo
      }}
      animate={{
        x: dx * 20,
        y: dy * 20,
        rotate: f.rotation + dx * 10,
      }}
      transition={{ type: 'spring', stiffness: 30, damping: 20 }}
    />
  )
}

/* ──────────────────────────────────────────────
   COMPONENTE PRINCIPAL: InteractiveAlfajor
   ────────────────────────────────────────────── */

export default function DeconstructedAlfajor() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [fragments] = useState(() => generateFragments(40))

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Transiciones de imagen según el scroll
  // 0.0 -> 0.7: Alfajor girando/moviéndose
  // 0.7 -> 1.0: Cambio al alfajor cortado
  const showFullAlfajor = useTransform(scrollYProgress, [0, 0.65, 0.75], [1, 1, 0])
  const showCutAlfajor = useTransform(scrollYProgress, [0.65, 0.75, 1], [0, 1, 1])
  
  // Efecto de escala imponente al final
  const mainScale = useTransform(scrollYProgress, [0.7, 0.9], [0.8, 1.2])
  
  // Rotación sutil controlada por scroll + mouse
  const scrollRotate = useTransform(scrollYProgress, [0, 1], [0, 45])
  const mouseRotateX = useSpring((mousePos.y - 50) * -0.2, { stiffness: 50, damping: 20 })
  const mouseRotateY = useSpring((mousePos.x - 50) * 0.2, { stiffness: 50, damping: 20 })

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
      className="relative w-full h-[400vh] bg-[#1a0f08]"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* Fondo con textura sutil */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
        
        {/* Gradiente cinemático */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2D1B0F]/40 to-[#1a0f08]" />

        {/* Fragmentos de ingredientes (Nueces/Pistachos) */}
        <div className="absolute inset-0 z-10 overflow-hidden">
          {fragments.map((f) => (
            <FragmentElement key={f.id} f={f} mouseX={mousePos.x} mouseY={mousePos.y} />
          ))}
        </div>

        {/* Brand Watermark (Fitted) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0">
          <h2 className="text-[15vw] font-bold font-montserrat text-white leading-none tracking-tighter uppercase whitespace-nowrap">
            ENTREMARES
          </h2>
        </div>

        {/* Contenedor del Alfajor Principal */}
        <div className="relative z-20 w-full h-full flex items-center justify-center" style={{ perspective: '2000px' }}>
          
          <motion.div
            style={{
              scale: mainScale,
              rotateX: mouseRotateX,
              rotateY: mouseRotateY,
              rotateZ: scrollRotate,
              transformStyle: 'preserve-3d',
            }}
            className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]"
          >
            {/* Alfajor Glaseado (Fase 1) */}
            <motion.div 
              style={{ opacity: showFullAlfajor }}
              className="absolute inset-0"
            >
              <Image
                src="/images/hero/alfajor-glaseado.webp"
                alt="Alfajor Glaseado"
                fill
                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                priority
              />
            </motion.div>

            {/* Alfajor Cortado (Fase 2) - USANDO alfajor-relleno como temp si no existe alfajor-cortado */}
            <motion.div 
              style={{ opacity: showCutAlfajor }}
              className="absolute inset-0"
            >
              <Image
                src="/images/hero/alfajor-relleno.webp" // Cambiar a alfajor-cortado.webp cuando el usuario la suba
                alt="Alfajor Cortado"
                fill
                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              />
            </motion.div>
          </motion.div>

          {/* Textos que aparecen al final */}
          <motion.div
            className="absolute bottom-[10%] text-center z-30"
            style={{ opacity: showCutAlfajor, y: useTransform(scrollYProgress, [0.7, 0.9], [50, 0]) }}
          >
            <h3 className="text-4xl md:text-7xl font-montserrat font-bold text-white mb-2 tracking-tight">
              PISTACHE INTENSO
            </h3>
            <p className="text-pistacho text-lg md:text-xl font-lato tracking-widest uppercase">
              La perfección en cada mitad
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
