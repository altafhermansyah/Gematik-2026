"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Respect user's accessibility reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.25,
      // Exponential ease-out for ultra-silky inertia and natural deceleration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.6,
      infinite: false,
      autoResize: true,
    });

    lenisRef.current = lenis;

    // Attach window global reference for potential programmatic controls
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    const startRaf = () => {
      if (!rafId && !document.hidden) {
        rafId = requestAnimationFrame(raf);
      }
    };

    const stopRaf = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stopRaf();
      } else {
        startRaf();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    startRaf();

    return () => {
      stopRaf();
      document.removeEventListener("visibilitychange", handleVisibility);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  // On client-side route navigation, scroll to top smoothly (unless anchor hash exists)
  useEffect(() => {
    if (lenisRef.current) {
      if (!window.location.hash) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
    }
  }, [pathname]);

  return <>{children}</>;
}
