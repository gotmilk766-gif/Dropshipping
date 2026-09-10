"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "./motion/lenisStore";

// mdx.so-style inertia scrolling across the whole store. Uses Lenis'
// auto-RAF mode (smooth wheel/touch scroll on <html>). Respects
// prefers-reduced-motion by falling back to native scrolling, and
// registers itself in the module store so other components can pause it
// (e.g. the cart drawer locks body scroll while open).
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      smoothWheel: true,
    });
    setLenis(lenis);

    // Keep any scroll-to-top from client-side navigation in sync.
    const onScroll = () => {
      if (window.scrollY === 0 && lenis.animatedScroll !== 0) {
        lenis.scrollTo(0, { immediate: true });
      }
    };
    window.addEventListener("scroll", onScroll, { capture: true, passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll, { capture: true });
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}