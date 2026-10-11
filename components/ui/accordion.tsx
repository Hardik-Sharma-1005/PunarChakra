'use client'

import React, { createContext, useContext, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionContextType {
  openItems: string[]
  toggleItem: (value: string) => void
}

const AccordionContext = createContext<AccordionContextType | null>(null)

export function Accordion({
  children,
  defaultValue = [],
  className = '',
}: {
  children: React.ReactNode
  defaultValue?: string[]
  className?: string
}) {
  const [openItems, setOpenItems] = useState<string[]>(defaultValue)

  const toggleItem = (val: string) => {
    setOpenItems((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    )
  }

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={cn('divide-y divide-line', className)}>{children}</div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemContextType {
  value: string
  isOpen: boolean
}

const AccordionItemContext = createContext<AccordionItemContextType | null>(null)

export function AccordionItem({
  value,
  children,
  className = '',
}: {
  value: string
  children: React.ReactNode
  className?: string
}) {
  const ctx = useContext(AccordionContext)
  const isOpen = ctx?.openItems.includes(value) ?? false

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div className={cn('border-b border-line py-1 transition-colors', className)}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

export function AccordionTrigger({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const itemCtx = useContext(AccordionItemContext)
  const rootCtx = useContext(AccordionContext)

  if (!itemCtx || !rootCtx) return null

  return (
    <button
      type="button"
      onClick={() => rootCtx.toggleItem(itemCtx.value)}
      aria-expanded={itemCtx.isOpen}
      className={cn(
        'flex w-full items-center justify-between py-5 text-left font-medium text-foreground transition-all hover:text-accent-bright group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm',
        className
      )}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn(
          'size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:text-foreground',
          itemCtx.isOpen && 'rotate-180 text-accent'
        )}
        aria-hidden="true"
      />
    </button>
  )
}

export function AccordionContent({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const itemCtx = useContext(AccordionItemContext)
  if (!itemCtx) return null

  if (!itemCtx.isOpen) return null

  return (
    <div
      className={cn(
        'overflow-hidden text-sm leading-relaxed text-muted-foreground animate-in fade-in-50 duration-200 pb-5',
        className
      )}
    >
      {children}
    </div>
  )
}
