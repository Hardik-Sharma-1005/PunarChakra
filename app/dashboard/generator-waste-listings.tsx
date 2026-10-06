import type {
  ListingStatus,
  MaterialCategory,
  PickupReadiness,
  WasteCondition,
} from "@/types/domain";

import { createSupabaseServerClient } from "@/lib/supabase/server";

interface GeneratorWasteListingsProps {
  generatorId: string;
}

interface WasteListingRow {
  id: string;
  generator_id: string;
  material: string;
  quantity_kg: number | string;
  condition: string;
  location: {
    address: string;
    city: string;
    state: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  pickup_readiness: PickupReadiness;
  status: string;
  created_at: string;
}

interface RecoveryTransactionRow {
  id: string;
  listing_id: string;
  status: string;
  payment_status: string;
  created_at: string;
}

const materialLabels: Record<MaterialCategory, string> = {
  concrete_rubble: "Concrete & Rubble",
  bricks_masonry: "Bricks & Masonry",
  scrap_metal: "Scrap Metal",
  wood: "Wood",
  glass: "Glass",
  soil_excavated: "Soil / Excavated Material",
  mixed_cd_waste: "Mixed C&D Waste",
};

const conditionLabels: Record<WasteCondition, string> = {
  clean_sorted: "Clean & Sorted",
  mixed_materials: "Mixed Materials",
  contaminated: "Contaminated",
  requires_sorting: "Requires Sorting",
};

const statusStyles: Record<
  ListingStatus,
  {
    label: string;
    className: string;
  }
> = {
  available: {
    label: "Available",
    className: "border-[#b9d1bd] bg-[#eef6ef] text-[#28563b]",
  },
  assigned: {
    label: "Assigned",
    className: "border-[#e4c9a9] bg-[#fff5e8] text-[#9a5b20]",
  },
  completed: {
    label: "Completed",
    className: "border-[#bfd0e1] bg-[#eef5fb] text-[#315b80]",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-[#e4bdb8] bg-[#fff1ef] text-[#9b4036]",
  },
};

const transactionStatusLabels: Record<string, string> = {
  assigned: "Assigned to collector",
  pickup_in_progress: "Pickup in progress",
  collected: "Collected",
  in_transit: "In transit",
  received: "Received by processor",
  completed: "Recovery completed",
  cancelled: "Recovery cancelled",
};

const paymentStatusLabels: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  not_applicable: "Not applicable",
};

function formatQuantity(quantityKg: number | string): string {
  const kilograms = Number(quantityKg);

  if (!Number.isFinite(kilograms)) {
    return "—";
  }

  if (kilograms >= 1000) {
    return `${(kilograms / 1000).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })} tonnes`;
  }

  return `${kilograms.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })} kg`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPickupReadiness(
  pickupReadiness: PickupReadiness,
): string {
  if (pickupReadiness.status === "ready_now") {
    return "Ready now";
  }

  const date = new Date(pickupReadiness.availableFrom);

  if (Number.isNaN(date.getTime())) {
    return "Scheduled";
  }

  return `From ${date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

export default async function GeneratorWasteListings({
  generatorId,
}: GeneratorWasteListingsProps) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("waste_listings")
    .select(
      "id, generator_id, material, quantity_kg, condition, location, pickup_readiness, status, created_at",
    )
    .eq("generator_id", generatorId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    return (
      <section className="border border-[#d9dfd3] bg-white p-6 sm:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d97736]">
            Your listings
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#203b2c]">
            Listing history
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#9b4036]">
            We could not load your listings right now. Please refresh
            the page and try again.
          </p>
        </div>
      </section>
    );
  }

  const listings = (data ?? []) as WasteListingRow[];

  const listingIds = listings.map((listing) => listing.id);

  let transactions: RecoveryTransactionRow[] = [];

  if (listingIds.length > 0) {
    const { data: transactionData } = await supabase
      .from("recovery_transactions")
      .select(
        "id, listing_id, status, payment_status, created_at",
      )
      .in("listing_id", listingIds);

    transactions = (transactionData ??
      []) as RecoveryTransactionRow[];
  }

  const transactionsByListingId = new Map(
    transactions.map((transaction) => [
      transaction.listing_id,
      transaction,
    ]),
  );

  return (
    <section className="border border-[#d9dfd3] bg-white p-6 sm:p-8">
      <div className="border-b border-[#d9dfd3] pb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d97736]">
          Your listings
        </p>

        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#203b2c]">
              Listing history
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#66756a]">
              Track the material you have listed and its current recovery
              status.
            </p>
          </div>

          {listings.length > 0 ? (
            <span className="text-xs font-medium text-[#66756a]">
              Showing latest {listings.length}
            </span>
          ) : null}
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="py-10 text-center">
          <h3 className="text-base font-semibold text-[#203b2c]">
            No listings yet
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#66756a]">
            Once you create a waste listing, it will appear here with
            its current recovery status.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {listings.map((listing) => {
            const status = statusStyles[listing.status as ListingStatus];

            const material =
              materialLabels[listing.material as MaterialCategory] ??
              listing.material;

            const condition =
              conditionLabels[listing.condition as WasteCondition] ??
              listing.condition;

            const location = listing.location;
            const transaction = transactionsByListingId.get(listing.id);

            return (
              <article
                key={listing.id}
                className="border border-[#d9dfd3] p-5 transition hover:border-[#aeb9b0] sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#203b2c]">
                      {material}
                    </h3>

                    <p className="mt-1 text-sm text-[#66756a]">
                      Listed {formatDate(listing.created_at)}
                    </p>
                  </div>

                  {status ? (
                    <span
                      className={`inline-flex w-fit border px-3 py-1 text-xs font-semibold ${status.className}`}
                    >
                      {status.label}
                    </span>
                  ) : (
                    <span className="inline-flex w-fit border border-[#d9dfd3] bg-[#f5f5ed] px-3 py-1 text-xs font-semibold text-[#66756a]">
                      {listing.status}
                    </span>
                  )}
                </div>

                <div className="mt-5 grid gap-5 border-t border-[#d9dfd3] pt-5 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#66756a]">
                      Quantity
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#203b2c]">
                      {formatQuantity(listing.quantity_kg)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#66756a]">
                      Condition
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#203b2c]">
                      {condition}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#66756a]">
                      Pickup
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#203b2c]">
                      {formatPickupReadiness(
                        listing.pickup_readiness,
                      )}
                    </p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#66756a]">
                      Location
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#203b2c]">
                      {location.address}, {location.city},{" "}
                      {location.state}
                    </p>
                  </div>
                </div>

                {transaction ? (
                  <div className="mt-6 border-t border-[#d9dfd3] pt-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#d97736]">
                          Recovery transaction
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#203b2c]">
                          {transactionStatusLabels[
                            transaction.status
                          ] ?? transaction.status}
                        </p>
                      </div>

                      <span className="border border-[#e4c9a9] bg-[#fff5e8] px-3 py-1 text-xs font-semibold text-[#9a5b20]">
                        Payment:{" "}
                        {paymentStatusLabels[
                          transaction.payment_status
                        ] ?? transaction.payment_status}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#66756a]">
                          Transaction ID
                        </p>

                        <p className="mt-1 break-all font-mono text-xs text-[#203b2c]">
                          {transaction.id}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#66756a]">
                          Accepted on
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#203b2c]">
                          {formatDate(transaction.created_at)}
                        </p>
                      </div>
                    </div>
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