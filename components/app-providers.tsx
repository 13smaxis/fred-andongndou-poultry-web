"use client";

import { CartProvider } from "@/contexts/CartContext";
import { useEffect } from "react";
import Lenis from "lenis";

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (value) => 1 - Math.pow(2, -10 * value),
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 1.2,
    });

    let frameId = 0;

    const animate = (time: number) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return <CartProvider>{children}</CartProvider>;
}
