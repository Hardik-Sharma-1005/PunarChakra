'use client'

import { SiteProvider } from '@/components/site/site-provider'
import { IntroCinematic } from '@/components/intro/intro-cinematic'
import { AuthModal } from '@/components/site/auth-modal'
import { Hero } from '@/components/sections/hero'
import { Problem } from '@/components/sections/problem'
import { Solution } from '@/components/sections/solution'
import { Streams } from '@/components/sections/streams'
import { HowItWorks } from '@/components/sections/how-it-works'
import { Economics } from '@/components/sections/economics'
import { Aggregation } from '@/components/sections/aggregation'
import { Verification } from '@/components/sections/verification'
import { Faq } from '@/components/sections/faq'
import { ClosingCta, SiteFooter } from '@/components/sections/closing'

export default function Home() {
  return (
    <SiteProvider>
      {/* 5-Scene Opening Cinematic with Docking */}
      <IntroCinematic />

      {/* Interactive Authentication Modal */}
      <AuthModal />

      {/* Main Landing Page Experience */}
      <div className="relative min-h-screen w-full bg-background text-foreground selection:bg-accent-bright selection:text-black">
        <main>
          {/* 00: Hero with 9-Image Staircase, Pill Nav & Persistent Docking */}
          <Hero />

          {/* 01: The Problem with 3D Carousel & Drag Navigation */}
          <Problem />

          {/* 02: The Solution — listing and recovery handoffs */}
          <Solution />

          {/* 03: Supported C&D materials */}
          <Streams />

          {/* 04: How it works — listing to recovery status */}
          <HowItWorks />

          {/* 05: Matching explanation */}
          <Economics />

          {/* 06: Future concept — load aggregation */}
          <Aggregation />

          {/* 07: Recovery status updates */}
          <Verification />

          {/* 08: Frequently Asked Questions */}
          <Faq />

          {/* 09: Closing Call to Action */}
          <ClosingCta />
        </main>

        {/* Global Footer */}
        <SiteFooter />
      </div>
    </SiteProvider>
  )
}
