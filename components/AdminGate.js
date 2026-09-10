"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DEMO_ADMIN_PIN } from "@/lib/utils";
import {
  isSupabaseConfigured,
  getAdminUser,
  onAuthChange,
  signInAdmin,
} from "@/lib/authClient";
import { LockIcon } from "./icons";

const AUTH_KEY = "nexus_admin_auth";

export default function AdminGate({ children }) {
  const [mode, setMode] = useState("loading"); // loading | supabase | demo
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Demo mode: sessionStorage PIN guard, same as before.
      if (window.sessionStorage.getItem(AUTH_KEY) === "1") {
        setMode("demo");
      } else {
        setMode("demo-login");
      }
      return undefined;
    }

    let unsubscribe = () => {};
    (async () => {
      const { user: current } = await getAdminUser();
      setUser(current);
      setMode(current ? "supabase" : "supabase-login");
      unsubscribe = onAuthChange((u) => {
        setUser(u);
        setMode(u ? "supabase" : "supabase-login");
      });
    })();
    return () => unsubscribe();
  }, []);

  if (mode === "loading") return null;
  if (mode === "supabase") return children;

  if (mode === "demo") return children;

  if (mode === "supabase-login") {
    return <SupabaseLoginForm />;
  }

  return <DemoPinForm />;
}

function SupabaseLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error: err } = await signInAdmin(email.trim(), password);
    if (err) {
      setError(err.message);
      setBusy(false);
    }
    // On success onAuthChange flips the gate — no local state needed.
  }

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
          Sign in with your admin account to manage the store.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@yourstore.com"
            aria-label="Admin email"
            autoComplete="email"
            required
            className="w-full rounded-lg border border-line bg-background px-4 py-2.5 text-sm text-ink placeholder-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            aria-label="Admin password"
            autoComplete="current-password"
            required
            className="w-full rounded-lg border border-line bg-background px-4 py-2.5 text-sm text-ink placeholder-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          {error && (
            <p className="text-xs text-sale">{error}</p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-white py-3 text-sm font-bold text-[#101820] transition hover:bg-white/85 disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-muted">
          Only emails in the Supabase <code>admins</code> table can sign in and
          publish products.
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

function DemoPinForm() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (pin === DEMO_ADMIN_PIN) {
      window.sessionStorage.setItem(AUTH_KEY, "1");
      setError(false);
      window.location.reload();
    } else {
      setError(true);
    }
  }

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
          Demo guard only — add your Supabase keys to switch to real email
          login (see README).
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
