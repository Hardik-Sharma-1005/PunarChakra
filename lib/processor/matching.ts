import type {
  MatchReason,
  MaterialCategory,
  ProcessorProfile,
  WasteListing,
} from "@/types/domain";

export type ProcessorMatchTier =
  | "strong"
  | "good"
  | "potential";

export interface ProcessorMatchResult {
  tier: ProcessorMatchTier;
  reasons: MatchReason[];
}

function hasMaterialMatch(
  processor: ProcessorProfile,
  listing: WasteListing,
): boolean {
  return processor.acceptedMaterials.includes(listing.material);
}

function isWithinQuantityRequirement(
  processor: ProcessorProfile,
  listing: WasteListing,
): boolean {
  return (
    listing.quantityKg >= processor.minimumRequiredQuantityKg &&
    listing.quantityKg <= processor.maximumRequiredQuantityKg
  );
}

function hasAvailableProcessingCapacity(
  processor: ProcessorProfile,
  listing: WasteListing,
  reservedQuantityKg: number,
): boolean {
  const availableCapacityKg =
    processor.processingCapacityKg - reservedQuantityKg;

  return listing.quantityKg <= availableCapacityKg;
}

function isNearbyFacility(
  processor: ProcessorProfile,
  listing: WasteListing,
): boolean {
  return (
    processor.location.city.trim().toLowerCase() ===
    listing.location.city.trim().toLowerCase()
  );
}

export function getProcessorMatchResult(
  processor: ProcessorProfile,
  listing: WasteListing,
  reservedQuantityKg: number,
): ProcessorMatchResult | null {
  if (!hasMaterialMatch(processor, listing)) {
    return null;
  }

  const reasons: MatchReason[] = ["material_accepted"];

  const quantityMatches = isWithinQuantityRequirement(
    processor,
    listing,
  );

  const capacityMatches = hasAvailableProcessingCapacity(
    processor,
    listing,
    reservedQuantityKg,
  );

  const nearbyMatches = isNearbyFacility(
    processor,
    listing,
  );

  if (quantityMatches) {
    reasons.push("quantity_within_requirement");
  }

  if (capacityMatches) {
    reasons.push("processing_capacity_available");
  }

  if (nearbyMatches) {
    reasons.push("nearby_facility");
  }

  if (
    quantityMatches &&
    capacityMatches &&
    nearbyMatches
  ) {
    return {
      tier: "strong",
      reasons,
    };
  }

  if (
    quantityMatches &&
    capacityMatches
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

export function buildProcessorMatchRecommendation(
  processor: ProcessorProfile,
  listing: WasteListing,
  reservedQuantityKg: number,
): {
  listingId: string;
  candidateUserId: string;
  candidateRole: "processor";
  reasons: MatchReason[];
} | null {
  const result = getProcessorMatchResult(
    processor,
    listing,
    reservedQuantityKg,
  );

  if (!result) {
    return null;
  }

  return {
    listingId: listing.id,
    candidateUserId: processor.userId,
    candidateRole: "processor",
    reasons: result.reasons,
  };
}

export function sortProcessorMatches(
  matches: Array<{
    listing: WasteListing;
    result: ProcessorMatchResult;
  }>,
): Array<{
  listing: WasteListing;
  result: ProcessorMatchResult;
}> {
  const tierRank: Record<ProcessorMatchTier, number> = {
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