import "server-only";

import { getApprovedProfile } from "@/lib/auth/get-approved-profile";
import type { CurrentProfile } from "@/lib/auth/get-current-profile";

export async function getAdminProfile(): Promise<CurrentProfile | null> {
  return getApprovedProfile(["admin"]);
}
