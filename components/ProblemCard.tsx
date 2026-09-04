import { Problem } from "@/lib/types";

const REDACTED_TAG_WIDTHS = [72, 44, 96, 56];

export default function ProblemCard({
  problem,
  onSkip,
  isLoading
}: {
  problem: Problem | null;
  onSkip: () => void;
  isLoading?: boolean;
}) {
  if (isLoading || !problem) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6 shadow-[0_1px_0_0_var(--color-border)] sm:p-8 animate-pulse">
        <div className="flex items-center justify-between">
           <div className="h-7 w-16 bg-surface-2 rounded border border-border"></div>
           <div className="h-5 w-16 bg-surface-2 rounded"></div>
        </div>
        <div className="mt-5 h-8 w-3/4 bg-surface-2 rounded"></div>
        <div className="mt-5 flex items-center gap-2">
           <div className="h-2.5 w-16 rounded-full bg-surface-2"></div>
           <div className="h-2.5 w-10 rounded-full bg-surface-2"></div>
           <div className="h-2.5 w-24 rounded-full bg-surface-2"></div>
        </div>
        <div className="mt-7 flex items-center justify-between border-t border-border pt-5">
          <div className="h-5 w-32 bg-surface-2 rounded"></div>
          <div className="h-5 w-12 bg-surface-2 rounded"></div>
        </div>
      </div>
    );
  }

  const cfLink = `https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`;

  return (
    <div className="rounded-lg border border-border bg-surface p-6 shadow-[0_1px_0_0_var(--color-border)] sm:p-8">
      <div className="flex items-center justify-between">
        <span className="rounded border border-border bg-bg px-2.5 py-1 font-mono text-sm tabular text-primary">
          {problem.rating || "Unrated"}
        </span>
        <span className="font-mono text-sm text-muted">
          {problem.contestId} · {problem.index}
        </span>
      </div>

      <h2 className="mt-5 font-serif text-2xl text-ink">
        {problem.name}
      </h2>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {REDACTED_TAG_WIDTHS.map((width, i) => (
          <span
            key={i}
            className="h-2.5 rounded-full bg-primary"
            style={{ width: `${width}px` }}
            aria-hidden="true"
          />
        ))}
        <span className="ml-1 font-serif text-sm italic text-muted">
          Your tags are hidden.
        </span>
      </div>

      <div className="mt-7 flex items-center justify-between border-t border-border pt-5">
        <a 
          href={cfLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm text-muted hover:text-primary transition-colors"
        >
          Open on Codeforces ↗
        </a>
        <button 
          onClick={onSkip}
          className="text-sm text-muted hover:text-primary transition-colors"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
