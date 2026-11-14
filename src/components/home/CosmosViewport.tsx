"use client";

import { useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Lenis from "lenis";
import type { PlanetCasePoint } from "./PlanetCanvas";

const LazyPlanetCanvas = dynamic(() => import("./PlanetCanvas"), {
  ssr: false,
  loading: () => <div className="cosmos-fallback-backdrop" aria-hidden="true" />,
});

/** Mounts the WebGL globe chunk after the browser paints initial Hero SSR HTML. */
function DeferredPlanetCanvas({
  casePoints,
}: {
  casePoints: readonly PlanetCasePoint[];
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(rafId);
  }, []);

  if (!ready) {
    return <div className="cosmos-fallback-backdrop" aria-hidden="true" />;
  }

  return <LazyPlanetCanvas casePoints={casePoints} />;
}

type CosmosViewportProps = {
  casePoints: readonly PlanetCasePoint[];
  children: ReactNode;
};

export default function CosmosViewport({
  casePoints,
  children,
}: CosmosViewportProps) {
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const revealEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );

    if (motionQuery.matches) {
      for (const el of revealEls) {
        el.classList.add("in");
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );

    for (const el of revealEls) {
      observer.observe(el);
    }

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

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
      observer.disconnect();
      lenis.destroy();
    };
  }, []);

  return (
    <div className="cosmos-page" id="top">
      <DeferredPlanetCanvas casePoints={casePoints} />
      {children}
    </div>
  );
}
