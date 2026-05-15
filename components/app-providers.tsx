"use client";

import { CartProvider } from "@/contexts/CartContext";
import { useEffect } from "react";
import Lenis from "lenis";

/*
 * AppProviders is a wrapper component that sets up global providers and effects for the application.
 * It currently includes the CartProvider for managing shopping cart state and a useEffect hook to initialize
 * the Lenis smooth scrolling library. The Lenis effect checks for user preference for reduced motion and
 * only initializes if the user has not indicated a preference for reduced motion. It also sets up an animation
 * loop to continuously update the Lenis instance and ensures that resources are cleaned up when the component is unmounted.
 */
export function AppProviders({ children }: { children: React.ReactNode }) 
{
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) 
    {
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
