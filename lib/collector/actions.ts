"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getApprovedProfile } from "@/lib/auth/get-approved-profile";
import type {
  CollectorAvailability,
  MaterialCategory,
  QuantityInput,
  QuantityUnit,
} from "@/types/domain";

export type CollectorProfileActionState = {
  success: boolean;
  message: string;
  profileId?: string;
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

const OPERATING_AREAS = ["Ghaziabad", "Noida"] as const;

const COLLECTOR_AVAILABILITIES: CollectorAvailability[] = [
  "available",
  "unavailable",
];

const QUANTITY_UNITS: QuantityUnit[] = ["kg", "tonnes"];

type BaseLocationInput = {
  address: string;
  city: string;
  state: "Uttar Pradesh";
  latitude?: number;
  longitude?: number;
};

export type CreateCollectorProfileInput = {
  collectibleMaterials: MaterialCategory[];
  maximumCollectionCapacity: QuantityInput;
  operatingAreas: string[];
  availability: CollectorAvailability;
  baseLocation: BaseLocationInput;
};

function isMaterialCategory(value: unknown): value is MaterialCategory {
  return (
    typeof value === "string" &&
    MATERIAL_CATEGORIES.includes(value as MaterialCategory)
  );
}

function isQuantityUnit(value: unknown): value is QuantityUnit {
  return (
    typeof value === "string" &&
    QUANTITY_UNITS.includes(value as QuantityUnit)
  );
}

function isCollectorAvailability(
  value: unknown,
): value is CollectorAvailability {
  return (
    typeof value === "string" &&
    COLLECTOR_AVAILABILITIES.includes(value as CollectorAvailability)
  );
}

function isOperatingArea(value: unknown): value is string {
  return (
    typeof value === "string" &&
    OPERATING_AREAS.includes(value as (typeof OPERATING_AREAS)[number])
  );
}

function isFiniteCoordinate(
  value: unknown,
  minimum: number,
  maximum: number,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= minimum &&
    value <= maximum
  );
}

function isValidBaseLocation(value: unknown): value is BaseLocationInput {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const location = value as Record<string, unknown>;

  if (
    typeof location.address !== "string" ||
    !location.address.trim() ||
    location.address.length > 500
  ) {
    return false;
  }

  if (!isOperatingArea(location.city)) {
    return false;
  }

  if (location.state !== "Uttar Pradesh") {
    return false;
  }

  const hasLatitude = location.latitude !== undefined;
  const hasLongitude = location.longitude !== undefined;

  if (hasLatitude !== hasLongitude) {
    return false;
  }

  if (
    hasLatitude &&
    (!isFiniteCoordinate(location.latitude, -90, 90) ||
      !isFiniteCoordinate(location.longitude, -180, 180))
  ) {
    return false;
  }

  return true;
}

function isValidCreateCollectorProfileInput(
  input: unknown,
): input is CreateCollectorProfileInput {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return false;
  }

  const profile = input as Record<string, unknown>;

  if (
    !Array.isArray(profile.collectibleMaterials) ||
    profile.collectibleMaterials.length === 0 ||
    !profile.collectibleMaterials.every(isMaterialCategory)
  ) {
    return false;
  }

  const uniqueMaterials = new Set(profile.collectibleMaterials);

  if (uniqueMaterials.size !== profile.collectibleMaterials.length) {
    return false;
  }

  if (
    typeof profile.maximumCollectionCapacity !== "object" ||
    profile.maximumCollectionCapacity === null ||
    Array.isArray(profile.maximumCollectionCapacity)
  ) {
    return false;
  }

  const quantity = profile.maximumCollectionCapacity as Record<
    string,
    unknown
  >;

  if (
    typeof quantity.value !== "number" ||
    !Number.isFinite(quantity.value) ||
    quantity.value <= 0 ||
    !isQuantityUnit(quantity.unit)
  ) {
    return false;
  }

  if (
    !Array.isArray(profile.operatingAreas) ||
    profile.operatingAreas.length === 0 ||
    !profile.operatingAreas.every(isOperatingArea)
  ) {
    return false;
  }

  const uniqueOperatingAreas = new Set(profile.operatingAreas);

  if (uniqueOperatingAreas.size !== profile.operatingAreas.length) {
    return false;
  }

  if (!isCollectorAvailability(profile.availability)) {
    return false;
  }

  if (!isValidBaseLocation(profile.baseLocation)) {
    return false;
  }

  return true;
}

function normalizeQuantityToKg(quantity: QuantityInput): number {
  if (quantity.unit === "kg") {
    return quantity.value;
  }

  return quantity.value * 1000;
}

export async function saveCollectorProfileAction(
  input: CreateCollectorProfileInput,
): Promise<CollectorProfileActionState> {
  const collector = await getApprovedProfile(["collector"]);

  if (!collector) {
    return {
      success: false,
      message:
        "You must be signed in with an approved collector account to manage a collector profile.",
    };
  }

  if (!isValidCreateCollectorProfileInput(input)) {
    return {
      success: false,
      message: "The collector profile details are invalid.",
    };
  }

  const maximumCollectionCapacityKg = normalizeQuantityToKg(
    input.maximumCollectionCapacity,
  );

  if (
    !Number.isFinite(maximumCollectionCapacityKg) ||
    maximumCollectionCapacityKg <= 0
  ) {
    return {
      success: false,
      message: "The maximum collection capacity must be greater than zero.",
    };
  }

  const baseLocation = {
    address: input.baseLocation.address.trim(),
    city: input.baseLocation.city,
    state: input.baseLocation.state,
    ...(input.baseLocation.latitude !== undefined &&
    input.baseLocation.longitude !== undefined
      ? {
          coordinates: {
            latitude: input.baseLocation.latitude,
            longitude: input.baseLocation.longitude,
          },
        }
      : {}),
  };

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("collector_profiles")
    .upsert(
      {
        user_id: collector.id,
        collectible_materials: input.collectibleMaterials,
        maximum_collection_capacity_kg: maximumCollectionCapacityKg,
        operating_areas: input.operatingAreas,
        availability: input.availability,
        base_location: baseLocation,
      },
      {
        onConflict: "user_id",
      },
    )
    .select("id")
    .single();

  if (error || !data) {
    return {
      success: false,
      message:
        "Unable to save the collector profile. Please check your details and try again.",
    };
  }

  return {
    success: true,
    message: "Collector profile saved successfully.",
    profileId: data.id,
  };
}