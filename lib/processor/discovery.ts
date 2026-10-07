import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getApprovedProfile } from "@/lib/auth/get-approved-profile";
import {
  getProcessorMatchResult,
  type ProcessorMatchResult,
} from "./matching";
import type {
  MaterialCategory,
  ProcessorProfile,
  PickupReadiness,
  WasteCondition,
  WasteListing,
} from "@/types/domain";

type ProcessorDiscoveryRow = {
  transaction_id: string;
  listing_id: string;
  generator_id: string;
  collector_id: string;
  processor_id: string | null;
  status: string;
  material: string;
  quantity_kg: number | string;
  condition: string;
  location: unknown;
  pickup_readiness: unknown;
  description: string | null;
  photo_urls: string[] | null;
  listing_created_at: string;
  listing_updated_at: string;
  transaction_created_at: string;
  transaction_updated_at: string;
  generator_display_name: string;
  generator_organization_name: string | null;
  collector_display_name: string;
  collector_organization_name: string | null;
};

type ProcessorProfileRow = {
  id: string;
  user_id: string;
  facility_type: string;
  accepted_materials: string[];
  minimum_required_quantity_kg: number | string;
  maximum_required_quantity_kg: number | string;
  processing_capacity_kg: number | string;
  location: unknown;
  created_at: string;
  updated_at: string;
  is_simulated: boolean;
};

export type ProcessorDiscoveryItem = {
  transactionId: string;
  listing: WasteListing;
  generator: {
    id: string;
    displayName: string;
    organizationName?: string;
  };
  collector: {
    id: string;
    displayName: string;
    organizationName?: string;
  };
  transactionStatus: "collected" | "in_transit";
  transactionCreatedAt: string;
  transactionUpdatedAt: string;
  match: ProcessorMatchResult;
};

export type ProcessorDiscoveryResult = {
  success: boolean;
  message: string;
  items: ProcessorDiscoveryItem[];
};

const MATERIAL_CATEGORIES: MaterialCategory[] = [
  "concrete_rubble",
  "bricks_masonry",
  "scrap_metal",
  "wood",
  "glass",
  "soil_excavated",
  "mixed_cd_waste",
];

const WASTE_CONDITIONS: WasteCondition[] = [
  "clean_sorted",
  "mixed_materials",
  "contaminated",
  "requires_sorting",
];

const TRANSACTION_STATUSES = [
  "collected",
  "in_transit",
] as const;

function isMaterialCategory(
  value: string,
): value is MaterialCategory {
  return MATERIAL_CATEGORIES.includes(
    value as MaterialCategory,
  );
}

function isWasteCondition(
  value: string,
): value is WasteCondition {
  return WASTE_CONDITIONS.includes(
    value as WasteCondition,
  );
}

function isTransactionStatus(
  value: string,
): value is (typeof TRANSACTION_STATUSES)[number] {
  return TRANSACTION_STATUSES.includes(
    value as (typeof TRANSACTION_STATUSES)[number],
  );
}

function parseLocation(
  value: unknown,
): WasteListing["location"] | null {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return null;
  }

  const location = value as Record<string, unknown>;

  if (
    typeof location.address !== "string" ||
    typeof location.city !== "string" ||
    typeof location.state !== "string"
  ) {
    return null;
  }

  const coordinates =
    typeof location.coordinates === "object" &&
    location.coordinates !== null &&
    !Array.isArray(location.coordinates)
      ? (location.coordinates as Record<string, unknown>)
      : null;

  if (coordinates) {
    if (
      typeof coordinates.latitude !== "number" ||
      typeof coordinates.longitude !== "number"
    ) {
      return null;
    }
  }

  return {
    address: location.address,
    city: location.city,
    state: location.state,
    ...(coordinates
      ? {
          coordinates: {
            latitude: coordinates.latitude as number,
            longitude: coordinates.longitude as number,
          },
        }
      : {}),
  };
}

function parsePickupReadiness(
  value: unknown,
): PickupReadiness | null {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return null;
  }

  const pickupReadiness = value as Record<string, unknown>;

  if (pickupReadiness.status === "ready_now") {
    return {
      status: "ready_now",
    };
  }

  if (
    pickupReadiness.status === "scheduled" &&
    typeof pickupReadiness.availableFrom === "string"
  ) {
    return {
      status: "scheduled",
      availableFrom: pickupReadiness.availableFrom,
    };
  }

  return null;
}

function mapProcessorProfile(
  data: ProcessorProfileRow,
): ProcessorProfile | null {
  const acceptedMaterials = data.accepted_materials.filter(
    isMaterialCategory,
  );

  if (acceptedMaterials.length === 0) {
    return null;
  }

  const minimumRequiredQuantityKg = Number(
    data.minimum_required_quantity_kg,
  );
  const maximumRequiredQuantityKg = Number(
    data.maximum_required_quantity_kg,
  );
  const processingCapacityKg = Number(
    data.processing_capacity_kg,
  );

  if (
    !Number.isFinite(minimumRequiredQuantityKg) ||
    minimumRequiredQuantityKg < 0 ||
    !Number.isFinite(maximumRequiredQuantityKg) ||
    maximumRequiredQuantityKg < minimumRequiredQuantityKg ||
    !Number.isFinite(processingCapacityKg) ||
    processingCapacityKg <= 0
  ) {
    return null;
  }

  const location = parseLocation(data.location);

  if (!location) {
    return null;
  }

  if (
    data.facility_type !== "processor" &&
    data.facility_type !== "buyer"
  ) {
    return null;
  }

  return {
    id: data.id,
    userId: data.user_id,
    facilityType: data.facility_type,
    acceptedMaterials,
    minimumRequiredQuantityKg,
    maximumRequiredQuantityKg,
    processingCapacityKg,
    location,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    isSimulated: data.is_simulated,
  };
}

function mapWasteListing(
  row: ProcessorDiscoveryRow,
): WasteListing | null {
  if (
    !isMaterialCategory(row.material) ||
    !isWasteCondition(row.condition)
  ) {
    return null;
  }

  const quantityKg = Number(row.quantity_kg);

  if (!Number.isFinite(quantityKg) || quantityKg <= 0) {
    return null;
  }

  const location = parseLocation(row.location);
  const pickupReadiness = parsePickupReadiness(
    row.pickup_readiness,
  );

  if (!location || !pickupReadiness) {
    return null;
  }

  return {
    id: row.listing_id,
    generatorId: row.generator_id,
    material: row.material,
    quantityKg,
    condition: row.condition,
    location,
    pickupReadiness,
    ...(row.description
      ? {
          description: row.description,
        }
      : {}),
    photoUrls: row.photo_urls ?? [],
    status: "assigned",
    createdAt: row.listing_created_at,
    updatedAt: row.listing_updated_at,
    isSimulated: false,
  };
}

export async function getProcessorDiscovery(): Promise<ProcessorDiscoveryResult> {
  const processor = await getApprovedProfile(["processor"]);

  if (!processor) {
    return {
      success: false,
      message:
        "You must be signed in with an approved processor account to view discovery.",
      items: [],
    };
  }

  const supabase = await createSupabaseServerClient();

  const { data: profileData, error: profileError } = await supabase
    .from("processor_profiles")
    .select(
      "id, user_id, facility_type, accepted_materials, minimum_required_quantity_kg, maximum_required_quantity_kg, processing_capacity_kg, location, created_at, updated_at, is_simulated",
    )
    .eq("user_id", processor.id)
    .maybeSingle();

  if (profileError) {
    return {
      success: false,
      message: "Unable to load your processor profile.",
      items: [],
    };
  }

  if (!profileData) {
    return {
      success: false,
      message:
        "Complete your processor profile before viewing discovery.",
      items: [],
    };
  }

  const processorProfile = mapProcessorProfile(
    profileData as ProcessorProfileRow,
  );

  if (!processorProfile) {
    return {
      success: false,
      message:
        "Your processor profile contains invalid or incomplete information.",
      items: [],
    };
  }

  const { data: discoveryData, error: discoveryError } =
    await supabase.rpc("get_processor_discovery");

  if (discoveryError) {
    return {
      success: false,
      message: "Unable to load processor discovery.",
      items: [],
    };
  }

  const rows = (discoveryData ??
    []) as ProcessorDiscoveryRow[];

  const candidateRows: Array<{
    row: ProcessorDiscoveryRow;
    listing: WasteListing;
    transactionStatus: "collected" | "in_transit";
  }> = [];

  for (const row of rows) {
    if (!isTransactionStatus(row.status)) {
      continue;
    }

    const listing = mapWasteListing(row);

    if (!listing) {
      continue;
    }

    candidateRows.push({
      row,
      listing,
      transactionStatus: row.status,
    });
  }

  const { data: activeTransactions, error: activeError } =
    await supabase
      .from("recovery_transactions")
      .select("id, listing_id, processor_id, status")
      .eq("processor_id", processor.id)
      .in("status", [
        "collected",
        "in_transit",
        "received",
      ]);

  if (activeError) {
    return {
      success: false,
      message:
        "Unable to load your active processing capacity.",
      items: [],
    };
  }

  let reservedQuantityKg = 0;

  if (activeTransactions && activeTransactions.length > 0) {
    const listingIds = activeTransactions.map(
      (transaction) => transaction.listing_id,
    );

    const { data: reservedListings, error: reservedListingsError } =
      await supabase
        .from("waste_listings")
        .select("id, quantity_kg")
        .in("id", listingIds);

    if (reservedListingsError) {
      return {
        success: false,
        message:
          "Unable to calculate your available processing capacity.",
        items: [],
      };
    }

    reservedQuantityKg = (reservedListings ?? []).reduce(
      (total, listing) => {
        const quantityKg = Number(listing.quantity_kg);

        if (!Number.isFinite(quantityKg) || quantityKg <= 0) {
          return total;
        }

        return total + quantityKg;
      },
      0,
    );
  }

  const items: ProcessorDiscoveryItem[] = [];

  for (const candidate of candidateRows) {
    if (candidate.row.processor_id !== null) {
      continue;
    }

    const match = getProcessorMatchResult(
      processorProfile,
      candidate.listing,
      reservedQuantityKg,
    );

    if (!match) {
      continue;
    }

    items.push({
      transactionId: candidate.row.transaction_id,
      listing: candidate.listing,
      generator: {
        id: candidate.row.generator_id,
        displayName: candidate.row.generator_display_name,
        ...(candidate.row.generator_organization_name
          ? {
              organizationName:
                candidate.row.generator_organization_name,
            }
          : {}),
      },
      collector: {
        id: candidate.row.collector_id,
        displayName: candidate.row.collector_display_name,
        ...(candidate.row.collector_organization_name
          ? {
              organizationName:
                candidate.row.collector_organization_name,
            }
          : {}),
      },
      transactionStatus: candidate.transactionStatus,
      transactionCreatedAt: candidate.row.transaction_created_at,
      transactionUpdatedAt: candidate.row.transaction_updated_at,
      match,
    });
  }

  items.sort((a, b) => {
    const tierRank = {
      strong: 0,
      good: 1,
      potential: 2,
    } as const;

    const tierDifference =
      tierRank[a.match.tier] - tierRank[b.match.tier];

    if (tierDifference !== 0) {
      return tierDifference;
    }

    return (
      new Date(b.transactionUpdatedAt).getTime() -
      new Date(a.transactionUpdatedAt).getTime()
    );
  });

  return {
    success: true,
    message: "Processor discovery loaded successfully.",
    items,
  };
}