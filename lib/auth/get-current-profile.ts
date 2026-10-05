import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { ApprovalStatus, UserRole } from "@/types/domain";

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

  return {
    id: profile.id,
    displayName: profile.display_name,
    role: profile.role as UserRole,
    approvalStatus: profile.approval_status as ApprovalStatus,
  };
}