"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedStatCardProps {
  end: number;
  label: string;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  className?: string;
}

export default function AnimatedStatCard({
  end,
  label,
  prefix = "",
  suffix = "",
  durationMs = 1400,
  className = "",
}: AnimatedStatCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const hasAnimatedRef = useRef(false);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimatedRef.current) {
          return;
        }

        hasAnimatedRef.current = true;
        const startTime = performance.now();

        const step = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / durationMs, 1);
          setValue(Math.round(progress * end));

          if (progress < 1) {
            requestAnimationFrame(step);
          }
        };

        requestAnimationFrame(step);
      },
      { threshold: 0.35 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [durationMs, end]);

  return (
    <div ref={cardRef} className={`rounded-xl p-6 text-center shadow-sm ${className}`}>
      <p className="text-3xl font-bold md:text-4xl">
        {prefix}
        {value}
        {suffix}
      </p>
      <p className="mt-1 text-sm">{label}</p>
    </div>
  );
}
