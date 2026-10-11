import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  ClipboardCheck,
  Factory,
  PackageCheck,
  PackagePlus,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { AppBrand, AppMetricCard } from "@/components/app/app-primitives";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { getAdminProfile } from "@/lib/auth/get-admin-profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutAndRedirectAction } from "@/lib/auth/sign-out";
import { getCollectorDiscovery } from "@/lib/collector/discovery";
import { getCollectorActiveRecoveries } from "@/lib/collector/active-recoveries";
import { getProcessorDiscovery } from "@/lib/processor/discovery";
import { getProcessorActiveRecoveries } from "@/lib/processor/active-recoveries";
import type { UserRole } from "@/types/domain";
import AdminApprovalPanel from "./admin-approval-panel";
import CollectorDiscovery from "./collector-discovery";
import CollectorActiveRecoveries from "./collector-active-recoveries";
import CollectorProfileSetup from "./collector-profile-setup";
import GeneratorWasteListingForm from "./generator-waste-listing-form";
import GeneratorWasteListings from "./generator-waste-listings";
import ProcessorDiscovery from "./processor-discovery";
import ProcessorActiveRecoveries from "./processor-active-recoveries";
import ProcessorProfileSetup from "./processor-profile-setup";

const roleLabels: Record<UserRole, string> = {
  generator: "Waste Generator",
  collector: "Collector",
  processor: "Processor / Buyer",
  admin: "Administrator",
};

const roleIcons: Record<UserRole, LucideIcon> = {
  generator: PackagePlus,
  collector: Truck,
  processor: Factory,
  admin: ShieldCheck,
};

const roleDescriptions: Record<UserRole, string> = {
  generator:
    "List recoverable material and follow its collection and recovery progress.",
  collector:
    "Review opportunities that fit your profile and keep accepted collections moving.",
  processor:
    "Review incoming material and record the next supported recovery step.",
  admin:
    "Review account requests and keep platform access moving safely.",
};

const nextStepCopy: Record<UserRole, string> = {
  generator: "Start with the material, quantity, condition, and pickup location.",
  collector:
    "Open opportunities that fit your profile and accept the ones you can handle.",
  processor:
    "Review incoming material, then record receipt when it reaches your facility.",
  admin: "Review pending accounts before granting platform access.",
};

type DashboardMetric = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: "green" | "orange" | "sage";
};

type DashboardNavItem = {
  label: string;
  href: string;
};

function countLabel(count: number | null, hasError: boolean): string {
  if (hasError) return "—";
  return (count ?? 0).toLocaleString("en-IN");
}

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
  let collectorProfileExists = false;
  let processorProfileExists = false;
  let collectorDiscovery = null as Awaited<ReturnType<typeof getCollectorDiscovery>> | null;
  let collectorActiveRecoveries = null as Awaited<
    ReturnType<typeof getCollectorActiveRecoveries>
  > | null;
  let processorDiscovery = null as Awaited<ReturnType<typeof getProcessorDiscovery>> | null;
  let processorActiveRecoveries = null as Awaited<
    ReturnType<typeof getProcessorActiveRecoveries>
  > | null;
  let summaryMetrics: DashboardMetric[] = [];
  let primaryAction = { label: "View your workspace", href: "#overview" };
  let dashboardNav: DashboardNavItem[] = [{ label: "Overview", href: "#overview" }];

  if (profile.role === "admin") {
    const admin = await getAdminProfile();

    if (!admin) {
      redirect("/login");
    }

    const supabase = await createSupabaseServerClient();
    const { data, error, count } = await supabase
      .from("profiles")
      .select(
        "id, display_name, organization_name, role, created_at, is_simulated",
        { count: "exact" },
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

    summaryMetrics = [
      {
        label: "Accounts awaiting review",
        value: countLabel(count, approvalLoadError),
        detail: approvalLoadError
          ? "The approval queue could not be loaded."
          : "Pending account requests",
        icon: ClipboardCheck,
        tone: "orange",
      },
      {
        label: "Simulated accounts in queue",
        value: approvalLoadError
          ? "—"
          : pendingAccounts
              .filter((account) => account.isSimulated)
              .length.toLocaleString("en-IN"),
        detail: "Clearly marked demo records",
        icon: PackageCheck,
        tone: "sage",
      },
    ];
    primaryAction = { label: "Review account requests", href: "#account-approvals" };
    dashboardNav = [
      { label: "Overview", href: "#overview" },
      { label: "Account approvals", href: "#account-approvals" },
    ];
  }

  if (profile.role === "generator") {
    const supabase = await createSupabaseServerClient();
    const [allListings, activeRecoveries, completedRecoveries] = await Promise.all([
      supabase
        .from("waste_listings")
        .select("id", { count: "exact", head: true })
        .eq("generator_id", profile.id),
      supabase
        .from("recovery_transactions")
        .select("id", { count: "exact", head: true })
        .eq("generator_id", profile.id)
        .in("status", [
          "assigned",
          "pickup_in_progress",
          "collected",
          "in_transit",
          "received",
        ]),
      supabase
        .from("recovery_transactions")
        .select("id", { count: "exact", head: true })
        .eq("generator_id", profile.id)
        .eq("status", "completed"),
    ]);

    summaryMetrics = [
      {
        label: "Waste listings",
        value: countLabel(allListings.count, Boolean(allListings.error)),
        detail: "Material you have listed",
        icon: PackagePlus,
        tone: "green",
      },
      {
        label: "Recoveries in progress",
        value: countLabel(activeRecoveries.count, Boolean(activeRecoveries.error)),
        detail: "Transactions moving through collection and receipt",
        icon: Truck,
        tone: "orange",
      },
      {
        label: "Completed recoveries",
        value: countLabel(completedRecoveries.count, Boolean(completedRecoveries.error)),
        detail: "Transactions recorded as completed",
        icon: PackageCheck,
        tone: "sage",
      },
    ];
    primaryAction = { label: "List new waste", href: "#new-listing" };
    dashboardNav = [
      { label: "Overview", href: "#overview" },
      { label: "List new waste", href: "#new-listing" },
      { label: "Your listings", href: "#your-listings" },
    ];
  }

  if (profile.role === "collector") {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("collector_profiles")
      .select("id")
      .eq("user_id", profile.id)
      .maybeSingle();

    collectorProfileExists = Boolean(data);

    if (collectorProfileExists) {
      [collectorDiscovery, collectorActiveRecoveries] = await Promise.all([
        getCollectorDiscovery(),
        getCollectorActiveRecoveries(),
      ]);

      summaryMetrics = [
        {
          label: "Suitable opportunities",
          value: countLabel(
            collectorDiscovery.success ? collectorDiscovery.items.length : null,
            !collectorDiscovery.success,
          ),
          detail: "Ranked using your collection profile",
          icon: Search,
          tone: "orange",
        },
        {
          label: "Active collections",
          value: countLabel(
            collectorActiveRecoveries.success
              ? collectorActiveRecoveries.items.filter(
                  (item) => item.transaction.status !== "completed",
                ).length
              : null,
            !collectorActiveRecoveries.success,
          ),
          detail: "Accepted recovery commitments",
          icon: Truck,
          tone: "green",
        },
      ];
      primaryAction = { label: "Find collection opportunities", href: "#opportunities" };
      dashboardNav = [
        { label: "Overview", href: "#overview" },
        { label: "Opportunities", href: "#opportunities" },
        { label: "Active collections", href: "#active-recoveries" },
      ];
    } else {
      primaryAction = { label: "Set up your collector profile", href: "#profile-setup" };
      dashboardNav = [
        { label: "Overview", href: "#overview" },
        { label: "Profile setup", href: "#profile-setup" },
      ];
    }
  }

  if (profile.role === "processor") {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("processor_profiles")
      .select("id")
      .eq("user_id", profile.id)
      .maybeSingle();

    processorProfileExists = Boolean(data);

    if (processorProfileExists) {
      [processorDiscovery, processorActiveRecoveries] = await Promise.all([
        getProcessorDiscovery(),
        getProcessorActiveRecoveries(),
      ]);

      const incomingCount = processorDiscovery.success
        ? processorDiscovery.items.length
        : null;
      const awaitingReceiptCount = processorActiveRecoveries.success
        ? processorActiveRecoveries.items.filter(
            (item) => item.transaction.status === "in_transit",
          ).length
        : null;

      summaryMetrics = [
        {
          label: "Incoming opportunities",
          value: countLabel(incomingCount, !processorDiscovery.success),
          detail: "Material collected and ready for review",
          icon: Factory,
          tone: "orange",
        },
        {
          label: "Awaiting receipt",
          value: countLabel(awaitingReceiptCount, !processorActiveRecoveries.success),
          detail: "In-transit recoveries for your facility",
          icon: PackageCheck,
          tone: "sage",
        },
        {
          label: "Active recoveries",
          value: countLabel(
            processorActiveRecoveries.success
              ? processorActiveRecoveries.items.filter(
                  (item) => item.transaction.status !== "completed",
                ).length
              : null,
            !processorActiveRecoveries.success,
          ),
          detail: "Reserved for your facility",
          icon: ClipboardCheck,
          tone: "green",
        },
      ];
      primaryAction = { label: "Review incoming material", href: "#opportunities" };
      dashboardNav = [
        { label: "Overview", href: "#overview" },
        { label: "Incoming material", href: "#opportunities" },
        { label: "Active recoveries", href: "#active-recoveries" },
      ];
    } else {
      primaryAction = { label: "Set up your facility profile", href: "#profile-setup" };
      dashboardNav = [
        { label: "Overview", href: "#overview" },
        { label: "Facility setup", href: "#profile-setup" },
      ];
    }
  }

  const RoleIcon = roleIcons[profile.role];
  const initials = profile.displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <main className="pc-app app-dashboard min-h-screen">
      <header className="app-topbar">
        <div className="app-topbar-inner mx-auto flex w-full max-w-[80rem] flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <AppBrand inverse />

          <nav className="app-dashboard-nav" aria-label="Workspace sections">
            {dashboardNav.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="app-user-actions">
            <span className="app-user-avatar" aria-hidden="true">
              {initials || "PC"}
            </span>
            <span className="app-user-name hidden text-sm font-semibold sm:inline">
              {profile.displayName}
            </span>
            <form action={signOutAndRedirectAction}>
              <button type="submit" className="app-signout">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="app-dashboard-content">
        <section id="overview" className="app-welcome" aria-labelledby="dashboard-title">
          <div>
            <span className="app-role-label">
              <RoleIcon size={15} aria-hidden="true" />
              {roleLabels[profile.role]}
            </span>
            <h1 id="dashboard-title">Welcome back, {profile.displayName}</h1>
            <p className="app-welcome-copy">{roleDescriptions[profile.role]}</p>
          </div>

          <div className="app-next-step">
            <p>Your next step</p>
            <p>{nextStepCopy[profile.role]}</p>
            <Link href={primaryAction.href} className="app-primary">
              {primaryAction.label}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </section>

        {summaryMetrics.length > 0 ? (
          <section className="app-metrics" aria-label="Your workspace summary">
            {summaryMetrics.map((metric) => (
              <AppMetricCard key={metric.label} {...metric} />
            ))}
          </section>
        ) : null}

        {profile.role === "admin" ? (
          <AdminApprovalPanel
            accounts={pendingAccounts}
            loadError={approvalLoadError}
          />
        ) : profile.role === "generator" ? (
          <div className="space-y-6">
            <GeneratorWasteListingForm />
            <GeneratorWasteListings generatorId={profile.id} />
          </div>
        ) : profile.role === "collector" ? (
          collectorProfileExists &&
          collectorDiscovery &&
          collectorActiveRecoveries ? (
            <div className="space-y-6">
              <CollectorDiscovery
                items={collectorDiscovery.items}
                loadError={
                  collectorDiscovery.success
                    ? undefined
                    : collectorDiscovery.message
                }
              />
              <CollectorActiveRecoveries
                items={collectorActiveRecoveries.items}
                loadError={
                  collectorActiveRecoveries.success
                    ? undefined
                    : collectorActiveRecoveries.message
                }
              />
            </div>
          ) : (
            <CollectorProfileSetup />
          )
        ) : profile.role === "processor" ? (
          processorProfileExists &&
          processorDiscovery &&
          processorActiveRecoveries ? (
            <div className="space-y-6">
              <ProcessorDiscovery
                items={processorDiscovery.items}
                loadError={
                  processorDiscovery.success
                    ? undefined
                    : processorDiscovery.message
                }
              />
              <ProcessorActiveRecoveries
                items={processorActiveRecoveries.items}
                loadError={
                  processorActiveRecoveries.success
                    ? undefined
                    : processorActiveRecoveries.message
                }
              />
            </div>
          ) : (
            <ProcessorProfileSetup />
          )
        ) : null}
      </div>
    </main>
  );
}
