"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { getAdminProfile } from "@/lib/auth/get-admin-profile";

export type AuthActionState = {
  success: boolean;
  message: string;
};

const REGISTRATION_ROLES = ["generator", "collector", "processor"] as const;

type RegistrationRole = (typeof REGISTRATION_ROLES)[number];

function isRegistrationRole(value: string): value is RegistrationRole {
  return REGISTRATION_ROLES.includes(value as RegistrationRole);
}

export async function signUpAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const displayName = String(formData.get("displayName") ?? "").trim();
  const organizationName = String(
    formData.get("organizationName") ?? "",
  ).trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "").trim().toLowerCase();

  if (!displayName || !email || !password || !role) {
    return {
      success: false,
      message: "Please fill in all required fields.",
    };
  }

  if (!isRegistrationRole(role)) {
    return {
      success: false,
      message: "Please select a valid account type.",
    };
  }

  if (displayName.length > 100 || organizationName.length > 150) {
    return {
      success: false,
      message: "One or more fields are too long.",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      message: "Password must be at least 8 characters.",
    };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
        organization_name: organizationName || null,
        role,
      },
    },
  });

  if (error) {
    return {
      success: false,
      message: "Registration failed. Check your details or try again.",
    };
  }

  return {
    success: true,
    message:
      "Registration submitted. Check your email if confirmation is required. Your account is awaiting approval.",
  };
}

export async function signInAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      success: false,
      message: "Please enter your email and password.",
    };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      message: "Unable to sign in. Check your credentials and try again.",
    };
  }

  const profile = await getCurrentProfile();

  if (!profile) {
    await supabase.auth.signOut();

    return {
      success: false,
      message:
        "Your account profile could not be found. Please contact support.",
    };
  }

  if (profile.approvalStatus === "approved") {
    redirect("/dashboard");
  }

  redirect("/pending");
}

export async function signOutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}

export type ProfileApprovalStatus = "approved" | "rejected";

export async function setProfileApprovalAction(
  targetProfileId: string,
  newStatus: ProfileApprovalStatus,
): Promise<AuthActionState> {
  const admin = await getAdminProfile();

  if (!admin) {
    return {
      success: false,
      message: "You are not authorized to manage account approvals.",
    };
  }

  const isValidUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      targetProfileId,
    );

  if (!isValidUuid) {
    return {
      success: false,
      message: "Invalid profile ID.",
    };
  }

  if (newStatus !== "approved" && newStatus !== "rejected") {
    return {
      success: false,
      message: "Invalid approval status.",
    };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.rpc("set_profile_approval_status", {
    p_target_profile_id: targetProfileId,
    p_new_status: newStatus,
  });

  if (error) {
    return {
      success: false,
      message:
        "Unable to update this account. It may no longer be pending, or the request may not be permitted.",
    };
  }

  return {
    success: true,
    message: `Account ${newStatus} successfully.`,
  };
}