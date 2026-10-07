"use server";

import { getApprovedProfile } from "@/lib/auth/get-approved-profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProcessorTransactionActionState = {
  success: boolean;
  message: string;
  transactionId?: string;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type ProcessorTargetStatus = "received" | "completed";

export async function reserveRecoveryTransactionAction(
  transactionId: string,
): Promise<ProcessorTransactionActionState> {
  const trimmedTransactionId = transactionId.trim();

  if (!trimmedTransactionId) {
    return {
      success: false,
      message: "Transaction ID is required.",
    };
  }

  if (!UUID_PATTERN.test(trimmedTransactionId)) {
    return {
      success: false,
      message: "Invalid transaction ID.",
    };
  }

  const profile = await getApprovedProfile(["processor"]);

  if (!profile) {
    return {
      success: false,
      message: "Approved processor access is required.",
    };
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.rpc(
    "reserve_recovery_transaction",
    {
      p_transaction_id: trimmedTransactionId,
    },
  );

  if (error) {
    return {
      success: false,
      message:
        error.message ||
        "Unable to reserve this recovery transaction.",
    };
  }

  if (!data) {
    return {
      success: false,
      message:
        "The recovery transaction could not be reserved.",
    };
  }

  return {
    success: true,
    message: "Recovery transaction reserved successfully.",
    transactionId: data,
  };
}

export async function advanceProcessorTransactionAction(
  transactionId: string,
  targetStatus: ProcessorTargetStatus,
): Promise<ProcessorTransactionActionState> {
  const trimmedTransactionId = transactionId.trim();

  if (!trimmedTransactionId) {
    return {
      success: false,
      message: "Transaction ID is required.",
    };
  }

  if (!UUID_PATTERN.test(trimmedTransactionId)) {
    return {
      success: false,
      message: "Invalid transaction ID.",
    };
  }

  if (
    targetStatus !== "received" &&
    targetStatus !== "completed"
  ) {
    return {
      success: false,
      message: "Invalid processor transaction status.",
    };
  }

  const profile = await getApprovedProfile(["processor"]);

  if (!profile) {
    return {
      success: false,
      message: "Approved processor access is required.",
    };
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.rpc(
    "advance_processor_transaction",
    {
      p_transaction_id: trimmedTransactionId,
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
