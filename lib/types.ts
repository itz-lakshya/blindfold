export type Problem = {
  contestId: number;
  index: string;
  name: string;
  rating?: number;
  tags: string[];
};

export type PracticeConfig = {
  minRating: number;
  maxRating: number;
  tagBiases: Record<string, number>;
};
