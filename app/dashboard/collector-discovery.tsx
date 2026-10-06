"use client";

import { useState, useTransition } from "react";

import {
  acceptWasteListingAction,
  type CollectorTransactionActionState,
} from "@/lib/collector/transaction-actions";
import type {
  MaterialCategory,
  MatchReason,
  WasteCondition,
} from "@/types/domain";

import type { CollectorDiscoveryItem } from "@/lib/collector/discovery";

type CollectorDiscoveryProps = {
  items: CollectorDiscoveryItem[];
  loadError?: string;
};

const materialLabels: Record<MaterialCategory, string> = {
  concrete_rubble: "Concrete & Rubble",
  bricks_masonry: "Bricks & Masonry",
  scrap_metal: "Scrap Metal",
  wood: "Wood",
  glass: "Glass",
  soil_excavated: "Excavated Soil",
  mixed_cd_waste: "Mixed C&D Waste",
};

const conditionLabels: Record<WasteCondition, string> = {
  clean_sorted: "Clean & Sorted",
  mixed_materials: "Mixed Materials",
  contaminated: "Contaminated",
  requires_sorting: "Requires Sorting",
};

const reasonLabels: Record<MatchReason, string> = {
  material_accepted: "Material accepted",
  quantity_within_capacity: "Quantity is within your capacity",
  within_operating_area: "Listing is within your operating area",
  currently_available: "You are currently available",
  pickup_ready: "Ready for pickup now",
  quantity_within_requirement: "Quantity meets processing requirements",
  processing_capacity_available: "Processing capacity is available",
  nearby_facility: "Nearby facility",
};

const tierLabels = {
  strong: "Strong Match",
  good: "Good Match",
  potential: "Potential Match",
} as const;

const tierStyles = {
  strong: {
    badge: "border-[#b8d8c0] bg-[#edf7ef] text-[#28563b]",
  },
  good: {
    badge: "border-[#ead6b9] bg-[#fbf3e7] text-[#9a5b21]",
  },
  potential: {
    badge: "border-[#d9dfd3] bg-[#f5f5ed] text-[#66756a]",
  },
} as const;

function formatQuantity(quantityKg: number): string {
  if (quantityKg >= 1000) {
    return `${(quantityKg / 1000).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })} tonnes`;
  }

  return `${quantityKg.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })} kg`;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPickupReadiness(
  item: CollectorDiscoveryItem,
): string {
  if (item.listing.pickupReadiness.status === "ready_now") {
    return "Ready now";
  }

  return `Available from ${formatDate(
    item.listing.pickupReadiness.availableFrom,
  )}`;
}

export default function CollectorDiscovery({
  items,
  loadError,
}: CollectorDiscoveryProps) {
  const [isPending, startTransition] = useTransition();
  const [actionState, setActionState] =
    useState<CollectorTransactionActionState | null>(null);
  const [acceptedListingId, setAcceptedListingId] =
    useState<string | null>(null);

  function handleAccept(listingId: string) {
    setActionState(null);

    startTransition(async () => {
      const result = await acceptWasteListingAction(listingId);

      setActionState(result);

      if (result.success) {
        setAcceptedListingId(listingId);
      }
    });
  }

  if (loadError) {
    return (
      <section className="border border-[#e4c8c0] bg-white p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d97736]">
          Collector discovery
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          Unable to load discovery
        </h2>

        <p className="mt-3 text-sm leading-6 text-[#66756a]">
          {loadError}
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="border border-[#d9dfd3] bg-white p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d97736]">
          Collector discovery
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          Waste opportunities matched to you
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#66756a]">
          Available listings are ranked using your collector profile.
          Each match explains why the listing fits your current
          collection capabilities.
        </p>
      </div>

      {actionState ? (
        <div
          className={
            actionState.success
              ? "border border-[#b8d8c0] bg-[#edf7ef] p-4 text-sm text-[#28563b]"
              : "border border-[#e4c8c0] bg-white p-4 text-sm text-[#9a4f35]"
          }
        >
          {actionState.message}
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className="border border-[#d9dfd3] bg-white p-8 text-center">
          <h3 className="text-lg font-semibold">
            No matching opportunities yet
          </h3>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#66756a]">
            New generator listings will appear here when their material
            matches something you collect.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {items.map(({ listing, match }) => {
            const isAccepted = acceptedListingId === listing.id;

            return (
              <article
                key={listing.id}
                className="border border-[#d9dfd3] bg-white p-6 sm:p-7"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`border px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${
                          tierStyles[match.tier].badge
                        }`}
                      >
                        {tierLabels[match.tier]}
                      </span>

                      <span className="border border-[#d9dfd3] bg-[#f5f5ed] px-3 py-1 text-xs font-medium text-[#66756a]">
                        {formatPickupReadiness({
                          listing,
                          match,
                        })}
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-bold tracking-tight">
                      {materialLabels[listing.material]}
                    </h3>

                    <p className="mt-2 text-sm text-[#66756a]">
                      {listing.location.city},{" "}
                      {listing.location.state}
                    </p>
                  </div>

                  <div className="shrink-0">
                    {isAccepted ? (
                      <span className="inline-flex border border-[#b8d8c0] bg-[#edf7ef] px-4 py-2 text-sm font-semibold text-[#28563b]">
                        Accepted
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAccept(listing.id)}
                        disabled={isPending}
                        className="bg-[#203b2c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#28563b] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isPending
                          ? "Accepting..."
                          : "Accept Listing"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 border-y border-[#d9dfd3] py-5 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#66756a]">
                      Quantity
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {formatQuantity(listing.quantityKg)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#66756a]">
                      Condition
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {conditionLabels[listing.condition]}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#66756a]">
                      Pickup
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {formatPickupReadiness({
                        listing,
                        match,
                      })}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#66756a]">
                    Why this matches
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {match.reasons.map((reason) => (
                      <span
                        key={reason}
                        className="border border-[#d9dfd3] bg-[#f5f5ed] px-3 py-2 text-xs font-medium text-[#28563b]"
                      >
                        ✓ {reasonLabels[reason]}
                      </span>
                    ))}
                  </div>
                </div>

                {listing.description ? (
                  <div className="mt-5 border-t border-[#d9dfd3] pt-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#66756a]">
                      Description
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#66756a]">
                      {listing.description}
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