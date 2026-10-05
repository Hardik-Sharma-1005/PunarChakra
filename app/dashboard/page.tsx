import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { getAdminProfile } from "@/lib/auth/get-admin-profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutAndRedirectAction } from "@/lib/auth/sign-out";
import AdminApprovalPanel from "./admin-approval-panel";
import GeneratorWasteListingForm from "./generator-waste-listing-form";
import GeneratorWasteListings from "./generator-waste-listings";

const roleLabels = {
  generator: "Waste Generator",
  collector: "Waste Collector",
  processor: "Processor",
  admin: "Administrator",
} as const;

export default async function DashboardPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  if (profile.approvalStatus !== "approved") {
    redirect("/pending");
  }

  let pendingAccounts: {
    id: string;
    displayName: string;
    organizationName: string | null;
    role: "generator" | "collector" | "processor" | "admin";
    createdAt: string;
    isSimulated: boolean;
  }[] = [];

  let approvalLoadError = false;

  if (profile.role === "admin") {
    const admin = await getAdminProfile();

    if (!admin) {
      redirect("/login");
    }

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, display_name, organization_name, role, created_at, is_simulated",
      )
      .eq("approval_status", "pending")
      .order("created_at", { ascending: true });

    if (error) {
      approvalLoadError = true;
    } else {
      pendingAccounts = (data ?? []).map((account) => ({
        id: account.id,
        displayName: account.display_name,
        organizationName: account.organization_name,
        role: account.role as
          | "generator"
          | "collector"
          | "processor"
          | "admin",
        createdAt: account.created_at,
        isSimulated: account.is_simulated,
      }));
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f5ed] px-4 py-10 text-[#203b2c] sm:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d9dfd3] pb-6">
          <Link href="/" className="text-xl font-bold tracking-tight">
            PunarChakra
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <span className="border border-[#d9dfd3] bg-white px-4 py-2 text-sm font-medium">
              {roleLabels[profile.role]}
            </span>

            <form action={signOutAndRedirectAction}>
              <button
                type="submit"
                className="border border-[#d9dfd3] bg-white px-4 py-2 text-sm font-semibold transition hover:border-[#28563b] hover:bg-[#f5f5ed]"
              >
                Sign out
              </button>
            </form>
          </div>
        </header>

        <section className="py-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d97736]">
            Your dashboard
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome, {profile.displayName}!
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-[#66756a]">
            Your account is approved. You can now access PunarChakra
            according to your role as a{" "}
            {roleLabels[profile.role].toLowerCase()}.
          </p>
        </section>

        {profile.role === "admin" ? (
          <AdminApprovalPanel
            accounts={pendingAccounts}
            loadError={approvalLoadError}
          />
        ) : profile.role === "generator" ? (
          <div className="space-y-8">
            <GeneratorWasteListingForm />

            <GeneratorWasteListings generatorId={profile.id} />
          </div>
        ) : (
          <section className="border border-[#d9dfd3] bg-white p-6 sm:p-8">
            <h2 className="text-lg font-semibold">Getting started</h2>
            <p className="mt-2 text-sm leading-6 text-[#66756a]">
              Your role-specific tools and recovery activities will appear
              here as the platform is developed.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}