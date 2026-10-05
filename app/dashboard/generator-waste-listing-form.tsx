"use client";

import { useState } from "react";

import { createWasteListingAction } from "@/lib/listings/actions";
import type {
  MaterialCategory,
  WasteCondition,
} from "@/types/domain";

const materialOptions: {
  value: MaterialCategory;
  label: string;
}[] = [
  {
    value: "concrete_rubble",
    label: "Concrete & Rubble",
  },
  {
    value: "bricks_masonry",
    label: "Bricks & Masonry",
  },
  {
    value: "scrap_metal",
    label: "Scrap Metal",
  },
  {
    value: "wood",
    label: "Wood",
  },
  {
    value: "glass",
    label: "Glass",
  },
  {
    value: "soil_excavated",
    label: "Soil / Excavated Material",
  },
  {
    value: "mixed_cd_waste",
    label: "Mixed C&D Waste",
  },
];

const conditionOptions: {
  value: WasteCondition;
  label: string;
}[] = [
  {
    value: "clean_sorted",
    label: "Clean & Sorted",
  },
  {
    value: "mixed_materials",
    label: "Mixed Materials",
  },
  {
    value: "contaminated",
    label: "Contaminated",
  },
  {
    value: "requires_sorting",
    label: "Requires Sorting",
  },
];

const inputClassName =
  "mt-2 w-full border border-[#d9dfd3] bg-white px-4 py-3 text-sm text-[#203b2c] outline-none transition placeholder:text-[#9aa59c] focus:border-[#28563b] focus:ring-1 focus:ring-[#28563b]";

const labelClassName =
  "text-sm font-semibold text-[#203b2c]";

export default function GeneratorWasteListingForm() {
  const [material, setMaterial] =
    useState<MaterialCategory>("concrete_rubble");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState<"kg" | "tonnes">("kg");
  const [condition, setCondition] =
    useState<WasteCondition>("clean_sorted");

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [pickupStatus, setPickupStatus] =
    useState<"ready_now" | "scheduled">("ready_now");
  const [availableFrom, setAvailableFrom] = useState("");

  const [description, setDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage(null);
    setSuccess(false);

    const numericQuantity = Number(quantity);

    if (!Number.isFinite(numericQuantity) || numericQuantity <= 0) {
      setMessage("Please enter a quantity greater than zero.");
      return;
    }

    if (description.length > 500) {
      setMessage("Description cannot exceed 500 characters.");
      return;
    }

    if (pickupStatus === "scheduled" && !availableFrom) {
      setMessage("Please select when the material will be ready.");
      return;
    }

    const parsedLatitude =
      latitude.trim() === "" ? undefined : Number(latitude);

    const parsedLongitude =
      longitude.trim() === "" ? undefined : Number(longitude);

    if (
      parsedLatitude !== undefined &&
      (!Number.isFinite(parsedLatitude) ||
        parsedLatitude < -90 ||
        parsedLatitude > 90)
    ) {
      setMessage("Please enter a valid latitude between -90 and 90.");
      return;
    }

    if (
      parsedLongitude !== undefined &&
      (!Number.isFinite(parsedLongitude) ||
        parsedLongitude < -180 ||
        parsedLongitude > 180)
    ) {
      setMessage("Please enter a valid longitude between -180 and 180.");
      return;
    }

    setSubmitting(true);

    const result = await createWasteListingAction({
      material,
      quantity: {
        value: numericQuantity,
        unit,
      },
      condition,
      location: {
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        ...(parsedLatitude !== undefined &&
        parsedLongitude !== undefined
          ? {
              coordinates: {
                latitude: parsedLatitude,
                longitude: parsedLongitude,
              },
            }
          : {}),
      },
      pickupReadiness:
        pickupStatus === "ready_now"
          ? {
              status: "ready_now",
            }
          : {
              status: "scheduled",
              availableFrom: new Date(availableFrom).toISOString(),
            },
      description: description.trim() || undefined,
    });

    setSubmitting(false);
    setMessage(result.message);
    setSuccess(result.success);

    if (result.success) {
      setQuantity("");
      setAddress("");
      setCity("");
      setState("");
      setLatitude("");
      setLongitude("");
      setPickupStatus("ready_now");
      setAvailableFrom("");
      setDescription("");
    }
  }

  return (
    <section className="border border-[#d9dfd3] bg-white p-6 sm:p-8">
      <div className="border-b border-[#d9dfd3] pb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d97736]">
          Generator
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#203b2c]">
          List your recoverable material
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#66756a]">
          Tell collectors what material you have, how much is available,
          and where it can be picked up.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-8"
      >
        <div>
          <h3 className="text-base font-semibold text-[#203b2c]">
            Material details
          </h3>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="material"
                className={labelClassName}
              >
                Material
              </label>

              <select
                id="material"
                value={material}
                onChange={(event) =>
                  setMaterial(
                    event.target.value as MaterialCategory,
                  )
                }
                className={inputClassName}
              >
                {materialOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="condition"
                className={labelClassName}
              >
                Condition
              </label>

              <select
                id="condition"
                value={condition}
                onChange={(event) =>
                  setCondition(
                    event.target.value as WasteCondition,
                  )
                }
                className={inputClassName}
              >
                {conditionOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="quantity"
                className={labelClassName}
              >
                Quantity
              </label>

              <input
                id="quantity"
                type="number"
                min="0"
                step="any"
                value={quantity}
                onChange={(event) =>
                  setQuantity(event.target.value)
                }
                placeholder="e.g. 2500"
                className={inputClassName}
                required
              />
            </div>

            <div>
              <label
                htmlFor="unit"
                className={labelClassName}
              >
                Unit
              </label>

              <select
                id="unit"
                value={unit}
                onChange={(event) =>
                  setUnit(
                    event.target.value as "kg" | "tonnes",
                  )
                }
                className={inputClassName}
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="tonnes">Tonnes</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-[#203b2c]">
            Pickup location
          </h3>

          <div className="mt-4 space-y-5">
            <div>
              <label
                htmlFor="address"
                className={labelClassName}
              >
                Address
              </label>

              <input
                id="address"
                type="text"
                value={address}
                onChange={(event) =>
                  setAddress(event.target.value)
                }
                placeholder="Building, street, locality"
                className={inputClassName}
                required
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="city"
                  className={labelClassName}
                >
                  City
                </label>

                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(event) =>
                    setCity(event.target.value)
                  }
                  placeholder="e.g. Ghaziabad"
                  className={inputClassName}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className={labelClassName}
                >
                  State
                </label>

                <input
                  id="state"
                  type="text"
                  value={state}
                  onChange={(event) =>
                    setState(event.target.value)
                  }
                  placeholder="e.g. Uttar Pradesh"
                  className={inputClassName}
                  required
                />
              </div>
            </div>

            <div>
              <p className={labelClassName}>
                Coordinates{" "}
                <span className="font-normal text-[#66756a]">
                  (optional)
                </span>
              </p>

              <div className="mt-2 grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="latitude"
                    className="sr-only"
                  >
                    Latitude
                  </label>

                  <input
                    id="latitude"
                    type="number"
                    min="-90"
                    max="90"
                    step="any"
                    value={latitude}
                    onChange={(event) =>
                      setLatitude(event.target.value)
                    }
                    placeholder="Latitude"
                    className="w-full border border-[#d9dfd3] bg-white px-4 py-3 text-sm text-[#203b2c] outline-none transition placeholder:text-[#9aa59c] focus:border-[#28563b] focus:ring-1 focus:ring-[#28563b]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="longitude"
                    className="sr-only"
                  >
                    Longitude
                  </label>

                  <input
                    id="longitude"
                    type="number"
                    min="-180"
                    max="180"
                    step="any"
                    value={longitude}
                    onChange={(event) =>
                      setLongitude(event.target.value)
                    }
                    placeholder="Longitude"
                    className="w-full border border-[#d9dfd3] bg-white px-4 py-3 text-sm text-[#203b2c] outline-none transition placeholder:text-[#9aa59c] focus:border-[#28563b] focus:ring-1 focus:ring-[#28563b]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-[#203b2c]">
            Pickup readiness
          </h3>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label
              className={`cursor-pointer border p-4 transition ${
                pickupStatus === "ready_now"
                  ? "border-[#28563b] bg-[#f5f5ed]"
                  : "border-[#d9dfd3] bg-white hover:border-[#aeb9b0]"
              }`}
            >
              <input
                type="radio"
                name="pickupStatus"
                value="ready_now"
                checked={pickupStatus === "ready_now"}
                onChange={() =>
                  setPickupStatus("ready_now")
                }
                className="sr-only"
              />

              <span className="block text-sm font-semibold text-[#203b2c]">
                Ready for pickup now
              </span>

              <span className="mt-1 block text-xs leading-5 text-[#66756a]">
                Collectors can act on this material immediately.
              </span>
            </label>

            <label
              className={`cursor-pointer border p-4 transition ${
                pickupStatus === "scheduled"
                  ? "border-[#28563b] bg-[#f5f5ed]"
                  : "border-[#d9dfd3] bg-white hover:border-[#aeb9b0]"
              }`}
            >
              <input
                type="radio"
                name="pickupStatus"
                value="scheduled"
                checked={pickupStatus === "scheduled"}
                onChange={() =>
                  setPickupStatus("scheduled")
                }
                className="sr-only"
              />

              <span className="block text-sm font-semibold text-[#203b2c]">
                Schedule pickup
              </span>

              <span className="mt-1 block text-xs leading-5 text-[#66756a]">
                Choose when the material will become available.
              </span>
            </label>
          </div>

          {pickupStatus === "scheduled" ? (
            <div className="mt-5">
              <label
                htmlFor="availableFrom"
                className={labelClassName}
              >
                Available from
              </label>

              <input
                id="availableFrom"
                type="datetime-local"
                value={availableFrom}
                onChange={(event) =>
                  setAvailableFrom(event.target.value)
                }
                className={inputClassName}
                required
              />
            </div>
          ) : null}
        </div>

        <div>
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="description"
              className={labelClassName}
            >
              Description{" "}
              <span className="font-normal text-[#66756a]">
                (optional)
              </span>
            </label>

            <span className="text-xs text-[#66756a]">
              {description.length}/500
            </span>
          </div>

          <textarea
            id="description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            maxLength={500}
            rows={5}
            placeholder="Add useful details about the material, access conditions, or anything collectors should know."
            className={inputClassName}
          />
        </div>

        {message ? (
          <div
            role="status"
            className={`border px-4 py-3 text-sm ${
              success
                ? "border-[#b9d1bd] bg-[#eef6ef] text-[#28563b]"
                : "border-[#e5c7b8] bg-[#fff5ef] text-[#9b4e25]"
            }`}
          >
            {message}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 border-t border-[#d9dfd3] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-[#66756a]">
            Your listing will become available to eligible
            collectors after submission.
          </p>

          <button
            type="submit"
            disabled={submitting}
            className="border border-[#28563b] bg-[#28563b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#203b2c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Creating listing..." : "Create listing"}
          </button>
        </div>
      </form>
    </section>
  );
}