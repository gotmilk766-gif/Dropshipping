"use client";

import Link from "next/link";
import Reveal from "./motion/Reveal";
import SplitHeading from "./motion/SplitHeading";
import { formatPrice, formatSold, placeholderImage, productBadge } from "@/lib/utils";

// Flash-sale product bento: one tall feature card + a 2x2 grid of smaller
// cards, wired to the live catalog. On-sale items first, real /product links.
function discount(p) {
  if (!p.originalPrice || p.originalPrice <= p.price) return null;
  return Math.round((1 - p.price / p.originalPrice) * 100);
}

function ProductCard({ product, feature = false }) {
  const badge = productBadge(product);
  const off = discount(product);
  return (
    <Link
      href={`/product/${product.id}`}
      data-magnetic="0.06"
      data-magnetic-max="10"
      className={`group flex flex-col overflow-hidden rounded-[1.25rem] border border-line bg-[#111c25] transition duration-300 hover:-translate-y-1.5 hover:border-[#2b3c4b] ${
        feature ? "md:col-span-6 md:row-span-2" : "md:col-span-3"
      } col-span-12`}
    >
      <div className="relative overflow-hidden">
        <img
          src={placeholderImage(product)}
          alt={product.name}
          className={`zoom-img w-full object-cover ${feature ? "aspect-[16/11]" : "aspect-square"}`}
        />
        {off != null && (
          <span className="absolute left-3 top-3 rounded-md bg-accent px-2 py-0.5 text-[11px] font-bold text-[#0d151c]">
            -{off}%
          </span>
        )}
        {badge && (
          <span
            className={`absolute right-3 top-3 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white ${badge.style}`}
          >
            {badge.label}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted">
          {product.category?.replace(/-/g, " ")}
        </p>
        <h3
          className={`font-heading mt-1 font-bold leading-snug text-ink ${
            feature ? "text-xl sm:text-2xl" : "text-sm"
          }`}
        >
          {product.name}
        </h3>
        {feature && product.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
            {product.description}
          </p>
        )}
        <div className="mt-auto flex items-end justify-between pt-4">
          <div className="font-heading text-lg font-bold tabular-nums text-ink">
            {formatPrice(product.price)}
            {off != null && (
              <span className="ml-2 text-sm font-normal text-muted line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <div className="text-xs tabular-nums text-muted">
            {product.rating ? (
              <span className="text-amber-400">★ {product.rating}</span>
            ) : null}
            {product.sold ? (
              <span className="ml-1">· {formatSold(product.sold)}</span>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function FlashSale({ products = [], loaded = false }) {
  const onSale = products.filter((p) => p.originalPrice && p.originalPrice > p.price);
  const pool = onSale.length >= 5 ? onSale : [...onSale, ...products].slice(0, 5);
  const items = pool.slice(0, 5);
  const [feature, ...rest] = items;

  return (
    <section className="border-t border-line bg-background">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-20 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Reveal>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                <span className="inline-block h-2 w-2 rounded-full bg-accent" />
                Flash sale · limited stock
              </p>
            </Reveal>
            <SplitHeading
              lines={["Best Sellers, Marked Down"]}
              baseDelay={100}
              className="font-heading mt-3 text-2xl font-black leading-tight text-ink sm:text-4xl"
            />
          </div>
          <Reveal delay={250}>
            <Link
              href="/search"
              data-magnetic="0.25"
              data-magnetic-max="6"
              className="group flex items-center gap-2 text-sm font-bold text-ink transition hover:text-accent"
            >
              SHOP THE SALE
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </Reveal>
        </div>

        {!loaded && items.length === 0 ? (
          <div className="mt-12 grid grid-cols-12 gap-4">
            <div className="col-span-12 aspect-[16/11] animate-pulse rounded-[1.25rem] border border-line bg-[#111c25] md:col-span-6 md:row-span-2 md:aspect-auto" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="col-span-6 aspect-square animate-pulse rounded-[1.25rem] border border-line bg-[#111c25] md:col-span-3"
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-12 gap-4">
            {feature && <ProductCard product={feature} feature />}
            {rest.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
