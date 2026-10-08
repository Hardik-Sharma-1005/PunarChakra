"use client";

import Link from "next/link";
import { useActionState } from "react";

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
    <main className="flex min-h-screen items-center justify-center bg-[#f5f5ed] px-4 py-10 text-[#203b2c]">
      <section className="w-full max-w-md border border-[#d9dfd3] bg-white p-8 shadow-sm sm:p-10">
        <Link
          href="/"
          className="text-sm font-semibold tracking-wide text-[#386747]"
        >
          ← PunarChakra
        </Link>

        <div className="mt-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#d97736]">
            Welcome back
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Sign in to your account
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#66756a]">
            Sign in to manage your recovery activities on PunarChakra.
          </p>
        </div>

        <form action={formAction} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
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
              className="w-full border border-[#d9dfd3] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#386747] focus:ring-2 focus:ring-[#386747]/15"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
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
              className="w-full border border-[#d9dfd3] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#386747] focus:ring-2 focus:ring-[#386747]/15"
            />
          </div>

          {state.message && (
            <p
              role="status"
              className={`text-sm ${
                state.success ? "text-[#386747]" : "text-red-600"
              }`}
            >
              {state.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#28563b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1f432e] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#66756a]">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#386747] underline underline-offset-4 hover:text-[#d97736]"
          >
            Create one
          </Link>
        </p>
      </section>
    </main>
  );
}