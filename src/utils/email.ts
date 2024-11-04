/**
 * Converts an email address into HTML entities to help prevent scraping
 */
export function obfuscateEmail(email: string): string {
  return email
    .split('')
    .map(char => `&#${char.charCodeAt(0)};`)
    .join('');
}
