import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import type { CurrentProfile } from "@/lib/auth/get-current-profile";
import type { UserRole } from "@/types/domain";

export async function getApprovedProfile(
  allowedRoles?: UserRole[],
): Promise<CurrentProfile | null> {
  const profile = await getCurrentProfile();

  if (!profile || profile.approvalStatus !== "approved") {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return null;
  }

  return profile;
}