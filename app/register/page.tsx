"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  Building2,
  CheckCircle2,
  Factory,
  Leaf,
  LockKeyhole,
  Truck,
} from "lucide-react";

import { AppBrand } from "@/components/app/app-primitives";
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
    description: "List reusable construction materials.",
    Icon: Building2,
  },
  {
    value: "collector",
    label: "Collector",
    description: "Find and accept collection jobs.",
    Icon: Truck,
  },
  {
    value: "processor",
    label: "Processor / Buyer",
    description: "Source and receive material.",
    Icon: Factory,
  },
] as const;

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(
    signUpAction,
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
              Build a better material loop
            </span>
            <h1>Join the Recovery Ecosystem</h1>
            <p>
              Connect your work to a clearer path for construction materials,
              from the first listing to recovery.
            </p>
          </div>

          <div className="app-auth-story-note">
            <CheckCircle2 size={19} aria-hidden="true" />
            <span>
              Your role helps us show the right recovery tools. Platform access
              still follows the existing approval process.
            </span>
          </div>
        </aside>

        <section className="app-auth-card">
          <header className="mb-7">
            <p className="app-eyebrow">Create an account</p>
            <h2 className="mt-2">Start with your role</h2>
            <p className="mt-3 text-sm leading-6 text-[#66756a]">
              Choose the work you do, then add your account details.
            </p>
          </header>

          <form action={formAction} className="space-y-6">
            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-[#203b2c]">
                I am joining as <span aria-hidden="true">*</span>
              </legend>

              <div className="app-role-grid">
                {registrationRoles.map(({ value, label, description, Icon }) => (
                  <label key={value} className="app-role-option">
                    <input
                      type="radio"
                      name="role"
                      value={value}
                      required
                      aria-label={label}
                    />
                    <span className="app-role-icon" aria-hidden="true">
                      <Icon size={21} strokeWidth={2} />
                    </span>
                    <span className="app-role-copy">
                      <strong>{label}</strong>
                      <span>{description}</span>
                    </span>
                  </label>
                ))}

                <div
                  className="app-role-option app-role-option--restricted"
                  aria-disabled="true"
                  aria-label="Administrator, restricted to approved platform staff"
                >
                  <span className="app-role-icon" aria-hidden="true">
                    <LockKeyhole size={20} strokeWidth={2} />
                  </span>
                  <span className="app-role-copy">
                    <strong>Administrator</strong>
                    <span>For approved platform staff only.</span>
                  </span>
                </div>
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="displayName"
                  className="mb-2 block text-sm font-semibold text-[#203b2c]"
                >
                  Full name <span aria-hidden="true">*</span>
                </label>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={100}
                  placeholder="Your full name"
                  className="px-4 py-3 text-sm outline-none transition focus:border-[#386747] focus:ring-2 focus:ring-[#386747]/15"
                />
              </div>

              <div>
                <label
                  htmlFor="organizationName"
                  className="mb-2 block text-sm font-semibold text-[#203b2c]"
                >
                  Organization
                </label>
                <input
                  id="organizationName"
                  name="organizationName"
                  type="text"
                  autoComplete="organization"
                  maxLength={150}
                  placeholder="Company or organization"
                  className="px-4 py-3 text-sm outline-none transition focus:border-[#386747] focus:ring-2 focus:ring-[#386747]/15"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#203b2c]"
                >
                  Email address <span aria-hidden="true">*</span>
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

              <div className="sm:col-span-2">
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#203b2c]"
                >
                  Password <span aria-hidden="true">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  placeholder="At least 8 characters"
                  className="px-4 py-3 text-sm outline-none transition focus:border-[#386747] focus:ring-2 focus:ring-[#386747]/15"
                />
                <p className="mt-2 text-xs text-[#66756a]">
                  Use at least 8 characters.
                </p>
              </div>
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
              {isPending ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#66756a]">
            Already have an account?{" "}
            <Link href="/login" className="app-inline-link">
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
