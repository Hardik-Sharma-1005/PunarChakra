'use client'

import { useEffect, useRef, useState } from 'react'
import { Reveal } from '@/components/motion/primitives'
import { SectionHeading } from '@/components/brand/brand'
import { useSite } from '@/components/site/site-provider'
import BorderGlow from '@/components/ui/BorderGlow'
import { SectionWaves } from '@/components/backgrounds/SectionWaves'
import { cn } from '@/lib/utils'

const ILLUSTRATIONS = [
  '/illustrations/problem-waste-generated.png',
  '/illustrations/problem-no-convenient-option.png',
  '/illustrations/problem-burned-dumped-piled.png',
  '/illustrations/problem-value-lost.png',
]

export function Problem() {
  const { t } = useSite()

  const [activeIndex, setActiveIndex] = useState(0)
  const [rotation, setRotation] = useState(0)
  const [dragging, setDragging] = useState(false)

  const dragStart = useRef<number | null>(null)
  const rotationStart = useRef(0)

  const count = t.problem.steps.length
  const angleStep = 360 / count

  /* =========================================================
     AUTO ROTATION
     ========================================================= */

  useEffect(() => {
    if (dragging) return

    const interval = window.setInterval(() => {
      setActiveIndex((current) => {
        const next = (current + 1) % count
        setRotation(-next * angleStep)
        return next
      })
    }, 3200)

    return () => window.clearInterval(interval)
  }, [count, angleStep, dragging])

  /* =========================================================
     SELECT CARD
     ========================================================= */

  const selectCard = (index: number) => {
    setActiveIndex(index)
    setRotation(-index * angleStep)
  }

  /* =========================================================
     DRAG GESTURE
     ========================================================= */

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    setDragging(true)
    dragStart.current = event.clientX
    rotationStart.current = rotation
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging || dragStart.current === null) return
    const delta = event.clientX - dragStart.current
    setRotation(rotationStart.current + delta * 0.35)
  }

  const handlePointerUp = () => {
    if (!dragging) return
    setDragging(false)

    const normalized = ((rotation % 360) + 360) % 360
    const nearest = Math.round(-normalized / angleStep) % count
    const index = (nearest + count) % count

    setActiveIndex(index)
    setRotation(-index * angleStep)
    dragStart.current = null
  }

  return (
    <section
      id="problem"
      aria-labelledby="problem-title"
      className="relative overflow-visible border-t border-line py-24 md:py-32"
    >
      <SectionWaves variant="subtle" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-8">
        {/* =====================================================
            SECTION HEADING
            ===================================================== */}

        <Reveal>
          <SectionHeading
            id="problem-title"
            eyebrow={t.problem.eyebrow}
            title={t.problem.title}
            description={t.problem.desc}
          />
        </Reveal>

        {/* =====================================================
            CIRCULAR CAROUSEL
            ===================================================== */}

        <div
          className="
            relative
            mx-auto
            mt-16
            flex
            h-[720px]
            w-full
            max-w-[1200px]
            items-center
            justify-center
            overflow-visible
            md:mt-20
            md:h-[780px]
          "
        >
          {/* Ambient Center Glow */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-[420px]
              w-[420px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-[#0f3e1e]/20
              blur-[100px]
            "
          />

          {/* Orbit Ring */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-[430px]
              w-[430px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              border
              border-[#1f6b3a]/20
            "
          />

          {/* Center Interaction Area */}
          <div
            className={cn(
              'absolute left-1/2 top-1/2 h-[520px] w-full -translate-x-1/2 -translate-y-1/2 overflow-visible touch-pan-y select-none',
              dragging ? 'cursor-grabbing' : 'cursor-grab'
            )}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/* CARDS */}
            {t.problem.steps.map((step, index) => {
              const relativeAngle = index * angleStep + rotation
              const radians = (relativeAngle * Math.PI) / 180

              const radiusX = 320
              const radiusY = 145

              const x = Math.sin(radians) * radiusX
              const y = Math.cos(radians) * radiusY
              const depth = (Math.cos(radians) + 1) / 2
              const isActive = index === activeIndex

              const scale = isActive ? 1 : 0.78 + depth * 0.08
              const opacity = isActive ? 1 : 0.35 + depth * 0.35
              const zIndex = Math.round(depth * 100) + (isActive ? 100 : 0)

              return (
                <div
                  key={step.title}
                  className="absolute left-1/2 top-1/2 w-[min(360px,80vw)] -translate-x-1/2 -translate-y-1/2"
                  style={{
                    transform: `
                      translate(-50%, -50%)
                      translate3d(${x}px, ${y}px, 0)
                      scale(${scale})
                    `,
                    opacity,
                    zIndex,
                    transition: dragging
                      ? 'none'
                      : `
                        transform 850ms cubic-bezier(0.22, 1, 0.36, 1),
                        opacity 850ms ease
                      `,
                  }}
                  onClick={() => {
                    if (!dragging) {
                      selectCard(index)
                    }
                  }}
                >
                  <BorderGlow
                    glowColor="66 168 120"
                    glowIntensity={isActive ? 1.8 : 0.55}
                    glowRadius={isActive ? 30 : 18}
                    animated={isActive}
                    colors={['#0f3e1e', '#1f6b3a', '#42a878']}
                    fillOpacity={isActive ? 0.3 : 0.12}
                    borderRadius={24}
                    className={cn(
                      'overflow-hidden transition-all duration-700',
                      isActive && 'shadow-[0_0_55px_rgba(66,168,120,0.20)]'
                    )}
                  >
                    <div className="flex min-h-[430px] flex-col">
                      {/* Illustration Container */}
                      <div
                        className={cn(
                          'relative flex h-[235px] items-center justify-center overflow-hidden px-6 pt-6 transition-all duration-700',
                          isActive ? 'bg-[#0f3e1e]/[0.12]' : 'bg-transparent'
                        )}
                      >
                        <div
                          aria-hidden="true"
                          className={cn(
                            'pointer-events-none absolute inset-0 transition-opacity duration-1000',
                            isActive ? 'opacity-100' : 'opacity-0'
                          )}
                          style={{
                            background:
                              'radial-gradient(circle at center, rgba(66,168,120,0.16), transparent 62%)',
                          }}
                        />

                        <img
                          src={ILLUSTRATIONS[index]}
                          alt=""
                          aria-hidden="true"
                          className={cn(
                            'relative z-10 h-full w-full object-contain transition-all duration-1000',
                            isActive
                              ? 'scale-105 opacity-100 drop-shadow-[0_0_30px_rgba(66,168,120,0.30)]'
                              : 'scale-100 opacity-45'
                          )}
                        />

                        <span
                          aria-hidden="true"
                          className={cn(
                            'absolute bottom-3 left-1/2 h-[2px] -translate-x-1/2 rounded-full transition-all duration-700',
                            isActive
                              ? 'w-16 bg-[#42a878] opacity-100 shadow-[0_0_12px_rgba(66,168,120,0.55)]'
                              : 'w-0 opacity-0'
                          )}
                        />
                      </div>

                      {/* Content */}
                      <div
                        className={cn(
                          'relative flex flex-1 flex-col border-t border-line/60 px-6 py-6 transition-all duration-700',
                          isActive ? 'bg-[#0f3e1e]/[0.08]' : 'bg-transparent'
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <p
                            className={cn(
                              'pt-1 text-xs font-semibold tracking-[0.2em] tabular-nums transition-colors duration-700',
                              isActive ? 'text-[#42a878]' : 'text-muted-foreground'
                            )}
                          >
                            {String(index + 1).padStart(2, '0')}
                          </p>

                          <div className="min-w-0">
                            <h3
                              className={cn(
                                'text-xl font-semibold leading-tight tracking-tight transition-all duration-700',
                                isActive
                                  ? 'translate-x-1 text-foreground'
                                  : 'text-muted-foreground'
                              )}
                            >
                              {step.title}
                            </h3>

                            <p
                              className={cn(
                                'mt-3 text-sm leading-relaxed transition-colors duration-700',
                                isActive
                                  ? 'text-muted-foreground'
                                  : 'text-muted-foreground/70'
                              )}
                            >
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </BorderGlow>
                </div>
              )
            })}
          </div>

          {/* Indicators */}
          <div className="absolute bottom-8 left-1/2 z-[200] flex -translate-x-1/2 items-center gap-2">
            {t.problem.steps.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Show problem step ${index + 1}`}
                onClick={() => selectCard(index)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-500',
                  index === activeIndex
                    ? 'w-8 bg-[#42a878]'
                    : 'w-1.5 bg-[#aeb8aa]/30'
                )}
              />
            ))}
          </div>

          <p className="pointer-events-none absolute bottom-1 left-1/2 z-[100] hidden -translate-x-1/2 text-[10px] uppercase tracking-[0.22em] text-[#aeb8aa]/40 md:block">
            Drag to explore
          </p>
        </div>
      </div>
    </section>
  )
}
