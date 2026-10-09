'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { content, type Lang } from '@/lib/content'

type ContentDictionary = (typeof content)['en']

interface SiteContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  t: ContentDictionary
  introDone: boolean
  setIntroDone: (done: boolean) => void
  openAuth: (mode?: 'login' | 'register') => void
  closeAuth: () => void
  authOpen: boolean
  authMode: 'login' | 'register'
}

const SiteContext = createContext<SiteContextType | null>(null)

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const [introDone, setIntroDone] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  useEffect(() => {
    // Check if user previously completed intro
    const stored = sessionStorage.getItem('punarchakra_intro_seen')
    if (stored === 'true') {
      setIntroDone(true)
    }
  }, [])

  const handleSetIntroDone = (done: boolean) => {
    setIntroDone(done)
    if (done) {
      sessionStorage.setItem('punarchakra_intro_seen', 'true')
    }
  }

  const openAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode)
    setAuthOpen(true)
  }

  const closeAuth = () => {
    setAuthOpen(false)
  }

  const t = content[lang]

  return (
    <SiteContext.Provider
      value={{
        lang,
        setLang,
        t,
        introDone,
        setIntroDone: handleSetIntroDone,
        openAuth,
        closeAuth,
        authOpen,
        authMode,
      }}
    >
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) {
    throw new Error('useSite must be used within a SiteProvider')
  }
  return ctx
}
