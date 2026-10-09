'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, ArrowRight, ShieldCheck, UserCheck, CheckCircle2 } from 'lucide-react'
import { useSite } from '@/components/site/site-provider'
import { ChakraMark } from '@/components/brand/brand'

export function AuthModal() {
  const { authOpen, closeAuth, authMode, t, lang } = useSite()
  const [role, setRole] = useState<'generator' | 'collector' | 'processor'>('generator')
  const [submitted, setSubmitted] = useState(false)
  const isHindi = lang === 'hi'

  if (!authOpen) return null

  const isRegister = authMode === 'register'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      closeAuth()
    }, 1800)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuth}
          className="absolute inset-0 bg-[#090b09]/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-2xl md:p-8"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeAuth}
            className="absolute right-5 top-5 rounded-full p-2 text-soft transition-colors hover:bg-surface-raised hover:text-warm"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3">
            <ChakraMark className="size-7 text-teal" />
            <div>
              <h3 className="text-xl font-semibold text-warm">
                {isRegister
                  ? isHindi
                    ? 'पुनर्चक्र में शामिल हों'
                    : 'Join Punarchakra'
                  : isHindi
                  ? 'लॉग इन करें'
                  : 'Welcome Back'}
              </h3>
              <p className="text-xs text-soft">
                {isHindi
                  ? 'कचरा प्रबंधन और मूल्य पुनर्प्राप्ति का सुरक्षित मंच'
                  : 'Secure waste coordination & value recovery'}
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="my-12 flex flex-col items-center justify-center text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-forest/40 text-teal">
                <CheckCircle2 className="size-8" />
              </div>
              <h4 className="mt-4 text-lg font-semibold text-warm">
                {isHindi ? 'सत्यापन संदेश भेजा गया!' : 'Verification Sent!'}
              </h4>
              <p className="mt-2 text-sm text-soft">
                {isHindi
                  ? 'कृपया अपना फ़ोन या ईमेल चेक करें।'
                  : 'Please check your phone or email for the instant login link.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Role Selector (for registration) */}
              {isRegister && (
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-soft">
                    {isHindi ? 'आपकी भूमिका' : 'I am a'}
                  </label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {[
                      {
                        key: 'generator',
                        label: isHindi ? 'उत्पादक' : 'Generator',
                        desc: isHindi ? 'खेत / साइट' : 'Farm / Site',
                      },
                      {
                        key: 'collector',
                        label: isHindi ? 'कलेक्टर' : 'Collector',
                        desc: isHindi ? 'परिवहन' : 'Logistics',
                      },
                      {
                        key: 'processor',
                        label: isHindi ? 'प्रोसेसर' : 'Processor',
                        desc: isHindi ? 'सुविधा' : 'Facility',
                      },
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() =>
                          setRole(item.key as 'generator' | 'collector' | 'processor')
                        }
                        className={`flex flex-col items-center rounded-xl border p-2.5 text-center transition-all ${
                          role === item.key
                            ? 'border-teal bg-forest/40 text-warm shadow-[0_0_12px_rgba(66,168,120,0.15)]'
                            : 'border-line bg-background/50 text-soft hover:border-line-strong'
                        }`}
                      >
                        <span className="text-xs font-semibold">{item.label}</span>
                        <span className="text-[10px] text-soft/70">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input field */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-soft">
                  {isHindi ? 'मोबाइल नंबर या ईमेल' : 'Mobile Number or Email'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  className="mt-2 w-full rounded-xl border border-line bg-background px-4 py-3 text-sm text-warm placeholder-soft/50 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-accent-bright py-3.5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
              >
                <span>
                  {isRegister
                    ? isHindi
                      ? 'आगे बढ़ें'
                      : 'Continue to Onboarding'
                    : isHindi
                    ? 'OTP प्राप्त करें'
                    : 'Get Instant OTP'}
                </span>
                <ArrowRight className="size-4" />
              </button>

              <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-soft/70">
                <ShieldCheck className="size-3.5 text-teal" />
                <span>
                  {isHindi
                    ? 'एंड-टू-एंड एनक्रिप्टेड और सुरक्षित डेटा'
                    : 'End-to-end encrypted & verified chain'}
                </span>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
