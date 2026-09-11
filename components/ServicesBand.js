import Link from "next/link";
import Reveal from "./motion/Reveal";
import SplitHeading from "./motion/SplitHeading";
import { DownloadIcon, PackageIcon, TruckIcon } from "./icons";

// "What we sell" as an asymmetric bento: the physical 3D-print offering
// gets a tall feature cell, digital + dropship stack beside it.
const SERVICES = [
  {
    icon: PackageIcon,
    tag: "Physical",
    title: "3D Prints",
    desc: "Handmade and printed in-house. Custom designs, toys, and desk gear, shipped in 3 days.",
    href: "/search?category=3d-prints",
    feature: true,
  },
  {
    icon: DownloadIcon,
    tag: "Digital",
    title: "KDS Templates",
    desc: "Instant-download Excel workbooks for restaurants. Unlocks right after payment.",
    href: "/search?category=digital",
  },
  {
    icon: TruckIcon,
    tag: "Dropship",
    title: "Supplier Finds",
    desc: "Gadgets, accessories, and figures shipped directly from our supplier in 7+ days.",
    href: "/search?category=dropship",
  },
];

export default function ServicesBand() {
  return (
    <section className="border-t border-line bg-[#0b131a]">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-20 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
                What we sell
              </p>
            </Reveal>
            <SplitHeading
              lines={["Three Ways to Shop"]}
              baseDelay={100}
              className="font-heading mt-4 text-3xl font-black leading-tight text-ink sm:text-5xl"
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
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-[1.3fr_1fr] md:grid-rows-2">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal
                key={s.title}
                delay={i * 120}
                className={s.feature ? "md:row-span-2" : ""}
              >
                <Link
                  href={s.href}
                  data-magnetic="0.1"
                  data-magnetic-max="10"
                  className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-line bg-background p-8 transition duration-300 hover:-translate-y-1 hover:border-accent/50"
                >
                  <Icon className={`text-accent ${s.feature ? "h-10 w-10" : "h-8 w-8"}`} />
                  <p className="mt-auto pt-10 text-xs font-semibold uppercase tracking-[0.3em] text-muted">
                    {s.tag}
                  </p>
                  <h3
                    className={`font-heading mt-2 font-black text-ink ${
                      s.feature ? "text-3xl sm:text-4xl" : "text-2xl"
                    }`}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-[34ch] text-sm leading-6 text-muted">
                    {s.desc}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
                    Shop {s.title}
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
