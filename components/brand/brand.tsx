'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function BrandLogo({
  className = '',
  priority = false,
  href = '#home',
}: {
  className?: string
  priority?: boolean
  href?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center gap-3 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg',
        className
      )}
      aria-label="Punarchakra Home"
    >
     
<div className="relative h-20 w-auto aspect-[180/48] flex items-center">
  <Image
    src="/brand/punarchakra-logo.png"
    alt="Punarchakra"
    width={200}
    height={68}
    priority={priority}
    className="h-24 w-auto object-contain"
  />
</div>
    </Link>
  )
}

export function ChakraMark({
  className = 'size-6',
  spinning = false,
}: {
  className?: string
  spinning?: boolean
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        'shrink-0 text-accent transition-transform',
        spinning && 'animate-[spin_24s_linear_infinite]',
        className
      )}
      aria-hidden="true"
    >
      {/* Outer concentric flow ring */}
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeDasharray="6 8"
        strokeOpacity="0.4"
      />
      {/* Middle circular cycle */}
      <circle
        cx="50"
        cy="50"
        r="34"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeDasharray="28 12"
        strokeLinecap="round"
      />
      {/* 8-spoke renewal directional spokes */}
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="50" y1="20" x2="50" y2="34" />
        <line x1="50" y1="66" x2="50" y2="80" />
        <line x1="20" y1="50" x2="34" y2="50" />
        <line x1="66" y1="50" x2="80" y2="50" />
        <line x1="28.8" y1="28.8" x2="38.7" y2="38.7" />
        <line x1="61.3" y1="61.3" x2="71.2" y2="71.2" />
        <line x1="28.8" y1="71.2" x2="38.7" y2="61.3" />
        <line x1="61.3" y1="38.7" x2="71.2" y2="28.8" />
      </g>
      {/* Center nucleus */}
      <circle cx="50" cy="50" r="10" fill="currentColor" fillOpacity="0.85" />
      <circle cx="50" cy="50" r="4" fill="#090b09" />
    </svg>
  )
}

export function SectionEyebrow({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface-raised/80 px-3.5 py-1 text-xs font-semibold tracking-wider uppercase text-accent-bright backdrop-blur-sm',
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-accent animate-pulse" />
      {children}
    </div>
  )
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  desc,
  className = '',
}: {
  id?: string
  eyebrow?: string
  title?: string
  description?: string
  desc?: string
  className?: string
}) {
  const bodyText = desc ?? description
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {eyebrow && <SectionEyebrow>{eyebrow}</SectionEyebrow>}
      {title && (
        <h2
          id={id}
          className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-5xl text-balance leading-[1.15]"
        >
          {title}
        </h2>
      )}
      {bodyText && (
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {bodyText}
        </p>
      )}
    </div>
  )
}
