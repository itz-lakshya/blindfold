/**
 * Next.js Server Actions for the practice flow.
 * securely bridges the client UI to the backend Codeforces API and recommendation engine.
 */

"use server";

import { getProblems, getUserSubmissions } from "@/lib/codeforces";
import { recommendProblem } from "@/lib/recommender";
import { PracticeConfig, Problem, UserContext, UserHistoryResponse } from "@/lib/types";

export async function fetchRecommendation(config: PracticeConfig, context?: UserContext): Promise<{ problem?: Problem; error?: string }> {
  try {
    const problems = await getProblems();
    const problem = recommendProblem(problems, config, context);
    return { problem };
  } catch (error: any) {
    console.error("fetchRecommendation error:", error);
    return { error: error.message || "An unexpected error occurred while fetching the recommendation." };
  }
}

export async function syncCodeforcesHistory(handle: string): Promise<UserHistoryResponse> {
  return await getUserSubmissions(handle);
}
