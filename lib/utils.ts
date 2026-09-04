/**
 * Shared utility functions.
 */

export function getProblemId(contestId: number, index: string): string {
  return `${contestId}${index}`;
}
