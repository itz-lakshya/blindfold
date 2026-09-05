/**
 * Codeforces API integration layer.
 * Handles fetching the global problemset and individual user submission histories,
 * keeping a lightweight in-memory cache to prevent rate-limiting.
 */

import { getProblemId } from "./utils";
import { Problem, UserHistoryResponse } from "./types";

const CF_API_URL = "https://codeforces.com/api/problemset.problems";

let cache: Problem[] | null = null;
let lastFetch = 0;
const TTL = 60 * 60 * 1000;

/**
 * Fetches the entire global problemset from Codeforces.
 * Caches the result in memory for 1 hour to prevent spamming the CF API
 * every time a user requests a new recommendation.
 */
export async function getProblems(): Promise<Problem[]> {
  const now = Date.now();
  
  if (cache && (now - lastFetch < TTL)) {
    return cache;
  }

  try {
    const res = await fetch(CF_API_URL, {
      next: { revalidate: 3600 }
    } as any);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    if (data.status !== "OK" || !data.result || !Array.isArray(data.result.problems)) {
      throw new Error(`Unexpected format: ${data.status}`);
    }

    const problems: Problem[] = data.result.problems
      .filter((p: any) => typeof p.contestId === "number" && typeof p.index === "string" && typeof p.name === "string")
      .map((p: any) => ({
        contestId: p.contestId,
        index: p.index,
        name: p.name,
        rating: typeof p.rating === "number" ? p.rating : undefined,
        tags: Array.isArray(p.tags) ? p.tags : [],
      }));

    cache = problems;
    lastFetch = now;

    return problems;
  } catch (err) {
    console.error("Failed to fetch problems:", err);
    
    if (cache) {
      return cache;
    }
    
    throw new Error(err instanceof Error ? err.message : "Unknown error");
  }
}

/**
 * Fetches a specific user's submission history from Codeforces.
 * Automatically sorts their submissions into 'solved' and 'attempted' buckets
 * using stable problem IDs (e.g. "1829G") for easy exclusion during recommendation.
 */
export async function getUserSubmissions(handle: string): Promise<UserHistoryResponse> {
  if (!handle || handle.trim() === "") {
    return { success: false, error: "Codeforces handle cannot be empty." };
  }

  const url = `https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle.trim())}`;
  
  try {
    const res = await fetch(url, {
      next: { revalidate: 60 } 
    } as any);

    const data = await res.json();

    if (data.status === "FAILED") {
      return { success: false, error: data.comment || "Codeforces API rejected the request." };
    }

    if (data.status !== "OK" || !Array.isArray(data.result)) {
      return { success: false, error: "Unexpected response format from Codeforces API." };
    }

    const solvedSet = new Set<string>();
    const attemptedSet = new Set<string>();

    for (const sub of data.result) {
      if (!sub.problem || typeof sub.problem.contestId !== "number" || typeof sub.problem.index !== "string") {
        continue;
      }
      
      const problemId = getProblemId(sub.problem.contestId, sub.problem.index);
      
      attemptedSet.add(problemId);
      
      if (sub.verdict === "OK") {
        solvedSet.add(problemId);
      }
    }

    return {
      success: true,
      data: {
        handle: handle.trim(),
        solvedProblemIds: Array.from(solvedSet),
        attemptedProblemIds: Array.from(attemptedSet),
      }
    };

  } catch (err) {
    console.error(`Error fetching submissions for ${handle}:`, err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "A network or API error occurred." 
    };
  }
}
