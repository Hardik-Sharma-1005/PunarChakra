'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { useSite } from '@/components/site/site-provider'
import { ChakraMark } from '@/components/brand/brand'
import { Sparkles, FastForward } from 'lucide-react'

// Art-directed waste fragments that transform into luminous energy
const FRAGMENTS = [
  { id: 1, x: -140, y: -90, size: 14, rot: 42, delay: 0.1 },
  { id: 2, x: 180, y: -120, size: 18, rot: -28, delay: 0.2 },
  { id: 3, x: -210, y: 70, size: 12, rot: 75, delay: 0.15 },
  { id: 4, x: 130, y: 110, size: 16, rot: -45, delay: 0.25 },
  { id: 5, x: -70, y: 140, size: 10, rot: 30, delay: 0.3 },
  { id: 6, x: 80, y: -160, size: 20, rot: 95, delay: 0.18 },
  { id: 7, x: -170, y: -40, size: 12, rot: -15, delay: 0.22 },
  { id: 8, x: 190, y: 30, size: 15, rot: 60, delay: 0.28 },
]

export function IntroCinematic() {
  const { introDone, setIntroDone, t } = useSite()
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4>(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Respect prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      if (mediaQuery.matches) {
        setIntroDone(true)
        return
      }
    }

    if (introDone) return

    // Phase progression:
    // 0: Discarded fragments (0 - 1.4s)
    // 1: Transformation stream emerges (1.4s - 2.8s)
    // 2: Particles converge into emblem (2.8s - 4.2s)
    // 3: Emblem illuminated with circular renewal ripple (4.2s - 5.5s)
    // 4: Glide and dock into top-left navbar (5.5s - 6.6s)
    const t1 = setTimeout(() => setPhase(1), 1400)
    const t2 = setTimeout(() => setPhase(2), 2800)
    const t3 = setTimeout(() => setPhase(3), 4200)
    const t4 = setTimeout(() => setPhase(4), 5400)
    const t5 = setTimeout(() => setIntroDone(true), 6500)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
    }
  }, [introDone, setIntroDone])

  if (!mounted || introDone) return null

  const handleSkip = () => {
    setIntroDone(true)
  }

  // Story caption matching current phase
  const captions = t.intro.captions
  const currentCaption =
    phase === 0
      ? captions[0]
      : phase === 1
      ? captions[1]
      : phase === 2
      ? captions[2]
      : phase === 3
      ? captions[5]
      : captions[3]

  return (
    <AnimatePresence>
      {!introDone && (
        <motion.div
          key="intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#090b09] select-none"
        >
          {/* Subtle nature-inspired deep gradient background */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute left-1/2 top-1/2 size-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[120px]"
              style={{
                background:
                  'radial-gradient(circle, rgba(31,107,58,0.7) 0%, rgba(15,62,30,0.4) 50%, transparent 70%)',
              }}
            />
          </div>

          {/* SKIP BUTTON */}
          <button
            type="button"
            onClick={handleSkip}
            className="group absolute right-6 top-6 z-50 inline-flex items-center gap-2 rounded-full border border-[#42a878]/30 bg-[#090b09]/80 px-4 py-2 text-xs font-semibold tracking-wider uppercase text-[#aeb8aa] backdrop-blur-md transition-all hover:border-[#42a878] hover:bg-[#0f3e1e]/40 hover:text-[#f0f2ed]"
            aria-label="Skip introductory animation"
          >
            <span>{t.intro.skip}</span>
            <FastForward className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* ====================================================================
              SCENE 1 & 2: DISCARDED WORLD & TRANSFORMATION STREAM
              ==================================================================== */}
          <div className="relative flex items-center justify-center">
            {/* Chaotic / Transforming Fragments */}
            {FRAGMENTS.map((frag) => {
              const isConverging = phase >= 2
              const isStreaming = phase >= 1

              return (
                <motion.div
                  key={frag.id}
                  className="absolute rounded-sm"
                  initial={{
                    x: frag.x,
                    y: frag.y,
                    scale: 1,
                    rotate: frag.rot,
                    opacity: 0.5,
                  }}
                  animate={
                    isConverging
                      ? {
                          x: 0,
                          y: 0,
                          scale: 0.2,
                          opacity: 0,
                          rotate: frag.rot + 180,
                        }
                      : isStreaming
                      ? {
                          x: frag.x * 0.7,
                          y: frag.y * 0.7,
                          scale: [1, 1.25, 0.9],
                          opacity: [0.5, 0.9, 0.7],
                          rotate: frag.rot + 60,
                        }
                      : {
                          x: [frag.x - 6, frag.x + 6, frag.x - 6],
                          y: [frag.y + 4, frag.y - 4, frag.y + 4],
                          rotate: frag.rot,
                          opacity: 0.5,
                        }
                  }
                  transition={{
                    duration: isConverging ? 0.9 : 2.5,
                    repeat: isConverging ? 0 : Infinity,
                    repeatType: 'mirror',
                    ease: isConverging ? [0.22, 1, 0.36, 1] : 'easeInOut',
                    delay: isConverging ? frag.delay * 0.5 : 0,
                  }}
                  style={{
                    width: frag.size,
                    height: frag.size,
                    backgroundColor: isStreaming ? '#42a878' : '#aeb8aa',
                    boxShadow: isStreaming
                      ? '0 0 12px rgba(66, 168, 120, 0.6)'
                      : 'none',
                  }}
                />
              )
            })}

            {/* SCENE 2 STREAM FLOW: Expanding luminous ring/particles */}
            {phase >= 1 && (
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{
                  scale: phase >= 2 ? 1.5 : [0.7, 1.1, 0.9],
                  opacity: phase >= 2 ? 0 : [0.4, 0.8, 0.5],
                }}
                transition={{
                  duration: phase >= 2 ? 0.7 : 2,
                  repeat: phase >= 2 ? 0 : Infinity,
                  ease: 'easeInOut',
                }}
                className="pointer-events-none absolute size-56 rounded-full border border-[#42a878]/40"
                style={{
                  boxShadow: '0 0 40px rgba(66,168,120,0.25) inset',
                }}
              />
            )}

            {/* ====================================================================
                SCENE 3, 4 & 5: CONVERGENCE, LOGO EMERGENCE, RENEWAL & DOCKING
                ==================================================================== */}
            <motion.div
              className="relative z-10 flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                phase === 0 || phase === 1
                  ? { opacity: 0, scale: 0.8 }
                  : phase === 2
                  ? { opacity: 1, scale: 1 }
                  : phase === 3
                  ? { opacity: 1, scale: 1.05 }
                  : /* Phase 4: Glide to top-left corner (docking position) */
                    {
                      position: 'fixed' as const,
                      top: 24,
                      left: 24,
                      x: 0,
                      y: 0,
                      scale: 0.85,
                      opacity: 0, // Hand off cleanly to navbar logo
                    }
              }
              transition={{
                duration: phase === 4 ? 0.9 : 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Central Glowing Emblem / Logo */}
              <div className="relative flex flex-col items-center">
                {/* Harmonic Circular Ripple on renewal (Phase 3) */}
                {phase >= 3 && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="pointer-events-none absolute size-44 rounded-full border border-[#42a878]/60"
                  />
                )}

                {/* Rotating Chakra Aura */}
                <div className="relative mb-3 flex size-20 items-center justify-center">
                  <ChakraMark className="size-16 text-[#42a878]" spinning />
                  <div className="absolute inset-0 size-20 rounded-full bg-[#1f6b3a]/20 blur-xl" />
                </div>

                {/* Brand Logo Image */}
                <div className="relative h-12 w-auto aspect-[180/48]">
                  <Image
                    src="/brand/punarchakra-logo.png"
                    alt="Punarchakra"
                    width={200}
                    height={54}
                    priority
                    className="h-12 w-auto object-contain drop-shadow-[0_0_20px_rgba(66,168,120,0.35)]"
                  />
                </div>

                {/* Dynamic Cinematic Story Caption */}
                <motion.div
                  key={currentCaption}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4 }}
                  className="mt-4 flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-[#aeb8aa]"
                >
                  <Sparkles className="size-3 text-[#42a878]" />
                  <span>{currentCaption}</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
