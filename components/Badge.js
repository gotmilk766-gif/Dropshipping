import { productBadge } from "@/lib/utils";

// mdx.so-style catalog badge: green "New" / orange "Sale",
// uppercase, small letter-spacing, rounded.
export default function Badge({ product }) {
  const badge = productBadge(product);
  if (!badge) return null;
  return (
    <span
      className={`rounded-[0.8rem] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white ${badge.style}`}
    >
      {badge.label}
    </span>
  );
}