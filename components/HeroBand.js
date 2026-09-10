"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CountUp from "./motion/CountUp";
import Reveal from "./motion/Reveal";
import RollText from "./motion/RollText";
import SplitHeading from "./motion/SplitHeading";

// mdx.so-style hero: huge serif headline with word-by-word reveal,
// pill CTA buttons with the signature letter-roll hover, and an
// animated stats row that counts up on scroll.
//
// The whole hero waits for the preloader to lift ("nexus:ready") before
// its entrance animation plays, exactly like mdx.so's reveal-on-load.
const STATS = [
  { value: 13000, suffix: "+", label: "Products Sold" },
  { value: 4.8, suffix: "★", label: "Average Rating" },
  { value: 90, suffix: "%", label: "Orders Ship Next Day" },
  { static: "#1", label: "Local 3D Print Shop" },
  { value: 75, suffix: "+", label: "Provinces Shipped To" },
];

export default function HeroBand() {
  const [go, setGo] = useState(false);

  useEffect(() => {
    if (window.__nexusReady) {
      const t = setTimeout(() => setGo(true), 0);
      return () => clearTimeout(t);
    }
    const onReady = () => {
      const t = setTimeout(() => setGo(true), 0);
      return t;
    };
    window.addEventListener("nexus:ready", onReady, { once: true });
    return () => window.removeEventListener("nexus:ready", onReady);
  }, []);

  return (
    <section className="relative overflow-hidden bg-background">
      {/* soft glow accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-40 h-[36rem] w-[36rem] rounded-full bg-accent/15 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-[#2D264B]/40 blur-[120px]"
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-4 pb-16 pt-16 sm:pt-24">
        <SplitHeading
          as="div"
          lines={["NEXUS STORE — MANILA, PH"]}
          baseDelay={0}
          stagger={0}
          go={go}
          className="text-xs font-semibold uppercase tracking-[0.35em] text-accent"
        />
        <SplitHeading
          as="h1"
          lines={["Products That Feel.", "Orders That Resonate."]}
          baseDelay={120}
          stagger={110}
          go={go}
          className="font-heading mt-5 max-w-4xl text-4xl font-black leading-[1.05] text-ink sm:text-6xl lg:text-7xl"
        />
        <Reveal delay={560} go={go} className="mt-6 max-w-xl">
          <p className="text-base leading-7 text-muted sm:text-lg">
            Custom 3D prints, instant-download KDS templates and dropship finds
            — one marketplace for everything you need.
          </p>
        </Reveal>

        <div className="mt-8 flex flex-wrap gap-3">
          <Reveal delay={720} go={go}>
            <Link
              href="/search"
              data-magnetic="0.35"
              data-magnetic-max="8"
              className="roll-hover inline-block rounded-full bg-white px-8 py-3 text-sm font-bold text-[#101820] transition hover:bg-white/85"
            >
              <RollText text="LET'S SHOP" />
            </Link>
          </Reveal>
          <Reveal delay={840} go={go}>
            <Link
              href="/sellers"
              data-magnetic="0.35"
              data-magnetic-max="8"
              className="roll-hover inline-block rounded-full border border-line px-8 py-3 text-sm font-bold text-ink transition hover:border-ink"
            >
              <RollText text="BECOME A SELLER" />
            </Link>
          </Reveal>
        </div>

        <Reveal delay={1000} go={go}>
          <div className="mt-14 grid grid-cols-2 gap-y-8 border-t border-line pt-10 sm:grid-cols-3 lg:grid-cols-5">
            {STATS.map((s) => (
              <div key={s.label} className="px-2">
                <div className="font-heading text-3xl font-black text-ink sm:text-4xl">
                  {s.static ? (
                    s.static
                  ) : (
                    <CountUp to={s.value} prefix={s.prefix || ""} suffix={s.suffix || ""} />
                  )}
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}