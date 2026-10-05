/**
 * Shared contracts for UI mock data and future application services.
 * Keep these domain shapes independent of Supabase so teammates can use them
 * before the database is connected.
 */

export type ISODateTime = string;

export type UserRole = "generator" | "collector" | "processor" | "admin";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export type MaterialCategory =
  | "concrete_rubble"
  | "bricks_masonry"
  | "scrap_metal"
  | "wood"
  | "glass"
  | "soil_excavated"
  | "mixed_cd_waste";

export type WasteCondition =
  | "clean_sorted"
  | "mixed_materials"
  | "contaminated"
  | "requires_sorting";

export type QuantityUnit = "kg" | "tonnes";

/** A quantity as entered in a form; persisted weights use kilograms. */
export interface QuantityInput {
  value: number;
  unit: QuantityUnit;
}

export type Kilograms = number;

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface MaterialLocation {
  address: string;
  city: string;
  state: string;
  coordinates?: Coordinates;
}

export type PickupReadiness =
  | { status: "ready_now" }
  | { status: "scheduled"; availableFrom: ISODateTime };

/** Shared metadata makes simulated records easy to label in the UI. */
export interface RecordMetadata {
  id: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  isSimulated: boolean;
}

/** The public profile shape; credentials and private auth data live separately. */
export interface UserProfile extends RecordMetadata {
  displayName: string;
  organizationName?: string;
  role: UserRole;
  approvalStatus: ApprovalStatus;
}

export type ListingStatus = "available" | "assigned" | "completed" | "cancelled";

export interface WasteListing extends RecordMetadata {
  generatorId: string;
  material: MaterialCategory;
  /** Canonical stored quantity, normalized from the form's kg/tonnes input. */
  quantityKg: Kilograms;
  condition: WasteCondition;
  location: MaterialLocation;
  pickupReadiness: PickupReadiness;
  description?: string;
  photoUrls?: string[];
  status: ListingStatus;
}

/** Fields submitted by the generator; ownership and status are server-assigned. */
export interface CreateWasteListingInput {
  material: MaterialCategory;
  quantity: QuantityInput;
  condition: WasteCondition;
  location: MaterialLocation;
  pickupReadiness: PickupReadiness;
  description?: string;
  photoUrls?: string[];
}

export type CollectorAvailability = "available" | "unavailable";

export interface CollectorProfile extends RecordMetadata {
  userId: string;
  collectibleMaterials: MaterialCategory[];
  maximumCollectionCapacityKg: Kilograms;
  operatingAreas: string[];
  availability: CollectorAvailability;
  baseLocation?: MaterialLocation;
}

export type FacilityType = "processor" | "buyer";

export interface ProcessorProfile extends RecordMetadata {
  userId: string;
  facilityType: FacilityType;
  acceptedMaterials: MaterialCategory[];
  minimumRequiredQuantityKg: Kilograms;
  maximumRequiredQuantityKg: Kilograms;
  processingCapacityKg: Kilograms;
  location: MaterialLocation;
}

export type TransactionStatus =
  | "assigned"
  | "pickup_in_progress"
  | "collected"
  | "in_transit"
  | "received"
  | "completed"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "not_applicable";

export interface TransactionStatusEvent {
  id: string;
  status: TransactionStatus;
  changedAt: ISODateTime;
  changedByUserId: string;
  note?: string;
}

/** Traceable record linking one listing to its recovery workflow. */
export interface RecoveryTransaction extends RecordMetadata {
  listingId: string;
  generatorId: string;
  collectorId: string;
  processorId?: string;
  status: TransactionStatus;
  statusHistory: TransactionStatusEvent[];
  agreedAmountInr?: number;
  paymentStatus: PaymentStatus;
}

export type MatchReason =
  | "material_accepted"
  | "quantity_within_capacity"
  | "within_operating_area"
  | "currently_available"
  | "pickup_ready"
  | "quantity_within_requirement"
  | "processing_capacity_available"
  | "nearby_facility";

/** Recommendations explain the rules that matched; they carry no confidence score. */
export interface MatchRecommendation {
  listingId: string;
  candidateUserId: string;
  candidateRole: "collector" | "processor";
  reasons: MatchReason[];
}
