'use client'

import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'

import './BorderGlow.css'

interface BorderGlowProps {
  children: ReactNode
  className?: string

  edgeSensitivity?: number
  glowColor?: string
  backgroundColor?: string
  borderRadius?: number
  glowRadius?: number
  glowIntensity?: number
  coneSpread?: number

  animated?: boolean
  colors?: string[]
  fillOpacity?: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '')

  const normalized =
    clean.length === 3
      ? clean
          .split('')
          .map((char) => char + char)
          .join('')
      : clean

  const value = Number.parseInt(normalized, 16)

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  }
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min

    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100,
  }
}

function buildGradientVars(colors: string[]) {
  const variables: Record<string, string> = {}

  colors.forEach((color, index) => {
    const { r, g, b } = hexToRgb(color)
    const { h, s, l } = rgbToHsl(r, g, b)

    variables[`--glow-color-${index + 1}`] =
      `${h} ${s}% ${l}%`
  })

  return variables
}

export default function BorderGlow({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '40 80 80',
  backgroundColor = '#090b09',
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1,
  coneSpread = 25,
  animated = false,
  colors = ['#0f3e1e', '#1f6b3a', '#42a878'],
  fillOpacity = 0.5,
}: BorderGlowProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const sweepAngle = useRef(-90)
  const animationFrame = useRef<number | null>(null)

  const updateGlow = useCallback(
    (x: number, y: number, angle?: number) => {
      const card = cardRef.current

      if (!card) return

      const rect = card.getBoundingClientRect()

      const px = x - rect.left
      const py = y - rect.top

      const distanceLeft = px
      const distanceRight = rect.width - px
      const distanceTop = py
      const distanceBottom = rect.height - py

      const distance = Math.min(
        distanceLeft,
        distanceRight,
        distanceTop,
        distanceBottom,
      )

      const proximity = clamp(
        1 - distance / edgeSensitivity,
        0,
        1,
      )

      const cursorAngle =
        angle ??
        (Math.atan2(
          py - rect.height / 2,
          px - rect.width / 2,
        ) *
          180) /
          Math.PI

      card.style.setProperty(
        '--glow-opacity',
        `${proximity * glowIntensity}`,
      )

      card.style.setProperty(
        '--glow-angle',
        `${cursorAngle}deg`,
      )

      card.style.setProperty(
        '--glow-x',
        `${px}px`,
      )

      card.style.setProperty(
        '--glow-y',
        `${py}px`,
      )
    },
    [edgeSensitivity, glowIntensity],
  )

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    const card = cardRef.current

    if (!card) return

    const rect = card.getBoundingClientRect()

    updateGlow(
      event.clientX,
      event.clientY,
      (Math.atan2(
        event.clientY - (rect.top + rect.height / 2),
        event.clientX - (rect.left + rect.width / 2),
      ) *
        180) /
        Math.PI,
    )
  }

  const handlePointerLeave = () => {
    const card = cardRef.current

    if (!card) return

    card.style.setProperty('--glow-opacity', '0')
  }

  useEffect(() => {
    if (!animated) return

    const card = cardRef.current

    if (!card) return

    card.classList.add('sweep-active')

    const rect = card.getBoundingClientRect()

    const sweep = () => {
      sweepAngle.current += 1.2

      if (sweepAngle.current > 270) {
        sweepAngle.current = -90
      }

      const radians = (sweepAngle.current * Math.PI) / 180

      const x =
        rect.width / 2 +
        Math.cos(radians) * rect.width * 0.65

      const y =
        rect.height / 2 +
        Math.sin(radians) * rect.height * 0.65

      updateGlow(
        rect.left + x,
        rect.top + y,
        sweepAngle.current,
      )

      animationFrame.current =
        requestAnimationFrame(sweep)
    }

    animationFrame.current =
      requestAnimationFrame(sweep)

    return () => {
      card.classList.remove('sweep-active')

      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current)
      }

      animationFrame.current = null
    }
  }, [animated, updateGlow])

  const style = {
    '--card-bg': backgroundColor,
    '--edge-sensitivity': edgeSensitivity,
    '--border-radius': `${borderRadius}px`,
    '--glow-padding': `${glowRadius}px`,
    '--cone-spread': `${coneSpread}deg`,
    '--fill-opacity': fillOpacity,
    '--glow-color': glowColor,
    '--glow-intensity': glowIntensity,
    '--glow-opacity': 0,
    '--glow-angle': '-90deg',
    '--glow-x': '50%',
    '--glow-y': '50%',
    ...buildGradientVars(colors),
  } as CSSProperties

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`border-glow-card ${className}`}
      style={style}
    >
      <span
        aria-hidden="true"
        className="edge-light"
      />

      <div className="border-glow-inner">
        {children}
      </div>
    </div>
  )
}
