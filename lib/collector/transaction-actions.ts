"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getApprovedProfile } from "@/lib/auth/get-approved-profile";

export type CollectorTransactionActionState = {
  success: boolean;
  message: string;
  transactionId?: string;
};

type CollectorTargetStatus =
  | "pickup_in_progress"
  | "collected"
  | "in_transit";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

  if (!UUID_PATTERN.test(listingId)) {
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

export async function advanceCollectorTransactionAction(
  transactionId: string,
  targetStatus: CollectorTargetStatus,
): Promise<CollectorTransactionActionState> {
  const collector = await getApprovedProfile(["collector"]);

  if (!collector) {
    return {
      success: false,
      message:
        "You must be signed in with an approved collector account to update a recovery transaction.",
    };
  }

  if (!UUID_PATTERN.test(transactionId)) {
    return {
      success: false,
      message: "Invalid transaction ID.",
    };
  }

  if (
    targetStatus !== "pickup_in_progress" &&
    targetStatus !== "collected" &&
    targetStatus !== "in_transit"
  ) {
    return {
      success: false,
      message: "Invalid collector transaction status.",
    };
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.rpc(
    "advance_collector_transaction",
    {
      p_transaction_id: transactionId,
      p_target_status: targetStatus,
    },
  );

  if (error || !data) {
    return {
      success: false,
      message:
        error?.message ||
        "Unable to update this recovery transaction.",
    };
  }

  return {
    success: true,
    message: "Recovery transaction updated successfully.",
    transactionId: data,
  };
}