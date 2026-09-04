import { Problem } from "./types";

const CF_API_URL = "https://codeforces.com/api/problemset.problems";

let cache: Problem[] | null = null;
let lastFetch = 0;
const TTL = 60 * 60 * 1000;

export async function getProblems(): Promise<Problem[]> {
  const now = Date.now();
  
  if (cache && (now - lastFetch < TTL)) {
    return cache;
  }

  try {
    const res = await fetch(CF_API_URL, {
      next: { revalidate: 3600 }
    });

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
      console.warn("Returning stale data.");
      return cache;
    }
    
    throw new Error(err instanceof Error ? err.message : "Unknown error");
  }
}
