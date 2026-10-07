import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getApprovedProfile } from "@/lib/auth/get-approved-profile";
import type {
  MaterialCategory,
  RecoveryTransaction,
  TransactionStatus,
  WasteCondition,
  WasteListing,
} from "@/types/domain";

const ACTIVE_TRANSACTION_STATUSES: TransactionStatus[] = [
  "collected",
  "in_transit",
  "received",
];

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

function isMaterialCategory(value: string): value is MaterialCategory {
  return MATERIAL_CATEGORIES.includes(value as MaterialCategory);
}

function isWasteCondition(value: string): value is WasteCondition {
  return WASTE_CONDITIONS.includes(value as WasteCondition);
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
): WasteListing["pickupReadiness"] | null {
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

type RecoveryTransactionRow = {
  id: string;
  listing_id: string;
  generator_id: string;
  collector_id: string;
  processor_id: string | null;
  status: string;
  agreed_amount_inr: number | string | null;
  payment_status: string;
  is_simulated: boolean;
  created_at: string;
  updated_at: string;
};

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

type ProfileRow = {
  id: string;
  display_name: string;
  organization_name: string | null;
  role: string;
};

export type ProcessorActiveRecovery = {
  transaction: RecoveryTransaction;
  listing: WasteListing;
  reservation: {
    isReserved: true;
    processorId: string;
  };
  generator: {
    displayName: string;
    organizationName: string | null;
  };
  collector: {
    displayName: string;
    organizationName: string | null;
  };
};

export type ProcessorActiveRecoveriesResult = {
  success: boolean;
  message: string;
  items: ProcessorActiveRecovery[];
};

function mapRecoveryTransaction(
  row: RecoveryTransactionRow,
): RecoveryTransaction | null {
  const status = row.status as TransactionStatus;

  if (!ACTIVE_TRANSACTION_STATUSES.includes(status)) {
    return null;
  }

  if (!row.processor_id) {
    return null;
  }

  if (
    row.payment_status !== "pending" &&
    row.payment_status !== "paid" &&
    row.payment_status !== "not_applicable"
  ) {
    return null;
  }

  const agreedAmountInr =
    row.agreed_amount_inr === null
      ? undefined
      : Number(row.agreed_amount_inr);

  if (
    agreedAmountInr !== undefined &&
    !Number.isFinite(agreedAmountInr)
  ) {
    return null;
  }

  return {
    id: row.id,
    listingId: row.listing_id,
    generatorId: row.generator_id,
    collectorId: row.collector_id,
    processorId: row.processor_id,
    status,
    statusHistory: [],
    ...(agreedAmountInr !== undefined
      ? {
          agreedAmountInr,
        }
      : {}),
    paymentStatus: row.payment_status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isSimulated: row.is_simulated,
  };
}

function mapWasteListing(row: WasteListingRow): WasteListing | null {
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

  if (
    row.status !== "available" &&
    row.status !== "assigned" &&
    row.status !== "completed" &&
    row.status !== "cancelled"
  ) {
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

export async function getProcessorActiveRecoveries(): Promise<ProcessorActiveRecoveriesResult> {
  const processor = await getApprovedProfile(["processor"]);

  if (!processor) {
    return {
      success: false,
      message:
        "You must be signed in with an approved processor account to view active recoveries.",
      items: [],
    };
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: transactionData,
    error: transactionError,
  } = await supabase
    .from("recovery_transactions")
    .select(
      "id, listing_id, generator_id, collector_id, processor_id, status, agreed_amount_inr, payment_status, is_simulated, created_at, updated_at",
    )
    .eq("processor_id", processor.id)
    .in("status", ACTIVE_TRANSACTION_STATUSES)
    .order("updated_at", { ascending: false })
    .limit(50);

  if (transactionError) {
    return {
      success: false,
      message: "Unable to load your active recovery transactions.",
      items: [],
    };
  }

  const transactions =
    (transactionData ?? []) as RecoveryTransactionRow[];

  if (transactions.length === 0) {
    return {
      success: true,
      message: "Active recoveries loaded successfully.",
      items: [],
    };
  }

  const listingIds = [
    ...new Set(transactions.map((row) => row.listing_id)),
  ];

  const participantIds = [
    ...new Set(
      transactions.flatMap((row) => [
        row.generator_id,
        row.collector_id,
      ]),
    ),
  ];

  const { data: listingData, error: listingError } = await supabase
    .from("waste_listings")
    .select(
      "id, generator_id, material, quantity_kg, condition, location, pickup_readiness, description, photo_urls, status, is_simulated, created_at, updated_at",
    )
    .in("id", listingIds);

  if (listingError) {
    return {
      success: false,
      message: "Unable to load recovery listing details.",
      items: [],
    };
  }

  const listingMap = new Map<string, WasteListingRow>();

  for (const listing of (listingData ?? []) as WasteListingRow[]) {
    listingMap.set(listing.id, listing);
  }

  const profileMap = new Map<string, ProfileRow>();

  if (participantIds.length > 0) {
    const { data: profileData, error: profileError } =
      await supabase
        .from("profiles")
        .select("id, display_name, organization_name, role")
        .in("id", participantIds);

    if (profileError) {
      return {
        success: false,
        message: "Unable to load recovery participant details.",
        items: [],
      };
    }

    for (const profile of (profileData ?? []) as ProfileRow[]) {
      profileMap.set(profile.id, profile);
    }
  }

  const items: ProcessorActiveRecovery[] = [];

  for (const transactionRow of transactions) {
    const transaction = mapRecoveryTransaction(transactionRow);

    if (!transaction) {
      continue;
    }

    const listingRow = listingMap.get(transactionRow.listing_id);
    const listing = listingRow
      ? mapWasteListing(listingRow)
      : null;

    if (!listing) {
      continue;
    }

    const generator = profileMap.get(transactionRow.generator_id);
    const collector = profileMap.get(transactionRow.collector_id);

    if (!generator || generator.role !== "generator") {
      continue;
    }

    if (!collector || collector.role !== "collector") {
      continue;
    }

    items.push({
      transaction,
      listing,
      reservation: {
        isReserved: true,
        processorId: processor.id,
      },
      generator: {
        displayName: generator.display_name,
        organizationName: generator.organization_name,
      },
      collector: {
        displayName: collector.display_name,
        organizationName: collector.organization_name,
      },
    });
  }

  return {
    success: true,
    message: "Active recoveries loaded successfully.",
    items,
  };
}