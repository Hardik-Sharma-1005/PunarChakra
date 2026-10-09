'use client'

import { useRef } from 'react'
import {
  Check,
  Clock,
  KeyRound,
  MapPin,
  ReceiptText,
  Route,
} from 'lucide-react'
import {
  motion,
  Reveal,
  useInView,
  useSequence,
} from '@/components/motion/primitives'
import { SectionHeading, ChakraMark } from '@/components/brand/brand'
import { useSite } from '@/components/site/site-provider'
import { cn } from '@/lib/utils'

const PROOF_ICONS = [MapPin, Clock, KeyRound, ReceiptText]

export function Verification() {
  const { t } = useSite()
  const v = t.verify

  const ref = useRef<HTMLDivElement>(null)

  const inView = useInView(ref, {
    once: true,
    margin: '-140px',
  })

  const step = useSequence(v.steps.length, 650, inView)

  const fill =
    step < 0 ? 0 : step / (v.steps.length - 1)

  return (
    <section
      aria-labelledby="verify-title"
      className="relative overflow-hidden border-t border-line py-24 md:py-32"
    >
      {/* ---------------------------------------------------------------- */}
      {/* TECHNICAL ROUTING NETWORK                                       */}
      {/* ---------------------------------------------------------------- */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <svg
          viewBox="0 0 1440 760"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full opacity-[0.075]"
        >
          {/* Primary routing path */}
          <path
            d="M-40 610 C 190 510, 290 650, 470 520 S 790 350, 980 470 S 1260 620, 1480 430"
            fill="none"
            stroke="#0f3e1e"
            strokeWidth="2.5"
          />

          {/* Secondary routing path */}
          <path
            d="M-40 660 C 210 550, 350 710, 520 570 S 810 410, 1010 520 S 1280 670, 1480 500"
            fill="none"
            stroke="#1f6b3a"
            strokeWidth="1.75"
          />

          {/* Fine technical route */}
          <path
            d="M-20 575 C 180 475, 320 580, 500 470 S 760 330, 940 425 S 1210 560, 1460 390"
            fill="none"
            stroke="#42a878"
            strokeWidth="1"
            strokeDasharray="4 14"
            opacity="0.7"
          />

          {/* Route nodes */}
          <circle
            cx="470"
            cy="520"
            r="6"
            fill="#1f6b3a"
          />

          <circle
            cx="980"
            cy="470"
            r="6"
            fill="#42a878"
          />

          <circle
            cx="1260"
            cy="565"
            r="5"
            fill="#0f3e1e"
          />

          {/* Node halos */}
          <circle
            cx="470"
            cy="520"
            r="16"
            fill="none"
            stroke="#1f6b3a"
            strokeWidth="1"
            opacity="0.3"
          />

          <circle
            cx="980"
            cy="470"
            r="18"
            fill="none"
            stroke="#42a878"
            strokeWidth="1"
            opacity="0.28"
          />

          <circle
            cx="1260"
            cy="565"
            r="14"
            fill="none"
            stroke="#0f3e1e"
            strokeWidth="1"
            opacity="0.25"
          />
        </svg>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* CONTENT                                                          */}
      {/* ---------------------------------------------------------------- */}

      <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        {/* ================================================================ */}
        {/* LEFT — VERIFICATION FLOW                                         */}
        {/* ================================================================ */}

        <div ref={ref}>
          <Reveal>
            <SectionHeading
              id="verify-title"
              eyebrow={v.eyebrow}
              title={v.title}
              desc={v.desc}
            />
          </Reveal>

          {/* Timeline */}
          <div className="relative mt-14">
            {/* Timeline track */}
            <div
              aria-hidden="true"
              className="absolute top-5 left-5 h-[calc(100%-2.5rem)] w-0.5 bg-line-strong md:top-5 md:right-[10%] md:left-[10%] md:h-0.5 md:w-auto"
            >
              {/* Mobile progress */}
              <motion.span
                className="absolute inset-0 origin-top bg-accent-bright md:hidden"
                initial={false}
                animate={{
                  scaleY: fill,
                }}
                transition={{
                  duration: 0.6,
                }}
              />

              {/* Desktop progress */}
              <motion.span
                className="absolute inset-0 hidden origin-left bg-accent-bright md:block"
                initial={false}
                animate={{
                  scaleX: fill,
                }}
                transition={{
                  duration: 0.6,
                }}
              />
            </div>

            <ol className="relative grid gap-6 md:grid-cols-5 md:gap-2">
              {v.steps.map((s, i) => {
                const done = step >= i

                return (
                  <li
                    key={s}
                    className="group flex items-center gap-4 md:flex-col md:text-center"
                  >
                    <motion.span
                      className={cn(
                        'relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300',
                        done
                          ? 'border-accent-bright bg-accent-bright text-background'
                          : 'border-line-strong bg-background text-muted-foreground',
                      )}
                      animate={
                        done
                          ? {
                              scale: [1, 1.08, 1],
                            }
                          : {
                              scale: 1,
                            }
                      }
                      transition={{
                        duration: 0.4,
                        delay: 0.05,
                      }}
                    >
                      {done ? (
                        <Check
                          className="size-5"
                          aria-hidden="true"
                        />
                      ) : (
                        <span className="text-sm tabular-nums">
                          {i + 1}
                        </span>
                      )}

                      {/* Active pulse */}
                      {step === i && (
                        <motion.span
                          aria-hidden="true"
                          className="absolute inset-[-6px] rounded-full border border-accent-bright/40"
                          initial={{
                            opacity: 0,
                            scale: 0.8,
                          }}
                          animate={{
                            opacity: [0, 0.7, 0],
                            scale: [0.8, 1.25, 1.35],
                          }}
                          transition={{
                            duration: 1.4,
                            repeat: Infinity,
                            ease: 'easeOut',
                          }}
                        />
                      )}
                    </motion.span>

                    <span
                      className={cn(
                        'text-[15px] font-medium transition-colors',
                        done
                          ? 'text-foreground'
                          : 'text-muted-foreground',
                      )}
                    >
                      {s}
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>

          {/* ============================================================ */}
          {/* VERIFICATION PROOF CARDS                                      */}
          {/* ============================================================ */}

          <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {v.proofs.map((p, i) => {
              const Icon = PROOF_ICONS[i]

              return (
                <motion.li
                  key={p}
                  initial={{
                    opacity: 0,
                    y: 12,
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
                    duration: 0.45,
                    delay: 1.1 + i * 0.1,
                  }}
                  className="group flex flex-col gap-3 rounded-lg border border-line bg-background/70 p-4 backdrop-blur-sm"
                >
                  <Icon
                    className="size-5 text-accent-bright transition-transform duration-300 group-hover:scale-110"
                    aria-hidden="true"
                  />

                  <span className="text-sm font-medium">
                    {p}
                  </span>
                </motion.li>
              )
            })}
          </ul>

          {/* ============================================================ */}
          {/* TECHNICAL STATUS                                             */}
          {/* ============================================================ */}

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={
              inView
                ? {
                    opacity: 1,
                  }
                : {}
            }
            transition={{
              delay: 1.7,
            }}
            className="mt-8 flex items-center gap-3 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase"
          >
            <Route
              className="size-4 text-accent-bright"
              aria-hidden="true"
            />

            <span>Traceable chain of custody</span>

            <span
              aria-hidden="true"
              className="h-px flex-1 bg-line-strong"
            />
          </motion.div>
        </div>

        {/* ================================================================ */}
        {/* RIGHT — DIGITAL RECEIPT                                          */}
        {/* ================================================================ */}

        <Reveal
          delay={0.15}
          className="lg:pt-10"
        >
          <Receipt
            show={step >= v.steps.length - 1}
          />
        </Reveal>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* DIGITAL RECEIPT                                                            */
/* -------------------------------------------------------------------------- */

function Receipt({
  show,
}: {
  show: boolean
}) {
  const { t } = useSite()
  const r = t.verify.receipt

  const rows = [
    [r.material, r.materialValue],
    [r.pickup, r.pickupValue],
    [r.time, r.timeValue],
    [r.otp, r.otpValue],
    [r.processor, r.processorValue],
  ] as const
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
        rotate: -3,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: -1.5,
      }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative mx-auto max-w-sm rounded-md bg-foreground p-6 text-background shadow-[0_30px_80px_-30px_rgb(0_0_0/0.6)] md:p-7"
    >
      {/* Receipt header */}
      <div className="flex items-center justify-between border-b border-dashed border-background/25 pb-4">
        <div className="flex items-center gap-2">
          <ChakraMark className="size-6" />

          <span className="font-semibold">
            {r.title}
          </span>
        </div>

        <span className="font-mono text-sm opacity-70">
          {r.id}
        </span>
      </div>

      {/* Receipt data */}
      <dl className="divide-y divide-dashed divide-background/20">
        {rows.map(([k, val], i) => (
          <div
            key={k}
            className="flex items-center justify-between gap-4 py-3 text-sm"
          >
            <dt className="opacity-65">
              {k}
            </dt>

            <dd
              className={cn(
                'text-right font-semibold',
                i >= 3 && 'flex items-center gap-1.5',
              )}
            >
              {i >= 3 && (
                <Check
                  className="size-4 text-primary"
                  aria-hidden="true"
                />
              )}

              {val}
            </dd>
          </div>
        ))}
      </dl>

      {/* QR / receipt footer */}
      <div className="mt-4 flex items-center gap-4 border-t border-dashed border-background/25 pt-5">
        <QrPattern />

        <p className="text-sm opacity-70">
          {r.scan}
        </p>
      </div>

      {/* Verified stamp */}
      <motion.span
        aria-hidden="true"
        className="absolute -top-4 -right-4 flex size-20 rotate-12 items-center justify-center rounded-full border-2 border-accent bg-background text-center text-[11px] leading-tight font-bold tracking-wide text-accent-bright uppercase"
        initial={{
          opacity: 0,
          scale: 1.6,
        }}
        animate={
          show
            ? {
                opacity: 1,
                scale: 1,
              }
            : {
                opacity: 0,
                scale: 1.6,
              }
        }
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 18,
        }}
      >
        {r.processorValue}
      </motion.span>

      {/* Bottom verified indicator */}
      <motion.div
        initial={{
          opacity: 0,
          width: 0,
        }}
        animate={
          show
            ? {
                opacity: 1,
                width: '100%',
              }
            : {
                opacity: 0,
                width: 0,
              }
        }
        transition={{
          duration: 0.7,
          delay: 0.15,
        }}
        className="absolute bottom-0 left-0 h-1 rounded-b-md bg-accent-bright"
      />
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/* QR PATTERN                                                                 */
/* -------------------------------------------------------------------------- */

const QR_SIZE = 11

const QR_CELLS = Array.from(
  {
    length: QR_SIZE * QR_SIZE,
  },
  (_, i) => {
    const x = i % QR_SIZE
    const y = Math.floor(i / QR_SIZE)

    const inFinder = (
      fx: number,
      fy: number,
    ) =>
      x >= fx &&
      x < fx + 3 &&
      y >= fy &&
      y < fy + 3

    if (
      inFinder(0, 0) ||
      inFinder(8, 0) ||
      inFinder(0, 8)
    ) {
      return true
    }

    return (
      (x * 7 + y * 13 + x * y) % 5 <
      2
    )
  },
)

function QrPattern() {
  return (
    <svg
      viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`}
      className="size-16 shrink-0"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      {QR_CELLS.map((on, i) =>
        on ? (
          <rect
            key={i}
            x={i % QR_SIZE}
            y={Math.floor(i / QR_SIZE)}
            width="1"
            height="1"
            fill="currentColor"
          />
        ) : null,
      )}
    </svg>
  )
}
