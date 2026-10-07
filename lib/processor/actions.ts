"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getApprovedProfile } from "@/lib/auth/get-approved-profile";
import type {
  FacilityType,
  MaterialCategory,
  QuantityInput,
} from "@/types/domain";

export type ProcessorProfileActionState = {
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

const FACILITY_TYPES: FacilityType[] = ["processor", "buyer"];

const FACILITY_CITIES = ["Ghaziabad", "Noida"] as const;

const QUANTITY_UNITS = ["kg", "tonnes"] as const;

type ProcessorLocationInput = {
  address: string;
  city: "Ghaziabad" | "Noida";
  state: "Uttar Pradesh";
  latitude?: number;
  longitude?: number;
};

export type CreateProcessorProfileInput = {
  facilityType: FacilityType;
  acceptedMaterials: MaterialCategory[];
  minimumRequiredQuantity: QuantityInput;
  maximumRequiredQuantity: QuantityInput;
  processingCapacity: QuantityInput;
  location: ProcessorLocationInput;
};

function isMaterialCategory(value: unknown): value is MaterialCategory {
  return (
    typeof value === "string" &&
    MATERIAL_CATEGORIES.includes(value as MaterialCategory)
  );
}

function isFacilityType(value: unknown): value is FacilityType {
  return (
    typeof value === "string" &&
    FACILITY_TYPES.includes(value as FacilityType)
  );
}

function isQuantityUnit(
  value: unknown,
): value is (typeof QUANTITY_UNITS)[number] {
  return (
    typeof value === "string" &&
    QUANTITY_UNITS.includes(value as (typeof QUANTITY_UNITS)[number])
  );
}

function isFacilityCity(
  value: unknown,
): value is (typeof FACILITY_CITIES)[number] {
  return (
    typeof value === "string" &&
    FACILITY_CITIES.includes(value as (typeof FACILITY_CITIES)[number])
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

function isValidQuantity(value: unknown): value is QuantityInput {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const quantity = value as Record<string, unknown>;

  return (
    typeof quantity.value === "number" &&
    Number.isFinite(quantity.value) &&
    quantity.value > 0 &&
    isQuantityUnit(quantity.unit)
  );
}

function isValidLocation(value: unknown): value is ProcessorLocationInput {
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

  if (!isFacilityCity(location.city)) {
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

function isValidCreateProcessorProfileInput(
  input: unknown,
): input is CreateProcessorProfileInput {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return false;
  }

  const profile = input as Record<string, unknown>;

  if (!isFacilityType(profile.facilityType)) {
    return false;
  }

  if (
    !Array.isArray(profile.acceptedMaterials) ||
    profile.acceptedMaterials.length === 0 ||
    !profile.acceptedMaterials.every(isMaterialCategory)
  ) {
    return false;
  }

  const uniqueMaterials = new Set(profile.acceptedMaterials);

  if (uniqueMaterials.size !== profile.acceptedMaterials.length) {
    return false;
  }

  if (!isValidQuantity(profile.minimumRequiredQuantity)) {
    return false;
  }

  if (!isValidQuantity(profile.maximumRequiredQuantity)) {
    return false;
  }

  if (!isValidQuantity(profile.processingCapacity)) {
    return false;
  }

  if (!isValidLocation(profile.location)) {
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

export async function saveProcessorProfileAction(
  input: CreateProcessorProfileInput,
): Promise<ProcessorProfileActionState> {
  const processor = await getApprovedProfile(["processor"]);

  if (!processor) {
    return {
      success: false,
      message:
        "You must be signed in with an approved processor account to manage a processor profile.",
    };
  }

  if (!isValidCreateProcessorProfileInput(input)) {
    return {
      success: false,
      message: "The processor profile details are invalid.",
    };
  }

  const minimumRequiredQuantityKg = normalizeQuantityToKg(
    input.minimumRequiredQuantity,
  );

  const maximumRequiredQuantityKg = normalizeQuantityToKg(
    input.maximumRequiredQuantity,
  );

  const processingCapacityKg = normalizeQuantityToKg(
    input.processingCapacity,
  );

  if (
    !Number.isFinite(minimumRequiredQuantityKg) ||
    minimumRequiredQuantityKg <= 0
  ) {
    return {
      success: false,
      message: "The minimum required quantity must be greater than zero.",
    };
  }

  if (
    !Number.isFinite(maximumRequiredQuantityKg) ||
    maximumRequiredQuantityKg < minimumRequiredQuantityKg
  ) {
    return {
      success: false,
      message:
        "The maximum required quantity must be greater than or equal to the minimum required quantity.",
    };
  }

  if (!Number.isFinite(processingCapacityKg) || processingCapacityKg <= 0) {
    return {
      success: false,
      message: "The processing capacity must be greater than zero.",
    };
  }

  const location = {
    address: input.location.address.trim(),
    city: input.location.city,
    state: input.location.state,
    ...(input.location.latitude !== undefined &&
    input.location.longitude !== undefined
      ? {
          coordinates: {
            latitude: input.location.latitude,
            longitude: input.location.longitude,
          },
        }
      : {}),
  };

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.rpc("save_processor_profile", {
    p_facility_type: input.facilityType,
    p_accepted_materials: input.acceptedMaterials,
    p_minimum_required_quantity_kg: minimumRequiredQuantityKg,
    p_maximum_required_quantity_kg: maximumRequiredQuantityKg,
    p_processing_capacity_kg: processingCapacityKg,
    p_location: location,
  });

  if (error || !data) {
    return {
      success: false,
      message:
        "Unable to save the processor profile. Please check your details and try again.",
    };
  }

  return {
    success: true,
    message: "Processor profile saved successfully.",
    profileId: data,
  };
}