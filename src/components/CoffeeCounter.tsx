import { createSignal, onMount } from 'solid-js';
import '../styles/coffee-counter.css';

interface CoffeeCounterProps {
  initialCount: string;
}

const CoffeeCounter = (props: CoffeeCounterProps) => {
  const [count, setCount] = createSignal(props.initialCount);
  const [isAnimating, setIsAnimating] = createSignal(false);

  const rand = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const animateCounter = () => {
    // Start animation
    setIsAnimating(true);

    // Update count -- legacy k kept
    const currentCount = parseFloat(count().replace('k', ''));
    const newCount = (currentCount + 1).toFixed(0);
    setCount(newCount);

    // Reset animation after completion
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  onMount(() => {
    // Initial animation after mount
    setTimeout(() => animateCounter(), 1000);

    // Set up interval for periodic animations
    const interval = setInterval(animateCounter, rand(5000, 10000));
    return () => clearInterval(interval);
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
