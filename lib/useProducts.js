"use client";

import { useEffect, useState } from "react";
import { DEMO_PRODUCTS, getLocalProducts } from "./products";

// Returns the merged catalog: built-in demo products + anything added
// through the demo admin panel. In production, swap this for a Supabase
// query (see README "Going live" section).
export function useProducts() {
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [loaded, setLoaded] = useState(false);

  // Merge admin-added products right after mount (async so the first
  // client render matches the server output).
  useEffect(() => {
    const t = setTimeout(() => {
      setProducts([...DEMO_PRODUCTS, ...getLocalProducts()]);
      setLoaded(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  return { products, loaded };
}