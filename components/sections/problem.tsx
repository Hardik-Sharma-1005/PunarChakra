
'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/motion/primitives'
import { SectionHeading } from '@/components/brand/brand'
import { useSite } from '@/components/site/site-provider'
import BorderGlow from '@/components/ui/BorderGlow'
import { SectionWaves } from '@/components/backgrounds/SectionWaves'
import { cn } from '@/lib/utils'

const ILLUSTRATIONS = [
  '/images/problems/construction-waste.png',
  '/images/problems/crop-residue-burning.png',
  '/images/problems/uncollected-waste.png',
  '/images/problems/waste-recovery-opportunity.png',
]

const PROBLEM_CONTEXT = [
  {
    label: 'CONSTRUCTION & DEMOLITION',
    detail:
      'Broken bricks, concrete, tiles and other construction materials accumulate when reliable collection and recovery options are difficult to access.',
    impact:
      'Recoverable materials are lost, while unmanaged debris takes up space and can damage the surrounding environment.',
  },
  {
    label: 'AGRICULTURAL RESIDUE',
    detail:
      'After harvesting, farmers may have limited time, equipment or affordable options to collect and transport leftover crop residue.',
    impact:
      'When burning becomes the easiest available option, it contributes to harmful smoke and air pollution.',
  },
  {
    label: 'COLLECTION & LOGISTICS',
    detail:
      'Waste generators and potential collectors often lack a straightforward way to discover one another and coordinate collection.',
    impact:
      'Waste can remain dumped or piled up when transport, storage and reliable buyers are unavailable.',
  },
  {
    label: 'LOST ECONOMIC VALUE',
    detail:
      'Materials that could be reused or processed may be discarded when their quality, price, destination or transport costs are uncertain.',
    impact:
      'Generators miss potential earnings, and processors lose access to materials they could put to productive use.',
  },
]

export function Problem() {
  const { t } = useSite()
  const steps = t.problem.steps
  const count = Math.min(steps.length, ILLUSTRATIONS.length)

  const [activeIndex, setActiveIndex] = useState(0)
  const [dragging, setDragging] = useState(false)

  const dragStart = useRef<number | null>(null)
  const dragDistance = useRef(0)

  useEffect(() => {
    if (dragging || count <= 1) return

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % count)
    }, 6000)

    return () => window.clearInterval(interval)
  }, [count, dragging])

  const selectCard = (index: number) => {
    if (count === 0) return
    setActiveIndex((index + count) % count)
  }

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if ((event.target as HTMLElement).closest('button')) return

    dragStart.current = event.clientX
    dragDistance.current = 0
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (dragStart.current === null) return

    dragDistance.current = event.clientX - dragStart.current
  }

  const handlePointerUp = () => {
    if (dragStart.current === null) return

    const distance = dragDistance.current

    dragStart.current = null
    dragDistance.current = 0
    setDragging(false)

    if (Math.abs(distance) > 45) {
      selectCard(activeIndex + (distance < 0 ? 1 : -1))
    }
  }

  if (count === 0) return null

  return (
    <section
      id="problem"
      aria-labelledby="problem-title"
      className="relative overflow-hidden border-t border-line py-20 md:py-28"
    >
      <SectionWaves variant="subtle" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            id="problem-title"
            eyebrow={t.problem.eyebrow}
            title={t.problem.title}
            description={t.problem.desc}
          />
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mx-auto mt-12 w-full max-w-5xl md:mt-16">
            {/* Carousel header */}
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#99a399] md:text-sm">
                THE CHALLENGE
              </p>

              <p
                className="text-sm tabular-nums text-[#99a399]"
                aria-live="polite"
              >
                {String(activeIndex + 1).padStart(2, '0')}
                <span className="mx-2 text-[#477f4d]">/</span>
                {String(count).padStart(2, '0')}
              </p>
            </div>

            {/* Centered active card */}
            <div
              className={cn(
                'relative mx-auto w-full touch-pan-y select-none',
                dragging ? 'cursor-grabbing' : 'cursor-grab',
              )}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <div className="pointer-events-none absolute -inset-5 rounded-[36px] bg-[#0f3e1e]/15 opacity-70 blur-3xl" />

              {steps.slice(0, count).map((step, index) => {
                const isActive = index === activeIndex
                const context = PROBLEM_CONTEXT[index]

                return (
                  <div
                    key={step.title}
                    aria-hidden={!isActive}
                    className={cn(
                      'relative w-full transition-[opacity,transform] duration-700 ease-out',
                      isActive
                        ? 'relative z-10 translate-y-0 scale-100 opacity-100'
                        : 'pointer-events-none absolute inset-0 z-0 translate-y-3 scale-[0.985] opacity-0',
                    )}
                  >
                   
<BorderGlow
  glowColor="71 127 77"
  glowIntensity={isActive ? 1.25 : 0}
  glowRadius={isActive ? 24 : 0}
  animated={isActive}
  colors={['#0f3e1e', '#477f4d', '#6a692f']}
  fillOpacity={0.07}
  borderRadius={24}
  className="overflow-hidden"
>

                  
                      <article className="grid min-h-0 grid-cols-1 overflow-hidden bg-[#090b09]/95 md:grid-cols-[0.95fr_1.05fr]">
                        {/* Image */}
                        <div className="relative min-h-[240px] overflow-hidden bg-[#111a12] sm:min-h-[320px] md:min-h-[440px]">
                          <img
                            src={ILLUSTRATIONS[index]}
                            alt={context.label.toLowerCase()}
                            draggable={false}
                            className={cn(
                              'absolute inset-0 h-full w-full object-cover transition-transform duration-1000',
                              isActive ? 'scale-100' : 'scale-105',
                            )}
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-[#090b09]/75 via-transparent to-[#090b09]/10" />

                          <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-[#090b09]/70 px-3 py-2 backdrop-blur-md md:left-7 md:top-7">
                            <span className="text-[10px] font-semibold tracking-[0.16em] text-[#c5f4a7] md:text-xs">
                              {context.label}
                            </span>
                          </div>

                          <span className="absolute bottom-5 left-5 text-5xl font-semibold tracking-tight text-white/90 md:bottom-7 md:left-7 md:text-7xl">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
                          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#8acb78]">
                            The problem
                          </p>

                          <h3 className="max-w-lg text-2xl font-semibold leading-tight tracking-tight text-[#f0f2ed] sm:text-3xl md:text-4xl">
                            {step.title}
                          </h3>

                          <p className="mt-5 text-base leading-7 text-[#c0c8bd] md:text-lg md:leading-8">
                            {step.desc}
                          </p>

                          <div className="my-6 h-px w-full bg-gradient-to-r from-[#477f4d]/70 via-[#477f4d]/20 to-transparent" />

                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8acb78]">
                            Why it matters
                          </p>

                          <p className="mt-3 text-sm leading-7 text-[#99a399] md:text-base md:leading-7">
                            {context.impact}
                          </p>

                          <div className="mt-6 border-l-2 border-[#477f4d] pl-4">
                            <p className="text-sm leading-6 text-[#c0c8bd] md:text-base">
                              {context.detail}
                            </p>
                          </div>
                        </div>
                      </article>
                    </BorderGlow>
                  </div>
                )
              })}
            </div>

            {/* Controls */}
            <div className="mt-7 flex items-center justify-between gap-4">
              <p className="hidden text-xs tracking-wide text-[#99a399] sm:block">
                EXPLORE THE CHALLENGES
              </p>

              <div className="ml-auto flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {steps.slice(0, count).map((step, index) => (
                    <button
                      key={step.title}
                      type="button"
                      aria-label={`Show problem ${index + 1}: ${step.title}`}
                      aria-current={index === activeIndex ? 'step' : undefined}
                      onClick={() => selectCard(index)}
                      className={cn(
                        'h-2 rounded-full transition-all duration-300',
                        index === activeIndex
                          ? 'w-8 bg-[#8acb78]'
                          : 'w-2 bg-[#99a399]/35 hover:bg-[#99a399]/70',
                      )}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  aria-label="Previous problem"
                  onClick={() => selectCard(activeIndex - 1)}
                  className="flex size-11 items-center justify-center rounded-full border border-[#477f4d]/50 text-[#f0f2ed] transition-colors hover:border-[#8acb78] hover:bg-[#0f3e1e]/40"
                >
                  <ArrowLeft size={18} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  aria-label="Next problem"
                  onClick={() => selectCard(activeIndex + 1)}
                  className="flex size-11 items-center justify-center rounded-full border border-[#477f4d]/50 text-[#f0f2ed] transition-colors hover:border-[#8acb78] hover:bg-[#0f3e1e]/40"
                >
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Closing statement */}
            <div className="mt-12 border-t border-line-strong pt-7 md:mt-16 md:pt-9">
              <p className="mx-auto max-w-3xl text-center text-base leading-8 text-[#c0c8bd] md:text-lg md:leading-9">
                Waste becomes a bigger problem when collection, transport,
                processing and fair compensation do not connect. PunarChakra
                aims to connect these missing links so recoverable materials
                can reach the people who can put them to use.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
