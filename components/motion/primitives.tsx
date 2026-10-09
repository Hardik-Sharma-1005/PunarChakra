'use client'

import React, { useEffect, useState } from 'react'
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from 'motion/react'

export { motion, useInView }

export function Reveal({
  children,
  delay = 0,
  duration = 0.7,
  y = 20,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  y?: number
  className?: string
}) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function useLoopProgress(
  durationSec: number = 10,
  stepsCount: number = 8,
  computeActive?: (progress: number) => number
): { progress: MotionValue<number>; active: number } {
  const progress = useMotionValue(0)
  const [active, setActive] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion) return

    let startTime: number | null = null
    let animId: number

    const tick = (now: number) => {
      if (startTime === null) startTime = now
      const elapsed = (now - startTime) / 1000
      const current = (elapsed % durationSec) / durationSec
      progress.set(current)

      if (computeActive) {
        setActive(computeActive(current))
      } else {
        setActive(Math.min(stepsCount - 1, Math.floor(current * stepsCount)))
      }

      animId = requestAnimationFrame(tick)
    }

    animId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animId)
  }, [durationSec, stepsCount, computeActive, progress, shouldReduceMotion])

  return { progress, active }
}

export function useSequence(
  count: number,
  intervalMs: number = 650,
  enabled: boolean = true
): number {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!enabled || count <= 0) return

    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % count)
    }, intervalMs)

    return () => clearInterval(interval)
  }, [count, intervalMs, enabled])

  return active
}
