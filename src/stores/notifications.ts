import { createSignal, createEffect } from 'solid-js';

const STORAGE_KEY = 'read_release_ids';

function getInitialState(): string[] {
  if (typeof localStorage !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
  return [];
}

const [readReleaseIds, setReadReleaseIds] = createSignal<string[]>(getInitialState());

// Persist changes to localStorage
createEffect(() => {
  const ids = readReleaseIds();
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }
});

export function hasUnreadReleases(releases: { id: string }[]): boolean {
  if (!releases?.length) return false;
  const readIds = readReleaseIds();
  return releases.some(release => !readIds.includes(release.id));
}

export function markReleasesAsRead(releases: { id: string }[]) {
  if (!releases?.length) return;
  const newReadIds = [...new Set([...readReleaseIds(), ...releases.map(r => r.id)])];
  setReadReleaseIds(newReadIds);
}

export { readReleaseIds };
