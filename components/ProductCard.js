"use client";

import Link from "next/link";
import Badge from "./Badge";
import {
  formatPrice,
  placeholderImage,
  TYPE_META,
} from "@/lib/utils";

// mdx.so-style catalog card: dark card, New/Sale badge, bold serif title,
// price with strikethrough, muted type line. Image zooms on hover.
export default function ProductCard({ product, priority = false }) {
  const typeMeta = TYPE_META[product.type];

  return (
    <Link
      href={`/product/${product.id}`}
      data-magnetic="0.12"
      data-magnetic-max="10"
      data-cursor="VIEW"
      className="group block overflow-hidden rounded-[1.5rem] border border-line bg-[#16202b] p-4 transition duration-300 hover:-translate-y-1 hover:border-accent/50"
    >
      <div className="relative overflow-hidden rounded-[1.2rem]">
        <img
          src={placeholderImage(product)}
          alt={product.name}
          width={600}
          height={600}
          loading={priority ? "eager" : "lazy"}
          className="zoom-img aspect-square w-full object-cover"
        />
        <span className="absolute bottom-3 left-3">
          <Badge product={product} />
        </span>
      </div>

      <div className="px-1 pt-3">
        <h3 className="font-heading line-clamp-2 min-h-[2.6rem] text-sm font-bold leading-5 text-ink group-hover:underline">
          {product.name}
        </h3>
        <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
          <span className="font-heading text-base font-bold text-ink">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-muted line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-muted">{typeMeta.label}</p>
      </div>
    </Link>
  );
}