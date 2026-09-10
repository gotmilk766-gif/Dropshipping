"use client";

import { useEffect, useState } from "react";

// mdx.so's signature loading screen: a dark full-screen overlay that
// cycles through calm messages ("Perfection takes a moment…") before
// fading out. Shows once per browser session. When it lifts it fires
// "nexus:ready" so above-the-fold animations can start in sync.
const MESSAGES = [
  "Perfection takes a moment",
  "Something special is loading",
  "Brewing your Experience",
  "Great things take time",
  "Worth the wait",
];

export default function Preloader() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const alreadySeen = window.sessionStorage.getItem("nexus_preloader_seen");
    window.__nexusReady = alreadySeen ? true : false;

    // If this is a repeat visit, skip the overlay but still tell the
    // hero to start animating shortly after mount.
    if (alreadySeen) {
      const t = setTimeout(() => {
        window.dispatchEvent(new Event("nexus:ready"));
      }, 350);
      return () => clearTimeout(t);
    }

    window.sessionStorage.setItem("nexus_preloader_seen", "1");

    const showTimer = setTimeout(() => setVisible(true), 0);
    const msgTimer = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 560);

    const hideTimer = setTimeout(() => {
      clearInterval(msgTimer);
      window.__nexusReady = true;
      setFading(true);
      window.dispatchEvent(new Event("nexus:ready"));
    }, 2800);

    const doneTimer = setTimeout(() => {
      setVisible(false);
    }, 3300);

    return () => {
      clearTimeout(showTimer);
      clearInterval(msgTimer);
      clearTimeout(hideTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden
    >
      <div className="font-heading text-3xl font-black tracking-tight text-ink">
        NEXUS<span className="text-accent">.</span>
      </div>
      <div className="mt-6 h-px w-48 overflow-hidden bg-white/10">
        <div
          className="h-full w-full origin-left bg-accent"
          style={{ animation: "preloader-bar 2.6s ease-in-out forwards" }}
        />
      </div>
      <p
        key={msgIndex}
        className="fade-up mt-6 font-heading text-sm italic text-muted"
      >
        {MESSAGES[msgIndex]}
      </p>
    </div>
  );
}