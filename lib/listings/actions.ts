"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getApprovedProfile } from "@/lib/auth/get-approved-profile";
import type {
  CreateWasteListingInput,
  MaterialCategory,
  QuantityUnit,
  WasteCondition,
} from "@/types/domain";

export type WasteListingActionState = {
  success: boolean;
  message: string;
  listingId?: string;
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

const QUANTITY_UNITS: QuantityUnit[] = ["kg", "tonnes"];

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMaterialCategory(value: unknown): value is MaterialCategory {
  return (
    typeof value === "string" &&
    MATERIAL_CATEGORIES.includes(value as MaterialCategory)
  );
}

function isWasteCondition(value: unknown): value is WasteCondition {
  return (
    typeof value === "string" &&
    WASTE_CONDITIONS.includes(value as WasteCondition)
  );
}

function isQuantityUnit(value: unknown): value is QuantityUnit {
  return (
    typeof value === "string" &&
    QUANTITY_UNITS.includes(value as QuantityUnit)
  );
}

function isValidDateTime(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) {
    return false;
  }

  const timestamp = Date.parse(value);

  return Number.isFinite(timestamp);
}

function isValidLocation(value: unknown): boolean {
  if (!isPlainObject(value)) {
    return false;
  }

  if (
    typeof value.address !== "string" ||
    typeof value.city !== "string" ||
    typeof value.state !== "string" ||
    !value.address.trim() ||
    !value.city.trim() ||
    !value.state.trim()
  ) {
    return false;
  }

  if (value.coordinates === undefined) {
    return true;
  }

  if (!isPlainObject(value.coordinates)) {
    return false;
  }

  const { latitude, longitude } = value.coordinates;

  return (
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    typeof longitude === "number" &&
    Number.isFinite(longitude) &&
    longitude >= -180 &&
    longitude <= 180
  );
}

function isValidPickupReadiness(value: unknown): boolean {
  if (!isPlainObject(value) || typeof value.status !== "string") {
    return false;
  }

  if (value.status === "ready_now") {
    return true;
  }

  if (value.status === "scheduled") {
    return isValidDateTime(value.availableFrom);
  }

  return false;
}

function isValidPhotoUrls(value: unknown): boolean {
  if (value === undefined) {
    return true;
  }

  if (!Array.isArray(value)) {
    return false;
  }

  return value.every((photoUrl) => {
    if (typeof photoUrl !== "string" || !photoUrl.trim()) {
      return false;
    }

    try {
      const url = new URL(photoUrl);

      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  });
}

function isValidCreateWasteListingInput(
  input: unknown,
): input is CreateWasteListingInput {
  if (!isPlainObject(input)) {
    return false;
  }

  if (!isMaterialCategory(input.material)) {
    return false;
  }

  if (!isPlainObject(input.quantity)) {
    return false;
  }

  if (
    typeof input.quantity.value !== "number" ||
    !Number.isFinite(input.quantity.value) ||
    input.quantity.value <= 0 ||
    !isQuantityUnit(input.quantity.unit)
  ) {
    return false;
  }

  if (!isWasteCondition(input.condition)) {
    return false;
  }

  if (!isValidLocation(input.location)) {
    return false;
  }

  if (!isValidPickupReadiness(input.pickupReadiness)) {
    return false;
  }

  if (input.description !== undefined) {
    if (
      typeof input.description !== "string" ||
      input.description.length === 0
    ) {
      return false;
    }
  }

  if (!isValidPhotoUrls(input.photoUrls)) {
    return false;
  }

  return true;
}

function normalizeQuantityToKg(quantity: CreateWasteListingInput["quantity"]): number {
  if (quantity.unit === "kg") {
    return quantity.value;
  }

  return quantity.value * 1000;
}

export async function createWasteListingAction(
  input: CreateWasteListingInput,
): Promise<WasteListingActionState> {
  const generator = await getApprovedProfile(["generator"]);

  if (!generator) {
    return {
      success: false,
      message:
        "You must be signed in with an approved generator account to create a listing.",
    };
  }

  if (!isValidCreateWasteListingInput(input)) {
    return {
      success: false,
      message: "The waste listing details are invalid.",
    };
  }

  const quantityKg = normalizeQuantityToKg(input.quantity);

  if (!Number.isFinite(quantityKg) || quantityKg <= 0) {
    return {
      success: false,
      message: "The quantity must be greater than zero.",
    };
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("waste_listings")
    .insert({
      generator_id: generator.id,
      material: input.material,
      quantity_kg: quantityKg,
      condition: input.condition,
      location: input.location,
      pickup_readiness: input.pickupReadiness,
      description: input.description?.trim() || null,
      photo_urls: input.photoUrls ?? [],
      status: "available",
    })
    .select("id")
    .single();

  if (error || !data) {
    return {
      success: false,
      message:
        "Unable to create the waste listing. Please check your details and try again.",
    };
  }

  return {
    success: true,
    message: "Waste listing created successfully.",
    listingId: data.id,
  };
}
