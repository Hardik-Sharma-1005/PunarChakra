"use client";

import { useState } from "react";
import type {
  MaterialCategory,
  TransactionStatus,
  WasteCondition,
} from "@/types/domain";
import {
  advanceCollectorTransactionAction,
  type CollectorTransactionActionState,
} from "@/lib/collector/transaction-actions";
import type { CollectorActiveRecovery } from "@/lib/collector/active-recoveries";

type CollectorActiveRecoveriesProps = {
  items: CollectorActiveRecovery[];
  loadError?: string;
};

type NextAction = {
  targetStatus:
    | "pickup_in_progress"
    | "collected"
    | "in_transit";
  label: string;
} | null;

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

function formatQuantity(quantityKg: number) {
  if (quantityKg >= 1000) {
    return `${quantityKg / 1000} tonnes`;
  }

  return `${quantityKg} kg`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getNextAction(status: TransactionStatus): NextAction {
  switch (status) {
    case "assigned":
      return {
        targetStatus: "pickup_in_progress",
        label: "Start Pickup",
      };

    case "pickup_in_progress":
      return {
        targetStatus: "collected",
        label: "Mark Collected",
      };

    case "collected":
      return {
        targetStatus: "in_transit",
        label: "Start Transit",
      };

    case "in_transit":
      return null;

    default:
      return null;
  }
}

export default function CollectorActiveRecoveries({
  items: initialItems,
  loadError,
}: CollectorActiveRecoveriesProps) {
  const [items, setItems] = useState(initialItems);
  const [pendingTransactionId, setPendingTransactionId] =
    useState<string | null>(null);
  const [actionState, setActionState] =
    useState<CollectorTransactionActionState | null>(null);

  async function handleAdvance(
    transactionId: string,
    targetStatus:
      | "pickup_in_progress"
      | "collected"
      | "in_transit",
  ) {
    setPendingTransactionId(transactionId);
    setActionState(null);

    const result = await advanceCollectorTransactionAction(
      transactionId,
      targetStatus,
    );

    setActionState(result);
    setPendingTransactionId(null);

    if (!result.success) {
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.transaction.id === transactionId
          ? {
              ...item,
              transaction: {
                ...item.transaction,
                status: targetStatus,
                updatedAt: new Date().toISOString(),
              },
            }
          : item,
      ),
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
          Active recoveries
        </p>

        <h2 className="mt-2 text-2xl font-bold text-stone-950">
          Manage your recovery commitments
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
          Move each recovery through pickup, collection, and transit. Once
          material is in transit, the processor takes over the next stage.
        </p>
      </div>

      {loadError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {loadError}
        </div>
      ) : null}

      {actionState ? (
        <div
          className={`rounded-2xl border p-4 text-sm ${
            actionState.success
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {actionState.message}
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
          <p className="text-sm font-medium text-stone-700">
            No active recoveries yet.
          </p>

          <p className="mt-2 text-sm text-stone-500">
            Accepted recovery commitments will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {items.map((item) => {
            const nextAction = getNextAction(item.transaction.status);
            const isPending =
              pendingTransactionId === item.transaction.id;

            return (
              <article
                key={item.transaction.id}
                className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-bold text-stone-950">
                          {MATERIAL_LABELS[item.listing.material]}
                        </h3>

                        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                          {STATUS_LABELS[item.transaction.status]}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-stone-500">
                        {item.listing.location.city},{" "}
                        {item.listing.location.state}
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                          Quantity
                        </p>

                        <p className="mt-1 text-sm font-semibold text-stone-900">
                          {formatQuantity(item.listing.quantityKg)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                          Condition
                        </p>

                        <p className="mt-1 text-sm font-semibold text-stone-900">
                          {CONDITION_LABELS[item.listing.condition]}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                          Accepted
                        </p>

                        <p className="mt-1 text-sm font-semibold text-stone-900">
                          {formatDate(item.transaction.createdAt)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                          Pickup
                        </p>

                        <p className="mt-1 text-sm font-semibold text-stone-900">
                          {item.listing.pickupReadiness.status ===
                          "ready_now"
                            ? "Ready now"
                            : "Scheduled"}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl bg-stone-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                          Generator
                        </p>

                        <p className="mt-1 text-sm font-semibold text-stone-900">
                          {item.generator.organizationName ||
                            item.generator.displayName}
                        </p>

                        {item.generator.organizationName ? (
                          <p className="mt-1 text-xs text-stone-500">
                            {item.generator.displayName}
                          </p>
                        ) : null}
                      </div>

                      <div className="rounded-2xl bg-stone-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                          Processor
                        </p>

                        {item.processor ? (
                          <>
                            <p className="mt-1 text-sm font-semibold text-stone-900">
                              {item.processor.organizationName ||
                                item.processor.displayName}
                            </p>

                            {item.processor.organizationName ? (
                              <p className="mt-1 text-xs text-stone-500">
                                {item.processor.displayName}
                              </p>
                            ) : null}
                          </>
                        ) : (
                          <p className="mt-1 text-sm font-semibold text-stone-500">
                            Not assigned yet
                          </p>
                        )}
                      </div>
                    </div>

                    {item.listing.description ? (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                          Description
                        </p>

                        <p className="mt-1 text-sm leading-6 text-stone-700">
                          {item.listing.description}
                        </p>
                      </div>
                    ) : null}
                  </div>

                  <div className="shrink-0">
                    {nextAction ? (
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                          handleAdvance(
                            item.transaction.id,
                            nextAction.targetStatus,
                          )
                        }
                        className="rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isPending ? "Updating..." : nextAction.label}
                      </button>
                    ) : (
                      <span className="inline-flex rounded-xl bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-600">
                        Awaiting Processor
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
