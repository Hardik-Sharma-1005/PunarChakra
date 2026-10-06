"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  signUpAction,
  type AuthActionState,
} from "@/lib/auth/actions";

const initialState: AuthActionState = {
  success: false,
  message: "",
};

const registrationRoles = [
  {
    value: "generator",
    label: "Waste Generator",
    description: "I have C&D waste that needs recovery.",
  },
  {
    value: "collector",
    label: "Waste Collector",
    description: "I collect and transport recoverable C&D waste.",
  },
  {
    value: "processor",
    label: "Processor",
    description: "I receive and process recovered materials.",
  },
] as const;

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(
    signUpAction,
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
            Join the recovery network
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Create an account
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#66756a]">
            Register your details to get started with PunarChakra.
          </p>
        </div>

        <form action={formAction} className="mt-8 space-y-5">
          <fieldset>
            <legend className="mb-3 block text-sm font-medium">
              Register as *
            </legend>

            <div className="space-y-3">
              {registrationRoles.map((role) => (
                <label
                  key={role.value}
                  className="flex cursor-pointer items-start gap-3 border border-[#d9dfd3] p-4 transition hover:border-[#386747] has-[:checked]:border-[#386747] has-[:checked]:bg-[#f5f8f3]"
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    required
                    className="mt-1 h-4 w-4 accent-[#28563b]"
                  />

                  <span>
                    <span className="block text-sm font-semibold">
                      {role.label}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-[#66756a]">
                      {role.description}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label
              htmlFor="displayName"
              className="mb-2 block text-sm font-medium"
            >
              Full name *
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              autoComplete="name"
              required
              maxLength={100}
              placeholder="Your full name"
              className="w-full border border-[#d9dfd3] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#386747] focus:ring-2 focus:ring-[#386747]/15"
            />
          </div>

          <div>
            <label
              htmlFor="organizationName"
              className="mb-2 block text-sm font-medium"
            >
              Organization name
            </label>
            <input
              id="organizationName"
              name="organizationName"
              type="text"
              autoComplete="organization"
              maxLength={150}
              placeholder="Company or organization (optional)"
              className="w-full border border-[#d9dfd3] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#386747] focus:ring-2 focus:ring-[#386747]/15"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              Email address *
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
              Password *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              placeholder="At least 8 characters"
              className="w-full border border-[#d9dfd3] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#386747] focus:ring-2 focus:ring-[#386747]/15"
            />
            <p className="mt-2 text-xs text-[#66756a]">
              Use at least 8 characters.
            </p>
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
            {isPending ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#66756a]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#386747] underline underline-offset-4 hover:text-[#d97736]"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}