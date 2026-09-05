/**
 * Component for selecting the minimum and maximum Codeforces rating.
 * Ensures the minimum rating cannot exceed the maximum rating and vice versa.
 */

"use client";

const RATING_FLOOR = 800;
const RATING_CEILING = 3500;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function RatingRange({
  min,
  max,
  onChange,
}: {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}) {
  const handleMinChange = (value: number) => {
    const next = clamp(value, RATING_FLOOR, max);
    onChange(next, max);
  };

  const handleMaxChange = (value: number) => {
    const next = clamp(value, min, RATING_CEILING);
    onChange(min, next);
  };

  const span = RATING_CEILING - RATING_FLOOR;
  const leftPct = ((min - RATING_FLOOR) / span) * 100;
  const widthPct = ((max - min) / span) * 100;

  return (
    <div>
      <div className="flex flex-wrap items-end gap-6">
        <label className="block">
          <span className="block text-sm text-muted mb-1.5">From</span>
          <input
            id="rating-min"
            type="number"
            inputMode="numeric"
            step={100}
            min={RATING_FLOOR}
            max={max}
            value={min}
            onChange={(e) => handleMinChange(Number(e.target.value))}
            className="w-24 rounded-md border border-border bg-surface px-3 py-2 font-mono text-sm tabular text-ink"
          />
        </label>

        <span className="pb-2.5 text-muted">–</span>

        <label className="block">
          <span className="block text-sm text-muted mb-1.5">To</span>
          <input
            id="rating-max"
            type="number"
            inputMode="numeric"
            step={100}
            min={min}
            max={RATING_CEILING}
            value={max}
            onChange={(e) => handleMaxChange(Number(e.target.value))}
            className="w-24 rounded-md border border-border bg-surface px-3 py-2 font-mono text-sm tabular text-ink"
          />
        </label>

        <span className="pb-2.5 text-sm text-muted">
          rated problems only
        </span>
      </div>

      <div className="mt-4">
        <div className="relative h-1.5 rounded-full bg-surface-2">
          <div
            className="absolute inset-y-0 rounded-full bg-accent"
            style={{ left: `${leftPct}%`, width: `${Math.max(widthPct, 2)}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-xs text-muted">
          <span>{RATING_FLOOR}</span>
          <span>{RATING_CEILING}</span>
        </div>
      </div>
    </div>
  );
}
