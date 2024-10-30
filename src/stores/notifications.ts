import { createSignal } from 'solid-js';

const STORAGE_KEY = 'read_release_ids';

function getInitialState(): string[] {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  return [];
}

const [readReleaseIds, setReadReleaseIds] = createSignal<string[]>(getInitialState());

export function hasUnreadReleases(releases: { id: string }[]): boolean {
  const readIds = readReleaseIds();
  return releases.some(release => !readIds.includes(release.id));
}

export function markReleasesAsRead(releases: { id: string }[]) {
  const newReadIds = [...new Set([...readReleaseIds(), ...releases.map(r => r.id)])];
  setReadReleaseIds(newReadIds);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newReadIds));
  }
}

export { readReleaseIds };
