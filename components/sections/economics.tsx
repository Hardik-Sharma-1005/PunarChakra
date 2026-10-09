'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Loader2, MapPin, X } from 'lucide-react'
import {
  motion,
  Reveal,
  useInView,
  useSequence,
} from '@/components/motion/primitives'
import { SectionEyebrow } from '@/components/brand/brand'
import { useSite } from '@/components/site/site-provider'
import { cn } from '@/lib/utils'
import SpringCheck from './SpringCheck'

type EconomicsOption = {
  id: string
  name: string
  distance: string
  verdict: string
  cost: string | number
  value: string | number
}

type EconomicsLabels = {
  evaluating: string
  best: string
  metrics: {
    distance: string
    cost: string
    value: string
  }
}

/* -------------------------------------------------------------------------- */
/* MAIN SECTION                                                               */
/* -------------------------------------------------------------------------- */

export function Economics() {
  const { t } = useSite()
  const e = t.economics

  return (
    <section
      aria-labelledby="economics-title"
      className="relative overflow-hidden border-t border-line py-24 md:py-32"
    >
      {/* Decision intelligence background */}
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
          className="absolute right-[12%] top-1/2 size-[420px] -translate-y-1/2 rounded-full opacity-[0.07] blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(66,168,120,0.3), transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* ---------------------------------------------------------------- */}
        {/* LEFT                                                             */}
        {/* ---------------------------------------------------------------- */}

        <Reveal>
          <SectionEyebrow>{e.eyebrow}</SectionEyebrow>

          <h2
            id="economics-title"
            className="mt-5 max-w-xl text-4xl leading-[1.05] font-semibold tracking-tight text-balance md:text-5xl lg:text-6xl"
          >
            {e.title}
          </h2>

          {/* Question transition */}
          <div className="mt-10 space-y-3">
            <p className="text-lg text-muted-foreground line-through decoration-secondary/60">
              {e.askOld}
            </p>

            <p className="flex items-center gap-3 text-xl font-semibold text-accent-bright md:text-2xl">
              <span
                aria-hidden="true"
                className="h-0.5 w-8 bg-accent-bright shadow-[0_0_10px_rgba(66,168,120,0.35)]"
              />

              {e.askNew}
            </p>
          </div>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            {e.desc}
          </p>

          {/* Factors */}
          <div className="mt-10">
            <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              {e.factorsTitle}
            </p>

            <FactorChecklist factors={e.factors} />
          </div>
        </Reveal>

        {/* ---------------------------------------------------------------- */}
        {/* RIGHT                                                            */}
        {/* ---------------------------------------------------------------- */}

        <Reveal delay={0.1}>
          <DecisionBoard />
        </Reveal>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* FACTOR CHECKLIST                                                           */
/* -------------------------------------------------------------------------- */

function FactorChecklist({
  factors,
}: {
  factors: string[]
}) {
  const ref = useRef<HTMLDivElement>(null)

  const inView = useInView(ref, {
    once: true,
    margin: '-120px',
  })

  const [checkedIndex, setCheckedIndex] = useState(-1)

  useEffect(() => {
    if (!inView) return

    setCheckedIndex(-1)

    const timers = factors.map((_, i) =>
      window.setTimeout(() => {
        setCheckedIndex(i)
      }, (i + 1) * 1000),
    )

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [inView, factors.length])

  return (
    <div
      ref={ref}
      className="mt-5 border-t border-line"
    >
      <ul className="divide-y divide-line">
        {factors.map((factor, i) => {
          const checked = checkedIndex >= i

          return (
            <motion.li
              key={factor}
              initial={{
                opacity: 0,
                x: -8,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.3,
                delay: i * 0.025,
              }}
              className="flex min-h-12 items-center justify-between gap-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="w-6 shrink-0 text-xs tabular-nums text-muted-foreground">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <SpringCheck
                  key={`${factor}-${checked}`}
                  label={factor}
                  defaultChecked={checked}
                  color="#f0f2ed"
                  fillColor="#1f6b3a"
                  checkColor="#090b09"
                  boxSize={24}
                  boxRadius={7}
                  fontSize={15}
                  bounce={0.2}
                  doneOpacity={1}
                />
              </div>

              <motion.span
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-full bg-accent-bright"
                initial={{
                  opacity: 0,
                  scale: 0,
                }}
                animate={
                  checked
                    ? {
                        opacity: 0.8,
                        scale: 1,
                      }
                    : {
                        opacity: 0,
                        scale: 0,
                      }
                }
                transition={{
                  duration: 0.25,
                }}
              />
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* DECISION BOARD                                                             */
/* -------------------------------------------------------------------------- */

function DecisionBoard() {
  const { t } = useSite()
  const e = t.economics

  const ref = useRef<HTMLDivElement>(null)

  const inView = useInView(ref, {
    once: true,
    margin: '-120px',
  })

  /*
   * 0 → evaluate A
   * 1 → evaluate B
   * 2 → evaluate C
   * 3 → final decision
   *
   * 2.5 seconds per stage.
   */
  const step = useSequence(
    e.options.length + 1,
    2500,
    inView,
  )

  const decided = step >= e.options.length

  return (
    <div
      ref={ref}
      className="relative"
    >
      {/* Engine heading */}
      <motion.div
        initial={{
          opacity: 0,
          y: 8,
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
          duration: 0.5,
        }}
        className="mb-4 flex items-center gap-3"
      >
        <motion.span
          className="size-2 rounded-full bg-accent-bright"
          animate={{
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <span className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          {e.origin}
        </span>

        <span
          aria-hidden="true"
          className="h-px flex-1 bg-line"
        />
      </motion.div>

      {/* Waste origin */}
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
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
          duration: 0.5,
          delay: 0.15,
        }}
        className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-line-strong bg-surface p-4 md:p-5"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <MapPin
              className="size-5"
              aria-hidden="true"
            />
          </span>

          <div>
            <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
              {e.origin}
            </p>

            <p className="font-semibold">
              {e.originDetail}
            </p>
          </div>
        </div>

        <span className="hidden rounded-full border border-line px-3 py-1 text-xs text-muted-foreground sm:block">
          {e.illustrative}
        </span>
      </motion.div>

      {/* Destination options */}
      <div className="space-y-3">
        {e.options.map((o) => {
          const evaluated = step >= Number(o.id === 'A' ? 0 : o.id === 'B' ? 1 : 2)
          const evaluating = step === Number(o.id === 'A' ? 0 : o.id === 'B' ? 1 : 2)

          const best =
            o.id === 'C' &&
            evaluated

          const rejected =
            evaluated &&
            !best

          return (
            <DecisionCard
              key={o.id}
              option={o}
              evaluated={evaluated}
              evaluating={evaluating}
              rejected={rejected}
              best={best}
              labels={e}
            />
          )
        })}
      </div>

      {/* Final decision */}
      <motion.div
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={
          decided
            ? {
                opacity: 1,
                y: 0,
              }
            : {
                opacity: 0,
                y: 12,
              }
        }
        transition={{
          duration: 0.6,
          delay: 0.2,
        }}
        className="mt-5 flex items-center gap-3"
      >
        <span
          aria-hidden="true"
          className="h-px flex-1 bg-accent-bright/50"
        />

        <span className="flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-accent-bright uppercase">
          <Check
            className="size-3.5"
            aria-hidden="true"
          />
          {e.best}
        </span>

        <span
          aria-hidden="true"
          className="h-px flex-1 bg-accent-bright/50"
        />
      </motion.div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* DECISION CARD                                                              */
/* -------------------------------------------------------------------------- */

function DecisionCard({
  option,
  evaluated,
  evaluating,
  rejected,
  best,
  labels,
}: {
  option: EconomicsOption
  evaluated: boolean
  evaluating: boolean
  rejected: boolean
  best: boolean
  labels: EconomicsLabels
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={
        rejected
          ? {
              opacity: 0.28,
              y: 0,
              scale: 0.975,
            }
          : {
              opacity: 1,
              y: 0,
              scale: best ? 1.015 : 1,
            }
      }
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        'relative overflow-hidden rounded-xl border bg-background transition-colors duration-500',
        best
          ? 'border-accent-bright bg-primary/60 shadow-[0_0_32px_rgba(66,168,120,0.15)]'
          : 'border-line',
      )}
    >
      {/* Winner glow */}
      {best && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 bg-accent-bright/[0.035]"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.6,
          }}
        />
      )}

      <div className="relative p-4 md:p-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={cn(
                'flex size-8 shrink-0 items-center justify-center rounded-md border text-sm font-semibold',
                best
                  ? 'border-accent-bright text-accent-bright'
                  : 'border-line-strong text-foreground',
              )}
            >
              {option.id}
            </span>

            <div className="min-w-0">
              <p className="truncate font-semibold">
                {option.name}
              </p>

              <p className="mt-0.5 text-sm text-muted-foreground">
                {evaluated
                  ? option.distance
                  : 'Evaluating destination…'}
              </p>
            </div>
          </div>

          {/* Evaluation state */}
          <div
            className="shrink-0"
            aria-live="polite"
          >
            {evaluating && !best && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Loader2
                  className="size-3.5 animate-spin"
                  aria-hidden="true"
                />

                {labels.evaluating}
              </span>
            )}

            {rejected && (
              <motion.span
                initial={{
                  opacity: 0,
                  scale: 0.7,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 18,
                }}
              >
                <X
                  className="size-4 text-muted-foreground"
                  aria-label="Not selected"
                />
              </motion.span>
            )}

            {best && (
              <motion.span
                initial={{
                  opacity: 0,
                  scale: 0.7,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 18,
                }}
                className="flex items-center gap-1.5 rounded-full bg-accent-bright px-2.5 py-1 text-xs font-semibold text-background"
              >
                <Check
                  className="size-3.5"
                  aria-hidden="true"
                />

                {labels.best}
              </motion.span>
            )}
          </div>
        </div>

        {/* Verdict */}
        <FoldText
          key={`fold-${option.id}-${evaluated}`}
          show={evaluated}
        >
          <div
            className={cn(
              'mt-3 flex items-center gap-2 border-t pt-3 text-xs font-semibold tracking-[0.08em] uppercase',
              best
                ? 'border-accent-bright/30 text-accent-bright'
                : 'border-line text-muted-foreground',
            )}
          >
            <span
              className={cn(
                'flex size-5 shrink-0 items-center justify-center rounded-full',
                best
                  ? 'bg-accent-bright text-background'
                  : 'border border-line-strong',
              )}
            >
              {best ? (
                <Check
                  className="size-3"
                  aria-hidden="true"
                />
              ) : (
                <X
                  className="size-3"
                  aria-hidden="true"
                />
              )}
            </span>

            <span>{option.verdict}</span>
          </div>
        </FoldText>

        {/* Winner metrics */}
        <motion.div
          initial={{
            opacity: 0,
            height: 0,
          }}
          animate={
            best
              ? {
                  opacity: 1,
                  height: 'auto',
                }
              : {
                  opacity: 0,
                  height: 0,
                }
          }
          transition={{
            duration: 0.5,
            delay: 0.15,
          }}
          className="overflow-hidden"
        >
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-accent-bright/20 pt-4">
            <MiniMetric
              label={labels.metrics.distance}
              value={option.distance}
            />

            <MiniMetric
              label={labels.metrics.cost}
              value={option.cost}
            />

            <MiniMetric
              label={labels.metrics.value}
              value={option.value}
              percentage
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/* FOLD TEXT                                                                  */
/* -------------------------------------------------------------------------- */

function FoldText({
  show,
  children,
}: {
  show: boolean
  children: React.ReactNode
}) {
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

/* -------------------------------------------------------------------------- */
/* METRIC                                                                     */
/* -------------------------------------------------------------------------- */

function MiniMetric({
  label,
  value,
  percentage,
}: {
  label: string
  value: string | number
  percentage?: boolean
}) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </p>

      {percentage ? (
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-line">
          <motion.span
            className="block h-full rounded-full bg-accent-bright"
            initial={{
              width: 0,
            }}
            animate={{
              width: `${value}%`,
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </div>
      ) : (
        <p className="mt-1 text-sm font-semibold tabular-nums">
          {value}
        </p>
      )}
    </div>
  )
}
