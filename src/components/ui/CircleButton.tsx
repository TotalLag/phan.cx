import type { Component, JSX } from 'solid-js';
import { splitProps, Match, Switch } from 'solid-js';
import { createLogger } from '../../utils/logger';

const circleButtonLogger = createLogger('CircleButton');

type BaseProps = {
  label: string;
  class?: string;
  children: JSX.Element;
  as?: 'button' | 'label';
  onClick?: (event?: MouseEvent) => void;
};

type ButtonProps = BaseProps &
  JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button';
  };

type LabelProps = BaseProps &
  JSX.LabelHTMLAttributes<HTMLLabelElement> & {
    as: 'label';
    for: string;
  };

type Props = ButtonProps | LabelProps;

const CircleButton: Component<Props> = (props) => {
  circleButtonLogger.debug(`Rendering CircleButton with label: ${props.label}`);

  const [local, rest] = splitProps(props, ['label', 'class', 'children', 'as', 'onClick']);

  const baseClasses = [
    'relative',
    'inline-flex',
    'items-center',
    'justify-center',
    'p-icon-button',
    'rounded-button',
    'bg-surface-primary',
    'hover:bg-surface-hover',
    'active:bg-surface-active',
    'active:shadow-button',
    'focus:shadow-button',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-accent/20',
    'transition-all',
    'duration-base',
    'ease-soft',
  ];

  const classes = [...baseClasses, local.class].filter(Boolean).join(' ');

  const handleClick = (event?: MouseEvent) => {
    circleButtonLogger.info(`Button clicked: ${local.label}`);
    if (local.onClick) {
      local.onClick(event);
    }
  };

  return (
    <Switch>
      <Match when={local.as === 'label'}>
        <label
          {...(rest as JSX.LabelHTMLAttributes<HTMLLabelElement>)}
          class={classes}
          aria-label={local.label}
          onClick={(e) => handleClick(e)}
        >
          <span class="flex-layout">{local.children}</span>
        </label>
      </Match>
      <Match when={true}>
        <button
          {...(rest as JSX.ButtonHTMLAttributes<HTMLButtonElement>)}
          class={classes}
          aria-label={local.label}
          type={
            (rest as JSX.ButtonHTMLAttributes<HTMLButtonElement>).type ||
            'button'
          }
          onClick={(e) => handleClick(e)}
        >
          <span class="flex-layout">{local.children}</span>
        </button>
      </Match>
    </Switch>
  );
};

export default CircleButton;
