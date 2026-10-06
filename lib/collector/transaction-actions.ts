"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getApprovedProfile } from "@/lib/auth/get-approved-profile";

export type CollectorTransactionActionState = {
  success: boolean;
  message: string;
  transactionId?: string;
};

export async function acceptWasteListingAction(
  listingId: string,
): Promise<CollectorTransactionActionState> {
  const collector = await getApprovedProfile(["collector"]);

  if (!collector) {
    return {
      success: false,
      message:
        "You must be signed in with an approved collector account to accept a listing.",
    };
  }

  const isValidUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      listingId,
    );

  if (!isValidUuid) {
    return {
      success: false,
      message: "Invalid listing ID.",
    };
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.rpc("accept_waste_listing", {
    p_listing_id: listingId,
  });

  if (error || !data) {
    return {
      success: false,
      message:
        "Unable to accept this listing. It may no longer be available.",
    };
  }

  return {
    success: true,
    message: "Listing accepted successfully.",
    transactionId: data,
  };
}