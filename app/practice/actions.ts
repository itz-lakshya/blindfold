"use server";

import { getProblems } from "@/lib/codeforces";
import { recommendProblem } from "@/lib/recommender";
import { PracticeConfig, Problem } from "@/lib/types";

export async function fetchRecommendation(config: PracticeConfig): Promise<{ problem?: Problem; error?: string }> {
  try {
    const problems = await getProblems();
    const problem = recommendProblem(problems, config);
    return { problem };
  } catch (error: any) {
    console.error("fetchRecommendation error:", error);
    return { error: error.message || "An unexpected error occurred while fetching the recommendation." };
  }
}
