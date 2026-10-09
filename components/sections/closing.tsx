'use client'

import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/motion/primitives'
import { BrandLogo, ChakraMark } from '@/components/brand/brand'
import { useSite } from '@/components/site/site-provider'

export function ClosingCta() {
  const { t, openAuth } = useSite()
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden border-t border-line py-28 md:py-40">
      <div aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2 size-[46rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.07]">
        <ChakraMark className="size-full" spinning />
      </div>
      <Reveal className="relative mx-auto max-w-4xl px-5 text-center md:px-8">
        <h2 id="cta-title" className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance md:text-6xl lg:text-7xl">
          {t.cta.title}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">{t.cta.desc}</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => openAuth('register')}
            className="group inline-flex h-14 items-center justify-center gap-3 rounded-md bg-accent-bright px-8 text-base font-semibold text-background transition-transform hover:-translate-y-0.5 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
          >
            {t.cta.primary}
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </button>
          <a
            href="#how-it-works"
            className="inline-flex h-14 items-center justify-center rounded-md border border-line-strong px-8 text-base font-medium transition-colors hover:bg-surface-raised focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
          >
            {t.cta.secondary}
          </a>
        </div>
      </Reveal>
    </section>
  )
}

// Named alias export for backwards compatibility
export { ClosingCta as closingCta }

export function SiteFooter() {
  const { t } = useSite()
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex items-center gap-5">
          <BrandLogo className="w-36" />
          <span className="text-sm text-muted-foreground">{t.footer.tagline}</span>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <a href="#home" className="hover:text-foreground">{t.nav.home}</a>
          <a href="#about" className="hover:text-foreground">{t.nav.about}</a>
          <a href="#how-it-works" className="hover:text-foreground">{t.hero.secondary}</a>
          <a href="#faq" className="hover:text-foreground">{t.nav.faq}</a>
        </nav>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Punarchakra. {t.footer.rights}
        </p>
      </div>
    </footer>
  )
}
