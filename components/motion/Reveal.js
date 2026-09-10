"use client";

import { useEffect, useRef, useState } from "react";

// Scroll-triggered reveal: an IntersectionObserver flips data-reveal
// between "out" (opacity 0, shifted down) and "in" (settled), exactly
// like mdx.so hides content until it scrolls into view.
//
// When `go` is provided the observer is bypassed and reveal only fires
// when `go` turns true (used for above-the-fold content that should wait
// for the preloader).
export default function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
  threshold = 0.15,
  go = null,
}) {
  const ref = useRef(null);
  const [state, setState] = useState("out");

  // When driven by an external `go` flag, reveal as soon as it flips true.
  useEffect(() => {
    if (go === null || !go) return undefined;
    const t = setTimeout(() => setState("in"), 0);
    return () => clearTimeout(t);
  }, [go]);

  // Otherwise observe the element and reveal when it scrolls into view.
  useEffect(() => {
    if (go !== null) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setState("in");
            observer.disconnect();
          }
        });
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, go]);

  return (
    <Tag
      ref={ref}
      data-reveal={state}
      className={className}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}