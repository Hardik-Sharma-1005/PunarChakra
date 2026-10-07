"use client";

import { useState, useTransition } from "react";

import { reserveRecoveryTransactionAction } from "@/lib/processor/transaction-actions";
import type { ProcessorDiscoveryItem } from "@/lib/processor/discovery";
import type {
  MatchReason,
  MaterialCategory,
  WasteCondition,
} from "@/types/domain";

type ProcessorDiscoveryProps = {
  items: ProcessorDiscoveryItem[];
  loadError?: string;
};

const materialLabels: Record<MaterialCategory, string> = {
  concrete_rubble: "Concrete & Rubble",
  bricks_masonry: "Bricks & Masonry",
  scrap_metal: "Scrap Metal",
  wood: "Wood",
  glass: "Glass",
  soil_excavated: "Soil / Excavated Material",
  mixed_cd_waste: "Mixed C&D Waste",
};

const conditionLabels: Record<WasteCondition, string> = {
  clean_sorted: "Clean & Sorted",
  mixed_materials: "Mixed Materials",
  contaminated: "Contaminated",
  requires_sorting: "Requires Sorting",
};

const transactionStatusLabels = {
  collected: "Collected",
  in_transit: "In transit",
} as const;

const reasonLabels: Record<MatchReason, string> = {
  material_accepted: "Material accepted",
  quantity_within_capacity: "Quantity within capacity",
  within_operating_area: "Within operating area",
  currently_available: "Currently available",
  pickup_ready: "Pickup ready",
  quantity_within_requirement:
    "Quantity fits your requirement",
  processing_capacity_available:
    "Processing capacity is available",
  nearby_facility: "Facility is in the same city",
};

const tierStyles = {
  strong: {
    label: "Strong Match",
    className:
      "border-[#b9d1bd] bg-[#eef6ef] text-[#28563b]",
  },
  good: {
    label: "Good Match",
    className:
      "border-[#e4c9a9] bg-[#fff5e8] text-[#9a5b20]",
  },
  potential: {
    label: "Potential Match",
    className:
      "border-[#c8cfd2] bg-[#f2f4f4] text-[#52615a]",
  },
} as const;

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

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPickupReadiness(
  status: ProcessorDiscoveryItem["listing"]["pickupReadiness"],
): string {
  if (status.status === "ready_now") {
    return "Ready now";
  }

  const date = new Date(status.availableFrom);

  if (Number.isNaN(date.getTime())) {
    return "Scheduled";
  }

  return `From ${date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

export default function ProcessorDiscovery({
  items,
  loadError,
}: ProcessorDiscoveryProps) {
  const [visibleItems, setVisibleItems] = useState(items);
  const [actionError, setActionError] = useState<string | null>(
    null,
  );
  const [reservingTransactionId, setReservingTransactionId] =
    useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleReserve(transactionId: string) {
    setActionError(null);
    setReservingTransactionId(transactionId);

    startTransition(async () => {
      const result =
        await reserveRecoveryTransactionAction(
          transactionId,
        );

      if (!result.success) {
        setActionError(result.message);
        setReservingTransactionId(null);
        return;
      }

      setVisibleItems((currentItems) =>
        currentItems.filter(
          (item) => item.transactionId !== transactionId,
        ),
      );

      setReservingTransactionId(null);
    });
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
              Recovery opportunities
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#66756a]">
              Review collected material that is moving toward
              recovery facilities. Matches are explained using
              your material requirements, available capacity, and
              facility location.
            </p>
          </div>

          {visibleItems.length > 0 ? (
            <span className="text-xs font-medium text-[#66756a]">
              {visibleItems.length}{" "}
              {visibleItems.length === 1
                ? "opportunity"
                : "opportunities"}
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

      {visibleItems.length === 0 && !loadError ? (
        <div className="py-12 text-center">
          <h3 className="text-base font-semibold text-[#203b2c]">
            No recovery opportunities right now
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#66756a]">
            New opportunities will appear here when collectors
            mark material as collected or in transit.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {visibleItems.map((item) => {
            const tier = tierStyles[item.match.tier];

            const material =
              materialLabels[item.listing.material] ??
              item.listing.material;

            const condition =
              conditionLabels[item.listing.condition] ??
              item.listing.condition;

            const isReserving =
              reservingTransactionId === item.transactionId &&
              isPending;

            return (
              <article
                key={item.transactionId}
                className="border border-[#d9dfd3] p-5 transition hover:border-[#aeb9b0] sm:p-6"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex border px-3 py-1 text-xs font-semibold ${tier.className}`}
                      >
                        {tier.label}
                      </span>

                      <span className="border border-[#d9dfd3] bg-[#f5f5ed] px-3 py-1 text-xs font-semibold text-[#66756a]">
                        {transactionStatusLabels[
                          item.transactionStatus
                        ]}
                      </span>
                    </div>

                    <h3 className="mt-3 text-xl font-bold text-[#203b2c]">
                      {material}
                    </h3>

                    <p className="mt-1 text-sm text-[#66756a]">
                      Recovery opportunity updated{" "}
                      {formatDate(item.transactionUpdatedAt)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleReserve(item.transactionId)
                    }
                    disabled={isPending}
                    className="w-full border border-[#28563b] bg-[#28563b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#203b2c] disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
                  >
                    {isReserving
                      ? "Reserving..."
                      : "Accept / Reserve"}
                  </button>
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
                      {condition}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#66756a]">
                      Pickup readiness
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#203b2c]">
                      {formatPickupReadiness(
                        item.listing.pickupReadiness,
                      )}
                    </p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#66756a]">
                      Origin
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

                <div className="mt-6 border-t border-[#d9dfd3] pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#d97736]">
                    Why this matches
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.match.reasons.map((reason) => (
                      <span
                        key={reason}
                        className="border border-[#d9dfd3] bg-[#f5f5ed] px-3 py-2 text-xs font-medium text-[#52615a]"
                      >
                        {reasonLabels[reason]}
                      </span>
                    ))}
                  </div>
                </div>

                {item.listing.description ? (
                  <div className="mt-6 border-t border-[#d9dfd3] pt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#66756a]">
                      Description
                    </p>

                    <p className="mt-1 text-sm leading-6 text-[#52615a]">
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