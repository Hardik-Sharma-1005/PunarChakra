'use client'

import React, { createContext, useCallback, useContext, useEffect, useState, useSyncExternalStore } from 'react'
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
const INTRO_STORAGE_KEY = 'punarchakra_intro_seen'
const INTRO_CHANGE_EVENT = 'punarchakra:intro-change'

function subscribeToIntro(callback: () => void) {
  window.addEventListener(INTRO_CHANGE_EVENT, callback)
  return () => window.removeEventListener(INTRO_CHANGE_EVENT, callback)
}

function getIntroSnapshot() {
  return sessionStorage.getItem(INTRO_STORAGE_KEY) === 'true'
}

function getServerIntroSnapshot() {
  return true
}

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const introDone = useSyncExternalStore(
    subscribeToIntro,
    getIntroSnapshot,
    getServerIntroSnapshot,
  )
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const handleSetIntroDone = useCallback((done: boolean) => {
    if (done) {
      sessionStorage.setItem(INTRO_STORAGE_KEY, 'true')
    } else {
      sessionStorage.removeItem(INTRO_STORAGE_KEY)
    }
    window.dispatchEvent(new Event(INTRO_CHANGE_EVENT))
  }, [])

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
