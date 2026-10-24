/** Standard PDF fonts only cover Latin-1, so common typographic characters are mapped and the rest become "?". */
export function toLatin1(text: string): string {
  return text
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/•/g, "*")
    .replace(/\t/g, "    ")
    .replace(/[^\n\x20-\x7E\xA0-\xFF]/g, "?");
}

/** True when `toLatin1` would have to replace a character with "?". */
export function hasUnsupportedCharacters(text: string): boolean {
  return /[^\n\t\x20-\x7E\xA0-\xFF‘’“”–—…•]/.test(text);
}
