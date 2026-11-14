"use client";

import { useEffect, useRef, type RefObject } from "react";

type SharedIndicatorOptions = {
  activeKey: string;
  orientation?: "horizontal" | "vertical";
};

type RectSnapshot = {
  x: number;
  y: number;
  w: number;
  h: number;
};

/**
 * Zero-dependency FLIP shared indicator hook (#5 Stretch 12%, #9 Ease-in-out
 * for moves, #20 Reuse the same layoutId).
 *
 * Moves a single indicator element smoothly between children tagged with
 * `data-indicator-key="..."` using the Web Animations API, without adding
 * layout shifts (CLS = 0) or external animation libraries.
 */
export function useSharedIndicator<
  TContainer extends HTMLElement = HTMLElement,
  TIndicator extends HTMLElement = HTMLSpanElement,
>({
  activeKey,
  orientation = "horizontal",
}: SharedIndicatorOptions): {
  containerRef: RefObject<TContainer | null>;
  indicatorRef: RefObject<TIndicator | null>;
} {
  const containerRef = useRef<TContainer | null>(null);
  const indicatorRef = useRef<TIndicator | null>(null);
  const prevRectRef = useRef<RectSnapshot | null>(null);
  const prevKeyRef = useRef<string>(activeKey);

  useEffect(() => {
    const container = containerRef.current;
    const indicator = indicatorRef.current;
    if (!container || !indicator) return;

    const measureAndApply = (animate: boolean) => {
      const target = container.querySelector<HTMLElement>(
        `[data-indicator-key="${CSS.escape(activeKey)}"]`
      );
      if (!target) {
        indicator.style.opacity = "0";
        return;
      }

      const nextRect: RectSnapshot = {
        x: target.offsetLeft,
        y: target.offsetTop,
        w: target.offsetWidth,
        h: target.offsetHeight,
      };

      indicator.style.opacity = "1";
      indicator.style.width = `${nextRect.w}px`;
      indicator.style.height = `${nextRect.h}px`;
      indicator.style.transform = `translate3d(${nextRect.x}px, ${nextRect.y}px, 0)`;

      const prevRect = prevRectRef.current;
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (
        animate &&
        prevRect &&
        !prefersReduced &&
        typeof indicator.animate === "function" &&
        (Math.abs(prevRect.x - nextRect.x) > 1 ||
          Math.abs(prevRect.y - nextRect.y) > 1 ||
          Math.abs(prevRect.w - nextRect.w) > 1)
      ) {
        const dx = prevRect.x - nextRect.x;
        const dy = prevRect.y - nextRect.y;
        const sx = nextRect.w > 0 ? prevRect.w / nextRect.w : 1;
        const sy = nextRect.h > 0 ? prevRect.h / nextRect.h : 1;

        const midX = dx * 0.45;
        const midY = dy * 0.45;
        // #5 Stretch moving knobs 12% along travel axis at mid-flight
        const stretchX = orientation === "horizontal" ? 1.12 : 1;
        const stretchY = orientation === "vertical" ? 1.12 : 1;

        indicator.getAnimations().forEach((anim) => anim.cancel());
        indicator.animate(
          [
            {
              transform: `translate3d(${ nextRect.x + dx }px, ${ nextRect.y + dy }px, 0) scale(${sx}, ${sy})`,
              transformOrigin: "left top",
            },
            {
              transform: `translate3d(${ nextRect.x + midX }px, ${ nextRect.y + midY }px, 0) scale(${stretchX}, ${stretchY})`,
              transformOrigin: "left top",
              offset: 0.46,
            },
            {
              transform: `translate3d(${nextRect.x}px, ${nextRect.y}px, 0) scale(1, 1)`,
              transformOrigin: "left top",
            },
          ],
          {
            duration: 260,
            easing: "cubic-bezier(0.65, 0, 0.35, 1)",
          }
        );
      }

      prevRectRef.current = nextRect;
      prevKeyRef.current = activeKey;
    };

    const didKeyChange = prevKeyRef.current !== activeKey;
    measureAndApply(didKeyChange);

    const onResize = () => measureAndApply(false);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [activeKey, orientation]);

  return { containerRef, indicatorRef };
}
