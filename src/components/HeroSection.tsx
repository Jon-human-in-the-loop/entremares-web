'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'

const navItems = [
  { label: 'MENÚ', href: '/gift-packs' },
  { label: 'SOBRE NOSOTROS', href: '/about' },
  { label: 'CONTACTO', href: '/contact' },
]

import Image from 'next/image'

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full h-screen min-h-[600px] overflow-hidden bg-warm-white"
    >
      {/* Background Hero Image */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y }}
      >
        <div className="w-full h-full relative">
          <Image
            src="/images/hero/hero-variedade.webp"
            alt="Variedad de alfajores Entre Mares"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </motion.div>

      {/* Dark overlay for text readability */}
      <div
        className="absolute inset-0 z-10"
        style={{ background: 'linear-gradient(180deg, rgba(45,27,15,0.35) 0%, rgba(45,27,15,0.15) 40%, rgba(45,27,15,0.65) 100%)' }}
      />

      {/* Content */}
      <motion.div
        className="relative z-20 flex flex-col h-full"
        style={{ opacity }}
      >
        {/* Top spacing to account for the global header */}
        <div className="pt-24 md:pt-32" />

        {/* Center: brand watermark */}
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <motion.h1
            className="hero-brand-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          >
            ENTRE MARES
          </motion.h1>
          <motion.p
            className="hero-brand-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
          >
            ARTESANOS DEL MAR • ALFAJORES DE AUTOR
          </motion.p>
        </div>

        {/* Bottom tagline */}
        <motion.div
          className="pb-12 px-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
        >
          <p className="hero-tagline">
            ENTRE MARES: DONDE LA PASIÓN POR EL DULCE DE LECHE SE ENCUENTRA CON LA INNOVACIÓN ARTESANAL
          </p>
          {/* Scroll indicator */}
          <div className="mt-6 flex flex-col items-center gap-2">
            <span className="text-white/50 text-xs tracking-widest font-lato uppercase">Descubrir</span>
            <motion.div
              className="w-px h-8 bg-white/40"
              animate={{ scaleY: [0.5, 1, 0.5], opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
