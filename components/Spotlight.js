import Link from "next/link";
import Reveal from "./motion/Reveal";
import RollText from "./motion/RollText";
import SplitHeading from "./motion/SplitHeading";
import { formatPrice, placeholderImage } from "@/lib/utils";

// mdx.so-style "NEW · JUST RELEASED" product spotlight blocks,
// alternating image / copy layouts with scroll reveals.
export default function Spotlight({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="border-t border-line bg-background py-20 sm:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
                Fresh off the printer
              </p>
            </Reveal>
            <SplitHeading
              lines={["Our Prints,", "Your Expression."]}
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
              VIEW ALL
              <span
                aria-hidden
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 space-y-16">
          {products.map((p, i) => (
            <div
              key={p.id}
              className={`flex flex-col items-center gap-8 md:flex-row ${
                i % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <Reveal className="w-full shrink-0 md:w-1/2" delay={i * 100}>
                <Link
                  href={`/product/${p.id}`}
                  data-magnetic="0.08"
                  data-magnetic-max="12"
                  data-cursor="VIEW"
                  className="group block"
                >
                  <img
                    src={placeholderImage(p)}
                    alt={p.name}
                    width={600}
                    height={600}
                    className="zoom-img aspect-square w-full rounded-[1.5rem] border border-line object-cover"
                  />
                </Link>
              </Reveal>
              <div className="max-w-lg flex-1">
                <Reveal delay={150}>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sale">
                    New · Just Released
                  </p>
                </Reveal>
                <SplitHeading
                  as="h3"
                  lines={[p.name]}
                  baseDelay={220}
                  className="font-heading mt-3 text-2xl font-black leading-tight text-ink sm:text-4xl"
                />
                <Reveal delay={300}>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {p.description}
                  </p>
                </Reveal>
                <Reveal delay={380}>
                  <p className="font-heading mt-4 text-xl font-bold text-ink">
                    {formatPrice(p.price)}
                    {p.originalPrice && p.originalPrice > p.price && (
                      <span className="ml-2 text-base font-normal text-muted line-through">
                        {formatPrice(p.originalPrice)}
                      </span>
                    )}
                  </p>
                  <Link
                    href={`/product/${p.id}`}
                    data-magnetic="0.35"
                    data-magnetic-max="8"
                    className="roll-hover mt-6 inline-block rounded-full bg-white px-8 py-3 text-sm font-bold text-[#101820] transition hover:bg-white/85"
                  >
                    <RollText text="SHOP NOW" />
                  </Link>
                </Reveal>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}