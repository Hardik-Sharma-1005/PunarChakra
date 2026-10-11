"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight, Leaf } from "lucide-react";

import { AppBrand } from "@/components/app/app-primitives";
import {
  signInAction,
  type AuthActionState,
} from "@/lib/auth/actions";

const initialState: AuthActionState = {
  success: false,
  message: "",
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    signInAction,
    initialState,
  );

  return (
    <main className="pc-app app-auth-screen">
      <div className="app-auth-layout">
        <aside className="app-auth-story">
          <AppBrand inverse />

          <div className="app-auth-story-copy">
            <span className="app-eyebrow text-[#f7b07c]">
              <Leaf size={15} aria-hidden="true" />
              Your recovery work, in one place
            </span>
            <h1>Welcome back to PunarChakra</h1>
            <p>
              Pick up where you left off and see the next step for your
              listings, collections, or incoming material.
            </p>
          </div>

          <div className="app-auth-story-note">
            <ArrowRight size={19} aria-hidden="true" />
            <span>Sign in to open the workspace for your approved role.</span>
          </div>
        </aside>

        <section className="app-auth-card">
          <div className="mb-7">
            <AppBrand />
          </div>

          <header>
            <p className="app-eyebrow">Welcome back</p>
            <h2 className="mt-2">Sign in to your account</h2>
            <p className="mt-3 text-sm leading-6 text-[#66756a]">
              Manage your recovery activity and see what needs attention next.
            </p>
          </header>

          <form action={formAction} className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#203b2c]"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="px-4 py-3 text-sm outline-none transition focus:border-[#386747] focus:ring-2 focus:ring-[#386747]/15"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[#203b2c]"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Enter your password"
                className="px-4 py-3 text-sm outline-none transition focus:border-[#386747] focus:ring-2 focus:ring-[#386747]/15"
              />
            </div>

            {state.message && (
              <p
                role="status"
                className={`text-sm ${
                  state.success ? "text-[#386747]" : "text-red-700"
                }`}
              >
                {state.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="app-primary app-form-submit"
            >
              {isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#66756a]">
            New to the recovery network?{" "}
            <Link href="/register" className="app-inline-link">
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
