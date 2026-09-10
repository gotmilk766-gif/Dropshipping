"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";
import { CATEGORIES } from "@/lib/products";
import { CartIcon } from "./icons";

const NAV_LINKS = [
  { href: "/search", label: "Shop All" },
  ...CATEGORIES.map((c) => ({ href: `/search?category=${c.id}`, label: c.label })),
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { count } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const router = useRouter();

  function onSearch(e) {
    e.preventDefault();
    const q = e.currentTarget.q.value.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <>
      {/* Announcement bar (orange accent strip) */}
      <div className="bg-accent text-center text-[11px] font-bold uppercase tracking-widest text-[#101820]">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-2">
          Free shipping on orders over ₱1,500 — Made to order in the
          Philippines
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-background/85 backdrop-blur">
        <div className="mx-auto w-full max-w-[1200px] px-4">
          <div className="flex items-center justify-between gap-4 py-3">
            <Link
              href="/"
              className="font-heading shrink-0 text-xl font-black tracking-tight text-ink"
            >
              NEXUS<span className="text-accent">.</span>
            </Link>

            <nav className="hidden items-center gap-6 text-sm text-muted lg:flex">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href + l.label}
                  href={l.href}
                  className="transition hover:text-ink"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-3">
              <form
                onSubmit={onSearch}
                role="search"
                className="hidden items-center md:flex"
              >
                <input
                  name="q"
                  type="search"
                  placeholder="Search products…"
                  aria-label="Search products"
                  className="w-44 rounded-full border border-line bg-[#16202b] px-4 py-2 text-sm text-ink placeholder-muted focus:border-accent focus:outline-none lg:w-56"
                />
              </form>
              <Link
                href="/admin"
                className="text-sm text-muted transition hover:text-ink"
              >
                Admin
              </Link>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                aria-label={`Open cart, ${count} items`}
                className="relative flex items-center gap-1.5 rounded-full border border-line px-3 py-2 text-sm font-medium text-ink transition hover:border-ink"
              >
                <CartIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Cart</span>
                {count > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-sale px-1 text-[10px] font-bold text-white">
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile search + links */}
          <form
            onSubmit={onSearch}
            role="search"
            className="flex items-center pb-3 md:hidden"
          >
            <input
              name="q"
              type="search"
              placeholder="Search products…"
              aria-label="Search products"
              className="w-full rounded-full border border-line bg-[#16202b] px-4 py-2 text-sm text-ink placeholder-muted focus:border-accent focus:outline-none"
            />
          </form>
          <nav className="flex items-center gap-5 overflow-x-auto border-t border-line py-2 text-xs text-muted md:hidden">
            {NAV_LINKS.map((l) => (
              <Link key={l.href + l.label} href={l.href} className="whitespace-nowrap">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      </header>
    </>
  );
}