"use client";

import { useEffect, useRef, useState } from "react";

// Animated counter: counts from 0 to `to` when scrolled into view,
// with an ease-out curve (like mdx.so's stat reveals).
export default function CountUp({
  to,
  duration = 1800,
  prefix = "",
  suffix = "",
  className = "",
}) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let rafId;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            io.disconnect();
            const start = performance.now();
            const tick = (now) => {
              const p = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - p, 4);
              setValue(to * eased);
              if (p < 1) rafId = requestAnimationFrame(tick);
            };
            rafId = requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [to, duration]);

  const display = Number.isInteger(to)
    ? Math.round(value).toLocaleString("en-US")
    : value.toFixed(1).replace(/\.0$/, "");

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}