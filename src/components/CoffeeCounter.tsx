import { createSignal, onMount } from 'solid-js';
import '../styles/coffee-counter.css';
import { createLogger } from '../utils/logger';

const coffeeLogger = createLogger('CoffeeCounter');

interface CoffeeCounterProps {
  initialCount: string;
}

const CoffeeCounter = (props: CoffeeCounterProps) => {
  const [count, setCount] = createSignal(props.initialCount);
  const [isAnimating, setIsAnimating] = createSignal(false);

  coffeeLogger.debug(`Initializing Coffee Counter with count: ${props.initialCount}`);

  const rand = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const animateCounter = () => {
    // Start animation
    setIsAnimating(true);
    coffeeLogger.debug('Starting coffee counter animation');

    // Update count -- legacy k kept
    const currentCount = parseFloat(count().replace('k', ''));
    const newCount = (currentCount + 1).toFixed(0);
    setCount(newCount);

    coffeeLogger.info(`Coffee counter incremented: ${newCount}`);

    // Reset animation after completion
    setTimeout(() => {
      setIsAnimating(false);
      coffeeLogger.debug('Coffee counter animation completed');
    }, 1000);
  };

  onMount(() => {
    // Initial animation after mount
    coffeeLogger.debug('Coffee Counter mounted, setting up initial animation');

    setTimeout(() => {
      animateCounter();
    }, 1000);

    // Set up interval for periodic animations
    const interval = setInterval(animateCounter, rand(5000, 10000));
    
    coffeeLogger.info(`Periodic animation interval set: ${interval}`);

    return () => {
      clearInterval(interval);
      coffeeLogger.debug('Coffee Counter interval cleared');
    };
  });

  return (
    <div
      class="stats-counter text-center"
      classList={{ 'is-animating': isAnimating() }}
    >
      <div class="increment-indicator" classList={{ show: isAnimating() }}>
        +1
      </div>
      <div class="text-primary counter-value text-base font-bold">
        {count()}
      </div>
      <div class="text-xs uppercase leading-tight text-icon-muted">
        CUPS OF
        <br />
        COFFEE
      </div>
    </div>
  );
};

export default CoffeeCounter;
