
'use client'

import { Reveal } from '@/components/motion/primitives'
import { SectionHeading } from '@/components/brand/brand'
import { useSite } from '@/components/site/site-provider'
import { SectionWaves } from '@/components/backgrounds/SectionWaves'
import HoloCard from '@/components/ui/HoloCard'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const STREAM_IMAGES = [
  '/illustrations/stream-agriculture.jpg',
  '/illustrations/stream-construction.jpg',
]

export function Streams() {
  const { t } = useSite()
  const s = t.streams

  const streamCards = [
    {
      data: s.agri,
      image: STREAM_IMAGES[0],
      preset: 'cosmos' as const,
      index: 1,
    },
    {
      data: s.cnd,
      image: STREAM_IMAGES[1],
      preset: 'shards' as const,
      index: 2,
    },
  ]

  return (
    <section
      id="streams"
      aria-labelledby="streams-title"
      className="relative overflow-hidden border-t border-line bg-background py-24 md:py-32"
    >
      <SectionWaves variant="subtle" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-8">
        {/* SECTION HEADING */}
        <Reveal>
          <SectionHeading
            id="streams-title"
            eyebrow={s.eyebrow}
            title={s.title}
          />
        </Reveal>

        {/* TWO WASTE STREAMS */}
        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 items-stretch gap-12 md:mt-20 md:grid-cols-2 md:gap-14">
          {streamCards.map(({ data, image, preset, index }, cardIdx) => (
            <Reveal
              key={data.title}
              delay={cardIdx * 0.15}
              className="flex h-full flex-col items-center"
            >
              {/* Holo Card Container */}
              <div className="relative flex w-full justify-center">
                <HoloCard
                  image={image}
                  alt={data.alt || data.title}
                  preset={preset}
                  width={360}
                  radius={22}
                  tiltMax={14}
                  hoverScale={1.04}
                />
              </div>

              {/* Card information */}
              <div className="mt-8 flex w-full max-w-md flex-1 flex-col text-center md:text-left">
                <div className="mb-3 flex items-center justify-center gap-3 md:justify-start">
                  <span className="h-px w-8 bg-teal/60" />

                  <span className="text-sm font-semibold uppercase tracking-[0.24em] text-teal">
                    {data.label || String(index).padStart(2, '0')}
                  </span>

                  <span className="h-px w-8 bg-teal/60" />
                </div>

                <h3 className="text-3xl font-semibold tracking-tight text-warm md:text-4xl">
                  {data.title}
                </h3>

                <p className="mt-3 text-lg leading-relaxed text-soft md:text-xl">
                  {data.desc}
                </p>

                {/* Material items */}
                {data.items && data.items.length > 0 && (
                  <div className="mt-6 rounded-xl border border-line bg-surface/40 p-4 backdrop-blur-sm">
                    <span className="text-base font-semibold uppercase tracking-[0.16em] text-soft">
                      Included materials
                    </span>

                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {data.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-md border border-line bg-background/60 px-3 py-1.5 text-base text-soft"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Outputs / Can become */}
                {data.outputs && data.outputs.length > 0 && (
                  <div className="mt-4 rounded-xl border border-teal/20 bg-forest/20 p-4 backdrop-blur-sm">
                    <span className="inline-flex items-center gap-1.5 text-base font-semibold uppercase tracking-[0.16em] text-teal">
                      <ArrowRight className="size-4" />
                      {s.becomes || 'Can become'}
                    </span>

                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {data.outputs.map((out) => (
                        <span
                          key={out}
                          className="inline-flex items-center gap-1 rounded-md border border-teal/30 bg-teal/10 px-3 py-1.5 text-base font-medium text-warm"
                        >
                          <CheckCircle2 className="size-4 text-teal" />
                          {out}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
