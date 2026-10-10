
'use client'

import { Reveal } from '@/components/motion/primitives'
import { SectionHeading } from '@/components/brand/brand'
import { useSite } from '@/components/site/site-provider'
import { SectionWaves } from '@/components/backgrounds/SectionWaves'
import BorderGlow from '@/components/ui/BorderGlow'
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  Network,
  Layers,
  ShieldCheck,
} from 'lucide-react'

export function Solution() {
  const { t } = useSite()
  const s = t.solution

  const flowNodes = [
    {
      title: s.generator,
      role: 'Source',
      icon: Layers,
      status: 'Active',
      image: '/images/solutions/solution-source.png',
    },
    {
      title: s.system,
      role: 'Intelligence Layer',
      icon: Sparkles,
      status: s.chosen,
      highlight: true,
      image: '/images/solutions/solution-intelligence%20layer.png',
    },
    {
      title: s.collector,
      role: 'Logistics',
      icon: Network,
      status: 'Coordinated',
      image: '/images/solutions/solution-logistics.png',
    },
    {
      title: s.processor,
      role: 'Destination',
      icon: ShieldCheck,
      status: 'Renewed',
      image: '/images/solutions/solution-destination.png',
    },
  ]

  return (
    <section
      id="solution"
      aria-labelledby="solution-title"
      className="relative overflow-hidden border-t border-line bg-background py-24 md:py-32"
    >
      <SectionWaves variant="subtle" />

      {/* Subtle ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-1/3 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(66,168,120,0.4), transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-8">
        {/* Section Heading */}
        <Reveal>
          <SectionHeading
            id="solution-title"
            eyebrow={s.eyebrow}
            title={s.title}
            desc={s.desc}
          />
        </Reveal>

        {/* 4-Node Intelligent Flow Representation */}
        <Reveal delay={0.15} className="mt-16 md:mt-20">
          <div className="relative rounded-2xl border border-line bg-surface/60 p-6 backdrop-blur-md md:p-10">
            <div className="grid gap-6 md:grid-cols-4 md:gap-4">
              {flowNodes.map((node, idx) => {
                const Icon = node.icon

                return (
                  <div
                    key={node.role}
                    className="relative flex flex-col items-center text-center"
                  >
                    {/* Node Card */}
                    <div
                      className={`relative flex w-full flex-col items-center overflow-hidden rounded-xl border p-5 transition-all duration-300 ${
                        node.highlight
                          ? 'border-teal/50 shadow-[0_0_24px_rgba(66,168,120,0.15)]'
                          : 'border-line/70'
                      }`}
                    >
                      {/* Background image */}
                      <img
                        src={node.image}
                        alt=""
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover grayscale"
                      />

                      {/* Dark green tint */}
                      <div
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-0 z-10 ${
                          node.highlight
                            ? 'bg-[#062b16]/75'
                            : 'bg-[#062b16]/70'
                        }`}
                      />

                      {/* Additional contrast gradient */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#090b09]/20 via-transparent to-[#090b09]/40"
                      />

                      {/* Icon */}
                      <div
                        className={`relative z-20 flex size-12 items-center justify-center rounded-lg border ${
                          node.highlight
                            ? 'border-teal bg-[#0f3e1e]/90 text-warm'
                            : 'border-line bg-[#090b09]/80 text-soft'
                        }`}
                      >
                        <Icon className="size-7" />
                      </div>

                      {/* Role */}
                      <span className="relative z-20 mt-3 text-[18px] font-semibold uppercase tracking-[0.2em] text-soft">
                        {node.role}
                      </span>

                      {/* Title */}
                      <h4 className="relative z-20 mt-1 text-2xl font-semibold text-warm">
                        {node.title}
                      </h4>

                      {/* Status */}
                      <span
                        className={`relative z-20 mt-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[18px] font-medium ${
                          node.highlight
                            ? 'border-teal/30 bg-[#0f3e1e]/95 text-teal'
                            : 'border-line bg-[#090b09]/90 text-soft/80'
                        }`}
                      >
                        {node.status}
                      </span>
                    </div>

                    {/* Desktop connector arrow */}
                    {idx < flowNodes.length - 1 && (
                      <div
                        aria-hidden="true"
                        className="absolute -right-3 top-1/2 z-20 hidden -translate-y-1/2 text-soft/40 md:block"
                      >
                        <ArrowRight className="size-6" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Evaluation Status Banner */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 border-t border-line/60 pt-6 text-lg text-soft md:gap-8">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-soft/50" />
                <span>{s.evaluated}</span>
              </div>

              <div className="flex items-center gap-2">
                <XCircle className="size-5 text-soft/70" />
                <span>{s.rejected}</span>
              </div>

              <div className="flex items-center gap-2 font-medium text-teal">
                <CheckCircle2 className="size-5 text-teal" />
                <span>{s.chosen}</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Comparison: Marketplace vs PunarChakra */}
        <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2 md:gap-8">
          {/* Marketplace Card */}
          <Reveal delay={0.25}>
            <div className="relative h-full rounded-2xl border border-line bg-surface/40 p-8 backdrop-blur-sm">
              <span className="text-[18px] font-semibold uppercase tracking-[0.2em] text-soft">
                Standard approach
              </span>

              <h3 className="mt-2 text-4xl font-semibold tracking-tight text-warm">
                {s.marketplaceTitle}
              </h3>

              <p className="mt-4 text-2xl leading-relaxed text-soft">
                {s.marketplaceDesc}
              </p>

              <div className="mt-8 flex items-center gap-2 text-lg text-soft/60">
                <span className="size-2 rounded-full bg-soft/40" />
                <span>Passive directory model</span>
              </div>
            </div>
          </Reveal>

          {/* PunarChakra Card */}
          <Reveal delay={0.35}>
            <BorderGlow
              glowColor="#42a878"
              borderRadius={16}
              glowRadius={40}
              className="relative h-full overflow-hidden rounded-2xl border border-teal/40 bg-forest/20 p-8 shadow-[0_0_35px_rgba(66,168,120,0.08)] backdrop-blur-sm"
            >
              <div className="relative z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/40 bg-teal/15 px-3 py-1 text-[18px] font-semibold uppercase tracking-[0.2em] text-teal">
                  <Sparkles className="size-5" />
                  Active engine
                </span>

                <h3 className="mt-3 text-4xl font-semibold tracking-tight text-warm">
                  {s.systemTitle}
                </h3>

                <p className="mt-4 text-2xl leading-relaxed text-soft">
                  {s.systemDesc}
                </p>

                <div className="mt-8 flex items-center gap-2 text-lg text-teal">
                  <CheckCircle2 className="size-5" />
                  <span>Autonomous evaluation &amp; end-to-end routing</span>
                </div>
              </div>
            </BorderGlow>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
