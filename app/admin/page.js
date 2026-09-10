"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminGate from "@/components/AdminGate";
import { useProducts } from "@/lib/useProducts";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { formatDate, formatPrice } from "@/lib/utils";

function Dashboard() {
  const { products } = useProducts();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => {
      setOrders(
        JSON.parse(window.localStorage.getItem("nexus_orders") || "[]")
      );
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-16">
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-xl font-bold text-ink">
          Admin Dashboard
        </h1>
        <div className="flex gap-2">
          <Link
            href="/admin/upload"
            className="rounded-full bg-white px-4 py-2.5 text-sm font-bold text-[#101820] transition hover:bg-white/85"
          >
            + Add Product
          </Link>
          <Link
            href="/"
            className="rounded-full border border-line bg-background px-4 py-2.5 text-sm font-bold text-ink transition hover:border-ink"
          >
            View Store
          </Link>
        </div>
      </div>

      <div
        className={`mt-4 rounded-lg px-4 py-3 text-xs font-medium ${
          isSupabaseConfigured
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-amber-500/10 text-amber-300"
        }`}
      >
        {isSupabaseConfigured
          ? "Supabase connected — auth, database & storage are live."
          : "Demo mode: products and orders are stored in this browser only. Add your Supabase keys to go live (see README)."}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-[#16202b] p-5">
          <p className="text-xs text-muted">Products</p>
          <p className="font-heading mt-1 text-3xl font-black text-ink">
            {products.length}
          </p>
          <p className="mt-1 text-xs text-muted">
            {products.filter((p) => p.type === "digital").length} digital ·{" "}
            {products.filter((p) => p.type === "physical").length} physical ·{" "}
            {products.filter((p) => p.type === "dropship").length} dropship
          </p>
        </div>
        <div className="rounded-xl border border-line bg-[#16202b] p-5">
          <p className="text-xs text-muted">Orders (this device)</p>
          <p className="font-heading mt-1 text-3xl font-black text-ink">
            {orders.length}
          </p>
          <p className="mt-1 text-xs text-muted">demo checkout records</p>
        </div>
        <div className="rounded-xl border border-line bg-[#16202b] p-5">
          <p className="text-xs text-muted">Revenue (demo)</p>
          <p className="font-heading mt-1 text-3xl font-black text-accent">
            {formatPrice(revenue)}
          </p>
          <p className="mt-1 text-xs text-muted">from local orders</p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="font-heading mb-3 text-lg font-bold text-ink">
          Recent Orders
        </h2>
        {orders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-[#16202b] p-8 text-center text-sm text-muted">
            No orders yet — complete a demo checkout to see it here.
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 8).map((order) => (
              <div
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-[#16202b] p-4"
              >
                <div>
                  <p className="font-mono text-sm font-bold text-ink">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {order.customer?.name} · {order.customer?.email}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-black text-accent">
                    {formatPrice(order.total)}
                  </p>
                  <span className="mt-1 inline-block rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold text-emerald-400">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default function AdminPage() {
  return (
    <AdminGate>
      <Dashboard />
    </AdminGate>
  );
}