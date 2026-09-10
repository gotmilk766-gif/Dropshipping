"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";
import { CATEGORIES, getCategoryLabel } from "@/lib/products";
import { useProducts } from "@/lib/useProducts";
import { SearchIcon } from "@/components/icons";

const SORT_OPTIONS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "sold", label: "Best Selling" },
];

function SearchContent() {
  const sp = useSearchParams();
  const q = (sp.get("q") || "").trim().toLowerCase();
  const category = sp.get("category") || "";
  const [sort, setSort] = useState("featured");
  const { products, loaded } = useProducts();

  const results = useMemo(() => {
    let list = products.filter((p) => {
      const matchesQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q);
      const matchesCat = !category || p.category === category;
      return matchesQ && matchesCat;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "sold") list = [...list].sort((a, b) => b.sold - a.sold);
    return list;
  }, [products, q, category, sort]);

  const heading = q
    ? `Results for "${sp.get("q")}"`
    : category
      ? getCategoryLabel(category)
      : "Shop All";

  const categoryHref = (id) =>
    `/search?category=${id}${q ? `&q=${encodeURIComponent(sp.get("q"))}` : ""}`;

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 pb-16">
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <h1 className="font-heading text-2xl font-black text-ink sm:text-3xl">
          {heading}
        </h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted">
            {loaded ? `${results.length} product${results.length === 1 ? "" : "s"}` : "…"}
          </span>
          <label className="flex items-center gap-2">
            <span className="hidden text-muted sm:inline">Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort products"
              className="rounded-full border border-line bg-[#16202b] px-3 py-1.5 text-sm text-ink focus:border-accent focus:outline-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Filter chips */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-muted">
          Filter
        </span>
        {CATEGORIES.map((c) => {
          const active = c.id === category;
          return (
            <Link
              key={c.id}
              href={categoryHref(c.id)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                active
                  ? "border-white bg-white text-[#101820]"
                  : "border-line bg-[#16202b] text-muted hover:border-ink hover:text-ink"
              }`}
            >
              {c.label}
            </Link>
          );
        })}
        {(q || category) && (
          <Link
            href="/search"
            className="text-xs text-accent underline underline-offset-2"
          >
            Remove all
          </Link>
        )}
      </div>

      <div className="mt-6">
        {!loaded ? (
          <ProductGridSkeleton />
        ) : results.length > 0 ? (
          <ProductGrid products={results} />
        ) : (
          <div className="rounded-[1.5rem] border border-line bg-[#16202b] py-20 text-center">
            <SearchIcon className="mx-auto h-12 w-12 text-muted" />
            <h2 className="font-heading mt-4 text-lg font-bold text-ink">
              No products found
            </h2>
            <p className="mt-1 text-sm text-muted">
              Try a different search term or browse a category instead.
            </p>
            <Link
              href="/search"
              className="mt-5 inline-block rounded-full bg-white px-6 py-3 text-sm font-bold text-[#101820] transition hover:bg-white/85"
            >
              Shop All Products
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-[1200px] px-4 pb-16 pt-8">
          <ProductGridSkeleton />
        </main>
      }
    >
      <SearchContent />
    </Suspense>
  );
}