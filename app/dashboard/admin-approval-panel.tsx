
"use client";

import { useState, useTransition } from "react";

import {
  setProfileApprovalAction,
  type ProfileApprovalStatus,
} from "@/lib/auth/actions";

type PendingAccount = {
  id: string;
  displayName: string;
  organizationName: string | null;
  role: "generator" | "collector" | "processor" | "admin";
  createdAt: string;
  isSimulated: boolean;
};

type Props = {
  accounts: PendingAccount[];
  loadError: boolean;
};

const roleLabels = {
  generator: "Waste Generator",
  collector: "Waste Collector",
  processor: "Processor",
  admin: "Administrator",
} as const;

export default function AdminApprovalPanel({
  accounts,
  loadError,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    success: boolean;
    text: string;
  } | null>(null);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);

  const visibleAccounts = accounts.filter(
    (account) => !hiddenIds.includes(account.id),
  );

  function handleDecision(
    account: PendingAccount,
    status: ProfileApprovalStatus,
  ) {
    setMessage(null);
    setProcessingId(account.id);

    startTransition(async () => {
      try {
        const result = await setProfileApprovalAction(account.id, status);

        setMessage({
          success: result.success,
          text: result.message,
        });

        if (result.success) {
          setHiddenIds((current) => [...current, account.id]);
        }
      } catch {
        setMessage({
          success: false,
          text: "Something went wrong. Please try again.",
        });
      } finally {
        setProcessingId(null);
      }
    });
  }

  return (
    <section className="border border-[#d9dfd3] bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#d97736]">
            Administration
          </p>
          <h2 className="mt-2 text-xl font-bold">
            Account approvals
          </h2>
          <p className="mt-1 text-sm text-[#66756a]">
            Review and manage pending registrations.
          </p>
        </div>

        <span className="border border-[#d9dfd3] bg-[#f5f5ed] px-3 py-2 text-sm font-semibold">
          {visibleAccounts.length} pending
        </span>
      </div>

      {message && (
        <p
          role="status"
          className={`mt-5 border p-3 text-sm ${
            message.success
              ? "border-[#b8d7c0] bg-[#f0f8f1] text-[#28563b]"
              : "border-[#e9c2b7] bg-[#fff5f1] text-[#a33e25]"
          }`}
        >
          {message.text}
        </p>
      )}

      {loadError ? (
        <p className="mt-6 text-sm text-[#a33e25]" role="alert">
          Unable to load pending accounts. Please refresh the page and try again.
        </p>
      ) : visibleAccounts.length === 0 ? (
        <div className="mt-6 border border-dashed border-[#d9dfd3] px-4 py-10 text-center">
          <p className="font-semibold">No pending accounts</p>
          <p className="mt-2 text-sm text-[#66756a]">
            New registrations awaiting approval will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {visibleAccounts.map((account) => (
            <article
              key={account.id}
              className="border border-[#d9dfd3] p-4 sm:p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">
                      {account.displayName}
                    </h3>

                    {account.isSimulated && (
                      <span className="border border-[#e8d2a9] bg-[#fff8e9] px-2 py-1 text-xs font-medium text-[#94651f]">
                        Demo account
                      </span>
                    )}
                  </div>

                  {account.organizationName && (
                    <p className="mt-1 text-sm text-[#66756a]">
                      {account.organizationName}
                    </p>
                  )}

                  <p className="mt-2 text-sm text-[#66756a]">
                    {roleLabels[account.role]}
                  </p>

                  <p className="mt-1 text-xs text-[#879187]">
                    Registered{" "}
                    {new Date(account.createdAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        timeZone: "Asia/Kolkata",
                      },
                    )}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                      handleDecision(account, "approved")
                    }
                    className="bg-[#28563b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#203f2d] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isPending && processingId === account.id
                      ? "Processing..."
                      : "Approve"}
                  </button>

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                      handleDecision(account, "rejected")
                    }
                    className="border border-[#e4bdb4] bg-white px-4 py-2 text-sm font-semibold text-[#a33e25] transition hover:bg-[#fff5f1] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
