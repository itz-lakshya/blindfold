/**
 * The main Practice environment.
 * Reads URL configs and local history, triggers recommendations, and renders the Problem Card.
 */

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ProblemCard from "@/components/ProblemCard";
import { fetchRecommendation } from "./actions";
import { getProblemId } from "@/lib/utils";
import { Problem, PracticeConfig, UserContext } from "@/lib/types";
import { getSeenProblems, getCfHistory, markProblemSeen } from "@/lib/history";

function PracticeContent() {
  const searchParams = useSearchParams();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getConfig = (): PracticeConfig => {
    const minRating = parseInt(searchParams.get("minRating") || "1500", 10);
    const maxRating = parseInt(searchParams.get("maxRating") || "1800", 10);
    let tagBiases = {};
    const maxAgeParam = searchParams.get("maxAgeContests");
    const maxAgeContests = maxAgeParam ? parseInt(maxAgeParam, 10) : undefined;

    const tagsParam = searchParams.get("tags");
    if (tagsParam) {
      try {
        tagBiases = JSON.parse(tagsParam);
      } catch (e) {
        console.error("Failed to parse tags", e);
      }
    }
    return { minRating, maxRating, tagBiases, maxAgeContests };
  };

  const loadProblem = async () => {
    setLoading(true);
    setError(null);
    const config = getConfig();
    
    // Construct the UserContext from localStorage history layers
    const cfHistory = getCfHistory();
    const seenProblems = getSeenProblems();
    
    const context: UserContext = {
      solvedProblemIds: cfHistory ? cfHistory.solvedProblemIds : [],
      attemptedProblemIds: cfHistory ? cfHistory.attemptedProblemIds : [],
      seenProblemIds: seenProblems,
    };

    const result = await fetchRecommendation(config, context);
    if (result.error) {
      setError(result.error);
    } else if (result.problem) {
      setProblem(result.problem);
      // Mark as seen immediately upon successful selection/display
      markProblemSeen(getProblemId(result.problem.contestId, result.problem.index));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProblem();
  }, [searchParams]);

  return (
    <div className="mx-auto max-w-xl">
      {error ? (
        <div className="rounded-lg border border-border bg-surface p-6 shadow-[0_1px_0_0_var(--color-border)]">
          <h3 className="mb-2 font-serif text-xl text-primary">Unable to find a problem</h3>
          <p className="text-sm text-muted">{error}</p>
          <div className="mt-6 flex items-center gap-4 border-t border-border pt-4">
            <button 
              onClick={loadProblem}
              className="rounded bg-surface-2 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-border"
            >
              Try Again
            </button>
            <Link 
              href="/#configure"
              className="text-sm text-muted hover:text-primary transition-colors"
            >
              Adjust Configuration
            </Link>
          </div>
        </div>
      ) : (
        <ProblemCard 
          problem={problem} 
          isLoading={loading} 
          onSkip={loadProblem} 
        />
      )}
    </div>
  );
}

export default function PracticePage() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="border-b border-border">
        <div className="container flex items-center justify-between py-6">
          <Link href="/" className="font-serif text-xl italic text-primary hover:opacity-80 transition-opacity">
            Blindfold
          </Link>
          <Link
            href="/#configure"
            className="text-sm text-muted transition-colors hover:text-primary"
          >
            Configure session
          </Link>
        </div>
      </header>

      <main className="container py-16 sm:py-24">
        <div className="mb-10 text-center">
          <h1 className="font-serif text-3xl text-primary mb-3">Your Problem</h1>
          <p className="text-muted text-sm max-w-sm mx-auto">
            Solve it without knowing the tags. If it doesn&apos;t look right, skip it.
          </p>
        </div>
        
        <Suspense fallback={
          <div className="mx-auto max-w-xl">
            <ProblemCard problem={null} isLoading={true} onSkip={() => {}} />
          </div>
        }>
          <PracticeContent />
        </Suspense>
      </main>
    </div>
  );
}
