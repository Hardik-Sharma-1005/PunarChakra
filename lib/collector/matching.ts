import type {
  CollectorAvailability,
  CollectorProfile,
  MaterialCategory,
  MatchReason,
  MatchRecommendation,
  WasteListing,
} from "@/types/domain";

export type CollectorMatchTier =
  | "strong"
  | "good"
  | "potential";

export interface CollectorMatchResult {
  tier: CollectorMatchTier;
  reasons: MatchReason[];
}

function hasMaterialMatch(
  collector: CollectorProfile,
  listing: WasteListing,
): boolean {
  return collector.collectibleMaterials.includes(listing.material);
}

function isWithinCapacity(
  collector: CollectorProfile,
  listing: WasteListing,
): boolean {
  return listing.quantityKg <= collector.maximumCollectionCapacityKg;
}

function isWithinOperatingArea(
  collector: CollectorProfile,
  listing: WasteListing,
): boolean {
  return collector.operatingAreas.includes(listing.location.city);
}

function isCurrentlyAvailable(
  collector: CollectorProfile,
): boolean {
  return collector.availability === "available";
}

function isPickupReady(listing: WasteListing): boolean {
  return listing.pickupReadiness.status === "ready_now";
}

export function getCollectorMatchResult(
  collector: CollectorProfile,
  listing: WasteListing,
): CollectorMatchResult | null {
  if (!hasMaterialMatch(collector, listing)) {
    return null;
  }

  const reasons: MatchReason[] = ["material_accepted"];

  const quantityMatches = isWithinCapacity(collector, listing);
  const operatingAreaMatches = isWithinOperatingArea(
    collector,
    listing,
  );
  const availabilityMatches = isCurrentlyAvailable(collector);

  if (quantityMatches) {
    reasons.push("quantity_within_capacity");
  }

  if (operatingAreaMatches) {
    reasons.push("within_operating_area");
  }

  if (availabilityMatches) {
    reasons.push("currently_available");
  }

  if (isPickupReady(listing)) {
    reasons.push("pickup_ready");
  }

  if (
    quantityMatches &&
    operatingAreaMatches &&
    availabilityMatches
  ) {
    return {
      tier: "strong",
      reasons,
    };
  }

  if (
    quantityMatches &&
    operatingAreaMatches
  ) {
    return {
      tier: "good",
      reasons,
    };
  }

  return {
    tier: "potential",
    reasons,
  };
}

export function buildCollectorMatchRecommendation(
  collector: CollectorProfile,
  listing: WasteListing,
): MatchRecommendation | null {
  const result = getCollectorMatchResult(collector, listing);

  if (!result) {
    return null;
  }

  return {
    listingId: listing.id,
    candidateUserId: collector.userId,
    candidateRole: "collector",
    reasons: result.reasons,
  };
}

export function sortCollectorMatches(
  matches: Array<{
    listing: WasteListing;
    result: CollectorMatchResult;
  }>,
): Array<{
  listing: WasteListing;
  result: CollectorMatchResult;
}> {
  const tierRank: Record<CollectorMatchTier, number> = {
    strong: 0,
    good: 1,
    potential: 2,
  };

  return [...matches].sort((a, b) => {
    const tierDifference =
      tierRank[a.result.tier] - tierRank[b.result.tier];

    if (tierDifference !== 0) {
      return tierDifference;
    }

    return (
      new Date(b.listing.createdAt).getTime() -
      new Date(a.listing.createdAt).getTime()
    );
  });
}