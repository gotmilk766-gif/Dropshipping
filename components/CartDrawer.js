"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice, placeholderImage } from "@/lib/utils";
import { getLenis } from "./motion/lenisStore";
import { CartIcon } from "./icons";

export default function CartDrawer({ open, onClose }) {
  const { items, updateQty, removeItem, subtotal, count } = useCart();

  // Lock body scroll + pause smooth scrolling while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    getLenis()?.stop();
    return () => {
      document.body.style.overflow = prev;
      getLenis()?.start();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-line bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-line p-4">
          <h2 className="font-heading text-lg font-bold text-ink">
            My Cart ({count})
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-white/10 hover:text-ink"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="py-10 text-center">
              <CartIcon className="mx-auto h-14 w-14 text-muted" />
              <p className="mt-3 text-sm text-muted">Your cart is empty.</p>
              <Link
                href="/"
                onClick={onClose}
                className="mt-4 inline-block rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#101820] transition hover:bg-white/85"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <Link
                  href={`/product/${item.id}`}
                  onClick={onClose}
                  className="shrink-0"
                >
                  <img
                    src={placeholderImage(item)}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-lg border border-line object-cover"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/product/${item.id}`}
                    onClick={onClose}
                    className="line-clamp-2 text-sm font-medium text-ink hover:text-accent"
                  >
                    {item.name}
                  </Link>
                  <div className="mt-0.5 text-sm font-bold text-accent">
                    {formatPrice(item.price)}
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      aria-label="Decrease quantity"
                      className="flex h-7 w-7 items-center justify-center rounded border border-line text-muted transition hover:border-ink hover:text-ink"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-medium text-ink">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      aria-label="Increase quantity"
                      className="flex h-7 w-7 items-center justify-center rounded border border-line text-muted transition hover:border-ink hover:text-ink"
                    >
                      +
                    </button>
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
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-line p-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="font-heading text-lg font-bold text-ink">
                {formatPrice(subtotal)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full rounded-full bg-white py-3 text-center text-sm font-bold text-[#101820] transition hover:bg-white/85"
            >
              Checkout
            </Link>
            <Link
              href="/cart"
              onClick={onClose}
              className="mt-2 block w-full rounded-full border border-line py-3 text-center text-sm font-semibold text-ink transition hover:border-ink"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}