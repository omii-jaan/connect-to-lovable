import { useCallback, useEffect, useRef, useState } from "react";

interface TiltOptions {
  /** Max rotation in degrees on each axis. */
  max?: number;
  /** Perspective distance in px. */
  perspective?: number;
  /** Lift on hover in px. */
  lift?: number;
}

/**
 * Pointer-driven 3D tilt. Returns a ref to attach to the container and a
 * style object for the transformed surface. Disabled for reduced motion and
 * for coarse pointers (touch), where tilt reads as jitter.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>({
  max = 6,
  perspective = 1200,
  lift = 6,
}: TiltOptions = {}) {
  const ref = useRef<T | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false });

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const sync = () => {
      const setting = document.documentElement.dataset.motion;
      const reduced = setting === "reduced" || (setting !== "full" && query.matches);
      setEnabled(!reduced && fine);
    };

    sync();
    query.addEventListener("change", sync);
    // The motion setting lives as an attribute on <html>; watch it directly.
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributeFilter: ["data-motion"] });

    return () => {
      query.removeEventListener("change", sync);
      observer.disconnect();
    };
  }, []);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<T>) => {
      if (!enabled || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: -py * max * 2, y: px * max * 2, active: true });
    },
    [enabled, max],
  );

  const onPointerLeave = useCallback(() => {
    setTilt({ x: 0, y: 0, active: false });
  }, []);

  const style: React.CSSProperties = enabled
    ? {
        transform: `perspective(${perspective}px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) translateZ(${tilt.active ? lift : 0}px)`,
        transformStyle: "preserve-3d",
        transition: tilt.active
          ? "transform 120ms var(--ease-standard)"
          : "transform 600ms var(--ease-entrance)",
        willChange: "transform",
      }
    : {};

  return { ref, style, handlers: { onPointerMove, onPointerLeave }, enabled };
}
