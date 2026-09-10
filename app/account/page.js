"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { downloadDemoFile, formatDate, formatPrice } from "@/lib/utils";
import { DownloadIcon, PackageIcon } from "@/components/icons";

export default function AccountPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => {
      setOrders(
        JSON.parse(window.localStorage.getItem("nexus_orders") || "[]")
      );
    }, 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-16">
      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-heading text-xl font-bold text-ink">My Orders</h1>
        <p className="text-xs text-muted">
          Demo account — orders you placed on this device.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-line bg-[#16202b] py-20 text-center">
          <PackageIcon className="mx-auto h-16 w-16 text-muted" />
          <h2 className="font-heading mt-4 text-lg font-bold text-ink">
            No orders yet
          </h2>
          <p className="mt-1 text-sm text-muted">
            When you complete a checkout, your order history shows up here.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-bold text-[#101820] transition hover:bg-white/85"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => {
            const digitalItems = order.items.filter((i) => i.type === "digital");
            return (
              <div
                key={order.id}
                className="rounded-xl border border-line bg-[#16202b] p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-sm font-bold text-ink">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="ml-2 text-xs text-muted">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                      Paid
                    </span>
                    <span className="font-black text-accent">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                <ul className="mt-3 space-y-1.5 border-t border-line pt-3 text-sm text-muted">
                  {order.items.map((item) => (
                    <li key={item.productId || item.id} className="flex justify-between gap-3">
                      <span className="min-w-0 flex-1 truncate">
                        {item.name}{" "}
                        <span className="text-muted">× {item.qty}</span>
                      </span>
                      <span className="font-medium text-ink">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </li>
                  ))}
                </ul>

                {digitalItems.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
                    {digitalItems.map((item) => (
                      <button
                        key={item.productId || item.id}
                        type="button"
                        onClick={() => downloadDemoFile(order, item)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-500"
                      >
                        <DownloadIcon className="h-3.5 w-3.5" />
                        Download: {item.name.slice(0, 28)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}