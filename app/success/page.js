"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  downloadDemoFile,
  formatDate,
  formatPrice,
  TYPE_META,
} from "@/lib/utils";
import { CheckIcon, DownloadIcon, QuestionIcon, TruckIcon } from "@/components/icons";

function DownloadRow({ order, item }) {
  const meta = TYPE_META[item.type];
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-line p-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
        <p className="mt-0.5 text-xs text-muted">{meta.label}</p>
      </div>
      <button
        type="button"
        onClick={() => downloadDemoFile(order, item)}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-500"
      >
        <DownloadIcon className="h-3.5 w-3.5" />
        Download
      </button>
    </div>
  );
}

function SuccessContent() {
  const sp = useSearchParams();
  const orderId = sp.get("order");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      const orders = JSON.parse(
        window.localStorage.getItem("nexus_orders") || "[]"
      );
      setOrder(orders.find((o) => o.id === orderId) || null);
      setLoading(false);
    }, 0);
    return () => clearTimeout(t);
  }, [orderId]);

  if (loading) return null;

  if (!order) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 pb-16">
        <div className="mt-10 rounded-2xl border border-line bg-[#16202b] py-20 text-center">
          <QuestionIcon className="mx-auto h-16 w-16 text-muted" />
          <h1 className="font-heading mt-4 text-xl font-bold text-ink">
            Order not found
          </h1>
          <p className="mt-1 text-sm text-muted">
            We couldn&apos;t find that order on this device. Check your email
            receipt, or browse the store.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-bold text-[#101820] transition hover:bg-white/85"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  const digital = order.items.filter((i) => i.type === "digital");
  const physical = order.items.filter((i) => i.type !== "digital");

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16">
      <div className="mt-8 rounded-2xl border border-line bg-[#16202b] p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
          <CheckIcon className="h-7 w-7 text-emerald-400" />
        </div>
        <h1 className="font-heading mt-4 text-2xl font-black text-ink">
          Order Confirmed!
        </h1>
        <p className="mt-1 text-sm text-muted">
          Order{" "}
          <span className="font-mono font-semibold text-ink">
            #{order.id.slice(0, 8).toUpperCase()}
          </span>{" "}
          · {formatDate(order.createdAt)} · Status:{" "}
          <span className="font-semibold text-emerald-400">Paid</span>
        </p>
        <p className="mt-2 text-sm text-muted">
          A receipt is on its way to <b className="text-ink">{order.customer.email}</b> (demo —
          email delivery goes live with Resend).
        </p>
      </div>

      {digital.length > 0 && (
        <div className="mt-6 rounded-2xl border border-line bg-[#16202b] p-6">
          <h2 className="font-heading font-bold text-ink">
            Your Downloads Are Ready
          </h2>
          <div className="mt-4 space-y-3">
            {digital.map((item) => (
              <DownloadRow key={item.productId || item.id} order={order} item={item} />
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">
            Demo files are placeholders — connect Supabase Storage to deliver
            real templates automatically.
          </p>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-line bg-[#16202b] p-6">
        <h2 className="font-heading font-bold text-ink">Order Summary</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {order.items.map((item) => (
            <li key={item.productId || item.id} className="flex justify-between gap-3">
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
        {physical.length > 0 && (
          <p className="mt-3 flex items-start gap-2 rounded-lg bg-orange-500/10 px-3 py-2 text-xs text-orange-300">
            <TruckIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {physical.map((i) => i.name).join(", ")} will ship soon — you&apos;ll
              get tracking details by email ({TYPE_META.physical.label} /{" "}
              {TYPE_META.dropship.label}).
            </span>
          </p>
        )}
        <div className="mt-3 flex justify-between border-t border-line pt-3 text-base">
          <span className="font-bold text-ink">Total Paid</span>
          <span className="font-black text-accent">{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-full bg-white px-5 py-3 text-sm font-bold text-[#101820] transition hover:bg-white/85"
        >
          Continue Shopping
        </Link>
        <Link
          href="/account"
          className="rounded-full border border-line bg-background px-5 py-3 text-sm font-bold text-ink transition hover:border-ink"
        >
          View My Orders
        </Link>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}