"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import CountUp from "./motion/CountUp";
import Reveal from "./motion/Reveal";
import RollText from "./motion/RollText";
import SplitHeading from "./motion/SplitHeading";

// ── Swap this for a hosted .glb of one of your real 3D-print products.
//    Uses <model-viewer>'s CORS-safe sample (a printed-toy-style robot) as a
//    placeholder for now.
const MODEL_SRC =
  "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb";

// model-viewer is a web component loaded once from a CDN. Kept out of the
// bundle so the hero renders instantly and the 3D layer hydrates after.
const MODEL_VIEWER_SRC =
  "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";

const STATS = [
  { value: 13000, suffix: "+", label: "Products Sold" },
  { value: 4.8, suffix: "★", label: "Average Rating" },
  { value: 90, suffix: "%", label: "Orders Ship Next Day" },
  { static: "#1", label: "Local 3D Print Shop" },
  { value: 75, suffix: "+", label: "Provinces Shipped To" },
];

function loadModelViewer() {
  if (typeof window === "undefined") return;
  if (window.__mvLoaded || customElements.get("model-viewer")) {
    window.__mvLoaded = true;
    return;
  }
  const s = document.createElement("script");
  s.type = "module";
  s.src = MODEL_VIEWER_SRC;
  document.head.appendChild(s);
  window.__mvLoaded = true;
}

export default function HeroBand3D() {
  const [go, setGo] = useState(false);
  const modelRef = useRef(null);
  const floatRef = useRef(null);

  // Wait for the preloader to lift, exactly like the original HeroBand.
  useEffect(() => {
    if (window.__nexusReady) {
      const t = setTimeout(() => setGo(true), 0);
      return () => clearTimeout(t);
    }
    const onReady = () => setGo(true);
    window.addEventListener("nexus:ready", onReady, { once: true });
    return () => window.removeEventListener("nexus:ready", onReady);
  }, []);

  // Load the 3D web component + run the cursor-tilt / parallax loop.
  useEffect(() => {
    loadModelViewer();

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const mv = modelRef.current;
    const floatLayer = floatRef.current;

    if (reduce) {
      if (mv) mv.cameraOrbit = "0deg 90deg 105%";
      return;
    }

    const mouse = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let spin = 0;
    let raf = 0;

    const onMove = (e) => {
      mouse.x = e.clientX / window.innerWidth - 0.5;
      mouse.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("mousemove", onMove);

    const loop = () => {
      cur.x += (mouse.x - cur.x) * 0.05;
      cur.y += (mouse.y - cur.y) * 0.05;
      spin += 0.12; // gentle idle rotation
      if (mv) {
        mv.cameraOrbit = `${cur.x * 40 + spin}deg ${
          90 + cur.y * 18
        }deg 105%`;
      }
      if (floatLayer) {
        floatLayer.style.transform = `translate(${cur.x * 34}px, ${
          cur.y * 34
        }px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-background">
      {/* soft glow accents — matched to the original HeroBand */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-40 h-[36rem] w-[36rem] rounded-full bg-accent/15 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-[#2D264B]/40 blur-[120px]"
      />

      <div className="relative mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-8 px-4 pb-16 pt-16 sm:pt-24 lg:grid-cols-[1.1fr_0.9fr]">
        {/* ── Left: copy ─────────────────────────────────────────── */}
        <div>
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
            lines={["Printed to Order.", "Shipped to Feel."]}
            baseDelay={120}
            stagger={110}
            go={go}
            className="font-heading mt-5 max-w-3xl text-4xl font-black leading-[1.05] text-ink sm:text-6xl lg:text-7xl"
          />
          <Reveal delay={560} go={go} className="mt-6 max-w-xl">
            <p className="text-base leading-7 text-muted sm:text-lg">
              Custom 3D prints, instant-download KDS templates and dropship
              finds — one marketplace for everything you need.
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
        </div>

        {/* ── Right: interactive 3D showcase ─────────────────────── */}
        <div
          className={`relative h-[360px] transition-opacity duration-1000 sm:h-[440px] lg:h-[520px] ${
            go ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* floating parallax accents */}
          <div ref={floatRef} className="absolute inset-0" aria-hidden>
            <span className="hero3d-float absolute left-[12%] top-[18%] h-3 w-3 rounded-full bg-accent/70" />
            <span className="hero3d-float absolute right-[16%] top-[30%] h-2 w-2 rounded-full bg-white/60 [animation-delay:1.4s]" />
            <span className="hero3d-float absolute bottom-[22%] left-[24%] h-2.5 w-2.5 rounded-full bg-brand-light/70 [animation-delay:2.6s]" />
            <span className="hero3d-float absolute bottom-[16%] right-[22%] h-1.5 w-1.5 rounded-full bg-accent/60 [animation-delay:0.8s]" />
          </div>

          {/* radial pedestal glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[80px]"
          />

          {/* the 3D model */}
          <model-viewer
            ref={modelRef}
            src={MODEL_SRC}
            alt="Featured 3D-printed product"
            camera-controls=""
            disable-zoom=""
            interaction-prompt="none"
            shadow-intensity="0"
            environment-image="neutral"
            exposure="1.1"
            camera-orbit="0deg 90deg 105%"
            field-of-view="30deg"
            style={{
              width: "100%",
              height: "100%",
              "--progress-bar-color": "transparent",
              "--poster-color": "transparent",
              background: "transparent",
            }}
          />
        </div>

        {/* ── Stats row (full-width, below both columns) ─────────── */}
        <Reveal delay={1000} go={go} className="lg:col-span-2">
          <div className="mt-6 grid grid-cols-2 gap-y-8 border-t border-line pt-10 sm:grid-cols-3 lg:grid-cols-5">
            {STATS.map((s) => (
              <div key={s.label} className="px-2">
                <div className="font-heading text-3xl font-black text-ink sm:text-4xl">
                  {s.static ? (
                    s.static
                  ) : (
                    <CountUp
                      to={s.value}
                      prefix={s.prefix || ""}
                      suffix={s.suffix || ""}
                    />
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
