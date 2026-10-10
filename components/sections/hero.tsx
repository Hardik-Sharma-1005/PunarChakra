
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
        <div className="absolute inset-0 z-0">
          {/* Deep forest ambient glow */}
          <div
            className="
              absolute
              left-1/2
              top-[-10%]
              h-[55vh]
              w-[70vw]
              -translate-x-1/2
              rounded-full
              bg-[#0f3e1e]/15
              blur-[120px]
            "
          />

          {/* Subtle green accent glow */}
          <div
            className="
              absolute
              right-[-8%]
              top-[12%]
              h-[42vh]
              w-[30vw]
              rounded-full
              bg-[#42a878]/5
              blur-[120px]
            "
          />

          {/* Lower ambient glow */}
          <div
            className="
              absolute
              bottom-[5%]
              left-[-8%]
              h-[38vh]
              w-[32vw]
              rounded-full
              bg-[#1f6b3a]/10
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

        {/* Polygon Luminary background */}
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
            Images retain their natural colours and brightness.
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
            opacity-100
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
              {/* Image: no green blend or extra dark tint */}
              <div
                className="
                  absolute
                  inset-0
                  bg-cover
                  bg-top
                  bg-no-repeat
                  brightness-[1.12]
                  contrast-[1.05]
                "
                style={{
                  backgroundImage: `url("${image}")`,
                }}
              />

              {/* Gentle top-to-bottom fade for text readability */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-b
                  from-[#090b09]/15
                  via-transparent
                  to-[#090b09]/70
                "
              />

              {/* Subtle column separator */}
              <div
                className="
                  absolute
                  right-0
                  top-0
                  h-full
                  w-px
                  bg-gradient-to-b
                  from-transparent
                  via-[#42a878]/20
                  to-transparent
                "
              />
            </motion.div>
          ))}
        </div>

        {/* =====================================================
            GLOBAL READABILITY OVERLAY
            Reduced darkness to preserve image visibility.
            ===================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-[2]
            bg-gradient-to-b
            from-[#090b09]/35
            via-[#090b09]/25
            to-[#090b09]/80
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-[2]
            bg-[radial-gradient(ellipse_at_center,rgba(9,11,9,0.08)_0%,rgba(9,11,9,0.55)_100%)]
          "
        />
      </div>

      {/* =========================================================
          FOREGROUND WRAPPER
          ========================================================= */}

      <div className="relative z-10 flex min-h-screen w-full flex-col">
        {/* Navigation */}
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
          {/* Brand logo */}
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

          {/* Pill navigation */}
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
                { label: 'Problem', href: '#problem' },
                { label: 'Solution', href: '#solution' },
                { label: 'Streams', href: '#streams' },
                { label: 'How It Works', href: '#how-it-works' },
                { label: 'Economics', href: '#economics' },
                { label: 'FAQ', href: '#faq' },
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
              max-w-[min(1200px,96vw)]
              text-center
            "
          >
            {/* Eyebrow */}
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
                className="h-px w-8 bg-accent"
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
                className="h-px w-8 bg-accent"
              />
            </motion.div>

           
{/* Main headline */}

{/* Main headline */}

{/* Main headline */}
<motion.h1
  {...rise(0.05)}
  className="
    mx-auto
    w-full
    max-w-[96vw]
    text-center
    text-[clamp(70px,8.5vw,164px)]
    font-semibold
    leading-[0.98]
    tracking-[-0.045em]
    text-[#f0f2ed]
  "
>
  <span className="block">Waste isn't</span>
  <span className="block">worthless.</span>
  <span className="block text-[#aeb8aa]">It just hasn't</span>
  <span className="block text-[#aeb8aa]">found its next</span>
  <span className="block text-[#aeb8aa]">destination.</span>
</motion.h1>



            {/* Tagline */}
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
                className="h-0.5 w-12 bg-accent"
              />

              <div
                className="
                  text-[clamp(32px,3.5vw,45px)]
                  font-semibold
                  tracking-tight
                  text-accent-bright
                "
              >
                <TrueFocus />
              </div>

              <span
                aria-hidden="true"
                className="h-0.5 w-12 bg-accent"
              />
            </motion.div>

            {/* Description */}
            <motion.p
              {...rise(0.25)}
              className="
                mx-auto
                mt-[clamp(16px,2vh,24px)]
                max-w-[620px]
                text-[clamp(20px,1.6vw,24px)]
                leading-7
                text-[#aeb8aa]
              "
            >
              {t.hero.desc}
            </motion.p>

            {/* Get started CTA */}
            <motion.div
              {...rise(0.34)}
              className="
                mt-[clamp(20px,3vh,32px)]
                flex
                justify-center
              "
            >
              <div className="overflow-hidden rounded-xl bg-[#1f6b3a]">
                
<SpecularButton
  size="lg"
  radius={18}
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

        {/* Bottom fade */}
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

        {/* Bottom transition line */}
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