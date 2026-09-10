"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Badge from "@/components/Badge";
import ProductGrid from "@/components/ProductGrid";
import ProductSkeleton from "@/components/ProductSkeleton";
import AddToCartButton from "@/components/AddToCartButton";
import { useProducts } from "@/lib/useProducts";
import { getCategoryLabel } from "@/lib/products";
import {
  formatPrice,
  formatSold,
  placeholderImage,
  productBadge,
  TYPE_META,
} from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { LockIcon, RefreshIcon, SearchIcon, TruckIcon } from "@/components/icons";
import Reveal from "@/components/motion/Reveal";
import RollText from "@/components/motion/RollText";
import SplitHeading from "@/components/motion/SplitHeading";
import ProjectNumber from "@/components/ProjectNumber";

// Fulfillment timelines per type — mirrors mdx.so's "Design process"
// (duration / phase / steps) on their project pages.
const TIMELINES = {
  physical: [
    {
      duration: "~1 day",
      title: "Order & Print",
      steps: ["Order confirmed", "Queued on the printer", "Filament color chosen"],
    },
    {
      duration: "3 days",
      title: "Quality Check",
      steps: ["Sanded & finished", "Quality inspected", "Packed in Manila"],
    },
    {
      duration: "1–4 days",
      title: "Ship & Deliver",
      steps: ["Handed to courier", "Tracking emailed", "Delivered to your door"],
    },
  ],
  digital: [
    {
      duration: "Instant",
      title: "Payment",
      steps: ["Secure Stripe checkout", "GCash, Maya or card", "Receipt emailed"],
    },
    {
      duration: "Instant",
      title: "Unlock Download",
      steps: ["Link on success page", "Also sent by email", "Re-download anytime"],
    },
    {
      duration: "Always",
      title: "Stay Updated",
      steps: ["Free template updates", "Support included", "Licensed for your business"],
    },
  ],
  dropship: [
    {
      duration: "1 day",
      title: "Order Placed",
      steps: ["Confirmed by email", "Sent to supplier", "Invoice logged"],
    },
    {
      duration: "3–5 days",
      title: "Supplier Prep",
      steps: ["Packed at warehouse", "Quality screened", "Labeled for shipping"],
    },
    {
      duration: "7–14 days",
      title: "Ship & Deliver",
      steps: ["Tracking emailed", "In transit", "Delivered nationwide"],
    },
  ],
};

export default function ProductPage() {
  const { id } = useParams();
  const { products, loaded } = useProducts();
  const router = useRouter();
  const { addItem } = useCart();

  if (!loaded) {
    return (
      <main className="mx-auto w-full max-w-[1200px] px-4 pb-16">
        <div className="mt-6 grid gap-10 md:grid-cols-2">
          <ProductSkeleton />
          <div className="space-y-3">
            <div className="h-4 w-1/3 rounded bg-white/10" />
            <div className="h-8 w-3/4 rounded bg-white/10" />
            <div className="h-6 w-1/2 rounded bg-white/10" />
            <div className="h-24 w-full rounded bg-white/5" />
          </div>
        </div>
      </main>
    );
  }

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <main className="flex flex-col items-center px-4 py-24 text-center">
        <SearchIcon className="h-16 w-16 text-muted" />
        <h1 className="font-heading mt-4 text-2xl font-black text-ink">
          Product not found
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted">
          This product may have been removed or the link is incorrect.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#101820] transition hover:bg-white/85"
        >
          Back to Home
        </Link>
      </main>
    );
  }

  const meta = TYPE_META[product.type];
  const badge = productBadge(product);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;
  const timeline = TIMELINES[product.type] || TIMELINES.physical;
  const projectIndex = products.findIndex((p) => p.id === product.id) + 1;
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const stockLine =
    product.type === "digital"
      ? "In stock — instant delivery"
      : product.stock < 20
        ? `Only ${product.stock} left in stock — order soon!`
        : "In stock";

  function buyNow() {
    addItem(product);
    router.push("/checkout");
  }

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 pb-16">
      {/* Project-style hero with a Drip-style parallax ghost title */}
      <section className="relative overflow-hidden">
        <ProjectNumber text={product.name} index={projectIndex} />
        <div className="relative z-10">
          <nav className="mt-6 text-xs text-muted" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
            {" / "}
            <Link
              href={`/search?category=${product.category}`}
              className="hover:text-ink"
            >
              {getCategoryLabel(product.category)}
            </Link>
            {" / "}
            <span className="text-ink">{product.name}</span>
          </nav>

          <div className="mt-10 grid gap-12 lg:grid-cols-2">
        <div className="relative">
          <img
            src={placeholderImage(product)}
            alt={product.name}
            width={600}
            height={600}
            className="aspect-square w-full rounded-[1.5rem] border border-line object-cover"
          />
          {badge && (
            <span className="absolute bottom-4 left-4">
              <Badge product={product} />
            </span>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
              {getCategoryLabel(product.category)}
            </p>
          </Reveal>
          <SplitHeading
            lines={[product.name]}
            as="h1"
            baseDelay={100}
            stagger={40}
            className="font-heading mt-4 text-4xl font-black leading-[1.05] text-ink sm:text-5xl"
          />

          {/* Tags row (like mdx's UI/UX · DEVELOPMENT · 3D) */}
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-accent/40 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-accent">
              {meta.short}
            </span>
            <span className="rounded-full border border-line px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-muted">
              ★ {product.rating}
            </span>
            <span className="rounded-full border border-line px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-muted">
              {formatSold(product.sold)}
            </span>
          </div>

          {/* Overview */}
          <p className="mt-6 max-w-xl text-base leading-8 text-muted">
            {product.description}
          </p>

          {/* Price */}
          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="font-heading text-4xl font-black text-ink">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-lg text-muted line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {discount && (
              <span className="rounded-full bg-sale px-3 py-1 text-xs font-bold text-white">
                Save {discount}%
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-emerald-400">{stockLine}</p>

          <div className="mt-5 rounded-[1.5rem] border border-line bg-[#16202b] p-5 text-sm leading-6 text-ink">
            <span className="font-heading font-bold">{meta.label}.</span>{" "}
            {meta.delivery}
          </div>

          {/* VIEW EXPERIENCE buttons */}
          <div className="mt-7 flex flex-wrap gap-3">
            <AddToCartButton
              product={product}
              className="roll-hover rounded-full bg-white px-8 py-3 text-sm font-bold text-[#101820] transition hover:bg-white/85"
            >
              <RollText text="ADD TO CART" />
            </AddToCartButton>
            <button
              type="button"
              onClick={buyNow}
              className="roll-hover rounded-full bg-accent px-8 py-3 text-sm font-bold text-[#101820] transition hover:bg-accent-dark"
            >
              <RollText text="BUY NOW" />
            </button>
          </div>

          <ul className="mt-7 grid gap-3 text-xs text-muted sm:grid-cols-3">
            <li className="flex flex-col items-center gap-1.5 rounded-[1.2rem] border border-line bg-[#16202b] p-4 text-center">
              <TruckIcon className="h-5 w-5 text-accent" />
              Ships next day
              <span className="text-[11px]">from Manila</span>
            </li>
            <li className="flex flex-col items-center gap-1.5 rounded-[1.2rem] border border-line bg-[#16202b] p-4 text-center">
              <LockIcon className="h-5 w-5 text-accent" />
              Secure checkout
              <span className="text-[11px]">via Stripe</span>
            </li>
            <li className="flex flex-col items-center gap-1.5 rounded-[1.2rem] border border-line bg-[#16202b] p-4 text-center">
              <RefreshIcon className="h-5 w-5 text-accent" />
              Easy returns
              <span className="text-[11px]">per policy</span>
            </li>
          </ul>
          </div>
        </div>
        </div>
      </section>

      {/* Fulfillment timeline (mdx "Design process") */}
      <section className="mt-20 border-t border-line pt-14">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            Fulfillment timeline
          </p>
        </Reveal>
        <SplitHeading
          lines={[`How ${product.name} reaches you`]}
          baseDelay={80}
          stagger={30}
          className="font-heading mt-3 text-3xl font-black text-ink sm:text-4xl"
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {timeline.map((phase, i) => (
            <Reveal key={phase.title} delay={i * 120} className="h-full">
            <div
              className="rounded-[1.5rem] border border-line bg-[#16202b] p-7 transition duration-300 hover:-translate-y-1 hover:border-accent/50 h-full"
            >
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
                {phase.duration}
              </p>
              <h3 className="font-heading mt-3 text-xl font-black text-ink">
                {phase.title}
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {phase.steps.map((s) => (
                  <li key={s} className="flex gap-2">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* The challenge / The impact (mdx project-page pattern) */}
      <section className="mt-20 grid gap-12 border-t border-line pt-14 lg:grid-cols-2">
        <Reveal>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            The challenge
          </p>
          <h2 className="font-heading mt-3 text-2xl font-black leading-tight text-ink sm:text-3xl">
            Built to solve a real problem
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
            {product.description} It&apos;s designed to fit straight into your
            day — no fuss, no assembly drama, no wasted time.
          </p>
        </div>
        </Reveal>
        <Reveal delay={150}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            The impact
          </p>
          <h2 className="font-heading mt-3 text-2xl font-black leading-tight text-ink sm:text-3xl">
            What you get
          </h2>
          {product.features?.length > 0 && (
            <ul className="mt-4 max-w-xl space-y-3">
              {product.features.map((f) => (
                <li key={f} className="flex gap-3 text-sm leading-6 text-muted">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {f}
                </li>
              ))}
            </ul>
          )}
        </div>
        </Reveal>
      </section>

      {/* Next project */}
      {related.length > 0 && (
        <section className="mt-20 border-t border-line pt-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-heading text-2xl font-black text-ink sm:text-3xl">
              Next: You May Also Like
            </h2>
            <Link
              href={`/search?category=${product.category}`}
              className="group flex items-center gap-2 text-sm font-bold text-ink transition hover:text-accent"
            >
              VIEW ALL
              <span
                aria-hidden
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
          <div className="mt-8">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </main>
  );
}