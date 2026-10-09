'use client'

import { motion, useReducedMotion } from 'motion/react'

interface SectionWavesProps {
  className?: string
  opacity?: number
  variant?: 'default' | 'subtle' | 'strong'
  flip?: boolean
}

export function SectionWaves({
  className = '',
  opacity,
  variant = 'default',
  flip = false,
}: SectionWavesProps) {
  const shouldReduceMotion = useReducedMotion()

  const opacityByVariant = {
    subtle: 0.45,
    default: 0.65,
    strong: 0.85,
  }

  const finalOpacity = opacity ?? opacityByVariant[variant]

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
    >
      <motion.svg
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[55%] w-full"
        style={{
          transform: flip ? 'scaleY(-1)' : undefined,
        }}
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {/* Deep structural layer */}
        <path
          d="
            M0 285
            C180 235 320 250 470 295
            C650 350 780 345 930 285
            C1080 225 1240 220 1440 265
            L1440 400
            L0 400
            Z
          "
          fill="#0f3e1e"
          opacity={finalOpacity * 0.32}
        />

        {/* Middle transition layer */}
        <path
          d="
            M0 325
            C170 285 330 275 500 315
            C670 355 790 355 950 315
            C1110 275 1270 270 1440 305
            L1440 400
            L0 400
            Z
          "
          fill="#1f6b3a"
          opacity={finalOpacity * 0.22}
        />

        {/* Dark foreground layer */}
        <path
          d="
            M0 355
            C190 330 335 325 505 350
            C690 378 820 375 970 345
            C1130 315 1280 320 1440 345
            L1440 400
            L0 400
            Z
          "
          fill="#090b09"
          opacity={finalOpacity * 0.72}
        />

        {/* Fine technical line */}
        <path
          d="
            M0 285
            C180 235 320 250 470 295
            C650 350 780 345 930 285
            C1080 225 1240 220 1440 265
          "
          fill="none"
          stroke="#42a878"
          strokeWidth="1"
          opacity={finalOpacity * 0.35}
        />
      </motion.svg>
    </div>
  )
}
