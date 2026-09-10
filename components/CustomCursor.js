"use client";

import { useEffect, useRef } from "react";

// mdx.so-style custom cursor: a small brand-orange dot with a trailing
// ring that lerps behind it, expanding over interactive elements and
// showing a label over product cards. Also runs the magnetic effect —
// any [data-magnetic] element under the pointer gently follows the
// cursor. Desktop / fine-pointer only; fully disabled on touch devices
// and for prefers-reduced-motion (native cursor stays).

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export default function CustomCursor() {
  const wrapRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const st = useRef({
    on: false,
    x: -100,
    y: -100,
    rx: -100,
    ry: -100,
    target: null,
    releaseTimer: null,
  });

  useEffect(() => {
    const fine = window.matchMedia("(any-pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches || window.innerWidth < 1024) return;

    const wrap = wrapRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    const s = st.current;
    let raf = null;

    const setMagnetic = (el) => {
      if (s.target === el) return;
      if (s.target) {
        const prev = s.target;
        prev.style.transition = "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)";
        prev.style.transform = "translate3d(0px, 0px, 0)";
        prev.style.willChange = "";
        if (s.releaseTimer) clearTimeout(s.releaseTimer);
        s.releaseTimer = setTimeout(() => {
          prev.style.transition = "";
        }, 800);
      }
      s.target = el;
      if (el) el.style.willChange = "transform";
    };

    const onMove = (e) => {
      if (!wrap.classList.contains("is-on")) {
        // first move (or re-entry): snap the ring to the pointer so it
        // never sweeps in from a corner or from the previous position
        s.rx = e.clientX;
        s.ry = e.clientY;
        wrap.classList.remove("is-off");
        wrap.classList.add("is-on");
      }
      if (!s.on) {
        s.on = true;
        document.documentElement.classList.add("custom-cursor-on");
      }
      s.x = e.clientX;
      s.y = e.clientY;

      const t = e.target;
      if (t && t.closest) {
        const interactive = t.closest(
          'a, button, input, textarea, select, [role="button"], [data-magnetic], label'
        );
        const magnetic = t.closest("[data-magnetic]");
        setMagnetic(magnetic);
        const cursorEl = t.closest("[data-cursor]");
        const lbl = cursorEl ? cursorEl.getAttribute("data-cursor") : "";
        label.textContent = lbl || "";
        wrap.classList.toggle("cursor--label", !!lbl);
        wrap.classList.toggle("cursor--hover", !!interactive && !lbl);
      }
    };

    const onLeave = (e) => {
      if (!e.relatedTarget) {
        wrap.classList.add("is-off");
        setMagnetic(null);
      }
    };

    const onDown = () => wrap.classList.add("cursor--down");
    const onUp = () => wrap.classList.remove("cursor--down");

    const tick = () => {
      if (!s.on) {
        raf = requestAnimationFrame(tick);
        return;
      }
      dot.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) translate(-50%, -50%)`;
      s.rx += (s.x - s.rx) * 0.16;
      s.ry += (s.y - s.ry) * 0.16;
      ring.style.transform = `translate3d(${s.rx}px, ${s.ry}px, 0) translate(-50%, -50%)`;

      const el = s.target;
      if (el && el.isConnected) {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const pad = Math.min(r.width, r.height) * 0.5 + 24;
        const dx = s.x - cx;
        const dy = s.y - cy;
        const edgeDx = Math.max(0, Math.abs(dx) - r.width / 2);
        const edgeDy = Math.max(0, Math.abs(dy) - r.height / 2);
        const d = Math.hypot(edgeDx, edgeDy);
        const pull = clamp(1 - d / pad, 0, 1);
        if (pull > 0) {
          const strength = parseFloat(el.dataset.magnetic) || 0.2;
          const maxShift =
            parseFloat(el.dataset.magneticMax) || (r.width < 520 ? 10 : 16);
          el.style.transition = "none";
          el.style.transform = `translate3d(${
            clamp(dx * strength, -maxShift, maxShift) * pull
          }px, ${clamp(dy * strength, -maxShift, maxShift) * pull}px, 0)`;
        } else {
          setMagnetic(null);
        }
      }
      raf = requestAnimationFrame(tick);
    };

    const onResize = () => {
      if (window.innerWidth < 1024) {
        if (raf) cancelAnimationFrame(raf);
        raf = null;
        s.on = false;
        document.documentElement.classList.remove("custom-cursor-on");
        wrap.classList.remove("is-on");
        setMagnetic(null);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mouseout", onLeave);
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      document.documentElement.classList.remove("custom-cursor-on");
      wrap.classList.remove("is-on", "is-off");
      setMagnetic(null);
    };
  }, []);

  return (
    <div ref={wrapRef} className="cursor-wrap" aria-hidden>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring">
        <span ref={labelRef} className="cursor-label" />
      </div>
    </div>
  );
}
