import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface CountUpProps {
  value: string;
  duration?: number;
}

export const CountUp: React.FC<CountUpProps> = ({ value, duration = 2 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [displayValue, setDisplayValue] = useState('0');

  // Estrae la parte numerica e i prefissi/suffissi (es. "280+" -> prefix="", number=280, suffix="+")
  const match = value.match(/^([^0-9]*)(\d+)([^0-9]*)$/);

  useEffect(() => {
    if (!isInView) return;

    if (!match) {
      // Se non è un numero puro (es. "Chiavi in Mano", "Civile & Industriale"), mostra il testo direttamente
      setDisplayValue(value);
      return;
    }

    const [, prefix, numStr, suffix] = match;
    const targetNumber = parseInt(numStr, 10);
    const startTime = performance.now();
    const durationMs = duration * 1000;

    let animationFrameId: number;

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      
      // Easing out cubic per effetto rallentamento dolce alla fine
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * targetNumber);

      setDisplayValue(`${prefix}${current}${suffix}`);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, value, duration]);

  if (!match) {
    return <span ref={ref}>{value}</span>;
  }

  return <span ref={ref}>{displayValue}</span>;
};
