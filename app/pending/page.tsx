import Link from "next/link";
import { redirect } from "next/navigation";
import { CircleAlert, Clock3, Leaf } from "lucide-react";

import { AppBrand } from "@/components/app/app-primitives";
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
  const StatusIcon = isRejected ? CircleAlert : Clock3;

  return (
    <main className="pc-app app-auth-screen">
      <section className="app-status-card">
        <div className="mb-8 flex justify-center">
          <AppBrand />
        </div>

        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#e8efe4] text-[#28563b]">
          <StatusIcon size={30} strokeWidth={1.8} aria-hidden="true" />
        </div>

        <div className="mt-6 text-center">
          <p className="app-eyebrow justify-center">
            <Leaf size={14} aria-hidden="true" />
            Account status
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#203b2c]">
            {isRejected ? "Application not approved" : "Awaiting approval"}
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#66756a]">
            {isRejected
              ? "Your account application was not approved. Please contact the PunarChakra team for further information."
              : `Hi ${profile.displayName}, your account is ready for review. The PunarChakra team needs to approve it before you can access your role's workspace.`}
          </p>
        </div>

        {!isRejected && (
          <div className="mt-7 rounded-2xl border border-[#e8e0c9] bg-[#fbf8ed] p-5">
            <p className="text-sm font-semibold text-[#203b2c]">
              What happens next?
            </p>
            <p className="mt-2 text-sm leading-6 text-[#66756a]">
              Your registration is in the approval queue. Once approved, sign
              in again to continue with your listings or recovery work.
            </p>
          </div>
        )}

        <div className="mt-8 grid gap-3">
          <Link href="/login" className="app-primary w-full">
            Return to sign in
          </Link>

          <form action={signOutAndRedirectAction}>
            <button type="submit" className="app-secondary-button w-full">
              Sign out
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
