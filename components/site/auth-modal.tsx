'use client'

import { motion, AnimatePresence } from 'motion/react'
import { ArrowRight, ShieldCheck, X } from 'lucide-react'
import { useSite } from '@/components/site/site-provider'
import { ChakraMark } from '@/components/brand/brand'

export function AuthModal() {
  const { authOpen, closeAuth, authMode, lang } = useSite()
  const isHindi = lang === 'hi'

  if (!authOpen) return null

  const isRegister = authMode === 'register'
  const primaryHref = isRegister ? '/register' : '/login'
  const secondaryHref = isRegister ? '/login' : '/register'

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.button
          type="button"
          aria-label={isHindi ? 'मोडल बंद करें' : 'Close account options'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuth}
          className="absolute inset-0 cursor-default bg-[#090b09]/80 backdrop-blur-md"
        />

        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-2xl md:p-8"
        >
          <button
            type="button"
            onClick={closeAuth}
            className="absolute right-5 top-5 rounded-full p-2 text-soft transition-colors hover:bg-surface-raised hover:text-warm"
            aria-label={isHindi ? 'बंद करें' : 'Close modal'}
          >
            <X className="size-5" />
          </button>

          <div className="flex items-center gap-3">
            <ChakraMark className="size-7 text-teal" />
            <div>
              <h3 id="auth-modal-title" className="text-xl font-semibold text-warm">
                {isRegister
                  ? isHindi
                    ? 'पुनर्चक्र में शामिल हों'
                    : 'Join PunarChakra'
                  : isHindi
                    ? 'लॉग इन करें'
                    : 'Welcome Back'}
              </h3>
              <p className="text-xs text-soft">
                {isHindi
                  ? 'अपने मौजूदा खाते से आगे बढ़ें या नया खाता बनाएँ।'
                  : 'Continue to the existing sign-in or registration flow.'}
              </p>
            </div>
          </div>

          <a
            href={primaryHref}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-accent-bright py-3.5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          >
            <span>
              {isRegister
                ? isHindi
                  ? 'रजिस्ट्रेशन जारी रखें'
                  : 'Continue to registration'
                : isHindi
                  ? 'लॉग इन जारी रखें'
                  : 'Continue to sign in'}
            </span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>

          <p className="mt-5 text-center text-sm text-soft">
            {isRegister
              ? isHindi
                ? 'पहले से खाता है?'
                : 'Already have an account?'
              : isHindi
                ? 'नए हैं?'
                : 'New to PunarChakra?'}{' '}
            <a href={secondaryHref} className="font-semibold text-teal underline-offset-4 hover:underline">
              {isRegister
                ? isHindi
                  ? 'लॉग इन करें'
                  : 'Sign in'
                : isHindi
                  ? 'रजिस्टर करें'
                  : 'Create an account'}
            </a>
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-soft/70">
            <ShieldCheck className="size-3.5 text-teal" aria-hidden="true" />
            <span>
              {isHindi
                ? 'खाता सत्यापन और स्वीकृति मौजूदा प्रक्रिया के अनुसार होगी।'
                : 'Account verification and approval follow the existing process.'}
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}