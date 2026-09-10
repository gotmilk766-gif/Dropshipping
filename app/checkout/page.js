"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPrice, TYPE_META } from "@/lib/utils";
import { LockIcon, ReceiptIcon } from "@/components/icons";

const inputCls =
  "w-full rounded-lg border border-line bg-background px-4 py-2.5 text-sm text-ink placeholder-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [status, setStatus] = useState("idle"); // idle | submitting
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 pb-16">
        <div className="mt-10 rounded-2xl border border-line bg-[#16202b] py-20 text-center">
          <ReceiptIcon className="mx-auto h-16 w-16 text-muted" />
          <h1 className="font-heading mt-4 text-xl font-bold text-ink">
            Nothing to check out
          </h1>
          <p className="mt-1 text-sm text-muted">
            Your cart is empty — add some products first.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-bold text-[#101820] transition hover:bg-white/85"
          >
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  const needsShipping = items.some((i) => i.type !== "digital");
  const hasDigital = items.some((i) => i.type === "digital");
  const mixed = needsShipping && hasDigital;

  async function placeOrder(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError("Please fill in your name and email.");
      return;
    }
    if (needsShipping && !form.address.trim()) {
      setError("Please provide a delivery address for the shipped items.");
      return;
    }
    setError("");
    setStatus("submitting");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ id, name, price, qty, type }) => ({
            productId: id,
            name,
            price,
            qty,
            type,
          })),
          customer: form,
        }),
      });
      const data = await res.json();

      if (data.demo && data.orderId) {
        // Demo mode: record the order locally and show the success page.
        const order = {
          id: data.orderId,
          customer: form,
          items,
          subtotal,
          total: subtotal,
          status: "paid",
          createdAt: new Date().toISOString(),
        };
        const existing = JSON.parse(
          window.localStorage.getItem("nexus_orders") || "[]"
        );
        window.localStorage.setItem(
          "nexus_orders",
          JSON.stringify([order, ...existing])
        );
        clear();
        router.push(`/success?order=${data.orderId}`);
      } else if (data.url) {
        // Stripe mode (keys configured): redirect to Stripe Checkout.
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong. Please try again.");
        setStatus("idle");
      }
    } catch {
      setError("Network error — please check your connection and try again.");
      setStatus("idle");
    }
  }

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-16">
      <h1 className="font-heading mt-6 text-xl font-bold text-ink">Checkout</h1>

      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        <form onSubmit={placeOrder} className="space-y-4 lg:col-span-2">
          <section className="rounded-xl border border-line bg-[#16202b] p-5">
            <h2 className="font-heading font-bold text-ink">
              Contact & Delivery
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block text-xs font-medium text-muted">
                Full Name *
                <input
                  className={`${inputCls} mt-1`}
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Juan Dela Cruz"
                  required
                />
              </label>
              <label className="block text-xs font-medium text-muted">
                Email (receipt + downloads) *
                <input
                  type="email"
                  className={`${inputCls} mt-1`}
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@email.com"
                  required
                />
              </label>
              <label className="block text-xs font-medium text-muted">
                Phone (optional)
                <input
                  type="tel"
                  className={`${inputCls} mt-1`}
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="09XX XXX XXXX"
                />
              </label>
              {needsShipping ? (
                <label className="block text-xs font-medium text-muted sm:col-span-2">
                  Delivery Address (for shipped items) *
                  <input
                    className={`${inputCls} mt-1`}
                    value={form.address}
                    onChange={set("address")}
                    placeholder="House no., street, barangay, city, province"
                    required
                  />
                </label>
              ) : (
                <p className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400 sm:col-span-2">
                  Your cart is all-digital — no shipping address needed.
                  Downloads unlock right after payment.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-line bg-[#16202b] p-5">
            <h2 className="font-heading font-bold text-ink">Payment</h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted">
              <LockIcon className="h-4 w-4 shrink-0 text-muted" />
              Secured by <b className="text-ink">Stripe</b> — GCash, Maya,
              credit &amp; debit cards accepted.
            </p>
            <p className="mt-1 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
              Demo mode: no real payment is taken. Clicking &quot;Place
              Order&quot; completes the order instantly.
            </p>
            {error && (
              <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-4 w-full rounded-full bg-white py-3.5 text-sm font-bold text-[#101820] transition hover:bg-white/85 disabled:opacity-60"
            >
              {status === "submitting"
                ? "Placing order…"
                : `Place Order — ${formatPrice(subtotal)}`}
            </button>
          </section>
        </form>

        <aside className="h-fit rounded-xl border border-line bg-[#16202b] p-5 lg:sticky lg:top-24">
          <h2 className="font-heading font-bold text-ink">Your Order</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3">
                <span className="min-w-0 flex-1 truncate text-muted">
                  {item.name}{" "}
                  <span className="text-muted">× {item.qty}</span>
                </span>
                <span className="font-medium text-ink">
                  {formatPrice(item.price * item.qty)}
                </span>
              </li>
            ))}
          </ul>

          {mixed && (
            <div className="mt-4 rounded-lg border border-sky-500/20 bg-sky-500/10 p-3 text-xs leading-5 text-sky-300">
              This order mixes <b>instant downloads</b> with{" "}
              <b>shipped items</b>. Downloads unlock immediately; physical &
              dropship items ship separately per their timelines above.
            </div>
          )}

          <dl className="mt-4 space-y-2 border-t border-line pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-medium text-ink">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd className="font-medium text-emerald-400">Free (demo)</dd>
            </div>
            <div className="flex justify-between text-base">
              <dt className="font-bold text-ink">Total</dt>
              <dd className="font-black text-accent">{formatPrice(subtotal)}</dd>
            </div>
          </dl>

          {items.map((item) => (
            <p key={item.id} className="mt-3 text-[11px] text-muted">
              {item.name.slice(0, 30)}: {TYPE_META[item.type].delivery}
            </p>
          ))}
        </aside>
      </div>
    </main>
  );
}