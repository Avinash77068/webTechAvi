export function countMatches(text: string, term: string): number {
  if (!term) return 0;
  return text.split(term).length - 1;
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}
