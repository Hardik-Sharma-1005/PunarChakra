import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { signOutAndRedirectAction } from "@/lib/auth/sign-out";

export default async function PendingPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  if (profile.approvalStatus === "approved") {
    redirect("/dashboard");
  }

  const isRejected = profile.approvalStatus === "rejected";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f5ed] px-4 py-10 text-[#203b2c]">
      <section className="w-full max-w-lg border border-[#d9dfd3] bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f0df] text-3xl">
          {isRejected ? "!" : "⌛"}
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#d97736]">
          Account status
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          {isRejected ? "Application not approved" : "Awaiting approval"}
        </h1>

        <p className="mt-4 text-sm leading-7 text-[#66756a]">
          {isRejected
            ? "Your account application was not approved. Please contact the PunarChakra team for further information."
            : `Hi ${profile.displayName}, your account has been created successfully. The PunarChakra team needs to approve your account before you can access platform features.`}
        </p>

        {!isRejected && (
          <div className="mt-6 border border-[#e8e0c9] bg-[#fbf8ed] p-4 text-left">
            <p className="text-sm font-semibold">What happens next?</p>
            <p className="mt-1 text-sm leading-6 text-[#66756a]">
              Your account is awaiting review. Once approved, you&apos;ll be able
              to access the platform according to your assigned role.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center bg-[#28563b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1f432e]"
          >
            Return to sign in
          </Link>

          <form action={signOutAndRedirectAction}>
            <button
              type="submit"
              className="w-full border border-[#d9dfd3] bg-white px-5 py-3 text-sm font-semibold transition hover:border-[#28563b] hover:bg-[#f5f5ed]"
            >
              Sign out
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}