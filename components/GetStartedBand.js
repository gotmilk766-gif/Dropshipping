import Reveal from "./motion/Reveal";
import RollText from "./motion/RollText";
import SplitHeading from "./motion/SplitHeading";

// Closing CTA as a full-bleed accent field: dark type on the brand orange,
// a visible column grid, and the letter-roll buttons inverted to dark.
export default function GetStartedBand() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-[linear-gradient(120deg,var(--color-accent),#ff6711)] text-[#160a02]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: "linear-gradient(90deg,#160a02 1px,transparent 1px)",
          backgroundSize: "calc(100%/6) 100%",
        }}
      />
      <div className="relative mx-auto w-full max-w-[1200px] px-4 py-24 text-center sm:py-32">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#160a02]/70">
            Get Started
          </p>
        </Reveal>
        <SplitHeading
          lines={["Made in the Philippines", "Shipped Nationwide"]}
          baseDelay={100}
          stagger={120}
          className="font-heading mx-auto mt-4 max-w-3xl text-3xl font-black leading-tight sm:text-5xl"
        />
        <Reveal delay={300}>
          <p className="mx-auto mt-5 max-w-xl text-base font-medium leading-7 text-[#160a02]/80">
            Free shipping on orders over ₱1,500. GCash, Maya, and cards accepted
            at checkout. Custom 3D prints, ready-to-use templates, or dropship
            finds, all in one place.
          </p>
        </Reveal>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Reveal delay={420}>
            <a
              href="mailto:hello@nexusstore.ph"
              data-magnetic="0.35"
              data-magnetic-max="8"
              className="roll-hover inline-block rounded-full bg-[#0d151c] px-10 py-3.5 text-sm font-bold text-white transition hover:bg-black"
            >
              <RollText text="LET'S TALK" />
            </a>
          </Reveal>
          <Reveal delay={520}>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              data-magnetic="0.35"
              data-magnetic-max="8"
              className="roll-hover inline-block rounded-full border border-[#160a02]/40 px-10 py-3.5 text-sm font-bold text-[#160a02] transition hover:border-[#160a02]"
            >
              <RollText text="@nexusstore.ph" />
            </a>
          </Reveal>
        </div>
        <Reveal delay={600}>
          <p className="mt-8 text-xs uppercase tracking-[0.25em] text-[#160a02]/70">
            Content &amp; creatives by Maison Recall
          </p>
        </Reveal>
      </div>
    </section>
  );
}
