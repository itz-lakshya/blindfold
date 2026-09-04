import { Problem, PracticeConfig } from "./types";

export function recommendProblem(
  problems: Problem[],
  config: PracticeConfig
): Problem {
  if (!problems || problems.length === 0) {
    throw new Error("No problems provided.");
  }

  if (config.minRating > config.maxRating) {
    throw new Error("Invalid rating range.");
  }

  const valid = problems.filter((p) => {
    if (typeof p.rating !== "number") return false;
    return p.rating >= config.minRating && p.rating <= config.maxRating;
  });

  if (valid.length === 0) {
    throw new Error(`No eligible problems found in range ${config.minRating}-${config.maxRating}.`);
  }

  const weights: number[] = new Array(valid.length);
  let total = 0;

  for (let i = 0; i < valid.length; i++) {
    const p = valid[i];
    let w = 1;

    if (p.tags && config.tagBiases) {
      for (const t of p.tags) {
        const tLower = t.toLowerCase();
        
        if (config.tagBiases[tLower] !== undefined) {
          const bias = config.tagBiases[tLower];
          let mult = 1 + (bias / 100);
          
          if (mult <= 0) {
             mult = 0.01;
          }
          
          w *= mult;
        }
      }
    }

    weights[i] = w;
    total += w;
  }

  if (total <= 0) {
    const idx = Math.floor(Math.random() * valid.length);
    return valid[idx];
  }

  const r = Math.random() * total;
  let running = 0;

  for (let i = 0; i < valid.length; i++) {
    running += weights[i];
    if (running >= r) {
      return valid[i];
    }
  }

  return valid[valid.length - 1];
}
