"use client";

import { useCart } from "@/context/CartContext";

export default function AddToCartButton({
  product,
  className = "",
  children,
}) {
  const { addItem } = useCart();
  return (
    <button
      type="button"
      onClick={() => addItem(product)}
      data-magnetic="0.35"
      data-magnetic-max="8"
      className={
        className ||
        "rounded-full bg-white px-8 py-3 text-sm font-bold text-[#101820] transition hover:bg-white/85"
      }
    >
      {children || "Add to Cart"}
    </button>
  );
}