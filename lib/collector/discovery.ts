import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getApprovedProfile } from "@/lib/auth/get-approved-profile";
import { getCollectorMatchResult, type CollectorMatchResult } from "./matching";
import type {
  CollectorProfile,
  MaterialCategory,
  PickupReadiness,
  WasteCondition,
  WasteListing,
} from "@/types/domain";

type WasteListingRow = {
  id: string;
  generator_id: string;
  material: string;
  quantity_kg: number | string;
  condition: string;
  location: unknown;
  pickup_readiness: unknown;
  description: string | null;
  photo_urls: string[];
  status: string;
  is_simulated: boolean;
  created_at: string;
  updated_at: string;
};

export type CollectorDiscoveryItem = {
  listing: WasteListing;
  match: CollectorMatchResult;
};

export type CollectorDiscoveryResult = {
  success: boolean;
  message: string;
  items: CollectorDiscoveryItem[];
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

const LISTING_STATUSES = [
  "available",
  "assigned",
  "completed",
  "cancelled",
] as const;

function isMaterialCategory(value: string): value is MaterialCategory {
  return MATERIAL_CATEGORIES.includes(value as MaterialCategory);
}

function isWasteCondition(value: string): value is WasteCondition {
  return WASTE_CONDITIONS.includes(value as WasteCondition);
}

function isListingStatus(
  value: string,
): value is WasteListing["status"] {
  return LISTING_STATUSES.includes(
    value as (typeof LISTING_STATUSES)[number],
  );
}

function parseLocation(value: unknown): WasteListing["location"] | null {
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

function mapWasteListing(
  row: WasteListingRow,
): WasteListing | null {
  if (
    !isMaterialCategory(row.material) ||
    !isWasteCondition(row.condition) ||
    !isListingStatus(row.status)
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
    id: row.id,
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
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isSimulated: row.is_simulated,
  };
}

function mapCollectorProfile(
  data: {
    id: string;
    user_id: string;
    collectible_materials: string[];
    maximum_collection_capacity_kg: number | string;
    operating_areas: string[];
    availability: string;
    base_location: unknown;
    created_at: string;
    updated_at: string;
    is_simulated: boolean;
  },
): CollectorProfile | null {
  if (
    data.availability !== "available" &&
    data.availability !== "unavailable"
  ) {
    return null;
  }

  const capacity = Number(data.maximum_collection_capacity_kg);

  if (!Number.isFinite(capacity) || capacity <= 0) {
    return null;
  }

  const collectibleMaterials = data.collectible_materials.filter(
    isMaterialCategory,
  );

  if (collectibleMaterials.length === 0) {
    return null;
  }

  const baseLocation =
    data.base_location &&
    typeof data.base_location === "object" &&
    !Array.isArray(data.base_location)
      ? (data.base_location as CollectorProfile["baseLocation"])
      : undefined;

  return {
    id: data.id,
    userId: data.user_id,
    collectibleMaterials,
    maximumCollectionCapacityKg: capacity,
    operatingAreas: data.operating_areas,
    availability: data.availability,
    ...(baseLocation ? { baseLocation } : {}),
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    isSimulated: data.is_simulated,
  };
}

export async function getCollectorDiscovery(): Promise<CollectorDiscoveryResult> {
  const collector = await getApprovedProfile(["collector"]);

  if (!collector) {
    return {
      success: false,
      message:
        "You must be signed in with an approved collector account to view discovery.",
      items: [],
    };
  }

  const supabase = await createSupabaseServerClient();

  const { data: profileData, error: profileError } = await supabase
    .from("collector_profiles")
    .select(
      "id, user_id, collectible_materials, maximum_collection_capacity_kg, operating_areas, availability, base_location, created_at, updated_at, is_simulated",
    )
    .eq("user_id", collector.id)
    .maybeSingle();

  if (profileError) {
    return {
      success: false,
      message: "Unable to load your collector profile.",
      items: [],
    };
  }

  if (!profileData) {
    return {
      success: false,
      message:
        "Complete your collector profile before viewing discovery.",
      items: [],
    };
  }

  const collectorProfile = mapCollectorProfile(profileData);

  if (!collectorProfile) {
    return {
      success: false,
      message:
        "Your collector profile contains invalid or incomplete information.",
      items: [],
    };
  }

  const { data: listingData, error: listingError } = await supabase
    .from("waste_listings")
    .select(
      "id, generator_id, material, quantity_kg, condition, location, pickup_readiness, description, photo_urls, status, is_simulated, created_at, updated_at",
    )
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(50);

  if (listingError) {
    return {
      success: false,
      message: "Unable to load available waste listings.",
      items: [],
    };
  }

  const items: CollectorDiscoveryItem[] = [];

  for (const row of (listingData ?? []) as WasteListingRow[]) {
    const listing = mapWasteListing(row);

    if (!listing) {
      continue;
    }

    const match = getCollectorMatchResult(
      collectorProfile,
      listing,
    );

    if (!match) {
      continue;
    }

    items.push({
      listing,
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
      new Date(b.listing.createdAt).getTime() -
      new Date(a.listing.createdAt).getTime()
    );
  });

  return {
    success: true,
    message: "Discovery loaded successfully.",
    items,
  };
}