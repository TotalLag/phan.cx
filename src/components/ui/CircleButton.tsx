import type { JSX } from 'solid-js';

interface Props {
  label: string;
  class?: string;
  children: JSX.Element;
  onClick?: () => void;
}

export default function CircleButton(props: Props) {
  const classes = [
    'inline-flex items-center justify-center p-icon-button rounded-button',
    'bg-surface-primary',
    'cursor-pointer',
    'hover:bg-surface-hover',
    'active:bg-surface-active active:shadow-button',
    'focus:shadow-button focus:outline-none focus:ring-2 focus:ring-blue-500/20',
    'transition-all duration-fast ease-soft',
    props.class
  ].filter(Boolean).join(' ');

  return (
    <button 
      type="button"
      class={classes}
      aria-label={props.label}
      onClick={props.onClick}
    >
      <span class="flex-layout">
        {props.children}
      </span>
    </button>
  );
}
