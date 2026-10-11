'use client'

import { useRef, useState } from 'react'
import './HoloCard.css'

type HoloCardProps = {
  image: string
  alt?: string
  width?: number | string
  radius?: number
  tiltMax?: number
  hoverScale?: number
  preset?: 'cosmos' | 'shards'
}

export default function HoloCard({
  image,
  alt = '',
  width = 360,
  radius = 22,
  tiltMax = 14,
  hoverScale = 1.045,
}: HoloCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const [tilt, setTilt] = useState({
    x: 0,
    y: 0,
  })

  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()

    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateY = ((x - centerX) / centerX) * tiltMax
    const rotateX = -((y - centerY) / centerY) * tiltMax

    setTilt({
      x: rotateX,
      y: rotateY,
    })

    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`)
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`)
  }

  const handleMouseLeave = () => {
    setHovered(false)

    setTilt({
      x: 0,
      y: 0,
    })
  }

  const handleMouseEnter = () => {
    setHovered(true)
  }

  return (
    <div
      ref={cardRef}
      className={`holo-card ${hovered ? 'is-hovered' : ''}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        borderRadius: radius,
        transform: `
          perspective(1000px)
          rotateX(${tilt.x}deg)
          rotateY(${tilt.y}deg)
          scale(${hovered ? hoverScale : 1})
        `,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* BASE IMAGE — NEVER HIDDEN */}
      <img
        src={image}
        alt={alt}
        className="holo-card__image"
        draggable={false}
      />

      {/* HOLOGRAPHIC FOIL */}
      <div
        className="holo-card__foil"
        aria-hidden="true"
      />

      {/* GLARE */}
      <div
        className="holo-card__glare"
        aria-hidden="true"
      />

      {/* EDGE LIGHT */}
      <div
        className="holo-card__edge"
        aria-hidden="true"
      />
    </div>
  )
}
