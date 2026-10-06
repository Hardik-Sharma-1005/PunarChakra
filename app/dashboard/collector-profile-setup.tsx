"use client";

import { useState } from "react";

import {
  saveCollectorProfileAction,
  type CreateCollectorProfileInput,
} from "@/lib/collector/actions";
import type {
  CollectorAvailability,
  MaterialCategory,
  QuantityUnit,
} from "@/types/domain";

type CollectorProfileSetupProps = {
  initialProfile?: {
    collectibleMaterials: MaterialCategory[];
    maximumCollectionCapacityKg: number;
    operatingAreas: string[];
    availability: CollectorAvailability;
    baseLocation: {
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

const OPERATING_AREA_OPTIONS = ["Ghaziabad", "Noida"] as const;

function getInitialCapacity(
  initialProfile: CollectorProfileSetupProps["initialProfile"],
): { value: string; unit: QuantityUnit } {
  if (!initialProfile) {
    return {
      value: "",
      unit: "kg",
    };
  }

  return {
    value: String(initialProfile.maximumCollectionCapacityKg),
    unit: "kg",
  };
}

export default function CollectorProfileSetup({
  initialProfile = null,
}: CollectorProfileSetupProps) {
  const initialCapacity = getInitialCapacity(initialProfile);

  const [collectibleMaterials, setCollectibleMaterials] = useState<
    MaterialCategory[]
  >(initialProfile?.collectibleMaterials ?? []);

  const [capacityValue, setCapacityValue] = useState(initialCapacity.value);
  const [capacityUnit, setCapacityUnit] = useState<QuantityUnit>(
    initialCapacity.unit,
  );

  const [operatingAreas, setOperatingAreas] = useState<string[]>(
    initialProfile?.operatingAreas ?? [],
  );

  const [availability, setAvailability] = useState<CollectorAvailability>(
    initialProfile?.availability ?? "unavailable",
  );

  const [address, setAddress] = useState(
    initialProfile?.baseLocation?.address ?? "",
  );

  const [city, setCity] = useState(
    initialProfile?.baseLocation?.city ?? "",
  );

  const [latitude, setLatitude] = useState(
    initialProfile?.baseLocation?.coordinates?.latitude !== undefined
      ? String(initialProfile.baseLocation.coordinates.latitude)
      : "",
  );

  const [longitude, setLongitude] = useState(
    initialProfile?.baseLocation?.coordinates?.longitude !== undefined
      ? String(initialProfile.baseLocation.coordinates.longitude)
      : "",
  );

  const [state, setState] = useState({
    success: false,
    message: "",
  });

  const [isPending, setIsPending] = useState(false);

  function toggleMaterial(material: MaterialCategory) {
    setCollectibleMaterials((current) =>
      current.includes(material)
        ? current.filter((item) => item !== material)
        : [...current, material],
    );
  }

  function toggleOperatingArea(area: string) {
    setOperatingAreas((current) =>
      current.includes(area)
        ? current.filter((item) => item !== area)
        : [...current, area],
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsPending(true);
    setState({
      success: false,
      message: "",
    });

    const parsedCapacity = Number(capacityValue);
    const parsedLatitude =
      latitude.trim() === "" ? undefined : Number(latitude);
    const parsedLongitude =
      longitude.trim() === "" ? undefined : Number(longitude);

    const input: CreateCollectorProfileInput = {
      collectibleMaterials,
      maximumCollectionCapacity: {
        value: parsedCapacity,
        unit: capacityUnit,
      },
      operatingAreas,
      availability,
      baseLocation: {
        address,
        city,
        state: "Uttar Pradesh",
        latitude: parsedLatitude,
        longitude: parsedLongitude,
      },
    };

    const result = await saveCollectorProfileAction(input);

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
          Collector setup
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          Tell us how you operate
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#66756a]">
          Complete your operational profile so PunarChakra can show you
          recovery opportunities that fit your collection capabilities.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <fieldset>
          <legend className="text-sm font-semibold">
            Collectible materials *
          </legend>

          <p className="mt-1 text-xs text-[#66756a]">
            Select every material your organization can collect.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {MATERIAL_OPTIONS.map((material) => {
              const selected = collectibleMaterials.includes(material.value);

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
            Maximum collection capacity *
          </legend>

          <p className="mt-1 text-xs text-[#66756a]">
            Enter the maximum quantity you can collect for a recovery job.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_160px]">
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={capacityValue}
              onChange={(event) => setCapacityValue(event.target.value)}
              required
              placeholder="e.g. 5000"
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
          <legend className="text-sm font-semibold">
            Operating areas *
          </legend>

          <p className="mt-1 text-xs text-[#66756a]">
            Select the cities where you currently operate.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {OPERATING_AREA_OPTIONS.map((area) => {
              const selected = operatingAreas.includes(area);

              return (
                <label
                  key={area}
                  className={`flex cursor-pointer items-center gap-3 border p-4 text-sm transition ${
                    selected
                      ? "border-[#386747] bg-[#f5f5ed]"
                      : "border-[#d9dfd3] bg-white hover:border-[#386747]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleOperatingArea(area)}
                    className="h-4 w-4 accent-[#28563b]"
                  />

                  <span className="font-medium">{area}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold">Availability *</legend>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(
              [
                ["available", "Available"],
                ["unavailable", "Unavailable"],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className={`flex cursor-pointer items-center gap-3 border p-4 text-sm transition ${
                  availability === value
                    ? "border-[#386747] bg-[#f5f5ed]"
                    : "border-[#d9dfd3] bg-white hover:border-[#386747]"
                }`}
              >
                <input
                  type="radio"
                  name="availability"
                  value={value}
                  checked={availability === value}
                  onChange={() => setAvailability(value)}
                  className="h-4 w-4 accent-[#28563b]"
                />

                <span className="font-medium">{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold">Base location *</legend>

          <p className="mt-1 text-xs text-[#66756a]">
            Provide your operating base. Coordinates are optional.
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="collector-address"
                className="mb-2 block text-sm font-medium"
              >
                Full address *
              </label>

              <textarea
                id="collector-address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                required
                maxLength={500}
                rows={3}
                placeholder="Enter your full operating address"
                className="w-full resize-none border border-[#d9dfd3] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#386747] focus:ring-2 focus:ring-[#386747]/15"
              />
            </div>

            <div>
              <label
                htmlFor="collector-city"
                className="mb-2 block text-sm font-medium"
              >
                City *
              </label>

              <select
                id="collector-city"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                required
                className="w-full border border-[#d9dfd3] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#386747] focus:ring-2 focus:ring-[#386747]/15"
              >
                <option value="">Select city</option>
                <option value="Ghaziabad">Ghaziabad</option>
                <option value="Noida">Noida</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="collector-state"
                className="mb-2 block text-sm font-medium"
              >
                State
              </label>

              <input
                id="collector-state"
                type="text"
                value="Uttar Pradesh"
                readOnly
                className="w-full border border-[#d9dfd3] bg-[#f5f5ed] px-4 py-3 text-sm text-[#66756a] outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="collector-latitude"
                  className="mb-2 block text-sm font-medium"
                >
                  Latitude
                  <span className="ml-1 font-normal text-[#66756a]">
                    (optional)
                  </span>
                </label>

                <input
                  id="collector-latitude"
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
                  htmlFor="collector-longitude"
                  className="mb-2 block text-sm font-medium"
                >
                  Longitude
                  <span className="ml-1 font-normal text-[#66756a]">
                    (optional)
                  </span>
                </label>

                <input
                  id="collector-longitude"
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
          {isPending ? "Saving profile..." : "Save collector profile"}
        </button>
      </form>
    </section>
  );
}