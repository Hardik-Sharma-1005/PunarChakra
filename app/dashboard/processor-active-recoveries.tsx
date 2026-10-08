"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type {
  MaterialCategory,
  TransactionStatus,
  WasteCondition,
} from "@/types/domain";
import type { ProcessorActiveRecovery } from "@/lib/processor/active-recoveries";
import { advanceProcessorTransactionAction } from "@/lib/processor/transaction-actions";

type ProcessorActiveRecoveriesProps = {
  items: ProcessorActiveRecovery[];
  loadError?: string;
};

const MATERIAL_LABELS: Record<MaterialCategory, string> = {
  concrete_rubble: "Concrete & Rubble",
  bricks_masonry: "Bricks & Masonry",
  scrap_metal: "Scrap Metal",
  wood: "Wood",
  glass: "Glass",
  soil_excavated: "Excavated Soil",
  mixed_cd_waste: "Mixed C&D Waste",
};

const CONDITION_LABELS: Record<WasteCondition, string> = {
  clean_sorted: "Clean & Sorted",
  mixed_materials: "Mixed Materials",
  contaminated: "Contaminated",
  requires_sorting: "Requires Sorting",
};

const STATUS_LABELS: Record<TransactionStatus, string> = {
  assigned: "Assigned",
  pickup_in_progress: "Pickup in Progress",
  collected: "Collected",
  in_transit: "In Transit",
  received: "Received",
  completed: "Completed",
  cancelled: "Cancelled",
};

function formatQuantity(quantityKg: number): string {
  if (!Number.isFinite(quantityKg)) {
    return "—";
  }

  if (quantityKg >= 1000) {
    return `${(quantityKg / 1000).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })} tonnes`;
  }

  return `${quantityKg.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })} kg`;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ProcessorActiveRecoveries({
  items,
  loadError,
}: ProcessorActiveRecoveriesProps) {
  const router = useRouter();
  const [pendingTransactionId, setPendingTransactionId] = useState<string | null>(
    null,
  );
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleAdvance(
    transactionId: string,
    targetStatus: "received" | "completed",
  ) {
    setPendingTransactionId(transactionId);
    setActionError(null);

    const result = await advanceProcessorTransactionAction(
      transactionId,
      targetStatus,
    );

    if (!result.success) {
      setActionError(result.message);
      setPendingTransactionId(null);
      return;
    }

    router.refresh();
    setPendingTransactionId(null);
  }

  return (
    <section className="border border-[#d9dfd3] bg-white p-6 sm:p-8">
      <div className="border-b border-[#d9dfd3] pb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d97736]">
          Processor workspace
        </p>

        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#203b2c]">
              Active recoveries
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#66756a]">
              Track material reserved for your facility as it moves through
              collection, transit, and receipt.
            </p>
          </div>

          {items.length > 0 ? (
            <span className="text-xs font-medium text-[#66756a]">
              {items.length} {items.length === 1 ? "recovery" : "recoveries"}
            </span>
          ) : null}
        </div>
      </div>

      {loadError ? (
        <div className="mt-6 border border-[#e4bdb8] bg-[#fff1ef] p-4">
          <p className="text-sm font-medium leading-6 text-[#9b4036]">
            {loadError}
          </p>
        </div>
      ) : null}

      {actionError ? (
        <div className="mt-6 border border-[#e4bdb8] bg-[#fff1ef] p-4">
          <p className="text-sm font-medium leading-6 text-[#9b4036]">
            {actionError}
          </p>
        </div>
      ) : null}

      {items.length === 0 && !loadError ? (
        <div className="py-12 text-center">
          <h3 className="text-base font-semibold text-[#203b2c]">
            No active recoveries yet
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#66756a]">
            Recovery commitments assigned to your facility will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {items.map((item) => {
            const isPending = pendingTransactionId === item.transaction.id;

            return (
              <article
                key={item.transaction.id}
                className="border border-[#d9dfd3] p-5 sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="border border-[#b9d1bd] bg-[#eef6ef] px-3 py-1 text-xs font-semibold text-[#28563b]">
                        {STATUS_LABELS[item.transaction.status]}
                      </span>

                      {item.reservation.isReserved ? (
                        <span className="border border-[#e4c9a9] bg-[#fff5e8] px-3 py-1 text-xs font-semibold text-[#9a5b20]">
                          Reserved for your facility
                        </span>
                      ) : null}
                    </div>

                    <h3 className="mt-3 text-xl font-bold text-[#203b2c]">
                      {MATERIAL_LABELS[item.listing.material]}
                    </h3>

                    <p className="mt-1 text-sm text-[#66756a]">
                      Updated {formatDate(item.transaction.updatedAt)}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    {item.transaction.status === "in_transit" ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleAdvance(item.transaction.id, "received")
                        }
                        disabled={isPending}
                        className="border border-[#28563b] bg-[#28563b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#203b2c] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isPending ? "Updating..." : "Mark as Received"}
                      </button>
                    ) : null}

                    {item.transaction.status === "received" ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleAdvance(item.transaction.id, "completed")
                        }
                        disabled={isPending}
                        className="border border-[#28563b] bg-[#28563b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#203b2c] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isPending ? "Updating..." : "Mark as Completed"}
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="mt-6 grid gap-5 border-t border-[#d9dfd3] pt-5 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#66756a]">
                      Quantity
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#203b2c]">
                      {formatQuantity(item.listing.quantityKg)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#66756a]">
                      Condition
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#203b2c]">
                      {CONDITION_LABELS[item.listing.condition]}
                    </p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#66756a]">
                      Location
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#203b2c]">
                      {item.listing.location.address},{" "}
                      {item.listing.location.city},{" "}
                      {item.listing.location.state}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 border-t border-[#d9dfd3] pt-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#d97736]">
                      Generator
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#203b2c]">
                      {item.generator.organizationName ??
                        item.generator.displayName}
                    </p>
                    {item.generator.organizationName ? (
                      <p className="mt-1 text-xs text-[#66756a]">
                        {item.generator.displayName}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#d97736]">
                      Collector
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#203b2c]">
                      {item.collector.organizationName ??
                        item.collector.displayName}
                    </p>
                    {item.collector.organizationName ? (
                      <p className="mt-1 text-xs text-[#66756a]">
                        {item.collector.displayName}
                      </p>
                    ) : null}
                  </div>
                </div>

                {item.listing.description ? (
                  <div className="mt-6 border-t border-[#d9dfd3] pt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#66756a]">
                      Description
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#203b2c]">
                      {item.listing.description}
                    </p>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}