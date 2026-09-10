"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "nexus_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage right after mount (async so the first
  // client render matches the server output — no hydration mismatch).
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch {
        // ignore corrupted cart
      }
      setHydrated(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  // Persist on every change.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage full / unavailable — ignore
    }
  }, [items, hydrated]);

  function maxQty(product) {
    return product.type === "digital" ? 99 : product.stock || 99;
  }

  function addItem(product, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id
            ? { ...i, qty: Math.min(i.qty + qty, maxQty(product)) }
            : i
        );
      }
      return [...prev, { ...product, qty: Math.min(qty, maxQty(product)) }];
    });
  }

  function updateQty(id, qty) {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, Math.min(qty, 99)) } : i
      )
    );
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function clear() {
    setItems([]);
  }

  const { count, subtotal } = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    for (const i of items) {
      count += i.qty;
      subtotal += i.qty * i.price;
    }
    return { count, subtotal };
  }, [items]);

  const value = useMemo(
    () => ({ items, addItem, updateQty, removeItem, clear, count, subtotal }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}