'use client'

import { Reveal } from '@/components/motion/primitives'
import { SectionHeading } from '@/components/brand/brand'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useSite } from '@/components/site/site-provider'
import { SectionWaves } from '@/components/backgrounds/SectionWaves'

export function Faq() {
  const { t } = useSite()

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative scroll-mt-20 overflow-hidden border-t border-line bg-surface py-24 md:py-32"
    >
      {/* Shared section background */}
      <SectionWaves variant="subtle" />

      {/* Section content */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 px-5 md:grid-cols-[0.8fr_1.2fr] md:px-8">
        <Reveal>
          <SectionHeading
            id="faq-title"
            eyebrow={t.faq.eyebrow}
            title={t.faq.title}
          />
        </Reveal>

        <Reveal delay={0.1}>
          <Accordion
            defaultValue={['item-0']}
            className="border-t border-line-strong"
          >
            {t.faq.items.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`item-${i}`}
                className="border-line-strong"
              >
                <AccordionTrigger className="py-6 text-left text-lg font-semibold hover:no-underline md:text-xl">
                  {item.q}
                </AccordionTrigger>

                <AccordionContent className="pb-6 text-base leading-relaxed text-muted-foreground md:text-lg">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}
