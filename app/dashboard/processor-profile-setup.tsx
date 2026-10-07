"use client";

import { useState } from "react";

import {
  saveProcessorProfileAction,
  type CreateProcessorProfileInput,
} from "@/lib/processor/actions";
import type {
  FacilityType,
  MaterialCategory,
  QuantityUnit,
} from "@/types/domain";

type ProcessorProfileSetupProps = {
  initialProfile?: {
    facilityType: FacilityType;
    acceptedMaterials: MaterialCategory[];
    minimumRequiredQuantityKg: number;
    maximumRequiredQuantityKg: number;
    processingCapacityKg: number;
    location: {
      address: string;
      city: string;
      state: string;
      coordinates?: {
        latitude: number;
        longitude: number;
      };
    } | null;
  } | null;
};

const MATERIAL_OPTIONS: {
  value: MaterialCategory;
  label: string;
}[] = [
  { value: "concrete_rubble", label: "Concrete & rubble" },
  { value: "bricks_masonry", label: "Bricks & masonry" },
  { value: "scrap_metal", label: "Scrap metal" },
  { value: "wood", label: "Wood" },
  { value: "glass", label: "Glass" },
  { value: "soil_excavated", label: "Soil / excavated material" },
  { value: "mixed_cd_waste", label: "Mixed C&D waste" },
];

const FACILITY_TYPE_OPTIONS: {
  value: FacilityType;
  label: string;
  description: string;
}[] = [
  {
    value: "processor",
    label: "Processor",
    description:
      "A processing or recycling facility that receives material for recovery.",
  },
  {
    value: "buyer",
    label: "Buyer",
    description:
      "A business that purchases recovered material without necessarily processing it.",
  },
];

const CITIES = ["Ghaziabad", "Noida"] as const;

function getInitialQuantity(
  valueKg: number | undefined,
): { value: string; unit: QuantityUnit } {
  if (valueKg === undefined) {
    return {
      value: "",
      unit: "kg",
    };
  }

  return {
    value: String(valueKg),
    unit: "kg",
  };
}

export default function ProcessorProfileSetup({
  initialProfile = null,
}: ProcessorProfileSetupProps) {
  const initialMinimum = getInitialQuantity(
    initialProfile?.minimumRequiredQuantityKg,
  );
  const initialMaximum = getInitialQuantity(
    initialProfile?.maximumRequiredQuantityKg,
  );
  const initialCapacity = getInitialQuantity(
    initialProfile?.processingCapacityKg,
  );

  const [facilityType, setFacilityType] = useState<FacilityType>(
    initialProfile?.facilityType ?? "processor",
  );

  const [acceptedMaterials, setAcceptedMaterials] = useState<
    MaterialCategory[]
  >(initialProfile?.acceptedMaterials ?? []);

  const [minimumValue, setMinimumValue] = useState(initialMinimum.value);
  const [minimumUnit, setMinimumUnit] = useState<QuantityUnit>(
    initialMinimum.unit,
  );

  const [maximumValue, setMaximumValue] = useState(initialMaximum.value);
  const [maximumUnit, setMaximumUnit] = useState<QuantityUnit>(
    initialMaximum.unit,
  );

  const [capacityValue, setCapacityValue] = useState(initialCapacity.value);
  const [capacityUnit, setCapacityUnit] = useState<QuantityUnit>(
    initialCapacity.unit,
  );

  const [address, setAddress] = useState(
    initialProfile?.location?.address ?? "",
  );

  const [city, setCity] = useState(initialProfile?.location?.city ?? "");

  const [latitude, setLatitude] = useState(
    initialProfile?.location?.coordinates?.latitude !== undefined
      ? String(initialProfile.location.coordinates.latitude)
      : "",
  );

  const [longitude, setLongitude] = useState(
    initialProfile?.location?.coordinates?.longitude !== undefined
      ? String(initialProfile.location.coordinates.longitude)
      : "",
  );

  const [state, setState] = useState({
    success: false,
    message: "",
  });

  const [isPending, setIsPending] = useState(false);

  function toggleMaterial(material: MaterialCategory) {
    setAcceptedMaterials((current) =>
      current.includes(material)
        ? current.filter((item) => item !== material)
        : [...current, material],
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsPending(true);
    setState({
      success: false,
      message: "",
    });

    const parsedMinimum = Number(minimumValue);
    const parsedMaximum = Number(maximumValue);
    const parsedCapacity = Number(capacityValue);

    const parsedLatitude =
      latitude.trim() === "" ? undefined : Number(latitude);
    const parsedLongitude =
      longitude.trim() === "" ? undefined : Number(longitude);

    const input: CreateProcessorProfileInput = {
      facilityType,
      acceptedMaterials,
      minimumRequiredQuantity: {
        value: parsedMinimum,
        unit: minimumUnit,
      },
      maximumRequiredQuantity: {
        value: parsedMaximum,
        unit: maximumUnit,
      },
      processingCapacity: {
        value: parsedCapacity,
        unit: capacityUnit,
      },
      location: {
        address,
        city: city as "Ghaziabad" | "Noida",
        state: "Uttar Pradesh",
        latitude: parsedLatitude,
        longitude: parsedLongitude,
      },
    };

    const result = await saveProcessorProfileAction(input);

    setState({
      success: result.success,
      message: result.message,
    });

    setIsPending(false);
  }

  return (
    <section className="border border-[#d9dfd3] bg-white p-6 shadow-sm sm:p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d97736]">
          Processor setup
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          Tell us how your facility operates
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#66756a]">
          Complete your facility profile so PunarChakra can identify recovery
          opportunities that fit your material requirements and processing
          capacity.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <fieldset>
          <legend className="text-sm font-semibold">
            Facility type *
          </legend>

          <p className="mt-1 text-xs text-[#66756a]">
            Tell us whether your organization processes recovered material or
            purchases it.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {FACILITY_TYPE_OPTIONS.map((option) => {
              const selected = facilityType === option.value;

              return (
                <label
                  key={option.value}
                  className={`cursor-pointer border p-4 transition ${
                    selected
                      ? "border-[#386747] bg-[#f5f5ed]"
                      : "border-[#d9dfd3] bg-white hover:border-[#386747]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="facilityType"
                      value={option.value}
                      checked={selected}
                      onChange={() => setFacilityType(option.value)}
                      className="mt-1 h-4 w-4 accent-[#28563b]"
                    />

                    <div>
                      <span className="text-sm font-semibold">
                        {option.label}
                      </span>

                      <p className="mt-1 text-xs leading-5 text-[#66756a]">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold">
            Accepted materials *
          </legend>

          <p className="mt-1 text-xs text-[#66756a]">
            Select every material your facility can receive or purchase.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {MATERIAL_OPTIONS.map((material) => {
              const selected = acceptedMaterials.includes(material.value);

              return (
                <label
                  key={material.value}
                  className={`flex cursor-pointer items-center gap-3 border p-4 text-sm transition ${
                    selected
                      ? "border-[#386747] bg-[#f5f5ed]"
                      : "border-[#d9dfd3] bg-white hover:border-[#386747]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleMaterial(material.value)}
                    className="h-4 w-4 accent-[#28563b]"
                  />

                  <span className="font-medium">{material.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold">
            Required quantity range *
          </legend>

          <p className="mt-1 text-xs text-[#66756a]">
            Define the minimum and maximum quantity your facility is prepared
            to receive for one recovery transaction.
          </p>

          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <div>
              <label
                htmlFor="processor-minimum-quantity"
                className="mb-2 block text-sm font-medium"
              >
                Minimum required quantity *
              </label>

              <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
                <input
                  id="processor-minimum-quantity"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={minimumValue}
                  onChange={(event) => setMinimumValue(event.target.value)}
                  required
                  placeholder="e.g. 500"
                  className="w-full border border-[#d9dfd3] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#386747] focus:ring-2 focus:ring-[#386747]/15"
                />

                <select
                  value={minimumUnit}
                  onChange={(event) =>
                    setMinimumUnit(event.target.value as QuantityUnit)
                  }
                  className="w-full border border-[#d9dfd3] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#386747] focus:ring-2 focus:ring-[#386747]/15"
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="tonnes">Tonnes</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="processor-maximum-quantity"
                className="mb-2 block text-sm font-medium"
              >
                Maximum required quantity *
              </label>

              <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
                <input
                  id="processor-maximum-quantity"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={maximumValue}
                  onChange={(event) => setMaximumValue(event.target.value)}
                  required
                  placeholder="e.g. 5000"
                  className="w-full border border-[#d9dfd3] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#386747] focus:ring-2 focus:ring-[#386747]/15"
                />

                <select
                  value={maximumUnit}
                  onChange={(event) =>
                    setMaximumUnit(event.target.value as QuantityUnit)
                  }
                  className="w-full border border-[#d9dfd3] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#386747] focus:ring-2 focus:ring-[#386747]/15"
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="tonnes">Tonnes</option>
                </select>
              </div>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold">
            Processing capacity *
          </legend>

          <p className="mt-1 text-xs text-[#66756a]">
            Enter the maximum quantity your facility can process for one
            recovery transaction.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_160px]">
            <input
              id="processor-processing-capacity"
              type="number"
              min="0.01"
              step="0.01"
              value={capacityValue}
              onChange={(event) => setCapacityValue(event.target.value)}
              required
              placeholder="e.g. 10000"
              className="w-full border border-[#d9dfd3] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#386747] focus:ring-2 focus:ring-[#386747]/15"
            />

            <select
              value={capacityUnit}
              onChange={(event) =>
                setCapacityUnit(event.target.value as QuantityUnit)
              }
              className="w-full border border-[#d9dfd3] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#386747] focus:ring-2 focus:ring-[#386747]/15"
            >
              <option value="kg">Kilograms (kg)</option>
              <option value="tonnes">Tonnes</option>
            </select>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold">Facility location *</legend>

          <p className="mt-1 text-xs text-[#66756a]">
            Provide your facility location. Processor facilities are currently
            supported only in Ghaziabad and Noida.
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="processor-address"
                className="mb-2 block text-sm font-medium"
              >
                Full address *
              </label>

              <textarea
                id="processor-address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                required
                maxLength={500}
                rows={3}
                placeholder="Enter your full facility address"
                className="w-full resize-none border border-[#d9dfd3] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#386747] focus:ring-2 focus:ring-[#386747]/15"
              />
            </div>

            <div>
              <label
                htmlFor="processor-city"
                className="mb-2 block text-sm font-medium"
              >
                City *
              </label>

              <select
                id="processor-city"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                required
                className="w-full border border-[#d9dfd3] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#386747] focus:ring-2 focus:ring-[#386747]/15"
              >
                <option value="">Select city</option>
                {CITIES.map((cityOption) => (
                  <option key={cityOption} value={cityOption}>
                    {cityOption}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="processor-state"
                className="mb-2 block text-sm font-medium"
              >
                State
              </label>

              <input
                id="processor-state"
                type="text"
                value="Uttar Pradesh"
                readOnly
                className="w-full border border-[#d9dfd3] bg-[#f5f5ed] px-4 py-3 text-sm text-[#66756a] outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="processor-latitude"
                  className="mb-2 block text-sm font-medium"
                >
                  Latitude
                  <span className="ml-1 font-normal text-[#66756a]">
                    (optional)
                  </span>
                </label>

                <input
                  id="processor-latitude"
                  type="number"
                  min="-90"
                  max="90"
                  step="any"
                  value={latitude}
                  onChange={(event) => setLatitude(event.target.value)}
                  placeholder="e.g. 28.6692"
                  className="w-full border border-[#d9dfd3] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#386747] focus:ring-2 focus:ring-[#386747]/15"
                />
              </div>

              <div>
                <label
                  htmlFor="processor-longitude"
                  className="mb-2 block text-sm font-medium"
                >
                  Longitude
                  <span className="ml-1 font-normal text-[#66756a]">
                    (optional)
                  </span>
                </label>

                <input
                  id="processor-longitude"
                  type="number"
                  min="-180"
                  max="180"
                  step="any"
                  value={longitude}
                  onChange={(event) => setLongitude(event.target.value)}
                  placeholder="e.g. 77.4538"
                  className="w-full border border-[#d9dfd3] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#386747] focus:ring-2 focus:ring-[#386747]/15"
                />
              </div>
            </div>
          </div>
        </fieldset>

        {state.message && (
          <p
            role="status"
            className={`text-sm ${
              state.success ? "text-[#386747]" : "text-red-600"
            }`}
          >
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#28563b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1f432e] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving profile..." : "Save processor profile"}
        </button>
      </form>
    </section>
  );
}