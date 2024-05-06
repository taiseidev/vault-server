// src/utils/date.util.ts
export function calculateExpiryDate(seconds: number): string {
  const now = new Date();
  const expiryDate = new Date(now.getTime() + seconds * 1000);
  return expiryDate.toISOString();
}
