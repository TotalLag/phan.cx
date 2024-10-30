import { createSignal, Show, For } from 'solid-js';
import { Portal } from 'solid-js/web';
import { hasUnreadReleases, markReleasesAsRead } from '../../stores/notifications';

interface Release {
  id: string;
  name: string;
  tag: string;
  date: string;
  body: string;
}

interface Props {
  releases: Release[];
}

export default function NotificationsButton(props: Props) {
  const [isOpen, setIsOpen] = createSignal(false);
  const [isVisible, setIsVisible] = createSignal(false);
  const [position, setPosition] = createSignal({ top: 0, right: 0 });
  const [showPing, setShowPing] = createSignal(hasUnreadReleases(props.releases));
  let buttonRef: HTMLButtonElement | undefined;

  const updatePosition = () => {
    if (buttonRef) {
      const rect = buttonRef.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      });
    }
  };

  const handleOpen = () => {
    updatePosition();
    const wasOpen = isOpen();
    setIsOpen(!wasOpen);
    
    if (!wasOpen) {
      // Update both local state and store
      setShowPing(false);
      markReleasesAsRead(props.releases);
      setTimeout(() => setIsVisible(true), 0);
    } else {
      setIsVisible(false);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (buttonRef && !buttonRef.contains(event.target as Node)) {
      setIsVisible(false);
      setTimeout(() => {
        setIsOpen(false);
      }, 200);
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  return (
    <>
      <button 
        ref={buttonRef}
        onClick={handleOpen}
        class="relative inline-flex items-center justify-center p-2 rounded-full bg-surface-primary hover:bg-surface-hover active:bg-surface-active focus:outline-none focus:ring-2 focus:ring-accent/20"
        aria-label="Show notifications"
        aria-expanded={isOpen()}
        aria-haspopup="dialog"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 text-icon"
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
            <span class="absolute inset-0 rounded-full bg-red-600 ring-2 ring-red-400/20" />
            <span class="absolute -inset-1 rounded-full bg-red-600/40 animate-ping" />
          </span>
        </Show>
      </button>

      <Show when={isOpen()}>
        <Portal>
          <div 
            class="fixed z-50"
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
                w-[32rem] max-h-[32rem] overflow-hidden bg-surface-primary border border-border rounded-lg shadow-modal
                transform transition-all duration-200 ease-out origin-top-right
                ${isVisible() ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
              `}
            >
              <div class="sticky top-0 z-10 p-3 border-b border-border bg-surface-primary/80 backdrop-blur-sm">
                <h2 class="text-xs font-medium text-primary">What's Changed</h2>
              </div>
              
              <div class="overflow-y-auto max-h-[calc(32rem-3rem)]">
                <Show 
                  when={props.releases.length > 0}
                  fallback={
                    <div class="p-3 text-xs text-muted text-center">
                      No updates available
                    </div>
                  }
                >
                  <For each={props.releases}>
                    {(release) => (
                      <div class="flex gap-4 p-3 hover:bg-surface-hover transition-colors duration-150">
                        <div class="flex flex-col items-start gap-1.5 w-20 flex-shrink-0 pr-4 border-r border-border">
                          <div class="text-xs text-muted font-medium">
                            {formatDate(release.date)}
                          </div>
                          <div class="inline-flex items-center rounded-full bg-surface-secondary px-1.5 py-0.5 text-[0.6875rem] text-muted">
                            {release.tag}
                          </div>
                        </div>
                        <div class="flex-1 min-w-0">
                          <h3 class="text-xs font-medium text-primary">
                            {release.name}
                          </h3>
                          <div class="mt-1 text-[0.6875rem] leading-normal text-secondary whitespace-pre-wrap">
                            {release.body}
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
