"use client";

import { useEffect, useState } from "react";
import { DEMO_PRODUCTS, getLocalProducts } from "./products";

// Returns the live catalog. Fetches from /api/products, which serves the
// Supabase `products` table when configured, or the built-in demo catalog
// otherwise. Admin-added demo products (localStorage) are merged on top so
// the demo admin panel keeps working without keys.
export function useProducts() {
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && Array.isArray(data.products) && data.products.length) {
            setProducts(data.products);
          }
        }
      } catch {
        // Network hiccup — demo catalog already in place.
      } finally {
        if (!cancelled) {
          // Merge demo-admin (localStorage) additions last.
          setProducts((prev) => {
            const local = getLocalProducts();
            const seen = new Set(prev.map((p) => p.id));
            return [...prev, ...local.filter((p) => !seen.has(p.id))];
          });
          setLoaded(true);
        }
      }
    }

    const t = setTimeout(load, 0);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  return { products, loaded };
}
