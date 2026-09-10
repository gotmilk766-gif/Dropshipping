"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice, placeholderImage, TYPE_META } from "@/lib/utils";
import { CartIcon, LockIcon } from "@/components/icons";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, count } = useCart();

  if (items.length === 0) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 pb-16">
        <div className="mt-10 rounded-2xl border border-line bg-[#16202b] py-20 text-center">
          <CartIcon className="mx-auto h-16 w-16 text-muted" />
          <h1 className="font-heading mt-4 text-xl font-bold text-ink">
            Your cart is empty
          </h1>
          <p className="mt-1 text-sm text-muted">
            Add a 3D print, an Excel template or a dropship find to get started.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-bold text-[#101820] transition hover:bg-white/85"
          >
            Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-16">
      <h1 className="font-heading mt-6 text-xl font-bold text-ink">
        Shopping Cart ({count} item{count === 1 ? "" : "s"})
      </h1>

      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {items.map((item) => {
            const meta = TYPE_META[item.type];
            return (
              <div
                key={item.id}
                className="flex gap-4 rounded-xl border border-line bg-[#16202b] p-4"
              >
                <Link href={`/product/${item.id}`} className="shrink-0">
                  <img
                    src={placeholderImage(item)}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="h-24 w-24 rounded-lg border border-line object-cover"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/product/${item.id}`}
                    className="font-medium text-ink hover:text-accent"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-xs text-muted">
                    {meta.label} — {meta.delivery}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        aria-label="Decrease quantity"
                        className="flex h-8 w-8 items-center justify-center rounded border border-line text-muted transition hover:border-ink hover:text-ink"
                      >
                        −
                      </button>
                      <span className="w-7 text-center font-medium text-ink">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        aria-label="Increase quantity"
                        className="flex h-8 w-8 items-center justify-center rounded border border-line text-muted transition hover:border-ink hover:text-ink"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-bold text-accent">
                      {formatPrice(item.price * item.qty)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="ml-auto text-xs text-muted transition hover:text-sale"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="h-fit rounded-xl border border-line bg-[#16202b] p-5 lg:sticky lg:top-24">
          <h2 className="font-heading font-bold text-ink">Order Summary</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-medium text-ink">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd className="font-medium text-emerald-400">Free (demo)</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2 text-base">
              <dt className="font-bold text-ink">Total</dt>
              <dd className="font-black text-accent">{formatPrice(subtotal)}</dd>
            </div>
          </dl>
          <Link
            href="/checkout"
            className="mt-4 block w-full rounded-full bg-white py-3 text-center text-sm font-bold text-[#101820] transition hover:bg-white/85"
          >
            Proceed to Checkout
          </Link>
          <p className="mt-3 flex items-start gap-1.5 text-xs leading-5 text-muted">
            <LockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />
            Secure checkout via Stripe. Demo mode completes instantly with no
            real payment.
          </p>
        </aside>
      </div>
    </main>
  );
}