"use client";

const CF_TAGS = [
  { id: "dp", label: "DP" },
  { id: "graphs", label: "Graphs" },
  { id: "greedy", label: "Greedy" },
  { id: "binary search", label: "Binary Search" },
  { id: "math", label: "Math" },
  { id: "data structures", label: "Data Structures" },
  { id: "strings", label: "Strings" },
  { id: "combinatorics", label: "Combinatorics" },
  { id: "number theory", label: "Number Theory" },
  { id: "geometry", label: "Geometry" },
  { id: "trees", label: "Trees" },
  { id: "bitmasks", label: "Bitmasks" },
];

const STEPS = [-20, 0, 10, 20, 30, 50];

export default function TagBias({
  value,
  onChange,
}: {
  value: Record<string, number>;
  onChange: (value: Record<string, number>) => void;
}) {
  const adjust = (id: string, dir: 1 | -1) => {
    const current = value[id] ?? 0;
    let idx = STEPS.indexOf(current);
    if (idx === -1) idx = STEPS.indexOf(0);

    let nextIdx = idx + dir;
    if (nextIdx < 0) nextIdx = 0;
    if (nextIdx >= STEPS.length) nextIdx = STEPS.length - 1;

    onChange({ ...value, [id]: STEPS[nextIdx] });
  };

  return (
    <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
      {CF_TAGS.map((t) => {
        const v = value[t.id] ?? 0;
        const active = v > 0;
        const negative = v < 0;
        
        let cx = "border-border bg-surface";
        if (active) cx = "border-accent bg-accent-soft";
        if (negative) cx = "border-red-900/30 bg-red-950/10";

        let str = `${v}%`;
        if (v > 0) str = `+${v}%`;

        return (
          <li
            key={t.id}
            className={`flex items-center justify-between gap-3 rounded-md border px-3.5 py-2.5 transition-colors ${cx}`}
          >
            <span className="text-sm text-ink">{t.label}</span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={`Decrease ${t.label}`}
                onClick={() => adjust(t.id, -1)}
                disabled={STEPS.indexOf(v) <= 0}
                className="flex h-6 w-6 items-center justify-center rounded border border-border text-muted hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-border disabled:hover:text-muted"
              >
                −
              </button>

              <span className="w-12 text-center font-mono text-xs tabular text-ink">
                {str}
              </span>

              <button
                type="button"
                aria-label={`Increase ${t.label}`}
                onClick={() => adjust(t.id, 1)}
                disabled={STEPS.indexOf(v) >= STEPS.length - 1}
                className="flex h-6 w-6 items-center justify-center rounded border border-border text-muted hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-border disabled:hover:text-muted"
              >
                +
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
