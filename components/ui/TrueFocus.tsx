'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import './TrueFocus.css'

interface TrueFocusProps {
  blurAmount?: number
  borderColor?: string
  glowColor?: string
  animationDuration?: number
  pauseBetweenAnimations?: number
}

function TrueFocus({
  blurAmount = 3,
  borderColor = '#42a878',
  glowColor = 'rgba(66, 168, 120, 0.3)',
  animationDuration = 0.8,
  pauseBetweenAnimations = 1.2,
}: TrueFocusProps) {
  const phrases = ['From waste', 'to worth']

  const [currentIndex, setCurrentIndex] = useState(0)

  const containerRef = useRef<HTMLSpanElement>(null)
  const phraseRefs = useRef<(HTMLSpanElement | null)[]>([])

  const [focusRect, setFocusRect] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentIndex((previous) => (previous + 1) % phrases.length)
    }, (animationDuration + pauseBetweenAnimations) * 1000)

    return () => window.clearInterval(interval)
  }, [animationDuration, pauseBetweenAnimations])

  useEffect(() => {
    const updateFocusRect = () => {
      const activePhrase = phraseRefs.current[currentIndex]
      const container = containerRef.current

      if (!activePhrase || !container) return

      const parentRect = container.getBoundingClientRect()
      const activeRect = activePhrase.getBoundingClientRect()

      setFocusRect({
        x: activeRect.left - parentRect.left,
        y: activeRect.top - parentRect.top,
        width: activeRect.width,
        height: activeRect.height,
      })
    }

    updateFocusRect()

    window.addEventListener('resize', updateFocusRect)

    return () => {
      window.removeEventListener('resize', updateFocusRect)
    }
  }, [currentIndex])

  return (
    <span
      ref={containerRef}
      className="true-focus"
      style={
        {
          '--true-focus-blur': `${blurAmount}px`,
          '--true-focus-border': borderColor,
          '--true-focus-glow': glowColor,
          '--true-focus-duration': `${animationDuration}s`,
        } as React.CSSProperties
      }
    >
      {phrases.map((phrase, index) => {
        const isActive = index === currentIndex

        return (
          <span
            key={phrase}
            ref={(element) => {
              phraseRefs.current[index] = element
            }}
            className={`true-focus__phrase ${
              isActive ? 'true-focus__phrase--active' : ''
            }`}
          >
            {phrase}
          </span>
        )
      })}

      <motion.span
        className="true-focus__frame"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
        }}
        transition={{
          duration: animationDuration,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <span className="true-focus__corner true-focus__corner--tl" />
        <span className="true-focus__corner true-focus__corner--tr" />
        <span className="true-focus__corner true-focus__corner--bl" />
        <span className="true-focus__corner true-focus__corner--br" />
      </motion.span>
    </span>
  )
}

export default TrueFocus
