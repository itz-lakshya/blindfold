/**
 * The central UI for displaying a recommended problem.
 * Handles the "hide by default" logic for tags and rating, and actions like Skip/Solve.
 */

"use client";

import { useState, useEffect } from "react";
import { getProblemId } from "@/lib/utils";
import { Problem } from "@/lib/types";
import { markProblemSolvedLocally } from "@/lib/history";

export default function ProblemCard({
  problem,
  onSkip,
  isLoading
}: {
  problem: Problem | null;
  onSkip: () => void;
  isLoading?: boolean;
}) {
  const [showRating, setShowRating] = useState(false);
  const [showTags, setShowTags] = useState(false);

  // Reset visibility when problem changes
  useEffect(() => {
    setShowRating(false);
    setShowTags(false);
  }, [problem]);

  if (isLoading || !problem) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6 shadow-[0_1px_0_0_var(--color-border)] sm:p-8 animate-pulse">
        <div className="flex items-center justify-between">
           <div className="h-7 w-24 bg-surface-2 rounded border border-border"></div>
           <div className="h-5 w-16 bg-surface-2 rounded"></div>
        </div>
        <div className="mt-5 h-8 w-3/4 bg-surface-2 rounded"></div>
        <div className="mt-5 h-6 w-1/3 bg-surface-2 rounded"></div>
        <div className="mt-7 flex items-center justify-between border-t border-border pt-5">
          <div className="h-5 w-32 bg-surface-2 rounded"></div>
          <div className="h-5 w-12 bg-surface-2 rounded"></div>
        </div>
      </div>
    );
  }

  const cfLink = `https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`;

  const handleSolved = () => {
    markProblemSolvedLocally(getProblemId(problem.contestId, problem.index));
    onSkip(); // Fetch next problem
  };

  return (
    <div className="rounded-lg border border-border bg-surface p-6 shadow-[0_1px_0_0_var(--color-border)] sm:p-8">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setShowRating(!showRating)}
          className="rounded border border-border bg-bg px-2.5 py-1 font-mono text-sm tabular text-primary transition-colors hover:border-primary"
        >
          {showRating ? `Rating: ${problem.rating || "Unrated"}` : "Show rating"}
        </button>
        <span className="font-mono text-sm text-muted">
          {problem.contestId} · {problem.index}
        </span>
      </div>

      <h2 className="mt-5 font-serif text-2xl text-ink">
        {problem.name}
      </h2>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button 
          onClick={() => setShowTags(!showTags)}
          className="text-sm font-medium text-muted hover:text-primary transition-colors"
        >
          {showTags ? "Hide tags" : "Show tags"}
        </button>
        
        {showTags && (
          <span className="ml-2 font-mono text-xs text-ink bg-surface-2 px-2 py-1 rounded">
            {problem.tags.length > 0 ? problem.tags.join(" · ") : "no tags"}
          </span>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
        <a 
          href={cfLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm text-muted hover:text-primary transition-colors"
        >
          Open on Codeforces ↗
        </a>
        <div className="flex items-center gap-4">
          <button 
            onClick={onSkip}
            className="text-sm text-muted hover:text-primary transition-colors"
          >
            Skip
          </button>
          <button 
            onClick={handleSolved}
            className="rounded bg-primary px-4 py-2 text-sm font-medium text-surface transition-colors hover:bg-[#1d271f]"
          >
            I Solved It
          </button>
        </div>
      </div>
    </div>
  );
}
