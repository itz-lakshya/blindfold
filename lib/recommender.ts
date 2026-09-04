/**
 * Core recommendation engine math.
 * Handles filtering eligible problems and calculating probabilistic weights
 * based on tag preferences and recency.
 */

import { getProblemId } from "./utils";
import { Problem, PracticeConfig, UserContext } from "./types";

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

export function calculateRecencyWeight(contestId: number): number {
  if (contestId > 1800) return 1.50;
  if (contestId > 1400) return 1.35;
  if (contestId > 800)  return 1.10;
  return 1.00;
}

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

export function calculateProblemWeight(problem: Problem, tagBiases: Record<string, number>): number {
  const topicWeight = calculateTopicWeight(problem.tags || [], tagBiases);
  const recencyWeight = calculateRecencyWeight(problem.contestId || 0);
  return topicWeight * recencyWeight;
}

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
    weights[i] = calculateProblemWeight(valid[i], config.tagBiases || {});
  }

  return weightedRandom(valid, weights);
}
