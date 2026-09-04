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

const STEPS = [-75, -50, -20, -10, 0, 10, 20, 30, 40, 50, 75];

export default function TagBias({
  value,
  onChange,
}: {
  value: Record<string, number>;
  onChange: (value: Record<string, number>) => void;
}) {
  const handleChange = (id: string, stepIndex: number) => {
    const nextBias = STEPS[stepIndex];
    onChange({ ...value, [id]: nextBias });
  };

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {CF_TAGS.map((t) => {
        const v = value[t.id] ?? 0;
        let idx = STEPS.indexOf(v);
        if (idx === -1) idx = STEPS.indexOf(0);

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
            className={`flex flex-col gap-3 rounded-md border px-4 py-3 transition-colors ${cx}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink">{t.label}</span>
              <span className="font-mono text-xs tabular text-ink w-12 text-right">
                {str}
              </span>
            </div>
            
            <input 
              type="range"
              min="0"
              max={STEPS.length - 1}
              step="1"
              value={idx}
              onChange={(e) => handleChange(t.id, parseInt(e.target.value, 10))}
              className="w-full accent-primary h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
            />
          </li>
        );
      })}
    </ul>
  );
}
