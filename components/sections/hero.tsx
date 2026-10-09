'use client'

import { motion } from '@/components/motion/primitives'
import { useSite } from '@/components/site/site-provider'
import { BrandLogo } from '@/components/brand/brand'
import SpecularButton from '@/components/ui/SpecularButton'
import TrueFocus from '@/components/ui/TrueFocus'
import PillNav from '@/components/ui/PillNav'

export function Hero() {
  const { t, introDone, openAuth } = useSite()

  const rise = (delay: number) => ({
    initial: {
      opacity: 0,
      y: 28,
    },
    animate: introDone
      ? {
          opacity: 1,
          y: 0,
        }
      : {
          opacity: 0,
          y: 28,
        },
    transition: {
      duration: 0.9,
      delay: introDone ? 0.5 + delay : 0,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  })

  /* =========================================================
     9-IMAGE STAIRCASE
     ========================================================= */

  const heroSteps = [
    '/images/hero%20steps/step-01.jpeg',
    '/images/hero%20steps/step-02.jpeg',
    '/images/hero%20steps/step-03.jpeg',
    '/images/hero%20steps/step-04.jpeg',
    '/images/hero%20steps/step-05.jpeg',
    '/images/hero%20steps/step-06.jpeg',
    '/images/hero%20steps/step-07.jpeg',
    '/images/hero%20steps/step-08.jpeg',
    '/images/hero%20steps/step-09.jpeg',
  ]

  const columnHeights = [
    'h-[92%]',
    'h-[76%]',
    'h-[58%]',
    'h-[42%]',
    'h-[26%]',
    'h-[42%]',
    'h-[58%]',
    'h-[76%]',
    'h-[92%]',
  ]

  const columnWidths = [
    'w-[11.11%]',
    'w-[11.11%]',
    'w-[11.11%]',
    'w-[11.11%]',
    'w-[11.11%]',
    'w-[11.11%]',
    'w-[11.11%]',
    'w-[11.11%]',
    'w-[11.11%]',
  ]

  return (
    <section
      id="home"
      aria-label="Punarchakra Hero"
      className="
        relative
        min-h-screen
        w-full
        overflow-hidden
        bg-[#090b09]
      "
    >
      {/* =========================================================
          BACKGROUND SYSTEM
          ========================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Soft background glows using strict brand palette */}
        <div className="absolute inset-0 z-0">
          {/* Deep Forest glow */}
          <div
            className="
              absolute
              left-1/2
              top-[-10%]
              h-[55vh]
              w-[70vw]
              -translate-x-1/2
              rounded-full
              bg-[#0f3e1e]/20
              blur-[120px]
            "
          />

          {/* Teal-Green accent glow */}
          <div
            className="
              absolute
              right-[-8%]
              top-[12%]
              h-[42vh]
              w-[30vw]
              rounded-full
              bg-[#42a878]/10
              blur-[120px]
            "
          />

          {/* Living Green lower glow */}
          <div
            className="
              absolute
              bottom-[5%]
              left-[-8%]
              h-[38vh]
              w-[32vw]
              rounded-full
              bg-[#1f6b3a]/15
              blur-[110px]
            "
          />

          {/* Technical grid */}
          <div
            className="
              absolute
              inset-0
              opacity-[0.035]
              [background-image:linear-gradient(rgba(240,242,237,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(240,242,237,0.4)_1px,transparent_1px)]
              [background-size:80px_80px]
            "
          />
        </div>

        {/* =====================================================
            POLYGON LUMINARY SVG (CONSTRAINED)
            ===================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            right-0
            top-[20%]
            z-0
            h-[60%]
            w-[50%]
            max-w-[700px]
            overflow-hidden
            opacity-[0.06]
          "
        >
          <img
            src="/backgrounds/Polygon%20Luminary.svg"
            alt=""
            className="size-full object-contain object-right"
          />
        </div>

        {/* =====================================================
            9-IMAGE STAIRCASE
            ===================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            top-0
            z-[1]
            flex
            h-[78vh]
            w-full
            items-start
            justify-between
            opacity-75
          "
        >
          {heroSteps.map((image, index) => (
            <motion.div
              key={image}
              initial={{
                opacity: 0,
                y: -40,
              }}
              animate={
                introDone
                  ? {
                      opacity: 1,
                      y: 0,
                    }
                  : {
                      opacity: 0,
                      y: -40,
                    }
              }
              transition={{
                duration: 1.1,
                delay: introDone ? 0.15 + index * 0.05 : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`
                relative
                overflow-hidden
                ${columnWidths[index]}
                ${columnHeights[index]}
              `}
            >
              {/* IMAGE */}
              <div
                className="
                  absolute
                  inset-0
                  bg-cover
                  bg-top
                  bg-no-repeat
                  brightness-[0.72]
                  contrast-[1.08]
                "
                style={{
                  backgroundImage: `url(${image})`,
                }}
              />

              {/* OVERLAYS */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-b
                  from-[#090b09]/40
                  via-transparent
                  to-[#090b09]
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-[#0f3e1e]/25
                  mix-blend-multiply
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-[#090b09]/30
                "
              />

              {/* COLUMN SEPARATOR */}
              <div
                className="
                  absolute
                  right-0
                  top-0
                  h-full
                  w-px
                  bg-gradient-to-b
                  from-transparent
                  via-[#42a878]/15
                  to-transparent
                "
              />
            </motion.div>
          ))}
        </div>

        {/* =====================================================
          DARK OVERLAY
          ===================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-[2]
            bg-gradient-to-b
            from-[#090b09]/85
            via-[#090b09]/80
            to-[#090b09]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-[2]
            bg-[radial-gradient(circle_at_center,rgba(9,11,9,0.3)_0%,rgba(9,11,9,0.92)_75%)]
          "
        />
      </div>

      {/* =========================================================
          FOREGROUND WRAPPER
          ========================================================= */}

      <div className="relative z-10 flex min-h-screen w-full flex-col">
        {/* =====================================================
            PERSISTENT TOP NAVIGATION
            ===================================================== */}

        <nav
          aria-label="Primary"
          className="
            relative
            z-30
            flex
            w-full
            items-center
            justify-between
            px-6
            py-6
            md:px-10
          "
        >
          {/* =================================================
              BRAND LOGO (DOCKS TO TOP-LEFT)
              ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: -18,
            }}
            animate={
              introDone
                ? {
                    opacity: 1,
                    x: 0,
                  }
                : {
                    opacity: 0,
                    x: -18,
                  }
            }
            transition={{
              duration: 0.7,
              delay: introDone ? 0.15 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative z-40 shrink-0"
          >
            <BrandLogo />
          </motion.div>

          {/* =================================================
              PILL NAV
              ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: -12,
            }}
            animate={
              introDone
                ? {
                    opacity: 1,
                    y: 0,
                  }
                : {
                    opacity: 0,
                    y: -12,
                  }
            }
            transition={{
              duration: 0.7,
              delay: introDone ? 0.25 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative z-30"
          >
            <PillNav
              items={[
                {
                  label: 'Problem',
                  href: '#problem',
                },
                {
                  label: 'Solution',
                  href: '#solution',
                },
                {
                  label: 'Streams',
                  href: '#streams',
                },
                {
                  label: 'How It Works',
                  href: '#how-it-works',
                },
                {
                  label: 'Economics',
                  href: '#economics',
                },
                {
                  label: 'FAQ',
                  href: '#faq',
                },
              ]}
              baseColor="#1f6b3a"
              pillColor="#090b09"
              hoveredPillTextColor="#f0f2ed"
              pillTextColor="#f0f2ed"
            />
          </motion.div>
        </nav>

        {/* =====================================================
            HERO CONTENT
            ===================================================== */}

        <div
          className="
            relative
            z-10
            flex
            min-h-[calc(100svh-90px)]
            w-full
            items-center
            justify-center
            px-6
            pb-[8vh]
            pt-[clamp(60px,8vh,100px)]
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[min(760px,88vw)]
              text-center
            "
          >
            {/* =================================================
                EYEBROW
                ================================================= */}

            <motion.div
              {...rise(0)}
              className="
                mb-[clamp(18px,2.5vh,28px)]
                flex
                items-center
                justify-center
                gap-3
              "
            >
              <span
                aria-hidden="true"
                className="
                  h-px
                  w-8
                  bg-accent
                "
              />

              <span
                className="
                  text-[clamp(10px,0.8vw,12px)]
                  font-medium
                  uppercase
                  tracking-[0.24em]
                  text-[#aeb8aa]
                "
              >
                {t.hero.eyebrow}
              </span>

              <span
                aria-hidden="true"
                className="
                  h-px
                  w-8
                  bg-accent
                "
              />
            </motion.div>

            {/* =================================================
                MAIN HEADLINE
                ================================================= */}

            <motion.h1
              {...rise(0.05)}
              className="
                mx-auto
                max-w-[820px]
                text-balance
                text-[clamp(42px,5.2vw,76px)]
                font-semibold
                leading-[0.98]
                tracking-[-0.045em]
                text-[#f0f2ed]
              "
            >
              {t.hero.titleA}
              <br />
              <span className="text-[#aeb8aa]">
                {t.hero.titleB}
              </span>
            </motion.h1>

            {/* =================================================
                TRUE FOCUS TAGLINE
                ================================================= */}

            <motion.div
              {...rise(0.18)}
              className="
                mt-[clamp(18px,2.5vh,30px)]
                flex
                items-center
                justify-center
                gap-4
              "
            >
              <span
                aria-hidden="true"
                className="
                  h-0.5
                  w-12
                  bg-accent
                "
              />

              <div
                className="
                  text-[clamp(20px,2vw,30px)]
                  font-semibold
                  tracking-tight
                  text-accent-bright
                "
              >
                <TrueFocus />
              </div>

              <span
                aria-hidden="true"
                className="
                  h-0.5
                  w-12
                  bg-accent
                "
              />
            </motion.div>

            {/* =================================================
                DESCRIPTION
                ================================================= */}

            <motion.p
              {...rise(0.25)}
              className="
                mx-auto
                mt-[clamp(16px,2vh,24px)]
                max-w-[620px]
                text-[clamp(13px,1vw,17px)]
                leading-7
                text-[#aeb8aa]
              "
            >
              {t.hero.desc}
            </motion.p>

            {/* =================================================
                GET STARTED & CTA
                ================================================= */}

            <motion.div
              {...rise(0.34)}
              className="
                mt-[clamp(20px,3vh,32px)]
                flex
                justify-center
              "
            >
              <div
                className="
                  overflow-hidden
                  rounded-xl
                  bg-[#1f6b3a]
                "
              >
                <SpecularButton
                  size="lg"
                  radius={12}
                  tint="#ffffff"
                  tintOpacity={0.12}
                  blur={0}
                  textColor="#f0f2ed"
                  lineColor="#f0f2ed"
                  baseColor="#1f6b3a"
                  intensity={1}
                  shineSize={10}
                  shineFade={40}
                  thickness={1}
                  speed={0.35}
                  followMouse
                  proximity={250}
                  autoAnimate={false}
                  onClick={() => openAuth('register')}
                >
                  {t.hero.primary}
                </SpecularButton>
              </div>
            </motion.div>
          </div>
        </div>

        {/* =====================================================
            BOTTOM FADE
            ===================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            bottom-0
            left-0
            right-0
            z-[2]
            h-[30%]
            bg-gradient-to-t
            from-[#090b09]
            via-[#090b09]/80
            to-transparent
          "
        />

        {/* =====================================================
            BOTTOM TRANSITION LINE
            ===================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            bottom-0
            left-1/2
            z-[3]
            h-px
            w-[70%]
            -translate-x-1/2
            bg-gradient-to-r
            from-transparent
            via-[#42a878]/60
            to-transparent
          "
        />
      </div>
    </section>
  )
}
