'use client'

import { motion } from 'motion/react'
import './FoldText.css'

interface FoldTextProps {
  show: boolean
  children: React.ReactNode
}

export default function FoldText({
  show,
  children,
}: FoldTextProps) {
  return (
    <motion.div
      initial={{
        height: 0,
        opacity: 0,
      }}
      animate={
        show
          ? {
              height: 'auto',
              opacity: 1,
            }
          : {
              height: 0,
              opacity: 0,
            }
      }
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="overflow-hidden"
    >
      {children}
    </motion.div>
  )
}
