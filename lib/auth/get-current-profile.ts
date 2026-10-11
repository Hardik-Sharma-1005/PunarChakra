import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { ApprovalStatus, UserRole } from "@/types/domain";

const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  generator: "Waste generator",
  collector: "Collector",
  processor: "Processor / Buyer",
  admin: "Administrator",
};

function usableName(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const name = value.trim();
  if (!name || name.toLowerCase() === "new user") return null;

  return name;
}

export interface CurrentProfile {
  id: string;
  displayName: string;
  role: UserRole;
  approvalStatus: ApprovalStatus;
}

export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, display_name, role, approval_status")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return null;
  }

  const validRoles: UserRole[] = [
    "generator",
    "collector",
    "processor",
    "admin",
  ];

  const validApprovalStatuses: ApprovalStatus[] = [
    "pending",
    "approved",
    "rejected",
  ];

  if (
    !validRoles.includes(profile.role as UserRole) ||
    !validApprovalStatuses.includes(
      profile.approval_status as ApprovalStatus,
    )
  ) {
    return null;
  }

  const role = profile.role as UserRole;
  const displayName =
    usableName(profile.display_name) ??
    usableName(user.user_metadata?.display_name) ??
    usableName(user.user_metadata?.full_name) ??
    usableName(user.user_metadata?.name) ??
    ROLE_DISPLAY_NAMES[role];

  return {
    id: profile.id,
    displayName,
    role,
    approvalStatus: profile.approval_status as ApprovalStatus,
  };
}
