"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DEMO_ADMIN_PIN } from "@/lib/utils";
import { LockIcon } from "./icons";

const AUTH_KEY = "nexus_admin_auth";

export default function AdminGate({ children }) {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (window.sessionStorage.getItem(AUTH_KEY) === "1") setAuthed(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  function submit(e) {
    e.preventDefault();
    if (pin === DEMO_ADMIN_PIN) {
      window.sessionStorage.setItem(AUTH_KEY, "1");
      setAuthed(true);
    } else {
      setError(true);
    }
  }

  if (authed) return children;

  return (
    <main className="mx-auto flex w-full max-w-md flex-col px-4 py-16">
      <div className="rounded-2xl border border-line bg-[#16202b] p-8 shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
          <LockIcon className="h-7 w-7 text-accent" />
        </div>
        <h1 className="font-heading mt-3 text-center text-xl font-bold text-ink">
          Admin Access
        </h1>
        <p className="mt-1 text-center text-sm text-muted">
          Demo mode — enter the admin PIN to manage the store.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="password"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError(false);
            }}
            placeholder="Admin PIN"
            aria-label="Admin PIN"
            className="w-full rounded-lg border border-line bg-background px-4 py-2.5 text-sm text-ink placeholder-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          {error && (
            <p className="text-xs text-sale">
              Wrong PIN. Try again (default: admin123).
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-full bg-white py-3 text-sm font-bold text-[#101820] transition hover:bg-white/85"
          >
            Unlock Dashboard
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-muted">
          Demo guard only — swap for Supabase email auth to go live.
        </p>
        <p className="mt-2 text-center">
          <Link href="/" className="text-xs text-accent underline">
            ← Back to store
          </Link>
        </p>
      </div>
    </main>
  );
}