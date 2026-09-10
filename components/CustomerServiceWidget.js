"use client";

import { useState } from "react";
import Link from "next/link";
import { ChatIcon, HeadsetIcon, MailIcon, QuestionIcon } from "./icons";

// Floating customer service button — stays visible while scrolling
// (fixed bottom-right), opens a quick-help panel.
export default function CustomerServiceWidget() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function send(e) {
    e.preventDefault();
    const subject = encodeURIComponent("Nexus Store — Customer Service");
    const body = encodeURIComponent(
      `${message}\n\n— sent from the Nexus Store help widget\nReply to: ${email}`
    );
    window.location.href = `mailto:hello@nexusstore.ph?subject=${subject}&body=${body}`;
    setMessage("");
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40"
          aria-hidden
          onClick={() => setOpen(false)}
        />
      )}

      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
        {open && (
          <div className="w-[min(22rem,calc(100vw-2.5rem))] overflow-hidden rounded-[1.5rem] border border-line bg-[#16202b] shadow-2xl">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-line bg-[#0d141c] px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                <HeadsetIcon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-heading text-sm font-bold text-ink">
                  Nexus Store
                </p>
                <p className="text-[11px] text-muted">
                  Customer service · online now
                </p>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4">
              <div className="rounded-[1.2rem] rounded-tl-sm bg-background px-4 py-3 text-xs leading-5 text-ink">
                Hi! How can we help today? For fast answers, pick a topic below
                or send us a message — we reply within 24 hours.
              </div>

              {/* Quick topics */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  href="/contact#faq"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-[1rem] border border-line bg-background px-3 py-2.5 text-xs font-semibold text-ink transition hover:border-accent/50"
                >
                  <QuestionIcon className="h-4 w-4 shrink-0 text-muted" />
                  FAQ & Help
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-[1rem] border border-line bg-background px-3 py-2.5 text-xs font-semibold text-ink transition hover:border-accent/50"
                >
                  <MailIcon className="h-4 w-4 shrink-0 text-muted" />
                  Contact Form
                </Link>
                <Link
                  href="/shipping"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-[1rem] border border-line bg-background px-3 py-2.5 text-xs font-semibold text-ink transition hover:border-accent/50"
                >
                  <ChatIcon className="h-4 w-4 shrink-0 text-muted" />
                  Shipping Help
                </Link>
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-[1rem] border border-line bg-background px-3 py-2.5 text-xs font-semibold text-ink transition hover:border-accent/50"
                >
                  <HeadsetIcon className="h-4 w-4 shrink-0 text-muted" />
                  Track My Order
                </Link>
              </div>

              {/* Mini message form */}
              <form onSubmit={send} className="mt-3 space-y-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  aria-label="Your email"
                  className="w-full rounded-full border border-line bg-background px-4 py-2 text-xs text-ink placeholder-muted focus:border-accent focus:outline-none"
                />
                <textarea
                  required
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help?"
                  aria-label="Your message"
                  className="w-full resize-none rounded-[1rem] border border-line bg-background px-4 py-2.5 text-xs text-ink placeholder-muted focus:border-accent focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full rounded-full bg-white py-2.5 text-xs font-bold text-[#101820] transition hover:bg-white/85"
                >
                  Send Message
                </button>
              </form>
              <p className="mt-2 text-center text-[10px] text-muted">
                Demo mode — messages open your email app addressed to us.
              </p>
            </div>
          </div>
        )}

        {/* Floating button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close customer service" : "Open customer service"}
          aria-expanded={open}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-[#101820] shadow-xl transition hover:scale-105 hover:bg-accent-dark"
        >
          {open ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              className="h-6 w-6"
              aria-hidden
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <HeadsetIcon className="h-7 w-7" />
          )}
        </button>
      </div>
    </>
  );
}