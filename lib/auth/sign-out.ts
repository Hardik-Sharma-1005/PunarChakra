"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signOutAndRedirectAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error("Unable to sign out. Please try again.");
  }

  redirect("/login");
}