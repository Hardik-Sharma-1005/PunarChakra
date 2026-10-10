
'use client'

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

const ROAD_PATH =
  'M 70 150 H 700 C 755 150 755 230 700 230 H 420 C 365 230 365 310 420 310 H 1550 C 1605 310 1605 390 1550 390 H 1280 C 1225 390 1225 470 1280 470 H 1930'




const ROAD_STOPS = [
  { x: 280, y: 150, labelX: 160, labelY: -35 },
  { x: 620, y: 150, labelX: 560, labelY: -35 },
  { x: 500, y: 310, labelX: 360, labelY: 390 },
  { x: 850, y: 310, labelX: 720, labelY: 390 },
  { x: 1150, y: 310, labelX: 1010, labelY: 90 },
  { x: 1500, y: 310, labelX: 1410, labelY: 90 },
  { x: 1380, y: 470, labelX: 1300, labelY: 555 },
  { x: 1730, y: 470, labelX: 1650, labelY: 555 },
]




export function HowItWorks() {
  const { t } = useSite()
  const steps = t.how.steps
  const n = Math.min(steps.length, ROAD_STOPS.length)

  const { progress, active } = useLoopProgress(
    n * 1.6,
    n,
    (p) => Math.round(p * (n - 1)),
  )

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-title"
      className="relative overflow-hidden border-t border-line bg-surface py-24 md:py-32"
    >
      {/* Original background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <img
          src="/backgrounds/Polygon%20Luminary.svg"
          alt=""
          className="pointer-events-none absolute left-1/2 top-1/2 max-h-full max-w-full -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.045]"
        />

        <div
          className="absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.08] blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(66,168,120,0.3), transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionHeading
            id="how-title"
            eyebrow={t.how.eyebrow}
            title={t.how.title}
          />
        </Reveal>

        <Reveal delay={0.1} className="relative mt-16 md:mt-20">
          {/* Desktop road: original SVG geometry and styling preserved */}
          <div className="relative hidden lg:block">
            <svg
              viewBox="0 0 2000 680"
              className="h-auto w-full overflow-visible"
              role="img"
              aria-label="Eight stops on the PunarChakra waste recovery route"
            >
              <defs>
                <filter
                  id="point-glow"
                  x="-300%"
                  y="-300%"
                  width="700%"
                  height="700%"
                >
                  <feGaussianBlur stdDeviation="5" />
                </filter>
              </defs>

              {/* Original road shadow */}
              <path
                d={ROAD_PATH}
                fill="none"
                stroke="#030804"
                strokeWidth="78"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Original outer road edge */}
              <path
                d={ROAD_PATH}
                fill="none"
                stroke="#071b0d"
                strokeWidth="68"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Original brand-green road */}
              <path
                d={ROAD_PATH}
                fill="none"
                stroke="#0f3e1e"
                strokeWidth="58"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Original subtle road highlight */}
              <path
                d={ROAD_PATH}
                fill="none"
                stroke="#477f4d"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="3 13"
                opacity="0.9"
              />

              {/* Original centre markings */}
              <path
                d={ROAD_PATH}
                fill="none"
                stroke="#99a399"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="15 19"
                opacity="0.85"
              />

              {/* Markers: title replaces number; no pulsing marker glow */}
              {steps.slice(0, n).map((step, i) => {
                const point = ROAD_STOPS[i]
                const Icon = ICONS[i] ?? Route

                return (
                  <g key={step.title}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="34"
                      fill="#090b09"
                      stroke="#477f4d"
                      strokeWidth="3"
                    />

                    <foreignObject
                      x={point.x - 22}
                      y={point.y - 22}
                      width="44"
                      height="44"
                    >
                      <div className="flex h-full w-full items-center justify-center text-[#f0f2ed]">
                        <Icon size={28} aria-hidden="true" />
                      </div>
                    </foreignObject>
                  </g>
                )
              })}

              {/* One travelling light */}
              <circle
                r="19"
                fill="#8acb78"
                opacity="0.45"
                filter="url(#point-glow)"
              >
                <animateMotion
                  dur="18s"
                  repeatCount="indefinite"
                  rotate="auto"
                >
                  <mpath href="#animated-road-path" />
                </animateMotion>
              </circle>

              <circle r="8" fill="#c5f4a7">
                <animateMotion
                  dur="18s"
                  repeatCount="indefinite"
                  rotate="auto"
                >
                  <mpath href="#animated-road-path" />
                </animateMotion>
              </circle>

              {/* Same path as the original road */}
              <path
                id="animated-road-path"
                d={ROAD_PATH}
                fill="none"
                stroke="none"
              />
            </svg>

            {/* Content integrated into the map; no separate cards */}
            <div className="pointer-events-none absolute inset-0">
              {steps.slice(0, n).map((step, i) => {
                const point = ROAD_STOPS[i]
                const isActive = i === active

                return (
                  
<motion.div
  key={step.title}
  className="absolute w-[18%] max-w-[280px] min-w-0 break-words"
  style={{
    left: `${(point.labelX / 2000) * 100}%`,
    top: `${(point.labelY / 680) * 100}%`,
  }}
  animate={{ opacity: isActive ? 1 : 0.9 }}
  transition={{ duration: 0.4 }}
>
  <h3
    className="text-[19px] font-semibold tracking-tight xl:text-[22px]"
    style={{
      color: isActive ? '#a8d99b' : '#f0f2ed',
    }}
  >
    {step.title}
  </h3>

  <p className="mt-1.5 max-w-full whitespace-normal break-words text-[15px] leading-relaxed text-[#99a399] xl:text-[17px]">
    {step.desc}
  </p>
</motion.div>

                )
              })}
            </div>
          </div>

          {/* Mobile: compact text integrated with the route */}
          <div className="relative lg:hidden">
            <div
              aria-hidden="true"
              className="absolute bottom-7 left-[27px] top-7 w-1 rounded-full bg-[#0f3e1e]"
            />

            <ol className="relative space-y-8">
              {steps.slice(0, n).map((step, i) => {
                const Icon = ICONS[i] ?? Route
                const isActive = i === active

                return (
                  <motion.li
                    key={step.title}
                    className="relative flex gap-5"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, delay: i * 0.04 }}
                  >
                    <span
                      className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full border-2 bg-[#090b09] text-[#f0f2ed] transition-colors duration-300"
                      style={{
                        borderColor: isActive ? '#a8d99b' : '#477f4d',
                      }}
                    >
                      <Icon size={21} aria-hidden="true" />
                    </span>

                    <div className="min-w-0 flex-1 pt-1.5">
                      <h3
                        className="text-lg font-semibold"
                        style={{
                          color: isActive ? '#a8d99b' : '#f0f2ed',
                        }}
                      >
                        {step.title}
                      </h3>

                      <p className="mt-1.5 text-sm leading-relaxed text-[#99a399]">
                        {step.desc}
                      </p>
                    </div>
                  </motion.li>
                )
              })}
            </ol>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mx-auto mt-14 max-w-3xl border-t border-line-strong pt-6 text-center">
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              PunarChakra evaluates the material, finds realistic options,
              compares their economics, coordinates the chosen route, and
              verifies the final destination.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
