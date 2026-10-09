'use client'

import { useTransform } from 'motion/react'
import {
  BadgeCheck,
  Calculator,
  Factory,
  Handshake,
  PackagePlus,
  Route,
  ScanSearch,
  Truck,
} from 'lucide-react'
import { motion, Reveal, useLoopProgress } from '@/components/motion/primitives'
import { SectionHeading } from '@/components/brand/brand'
import { useSite } from '@/components/site/site-provider'
import { cn } from '@/lib/utils'

const ICONS = [
  PackagePlus,
  ScanSearch,
  Route,
  Calculator,
  Handshake,
  Truck,
  Factory,
  BadgeCheck,
]

export function HowItWorks() {
  const { t } = useSite()
  const steps = t.how.steps
  const n = steps.length

  const { progress, active } = useLoopProgress(
    n * 1.6,
    n,
    (p) => Math.round(p * (n - 1)),
  )

  const left = useTransform(
    progress,
    (p) => `${((0.5 + p * (n - 1)) / n) * 100}%`,
  )

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-title"
      className="relative overflow-hidden border-t border-line bg-surface py-24 md:py-32"
    >
      {/* Intelligence / routing background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <img
          src="/backgrounds/Polygon%20Luminary.svg"
          alt=""
          className="absolute left-1/2 top-1/2 max-h-full max-w-full -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.045] pointer-events-none"
        />

        {/* Subtle center glow */}
        <div
          className="absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.08] blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(66,168,120,0.3), transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-8">
        {/* Heading */}
        <Reveal>
          <SectionHeading
            id="how-title"
            eyebrow={t.how.eyebrow}
            title={t.how.title}
          />
        </Reveal>

        {/* Process route */}
        <Reveal delay={0.1} className="relative mt-16 md:mt-20">
          {/* Desktop route */}
          <div
            aria-hidden="true"
            className="absolute top-7 right-[6.25%] left-[6.25%] hidden h-px bg-line-strong lg:block"
          />

          {/* Animated route progress */}
          <motion.span
            aria-hidden="true"
            className="absolute top-7 hidden h-px origin-left bg-accent-bright lg:block"
            style={{
              left: '6.25%',
              width: useTransform(
                progress,
                (p) => `${(p * (n - 1) / n) * 87.5}%`,
              ),
            }}
          />

          {/* Moving intelligence marker */}
          <motion.span
            aria-hidden="true"
            className="absolute top-7 hidden size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-[3px] bg-accent-bright shadow-[0_0_0_6px_color-mix(in_oklab,var(--pc-accent-bright)_16%,transparent),0_0_24px_color-mix(in_oklab,var(--pc-accent-bright)_35%,transparent)] lg:block"
            style={{ left }}
          />

          <ol className="grid gap-0 md:grid-cols-4 md:gap-y-14 lg:grid-cols-8 lg:gap-y-0">
            {steps.map((step, i) => {
              const Icon = ICONS[i]
              const isActive = i === active

              return (
                <li
                  key={step.title}
                  className="relative flex gap-5 pb-9 md:flex-col md:items-center md:pb-0 md:text-center"
                >
                  {/* Mobile connecting line */}
                  {i < n - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-7 top-14 w-px bg-line-strong md:hidden"
                    />
                  )}

                  {/* Tablet connecting lines */}
                  {i % 4 !== 3 && (
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 top-7 hidden h-px w-full bg-line-strong md:block lg:hidden"
                    />
                  )}

                  {/* Step node */}
                  <motion.span
                    className={cn(
                      'relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full border transition-all duration-500',
                      isActive
                        ? 'border-accent-bright bg-accent-bright text-background shadow-[0_0_0_6px_color-mix(in_oklab,var(--pc-accent-bright)_12%,transparent),0_0_28px_color-mix(in_oklab,var(--pc-accent-bright)_20%,transparent)]'
                        : 'border-line-strong bg-background text-secondary',
                    )}
                    animate={
                      isActive
                        ? {
                            scale: [1, 1.06, 1],
                          }
                        : {
                            scale: 1,
                          }
                    }
                    transition={{
                      duration: 0.8,
                      ease: 'easeOut',
                    }}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </motion.span>

                  {/* Step information */}
                  <div className="pt-1.5 md:mt-5 md:px-2 md:pt-0">
                    <p
                      className={cn(
                        'text-[10px] font-semibold tracking-[0.2em] tabular-nums transition-colors duration-500',
                        isActive
                          ? 'text-accent-bright'
                          : 'text-muted-foreground',
                      )}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </p>

                    <h3
                      className={cn(
                        'mt-1 text-base font-semibold tracking-tight transition-all duration-500 md:text-lg',
                        isActive
                          ? 'text-accent-bright'
                          : 'text-foreground',
                      )}
                    >
                      {step.title}
                    </h3>

                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {step.desc}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </Reveal>

        {/* Process summary */}
        <Reveal delay={0.3}>
          <div className="mx-auto mt-14 max-w-3xl border-t border-line-strong pt-6 text-center">
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              Punarchakra evaluates the material, finds realistic options,
              compares their economics, coordinates the chosen route, and
              verifies the final destination.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
