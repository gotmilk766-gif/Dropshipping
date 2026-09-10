"use client";

import { useEffect, useRef } from "react";

// Drip-style giant background title: a huge, ghosted copy of the product
// name sits behind the hero content (like mdx.so's oversized project
// heading) and parallax-scrolls — it drifts upward slower than the page,
// lagging behind the content for depth.
//
// Updates come from three redundant paths so it stays smooth in real
// browsers (rAF) and still works in throttled/occluded webviews where
// rAF can freeze: a passive capture scroll listener (instant sync) and a
// 100ms interval safety net. prefers-reduced-motion gets a static title.
export default function ProjectNumber({ text, index = null }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) {
      el.style.opacity = "1";
      return;
    }

    // show immediately (no transition — nothing to stall)
    el.style.opacity = "1";

    const section = el.parentElement;

    const apply = () => {
      if (!section || !section.isConnected) return;
      const rect = section.getBoundingClientRect();
      // how far the hero has scrolled past the top of the viewport
      const scrolled = Math.max(0, -rect.top);
      // move up at ~30% of the page speed (0.7 offset downward = lags)
      const drift = Math.min(scrolled * 0.7, 300);
      el.style.transform = `translate3d(0, ${drift}px, 0)`;
    };

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      apply();
    };
    raf = requestAnimationFrame(loop);

    // capture: true — page-scroll events reach the window reliably in
    // every environment (non-capture is silently missed in some webviews)
    window.addEventListener("scroll", apply, { capture: true, passive: true });

    // safety net for environments where rAF never fires (occluded tabs)
    const interval = setInterval(apply, 100);

    apply();

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(interval);
      window.removeEventListener("scroll", apply, { capture: true });
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute left-0 top-16 z-0 select-none opacity-0 sm:top-20"
    >
      {index != null && (
        <div className="font-heading text-sm font-bold tracking-[0.35em] text-accent/50">
          {String(index).padStart(2, "0")}
        </div>
      )}
      <div className="font-heading -mt-2 max-w-full break-words font-black uppercase leading-[0.82] tracking-tight text-white/[0.06] [font-size:clamp(4rem,10vw,12rem)]">
        {text}
      </div>
    </div>
  );
}