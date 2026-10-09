'use client'

import { useRef } from 'react'
import { ArrowRight, Factory, Truck } from 'lucide-react'
import { motion, Reveal, useInView } from '@/components/motion/primitives'
import { SectionHeading } from '@/components/brand/brand'
import { useSite } from '@/components/site/site-provider'
import { cn } from '@/lib/utils'
import PixelCard from '@/components/ui/PixelCard'

const THRESHOLD = 8
const UNIT = 'h-5 md:h-6'

export function Aggregation() {
  const { t } = useSite()
  const a = t.aggregation

  const ref = useRef<HTMLDivElement>(null)

  const inView = useInView(ref, {
    once: true,
    margin: '-140px',
  })

  const total = a.farmers.reduce(
    (sum, farmer) => sum + farmer.tonnes,
    0,
  )

  const colors = [
    'bg-accent',
    'bg-primary-bright',
    'bg-secondary',
  ]

  return (
    <section
      aria-labelledby="aggregation-title"
      className="relative overflow-hidden border-t border-line bg-surface py-24 md:py-32"
    >
      {/* ---------------------------------------------------------------- */}
      {/* BACKGROUND                                                        */}
      {/* ---------------------------------------------------------------- */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <img
          src="/backgrounds/Polygon%20Luminary.svg"
          alt=""
          className="absolute right-0 top-1/2 max-h-full max-w-[50%] -translate-y-1/2 object-contain opacity-[0.035] pointer-events-none"
        />

        <div
          className="absolute left-1/2 top-[60%] size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.055] blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(15,62,30,0.8), transparent 70%)',
          }}
        />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* CONTENT                                                           */}
      {/* ---------------------------------------------------------------- */}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            id="aggregation-title"
            eyebrow={a.eyebrow}
            title={a.title}
            desc={a.desc}
          />
        </Reveal>

        <div
          ref={ref}
          className="relative mt-16"
        >
          {/* ============================================================ */}
          {/* DESKTOP FLOW                                                  */}
          {/* ============================================================ */}

          <div className="hidden lg:grid lg:grid-cols-[1fr_90px_1.15fr_90px_0.8fr] lg:items-center lg:gap-6">
            {/* ---------------------------------------------------------- */}
            {/* SOURCES                                                     */}
            {/* ---------------------------------------------------------- */}

            <div className="relative">
              <div className="mb-5">
                <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  {a.tooSmall}
                </p>

                <div className="mt-2 h-px w-12 bg-line-strong" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {a.farmers.map((farmer, i) => (
                  <motion.div
                    key={farmer.name}
                    initial={{
                      opacity: 0,
                      y: 24,
                    }}
                    animate={
                      inView
                        ? {
                            opacity: 1,
                            y: 0,
                          }
                        : {}
                    }
                    transition={{
                      duration: 0.6,
                      delay: i * 0.15,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Stack
                      count={farmer.tonnes}
                      color={colors[i]}
                      active={inView}
                      delay={0.7 + i * 0.18}
                    />

                    <p className="mt-4 text-sm font-semibold">
                      {farmer.name}
                    </p>

                    <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
                      {farmer.tonnes} t
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ---------------------------------------------------------- */}
            {/* CONVERGENCE ARROWS                                           */}
            {/* ---------------------------------------------------------- */}

            <div className="relative flex h-48 items-center justify-center">
              <ConvergenceLines active={inView} />
            </div>

            {/* ---------------------------------------------------------- */}
            {/* COMBINED BATCH                                               */}
            {/* ---------------------------------------------------------- */}

            <CombinedBatch
              total={total}
              farmers={a.farmers}
              colors={colors}
              active={inView}
              threshold={THRESHOLD}
              labels={a}
            />

            {/* ---------------------------------------------------------- */}
            {/* TRANSPORT                                                    */}
            {/* ---------------------------------------------------------- */}

            <div className="flex items-center justify-center">
              <motion.div
                initial={{
                  opacity: 0,
                  x: -12,
                }}
                animate={
                  inView
                    ? {
                        opacity: 1,
                        x: 0,
                      }
                    : {}
                }
                transition={{
                  delay: 2.6,
                  duration: 0.6,
                }}
              >
                <ArrowRight
                  className="size-8 text-accent-bright"
                  aria-hidden="true"
                />
              </motion.div>
            </div>

            {/* ---------------------------------------------------------- */}
            {/* PROCESSOR                                                    */}
            {/* ---------------------------------------------------------- */}

            <Processor
              active={inView}
              labels={a}
            />
          </div>

          {/* ============================================================ */}
          {/* MOBILE / TABLET FLOW                                          */}
          {/* ============================================================ */}

          <div className="lg:hidden">
            {/* Sources */}
            <div>
              <div className="mb-5">
                <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  {a.tooSmall}
                </p>

                <div className="mt-2 h-px w-12 bg-line-strong" />
              </div>

              <div className="grid grid-cols-3 gap-3 md:gap-5">
                {a.farmers.map((farmer, i) => (
                  <motion.div
                    key={farmer.name}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={
                      inView
                        ? {
                            opacity: 1,
                            y: 0,
                          }
                        : {}
                    }
                    transition={{
                      duration: 0.6,
                      delay: i * 0.12,
                    }}
                  >
                    <Stack
                      count={farmer.tonnes}
                      color={colors[i]}
                      active={inView}
                      delay={0.6 + i * 0.15}
                    />

                    <p className="mt-3 text-sm font-semibold">
                      {farmer.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {farmer.tonnes} t
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Downward convergence */}
            <motion.div
              initial={{
                opacity: 0,
                scaleY: 0,
              }}
              animate={
                inView
                  ? {
                      opacity: 1,
                      scaleY: 1,
                    }
                  : {}
              }
              transition={{
                delay: 1.35,
                duration: 0.7,
              }}
              className="mx-auto my-8 h-12 w-px origin-top bg-gradient-to-b from-accent-bright/20 via-accent-bright to-accent-bright/20"
            />

            {/* Combined batch */}
            <CombinedBatch
              total={total}
              farmers={a.farmers}
              colors={colors}
              active={inView}
              threshold={THRESHOLD}
              labels={a}
            />

            {/* Transport */}
            <motion.div
              initial={{
                opacity: 0,
                y: -8,
              }}
              animate={
                inView
                  ? {
                      opacity: 1,
                      y: 0,
                    }
                  : {}
              }
              transition={{
                delay: 2.6,
                duration: 0.6,
              }}
              className="flex flex-col items-center py-8"
            >
              <span
                aria-hidden="true"
                className="h-8 w-px bg-accent-bright"
              />

              <Truck
                className="my-3 size-6 text-accent-bright"
                aria-hidden="true"
              />

              <span
                aria-hidden="true"
                className="h-8 w-px bg-accent-bright"
              />
            </motion.div>

            <Processor
              active={inView}
              labels={a}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* CONVERGENCE LINES                                                          */
/* -------------------------------------------------------------------------- */

function ConvergenceLines({
  active,
}: {
  active: boolean
}) {
  return (
    <div
      aria-hidden="true"
      className="relative h-full w-full"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute left-0 h-px origin-left bg-accent-bright/70"
          style={{
            top:
              i === 0
                ? '28%'
                : i === 1
                  ? '50%'
                  : '72%',
            width: '100%',
            rotate:
              i === 0
                ? 16
                : i === 2
                  ? -16
                  : 0,
          }}
          initial={{
            opacity: 0,
            scaleX: 0,
          }}
          animate={
            active
              ? {
                  opacity: [0, 1, 0.35],
                  scaleX: [0, 1, 1],
                }
              : {}
          }
          transition={{
            duration: 1,
            delay: 1.2 + i * 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}

      <motion.span
        className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent-bright bg-background shadow-[0_0_20px_rgba(66,168,120,0.35)]"
        initial={{
          scale: 0,
          opacity: 0,
        }}
        animate={
          active
            ? {
                scale: [0, 1.2, 1],
                opacity: 1,
              }
            : {}
        }
        transition={{
          delay: 1.65,
          duration: 0.55,
        }}
      />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* COMBINED BATCH                                                             */
/* -------------------------------------------------------------------------- */

function CombinedBatch({
  total,
  farmers,
  colors,
  active,
  threshold,
  labels,
}: {
  total: number
  farmers: Array<{
    name: string
    tonnes: number
  }>
  colors: string[]
  active: boolean
  threshold: number
  labels: {
    combined: string
    threshold: string
    viable: string
  }
}) {
  return (
    <motion.div
      className="relative rounded-2xl border border-line-strong bg-background/95 p-5 backdrop-blur-sm md:p-6"
      initial={{
        opacity: 0,
        y: 24,
        scale: 0.96,
      }}
      animate={
        active
          ? {
              opacity: 1,
              y: 0,
              scale: 1,
            }
          : {}
      }
      transition={{
        duration: 0.7,
        delay: 1.45,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Convergence node */}
      <motion.span
        aria-hidden="true"
        className="absolute -top-2 left-1/2 size-4 -translate-x-1/2 rounded-full border-2 border-accent-bright bg-background shadow-[0_0_16px_rgba(66,168,120,0.3)]"
        initial={{
          scale: 0,
          opacity: 0,
        }}
        animate={
          active
            ? {
                scale: 1,
                opacity: 1,
              }
            : {}
        }
        transition={{
          delay: 1.75,
          duration: 0.4,
        }}
      />

      {/* Header */}
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          {labels.combined}
        </p>

        <motion.p
          className="text-3xl font-semibold tabular-nums md:text-4xl"
          initial={{
            opacity: 0,
            y: 6,
          }}
          animate={
            active
              ? {
                  opacity: 1,
                  y: 0,
                }
              : {}
          }
          transition={{
            delay: 1.8,
          }}
        >
          {total} t
        </motion.p>
      </div>

      {/* Batch visualization */}
      <div className="relative mt-5">
        <div className="flex flex-col-reverse gap-1">
          {farmers.flatMap((farmer, farmerIndex) =>
            Array.from(
              {
                length: farmer.tonnes,
              },
              (_, unitIndex) => {
                const previous = farmers
                  .slice(0, farmerIndex)
                  .reduce(
                    (sum, item) =>
                      sum + item.tonnes,
                    0,
                  )

                const index =
                  previous + unitIndex

                return (
                  <motion.span
                    key={`${farmer.name}-${unitIndex}`}
                    className={cn(
                      'block w-full rounded-sm',
                      UNIT,
                      colors[farmerIndex],
                    )}
                    initial={{
                      opacity: 0,
                      x: -35,
                      scaleX: 0.4,
                    }}
                    animate={
                      active
                        ? {
                            opacity: 1,
                            x: 0,
                            scaleX: 1,
                          }
                        : {}
                    }
                    transition={{
                      duration: 0.45,
                      delay:
                        1.55 +
                        index * 0.08,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                  />
                )
              },
            ),
          )}
        </div>

        {/* Threshold */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-[-0.5rem] border-t-2 border-dashed border-foreground/60"
          style={{
            bottom: `calc(${(threshold / total) * 100}% - 1px)`,
          }}
          initial={{
            opacity: 0,
          }}
          animate={
            active
              ? {
                  opacity: 1,
                }
              : {}
          }
          transition={{
            delay: 1.9,
          }}
        />

        <motion.span
          className="absolute right-0 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase"
          style={{
            bottom: `calc(${(threshold / total) * 100}% + 6px)`,
          }}
          initial={{
            opacity: 0,
            x: 6,
          }}
          animate={
            active
              ? {
                  opacity: 1,
                  x: 0,
                }
              : {}
          }
          transition={{
            delay: 2,
          }}
        >
          {threshold} t threshold
        </motion.span>
      </div>

      {/* Explanation */}
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        {labels.threshold}
      </p>

      {/* Viability state */}
      <motion.div
        initial={{
          opacity: 0,
          y: 6,
        }}
        animate={
          active
            ? {
                opacity: 1,
                y: 0,
              }
            : {}
        }
        transition={{
          delay: 2.25,
        }}
        className="mt-4 flex items-center justify-between gap-4 border-t border-line pt-4"
      >
        <span className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          Aggregated route
        </span>

        <span className="rounded-full bg-accent-bright px-3 py-1 text-sm font-semibold text-background">
          {labels.viable}
        </span>
      </motion.div>
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/* PROCESSOR — PIXEL CARD                                                     */
/* -------------------------------------------------------------------------- */

function Processor({
  active,
  labels,
}: {
  active: boolean
  labels: {
    oneTrip: string
    processor: string
  }
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 18,
      }}
      animate={
        active
          ? {
              opacity: 1,
              x: 0,
            }
          : {}
      }
      transition={{
        delay: 2.8,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="w-full"
    >
      <PixelCard
        variant="default"
        gap={6}
        speed={28}
        colors="#0f3e1e,#1f6b3a,#42a878"
        className="min-h-[220px] rounded-2xl"
      >
        <div className="flex flex-col items-center justify-center p-5 text-center">
          {/* Processor icon */}
          <div className="flex size-14 items-center justify-center rounded-lg border border-accent-bright/25 bg-primary/80 shadow-[0_0_24px_rgba(15,62,30,0.25)]">
            <Factory
              className="size-6 text-foreground"
              aria-hidden="true"
            />
          </div>

          {/* One trip */}
          <p className="mt-4 text-xs font-semibold tracking-[0.18em] text-accent-bright uppercase">
            {labels.oneTrip}
          </p>

          {/* Processor */}
          <p className="mt-1 font-semibold text-foreground">
            {labels.processor}
          </p>

          {/* Route indicator */}
          <div
            aria-hidden="true"
            className="mt-4 flex items-center gap-2"
          >
            <span className="size-1.5 rounded-full bg-primary-bright" />

            <span className="h-px w-8 bg-gradient-to-r from-primary-bright via-accent-bright to-teal" />

            <span className="size-1.5 rounded-full bg-teal" />
          </div>
        </div>
      </PixelCard>
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/* STACK                                                                      */
/* -------------------------------------------------------------------------- */

function Stack({
  count,
  color,
  active,
  delay,
}: {
  count: number
  color: string
  active: boolean
  delay: number
}) {
  return (
    <div className="flex h-32 flex-col-reverse gap-1 border-b border-line-strong pb-1 md:h-40">
      {Array.from(
        {
          length: count,
        },
        (_, i) => (
          <motion.span
            key={i}
            className={cn(
              'block w-full rounded-sm',
              UNIT,
              color,
            )}
            initial={{
              opacity: 0,
              y: 12,
              scaleY: 0.5,
            }}
            animate={
              active
                ? {
                    opacity: 1,
                    y: 0,
                    scaleY: 1,
                  }
                : {}
            }
            transition={{
              duration: 0.35,
              delay:
                delay + i * 0.08,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          />
        ),
      )}
    </div>
  )
}
