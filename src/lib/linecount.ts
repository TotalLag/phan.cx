// src/lib/linecount.ts
import { execSync } from 'child_process';

export function getLineCount(): string {
  const buffer = execSync('npm run count:lines').toString().split('\n');
  return buffer[buffer.length - 2];
}