import { createSignal, createEffect } from 'solid-js';
import { createLogger } from '../utils/logger';

// Create a module-specific logger
const notificationsLogger = createLogger('NotificationsStore');

const STORAGE_KEY = 'read_release_ids';

function getInitialState(): string[] {
  if (typeof localStorage !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const initialIds = stored ? JSON.parse(stored) : [];
      notificationsLogger.debug(`Retrieved ${initialIds.length} read release IDs`);
      return initialIds;
    } catch (error) {
      notificationsLogger.warn('Failed to retrieve read release IDs', error);
      return [];
    }
  }
  return [];
}

const [readReleaseIds, setReadReleaseIds] =
  createSignal<string[]>(getInitialState());

// Persist changes to localStorage
createEffect(() => {
  const ids = readReleaseIds();
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
      notificationsLogger.debug(`Saved ${ids.length} read release IDs`);
    } catch (error) {
      notificationsLogger.warn('Failed to save read release IDs', error);
    }
  }
});

export function hasUnreadReleases(releases: { id: string }[]): boolean {
  if (!releases?.length) {
    notificationsLogger.debug('No releases to check for unread status');
    return false;
  }
  
  const readIds = readReleaseIds();
  const hasUnread = releases.some((release) => !readIds.includes(release.id));
  
  notificationsLogger.debug(`Unread releases check: ${hasUnread}`);
  return hasUnread;
}

export function markReleasesAsRead(releases: { id: string }[]) {
  if (!releases?.length) {
    notificationsLogger.debug('No releases to mark as read');
    return;
  }
  
  const newReadIds = [
    ...new Set([...readReleaseIds(), ...releases.map((r) => r.id)]),
  ];
  
  notificationsLogger.info(`Marking ${releases.length} releases as read`);
  setReadReleaseIds(newReadIds);
}

export { readReleaseIds };
