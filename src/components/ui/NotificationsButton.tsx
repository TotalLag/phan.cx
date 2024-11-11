import {
  createSignal,
  createEffect,
  Show,
  For,
  onMount,
  onCleanup,
} from 'solid-js';
import { Portal } from 'solid-js/web';
import {
  hasUnreadReleases,
  markReleasesAsRead,
} from '../../stores/notifications';
import type { Release } from '../../utils/github';
import CircleButton from './CircleButton';
import Markdown from './Markdown';
import { createLogger } from '../../utils/logger';

const notificationsLogger = createLogger('NotificationsButton');

interface Props {
  releases: Release[];
}

export default function NotificationsButton(props: Props) {
  const [isOpen, setIsOpen] = createSignal(false);
  const [isVisible, setIsVisible] = createSignal(false);
  const [position, setPosition] = createSignal({ top: 0, right: 0 });
  const [showPing, setShowPing] = createSignal(false);
  let buttonRef: HTMLButtonElement | undefined;
  let portalRef: HTMLDivElement | undefined;

  notificationsLogger.debug(`Initializing Notifications Button with ${props.releases.length} releases`);

  // Track unread state
  createEffect(() => {
    if (props.releases?.length) {
      const hasUnread = hasUnreadReleases(props.releases);
      setShowPing(hasUnread);
      notificationsLogger.debug(`Unread releases: ${hasUnread}`);
    }
  });

  const calculatePosition = () => {
    if (!buttonRef) return null;

    const rect = buttonRef.getBoundingClientRect();
    const isMobile = window.innerWidth < 640;

    return {
      top: rect.bottom + 8,
      right: isMobile ? 16 : window.innerWidth - rect.right,
    };
  };

  const updatePosition = () => {
    const newPosition = calculatePosition();
    if (newPosition) {
      setPosition(newPosition);
    }
  };

  const close = () => {
    notificationsLogger.debug('Closing notifications');
    setIsVisible(false);
    setTimeout(() => setIsOpen(false), 200);
  };

  const handleOpen = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isOpen()) {
      const newPosition = calculatePosition();
      if (newPosition) {
        notificationsLogger.info('Opening notifications');
        setPosition(newPosition);
        setIsOpen(true);
        markReleasesAsRead(props.releases);
        requestAnimationFrame(() => setIsVisible(true));
      }
    } else {
      close();
    }
  };

  onMount(() => {
    let mounted = true;

    const handleClickOutside = (event: MouseEvent) => {
      if (!isOpen() || !mounted) return;

      const target = event.target as Node;
      const isOutside =
        buttonRef &&
        !buttonRef.contains(target) &&
        portalRef &&
        !portalRef.contains(target);

      if (isOutside) {
        notificationsLogger.debug('Clicked outside notifications');
        close();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!mounted) return;
      if (event.key === 'Escape') {
        if (isOpen()) {
          notificationsLogger.debug('Escape key pressed, closing notifications');
          close();
        }
      }
    };

    const handleResize = () => {
      if (!mounted || !isOpen()) return;
      notificationsLogger.debug('Window resized, updating notifications position');
      updatePosition();
    };

    // Add event listeners
    document.addEventListener('click', handleClickOutside, true);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    // Cleanup function
    onCleanup(() => {
      notificationsLogger.debug('Cleaning up notifications button event listeners');
      mounted = false;
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    });
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  return (
    <>
      <CircleButton
        ref={buttonRef}
        onClick={handleOpen}
        label="Show notifications"
        aria-expanded={isOpen()}
        aria-haspopup="dialog"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-icon hover:text-icon-hover"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <Show when={showPing()}>
          <span class="absolute right-0.5 top-1 block h-2 w-2">
            <span class="absolute inset-0 rounded-pill bg-red-600 ring-2 ring-red-400/20" />
            <span class="absolute -inset-1 animate-ping rounded-pill bg-red-600/40" />
          </span>
        </Show>
      </CircleButton>

      <Show when={isOpen()}>
        <Portal>
          <div
            ref={portalRef}
            class="fixed z-popover sm:right-auto"
            style={{
              top: `${position().top}px`,
              right: `${position().right}px`,
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Notifications"
          >
            <div
              class={`max-h-[min(32rem,calc(100vh-6rem))] w-[calc(100vw-2rem)] origin-top-right transform overflow-hidden rounded-card border border-border bg-surface-primary shadow-modal transition-all duration-base ease-soft sm:w-[min(32rem,calc(100vw-2rem))] ${isVisible() ? 'scale-100 opacity-100' : 'scale-95 opacity-0'} `}
            >
              <div class="bg-surface-primary/80 sticky top-0 z-sticky border-b border-border p-container-px backdrop-blur-sm">
                <h2 class="text-primary text-xs font-medium">Release Notes</h2>
              </div>

              <div class="max-h-[calc(100vh-10rem)] overflow-y-auto sm:max-h-[calc(32rem-3rem)]">
                <Show
                  when={props.releases.length > 0}
                  fallback={
                    <div class="text-muted p-container-px text-center text-xs">
                      No updates available
                    </div>
                  }
                >
                  <For each={props.releases}>
                    {(release) => (
                      <div class="flex gap-stack p-container-px transition-colors duration-base ease-soft hover:bg-surface-hover">
                        <div class="flex w-20 flex-shrink-0 flex-col items-start gap-inline border-r border-border pr-4">
                          <div class="text-muted text-xs font-medium">
                            {formatDate(release.date)}
                          </div>
                          <div class="text-muted inline-flex items-center rounded-pill bg-surface-secondary px-1.5 py-0.5 text-[0.6875rem]">
                            {release.tag}
                          </div>
                        </div>
                        <div class="min-w-0 flex-1">
                          <h3 class="text-primary text-xs font-medium">
                            {release.name}
                          </h3>
                          <div class="mt-1">
                            <Markdown
                              content={release.body}
                              class="text-secondary text-[0.6875rem] leading-normal"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </For>
                </Show>
              </div>
            </div>
          </div>
        </Portal>
      </Show>
    </>
  );
}
