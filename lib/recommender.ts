/**
 * Core recommendation engine math.
 * Handles filtering eligible problems and calculating probabilistic weights
 * based on tag preferences and recency.
 */

import { getProblemId } from "./utils";
import { Problem, PracticeConfig, UserContext, DifficultyPreference } from "./types";

/**
 * Prunes the full problemset down to only eligible problems.
 * Strips out problems outside the rating range, outside the recency limit, 
 * or anything the user has already solved, attempted, or seen.
 */
export function filterEligibleProblems(
  problems: Problem[], 
  config: PracticeConfig,
  context?: UserContext
): Problem[] {
  let solvedSet = new Set<string>();
  let attemptedSet = new Set<string>();
  let seenSet = new Set<string>();

  if (context) {
    solvedSet = new Set(context.solvedProblemIds || []);
    attemptedSet = new Set(context.attemptedProblemIds || []);
    seenSet = new Set(context.seenProblemIds || []);
  }

  // Find max contest ID if we need to filter by recency limit
  let maxContestId = 0;
  if (config.maxAgeContests !== undefined) {
    maxContestId = problems.reduce((max, p) => Math.max(max, p.contestId), 0);
  }

  return problems.filter((p) => {
    if (typeof p.rating !== "number") return false;
    if (p.rating < config.minRating || p.rating > config.maxRating) return false;

    if (config.maxAgeContests !== undefined) {
      if (p.contestId < maxContestId - config.maxAgeContests) return false;
    }

    const problemId = getProblemId(p.contestId, p.index);
    if (solvedSet.has(problemId)) return false;
    if (attemptedSet.has(problemId)) return false;
    if (seenSet.has(problemId)) return false;

    return true;
  });
}

/**
 * Grants a slight probability multiplier to newer problems.
 * Codeforces contest IDs roughly correlate with time (higher = newer).
 */
export function calculateRecencyWeight(contestId: number): number {
  if (contestId > 1800) return 1.50;
  if (contestId > 1400) return 1.35;
  if (contestId > 800)  return 1.10;
  return 1.00;
}

/**
 * Calculates a probabilistic weight based on the user's tag preferences.
 * The strongest positively biased tag dominates the score, while other
 * positive tags add minor bonuses and negative tags apply minor penalties.
 */
export function calculateTopicWeight(tags: string[], tagBiases: Record<string, number>): number {
  let baseWeight = 1.0;
  
  const posBiases: number[] = [];
  const negBiases: number[] = [];

  for (const t of tags) {
    const tLower = t.toLowerCase();
    const bias = tagBiases[tLower];
    if (bias !== undefined) {
      if (bias > 0) posBiases.push(bias);
      else if (bias < 0) negBiases.push(bias);
    }
  }

  let posScore = 0;
  let posBonus = 0;

  if (posBiases.length > 0) {
    const maxPos = Math.max(...posBiases);
    posScore = (maxPos / 100) * 10.0;

    let foundMax = false;
    for (const b of posBiases) {
      if (b === maxPos && !foundMax) {
        foundMax = true;
        continue;
      }
      posBonus += (b / 100);
    }
  }

  let negPenalty = 0;
  for (const b of negBiases) {
    negPenalty += (Math.abs(b) / 100);
  }

  let finalTopicWeight = baseWeight + posScore + posBonus - negPenalty;
  
  return Math.max(0.1, finalTopicWeight);
}

/**
 * Adjusts the probability of selecting a problem based on its difficulty.
 * Applies a linear or exponential multiplier to favor problems closer to 
 * the top of the user's selected rating range.
 */
export function calculateDifficultyWeight(
  rating: number | undefined,
  minRating: number,
  maxRating: number,
  difficulty?: DifficultyPreference
): number {
  if (rating === undefined) return 1.0;
  if (difficulty === "balanced" || !difficulty) return 1.0;
  if (minRating >= maxRating) return 1.0;

  const normalized = (rating - minRating) / (maxRating - minRating);

  if (difficulty === "harder") {
    // Linear scale from 1.0 (minRating) to 4.0 (maxRating)
    return 1.0 + normalized * 3.0;
  }

  if (difficulty === "much_harder") {
    // Exponential scale from 1.0 (minRating) to 10.0 (maxRating)
    return 1.0 + Math.pow(normalized, 2) * 9.0;
  }

  return 1.0;
}

/**
 * The master combination function that calculates the final weight for a problem
 * by multiplying its topic, recency, and difficulty scores together.
 */
export function calculateProblemWeight(problem: Problem, config: PracticeConfig): number {
  const topicWeight = calculateTopicWeight(problem.tags || [], config.tagBiases || {});
  const recencyWeight = calculateRecencyWeight(problem.contestId || 0);
  const difficultyWeight = calculateDifficultyWeight(
    problem.rating,
    config.minRating,
    config.maxRating,
    config.difficulty
  );
  
  return topicWeight * recencyWeight * difficultyWeight;
}

/**
 * Performs a weighted random selection over an array of items.
 * Items with higher weights have a mathematically higher probability of being chosen,
 * but lower-weighted items still retain a chance of winning.
 */
export function weightedRandom<T>(items: T[], weights: number[]): T {
  let total = 0;
  for (const w of weights) {
    total += w;
  }

  if (total <= 0) {
    return items[Math.floor(Math.random() * items.length)];
  }

  const r = Math.random() * total;
  let running = 0;

  for (let i = 0; i < items.length; i++) {
    running += weights[i];
    if (running >= r) {
      return items[i];
    }
  }

  return items[items.length - 1];
}

/**
 * The primary entry point for the recommendation engine.
 * Filters the raw problemset, calculates weights for all eligible candidates, 
 * and randomly selects the final problem.
 */
export function recommendProblem(problems: Problem[], config: PracticeConfig, userContext?: UserContext): Problem {
  if (!problems || problems.length === 0) {
    throw new Error("No problems provided.");
  }

  if (config.minRating > config.maxRating) {
    throw new Error("Invalid rating range.");
  }

  const valid = filterEligibleProblems(problems, config, userContext);

  if (valid.length === 0) {
    throw new Error("No unseen problems match your current configuration.");
  }

  const weights: number[] = new Array(valid.length);
  for (let i = 0; i < valid.length; i++) {
    weights[i] = calculateProblemWeight(valid[i], config);
  }

  return weightedRandom(valid, weights);
}
