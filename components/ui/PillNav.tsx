'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './PillNav.css'

type PillNavItem = {
  label: string
  href: string
  ariaLabel?: string
}

type PillNavProps = {
  items: PillNavItem[]
  activeHref?: string
  className?: string
  ease?: string
  baseColor?: string
  pillColor?: string
  hoveredPillTextColor?: string
  pillTextColor?: string
}

export default function PillNav({
  items,
  activeHref,
  className = '',
  ease = 'power3.out',
  baseColor = '#1f6b3a',
  pillColor = '#090b09',
  hoveredPillTextColor = '#f0f2ed',
  pillTextColor,
}: PillNavProps) {
  const resolvedPillTextColor = pillTextColor ?? '#f0f2ed'

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const circleRefs = useRef<(HTMLSpanElement | null)[]>([])
  const timelineRefs = useRef<gsap.core.Timeline[]>([])
  const activeTweenRefs = useRef<(gsap.core.Timeline | gsap.core.Tween)[]>([])

  const hamburgerRef = useRef<HTMLButtonElement | null>(null)
  const mobileMenuRef = useRef<HTMLDivElement | null>(null)
  const navItemsRef = useRef<HTMLDivElement | null>(null)

  /*
   * Build the circular hover animation.
   */
  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return

        const pill = circle.parentElement
        const rect = pill.getBoundingClientRect()

        const width = rect.width
        const height = rect.height

        const radius = (width * width) / 4 + height * height
        const R = radius / (2 * height)
        const diameter = Math.ceil(2 * R) + 2

        const delta =
          Math.ceil(
            R -
              Math.sqrt(
                Math.max(
                  0,
                  R * R - (width * width) / 4
                )
              )
          ) + 1

        const originY = diameter - delta

        circle.style.width = `${diameter}px`
        circle.style.height = `${diameter}px`
        circle.style.bottom = `-${delta}px`

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        })

        const label = pill.querySelector('.pill-label') as HTMLElement | null
        const hoverLabel = pill.querySelector('.pill-label-hover') as HTMLElement | null

        if (label) gsap.set(label, { y: 0 })
        if (hoverLabel) gsap.set(hoverLabel, { y: 14, opacity: 0 })

        const tl = gsap.timeline({ paused: true })

        tl.to(
          circle,
          {
            scale: 1.2,
            duration: 0.45,
            ease,
          },
          0
        )

        if (label) {
          tl.to(
            label,
            {
              y: -14,
              opacity: 0,
              duration: 0.3,
              ease,
            },
            0
          )
        }

        if (hoverLabel) {
          tl.to(
            hoverLabel,
            {
              y: 0,
              opacity: 1,
              duration: 0.35,
              ease,
            },
            0.08
          )
        }

        timelineRefs.current[index] = tl
      })
    }

    layout()
    window.addEventListener('resize', layout)

    return () => {
      window.removeEventListener('resize', layout)
    }
  }, [items, ease])

  const handleMouseEnter = (index: number) => {
    const tl = timelineRefs.current[index]
    if (tl) {
      activeTweenRefs.current[index]?.kill()
      activeTweenRefs.current[index] = tl.play()
    }
  }

  const handleMouseLeave = (index: number) => {
    const tl = timelineRefs.current[index]
    if (tl) {
      activeTweenRefs.current[index]?.kill()
      activeTweenRefs.current[index] = tl.reverse()
    }
  }

  const toggleMobileMenu = () => {
    const next = !isMobileMenuOpen
    setIsMobileMenuOpen(next)

    if (!mobileMenuRef.current) return

    if (next) {
      gsap.to(mobileMenuRef.current, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power3.out',
      })
    } else {
      gsap.to(mobileMenuRef.current, {
        autoAlpha: 0,
        y: -8,
        scale: 0.95,
        duration: 0.2,
        ease: 'power3.in',
      })
    }
  }

  return (
    <div
      className={`pill-nav-container ${className}`}
      style={
        {
          '--pill-base': baseColor,
          '--pill-bg': pillColor,
          '--pill-text': resolvedPillTextColor,
          '--pill-hover-text': hoveredPillTextColor,
        } as React.CSSProperties
      }
    >
      <nav className="pill-nav" aria-label="Main Navigation">
        {/* Desktop items */}
        <div ref={navItemsRef} className="pill-nav-items desktop-only">
          <ul className="pill-list">
            {items.map((item, index) => {
              const isActive = activeHref === item.href
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-label={item.ariaLabel || item.label}
                    className={`pill ${isActive ? 'is-active' : ''}`}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => handleMouseLeave(index)}
                  >
                    <span
                      ref={(el) => {
                        circleRefs.current[index] = el
                      }}
                      className="hover-circle"
                      aria-hidden="true"
                    />
                    <span className="label-stack">
                      <span className="pill-label">{item.label}</span>
                      <span className="pill-label-hover" aria-hidden="true">
                        {item.label}
                      </span>
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Mobile hamburger */}
        <div className="mobile-only">
          <button
            ref={hamburgerRef}
            type="button"
            className="mobile-menu-button"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>

          <div ref={mobileMenuRef} className="mobile-menu-popover">
            <ul className="mobile-menu-list">
              {items.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`mobile-menu-link ${activeHref === item.href ? 'is-active' : ''}`}
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      if (mobileMenuRef.current) {
                        gsap.set(mobileMenuRef.current, { autoAlpha: 0, y: -8, scale: 0.95 })
                      }
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}
