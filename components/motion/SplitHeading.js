"use client";

import { Fragment, useEffect, useRef, useState } from "react";

// mdx.so-style split-text heading: each line is broken into words, each
// word sits inside an overflow-hidden column, and when the heading scrolls
// into view the words slide up one-by-one (staggered).
//
// When `go` is provided the observer is bypassed: the words animate as
// soon as `go` turns true (used for the hero, which waits for the
// preloader to lift).
export default function SplitHeading({
  lines = [],
  as: Tag = "h2",
  className = "",
  baseDelay = 0,
  stagger = 90,
  go = null,
}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (go === null || !go) return undefined;
    const t = setTimeout(() => setInView(true), 0);
    return () => clearTimeout(t);
  }, [go]);

  useEffect(() => {
    if (go !== null) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [go]);

  let wordIndex = 0;

  return (
    <Tag ref={ref} className={`${inView ? "in-view" : ""} ${className}`}>
      {lines.map((line, li) => (
        <span key={li} className="mask-line">
          {line.split(" ").map((word, wi, words) => {
            const idx = wordIndex++;
            return (
              <Fragment key={`${li}-${wi}`}>
                <span className="mask-word">
                  <span style={{ transitionDelay: `${baseDelay + idx * stagger}ms` }}>
                    {word}
                  </span>
                </span>
                {wi < words.length - 1 ? " " : ""}
              </Fragment>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}