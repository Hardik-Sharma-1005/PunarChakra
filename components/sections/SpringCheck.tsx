'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

interface SpringCheckProps {
  label: string
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  color?: string
  fillColor?: string
  checkColor?: string
  boxSize?: number
  boxRadius?: number
  fontSize?: number
  bounce?: number
  doneOpacity?: number
}

export default function SpringCheck({
  label,
  defaultChecked = false,
  onChange,
  color = '#f0f2ed',
  fillColor = '#42a878',
  checkColor = '#090b09',
  boxSize = 28,
  boxRadius = 9,
  fontSize = 18,
  bounce = 0.2,
  doneOpacity = 1,
}: SpringCheckProps) {
  const [checked, setChecked] = useState(defaultChecked)

  useEffect(() => {
    setChecked(defaultChecked)
  }, [defaultChecked])

  const toggle = () => {
    const next = !checked
    setChecked(next)
    onChange?.(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="group flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
      aria-pressed={checked}
    >
      {/* Check box */}
      <motion.span
        className="relative flex shrink-0 items-center justify-center border-2"
        style={{
          width: boxSize,
          height: boxSize,
          borderRadius: boxRadius,
          borderColor: checked ? fillColor : color,
        }}
        animate={{
          scale: checked ? [1, 1 + bounce, 1] : 1,
          backgroundColor: checked ? fillColor : 'transparent',
        }}
        transition={{
          duration: 0.42,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {/* Spring check mark */}
        <motion.svg
          viewBox="0 0 24 24"
          fill="none"
          className="absolute"
          style={{
            width: boxSize * 0.62,
            height: boxSize * 0.62,
          }}
          initial={false}
          animate={{
            opacity: checked ? 1 : 0,
            scale: checked ? 1 : 0.4,
          }}
          transition={{
            type: 'spring',
            stiffness: 420,
            damping: 18,
          }}
          aria-hidden="true"
        >
          <motion.path
            d="M5 12.5L10 17L19 7"
            stroke={checkColor}
            strokeWidth="2.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: checked ? 1 : 0 }}
            transition={{
              duration: 0.28,
              delay: checked ? 0.08 : 0,
              ease: 'easeOut',
            }}
          />
        </motion.svg>
      </motion.span>

      {/* Label */}
      <span
        className="whitespace-nowrap font-medium"
        style={{
          fontSize,
          color,
          opacity: checked ? doneOpacity : 1,
        }}
      >
        {label}
      </span>
    </button>
  )
}
