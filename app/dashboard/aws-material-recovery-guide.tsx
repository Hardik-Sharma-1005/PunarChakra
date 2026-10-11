"use client";

import { useEffect, useState } from "react";
import { ChevronDown, RotateCw } from "lucide-react";

import type { MaterialCategory } from "@/types/domain";

const guideUrl =
  "https://punarchakra-material-guide-357278307652-20261011.s3.eu-north-1.amazonaws.com/material-recovery-guide.json";

type RecoveryAdvice = {
  summary: string;
  sortingTip: string;
  handlingTip: string;
};

type RecoveryGuide = Record<MaterialCategory, RecoveryAdvice>;

const readinessChecks = [
  {
    key: "sorted",
    label: "The material is sorted according to the advice above.",
  },
  {
    key: "handling",
    label: "Safe handling arrangements are in place.",
  },
  {
    key: "acceptance",
    label: "The receiving processor accepts it, and local requirements are confirmed.",
  },
] as const;

type ReadinessCheckKey = (typeof readinessChecks)[number]["key"];

type GuideState =
  | { status: "loading" }
  | { status: "unavailable" }
  | { status: "ready"; guide: RecoveryGuide };

const materialCategories: MaterialCategory[] = [
  "concrete_rubble",
  "bricks_masonry",
  "scrap_metal",
  "wood",
  "glass",
  "soil_excavated",
  "mixed_cd_waste",
];

function AwsWordmark() {
  return (
    <svg
      aria-hidden="true"
      className="aws-guide-wordmark"
      viewBox="0 0 46 30"
      focusable="false"
    >
      <text
        x="1"
        y="19"
        fill="currentColor"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="19"
        fontWeight="700"
        letterSpacing="-1.2"
      >
        aws
      </text>
      <path
        d="M7 22c8 6 20 6 30-1"
        fill="none"
        stroke="#ed8b00"
        strokeLinecap="round"
        strokeWidth="2.2"
      />
      <path
        d="m34.5 18.8 3.3 2.1-2.8 2.7"
        fill="none"
        stroke="#ed8b00"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isRecoveryGuide(value: unknown): value is { materials: RecoveryGuide } {
  if (!isRecord(value) || value.schemaVersion !== 1 || !isRecord(value.materials)) {
    return false;
  }

  const materials = value.materials;

  return materialCategories.every((category) => {
    const advice = materials[category];

    return (
      isRecord(advice) &&
      typeof advice.summary === "string" &&
      typeof advice.sortingTip === "string" &&
      typeof advice.handlingTip === "string"
    );
  });
}

export default function AWSMaterialRecoveryGuide({
  material,
  materialLabel,
}: {
  material: MaterialCategory;
  materialLabel: string;
}) {
  const [state, setState] = useState<GuideState>({ status: "loading" });
  const [readinessByMaterial, setReadinessByMaterial] = useState<
    Partial<Record<MaterialCategory, ReadinessCheckKey[]>>
  >({});
  const [reloadKey, setReloadKey] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadGuide() {
      try {
        const response = await fetch(guideUrl, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("The AWS guide could not be loaded.");
        }

        const data: unknown = await response.json();

        if (!isRecoveryGuide(data)) {
          throw new Error("The AWS guide has an unexpected format.");
        }

        setState({ status: "ready", guide: data.materials });
      } catch {
        if (!controller.signal.aborted) {
          setState({ status: "unavailable" });
        }
      }
    }

    void loadGuide();

    return () => controller.abort();
  }, [reloadKey]);

  const advice = state.status === "ready" ? state.guide[material] : null;
  const completedChecks = readinessByMaterial[material] ?? [];
  const readinessPercent = Math.round(
    (completedChecks.length / readinessChecks.length) * 100,
  );

  function toggleReadinessCheck(key: ReadinessCheckKey) {
    setReadinessByMaterial((current) => {
      const completed = current[material] ?? [];
      const nextCompleted = completed.includes(key)
        ? completed.filter((check) => check !== key)
        : [...completed, key];

      return { ...current, [material]: nextCompleted };
    });
  }

  return (
    <section
      aria-labelledby="aws-recovery-guide-title"
      className="aws-guide mt-5 border border-[#d9dfd3] bg-[#f5f5ed] p-4 sm:p-5"
    >
      <div className="aws-guide-header flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="aws-guide-eyebrow text-xs font-semibold uppercase tracking-[0.16em] text-[#d97736]">
            AWS S3 material guide
          </p>
          <h4
            id="aws-recovery-guide-title"
            className="mt-1 text-sm font-semibold text-[#203b2c]"
          >
            Recovery ideas for {materialLabel}
          </h4>
        </div>

        <div className="aws-guide-actions">
          {state.status === "ready" ? (
            <span className="aws-guide-source" role="status">
              <AwsWordmark />
              <span>AWS S3 guide loaded</span>
            </span>
          ) : null}

          {advice ? (
            <button
              type="button"
              className="aws-guide-toggle"
              aria-expanded={isExpanded}
              aria-controls="aws-recovery-guide-content"
              onClick={() => setIsExpanded((expanded) => !expanded)}
            >
              <span>{isExpanded ? "Hide guide" : "Explore guide"}</span>
              <ChevronDown
                size={16}
                aria-hidden="true"
                className={`aws-guide-chevron${isExpanded ? " is-open" : ""}`}
              />
            </button>
          ) : null}
        </div>
      </div>

      {state.status === "loading" ? (
        <p className="mt-3 text-sm text-[#66756a]" role="status">
          Loading material guidance…
        </p>
      ) : null}

      {state.status === "unavailable" ? (
        <div className="aws-guide-unavailable mt-3" role="status">
          <p className="text-sm leading-6 text-[#66756a]">
            The AWS guide is temporarily unavailable. You can still create your listing.
          </p>
          <button
            type="button"
            className="aws-guide-retry"
            onClick={() => {
              setState({ status: "loading" });
              setReloadKey((key) => key + 1);
            }}
          >
            <RotateCw size={14} aria-hidden="true" />
            Try again
          </button>
        </div>
      ) : null}

      {advice ? (
        <div
          id="aws-recovery-guide-content"
          className="aws-guide-content mt-3 space-y-3 text-sm leading-6 text-[#46584b]"
          hidden={!isExpanded}
        >
          <p>{advice.summary}</p>
          <p>
            <span className="font-semibold text-[#203b2c]">Sorting: </span>
            {advice.sortingTip}
          </p>
          <p>
            <span className="font-semibold text-[#203b2c]">Handling: </span>
            {advice.handlingTip}
          </p>
          <p className="text-xs leading-5 text-[#66756a]">
            Guidance only. Confirm local requirements and the receiving processor&apos;s rules.
          </p>

          <fieldset className="mt-4 border-t border-[#d9dfd3] pt-4">
            <legend className="text-sm font-semibold text-[#203b2c]">
              Recovery readiness
            </legend>
            <p className="mt-1 text-xs leading-5 text-[#66756a]">
              Mark each step as you complete it. Progress is kept separately for each material until you leave or reload this page.
            </p>

            <div className="mt-3 space-y-2">
              {readinessChecks.map((check) => (
                <label
                  key={check.key}
                  className="aws-guide-check flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#46584b]"
                >
                  <input
                    type="checkbox"
                    checked={completedChecks.includes(check.key)}
                    onChange={() => toggleReadinessCheck(check.key)}
                    className="mt-1 size-4 shrink-0 accent-[#28563b]"
                  />
                  <span>{check.label}</span>
                </label>
              ))}
            </div>

            <div
              className="aws-guide-progress mt-4 h-2 overflow-hidden bg-[#e4e8df]"
              role="progressbar"
              aria-label="Recovery readiness checklist progress"
              aria-valuemin={0}
              aria-valuemax={readinessChecks.length}
              aria-valuenow={completedChecks.length}
              aria-valuetext={`${completedChecks.length} of ${readinessChecks.length} checks complete`}
            >
              <div
                className="aws-guide-progress-fill h-full bg-[#28563b]"
                style={{ width: `${readinessPercent}%` }}
              />
            </div>

            <p className="mt-2 text-xs font-medium text-[#28563b]" role="status">
              {completedChecks.length === readinessChecks.length
                ? "All checks marked complete. You have reviewed the key preparation and acceptance points."
                : `${completedChecks.length} of ${readinessChecks.length} checks complete`}
            </p>
          </fieldset>
        </div>
      ) : null}
    </section>
  );
}
