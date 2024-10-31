import { createSignal, createEffect, Show, For, onMount, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';
import { hasUnreadReleases, markReleasesAsRead } from '../../stores/notifications';
import type { Release } from '../../utils/github';
import CircleButton from './CircleButton';
import Markdown from './Markdown';

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

  // Track unread state
  createEffect(() => {
    if (props.releases?.length) {
      setShowPing(hasUnreadReleases(props.releases));
    }
  });

  const calculatePosition = () => {
    if (!buttonRef) return null;
    
    const rect = buttonRef.getBoundingClientRect();
    const isMobile = window.innerWidth < 640;
    
    return {
      top: rect.bottom + 8,
      right: isMobile ? 16 : window.innerWidth - rect.right
    };
  };

  const updatePosition = () => {
    const newPosition = calculatePosition();
    if (newPosition) {
      setPosition(newPosition);
    }
  };

  const close = () => {
    setIsVisible(false);
    setTimeout(() => setIsOpen(false), 200);
  };

  const handleOpen = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!isOpen()) {
      const newPosition = calculatePosition();
      if (newPosition) {
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
      const isOutside = buttonRef && 
        !buttonRef.contains(target) && 
        portalRef && 
        !portalRef.contains(target);

      if (isOutside) {
        close();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!mounted) return;
      if (event.key === 'Escape') {
        if (isOpen()) {
          close();
        }
      }
    };

    const handleResize = () => {
      if (!mounted || !isOpen()) return;
      updatePosition();
    };

    // Add event listeners
    document.addEventListener('click', handleClickOutside, true);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    // Cleanup function
    onCleanup(() => {
      mounted = false;
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    });
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
          class="w-5 h-5 text-icon hover:text-icon-hover"
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
          <span class="absolute top-1 right-0.5 block h-2 w-2">
            <span class="absolute inset-0 rounded-pill bg-red-600 ring-2 ring-red-400/20" />
            <span class="absolute -inset-1 rounded-pill bg-red-600/40 animate-ping" />
          </span>
        </Show>
      </CircleButton>

      <Show when={isOpen()}>
        <Portal>
          <div 
            ref={portalRef}
            class="fixed z-popover sm:right-auto"
            style={{
              'top': `${position().top}px`,
              'right': `${position().right}px`
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Notifications"
          >
            <div 
              class={`
                w-[calc(100vw-2rem)] sm:w-[min(32rem,calc(100vw-2rem))] max-h-[min(32rem,calc(100vh-6rem))] 
                overflow-hidden bg-surface-primary border border-border rounded-card shadow-modal
                transform transition-all duration-base ease-soft origin-top-right
                ${isVisible() ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
              `}
            >
              <div class="sticky top-0 z-sticky p-container-px border-b border-border bg-surface-primary/80 backdrop-blur-sm">
                <h2 class="text-xs font-medium text-primary">Release Notes</h2>
              </div>
              
              <div class="overflow-y-auto max-h-[calc(100vh-10rem)] sm:max-h-[calc(32rem-3rem)]">
                <Show 
                  when={props.releases.length > 0}
                  fallback={
                    <div class="p-container-px text-xs text-muted text-center">
                      No updates available
                    </div>
                  }
                >
                  <For each={props.releases}>
                    {(release) => (
                      <div class="flex gap-stack p-container-px hover:bg-surface-hover transition-colors duration-base ease-soft">
                        <div class="flex flex-col items-start gap-inline w-20 flex-shrink-0 pr-4 border-r border-border">
                          <div class="text-xs text-muted font-medium">
                            {formatDate(release.date)}
                          </div>
                          <div class="inline-flex items-center rounded-pill bg-surface-secondary px-1.5 py-0.5 text-[0.6875rem] text-muted">
                            {release.tag}
                          </div>
                        </div>
                        <div class="flex-1 min-w-0">
                          <h3 class="text-xs font-medium text-primary">
                            {release.name}
                          </h3>
                          <div class="mt-1">
                            <Markdown 
                              content={release.body} 
                              class="text-[0.6875rem] leading-normal text-secondary"
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
