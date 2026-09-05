/**
 * Global TypeScript interfaces and types.
 */

export type Problem = {
  contestId: number;
  index: string;
  name: string;
  rating?: number;
  tags: string[];
};

export type DifficultyPreference = "balanced" | "harder" | "much_harder";

export type PracticeConfig = {
  minRating: number;
  maxRating: number;
  tagBiases: Record<string, number>;
  maxAgeContests?: number;
  difficulty?: DifficultyPreference;
};

export type UserHistory = {
  handle: string;
  solvedProblemIds: string[];
  attemptedProblemIds: string[];
};

export type UserHistoryResponse = 
  | { success: true; data: UserHistory }
  | { success: false; error: string };

export type UserContext = {
  solvedProblemIds: string[];
  attemptedProblemIds: string[];
  seenProblemIds: string[];
};
