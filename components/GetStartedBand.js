import Reveal from "./motion/Reveal";
import RollText from "./motion/RollText";
import SplitHeading from "./motion/SplitHeading";

// mdx.so "Get Started" closing CTA.
export default function GetStartedBand() {
  return (
    <section className="relative overflow-hidden border-t border-line">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[44rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]"
      />
      <div className="relative mx-auto w-full max-w-[1200px] px-4 py-24 text-center sm:py-32">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            Get Started
          </p>
        </Reveal>
        <SplitHeading
          lines={["Let's Build Your Next", "Favorite Product"]}
          baseDelay={100}
          stagger={120}
          className="font-heading mx-auto mt-4 max-w-3xl text-3xl font-black leading-tight text-ink sm:text-5xl"
        />
        <Reveal delay={300}>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted">
            Custom 3D prints, ready-to-use templates, or dropship finds — turn
            your vision into a digital experience that stands out.
          </p>
        </Reveal>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Reveal delay={420}>
            <a
              href="mailto:hello@nexusstore.ph"
              data-magnetic="0.35"
              data-magnetic-max="8"
              className="roll-hover inline-block rounded-full bg-white px-10 py-3.5 text-sm font-bold text-[#101820] transition hover:bg-white/85"
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
              className="roll-hover inline-block rounded-full border border-line px-10 py-3.5 text-sm font-bold text-ink transition hover:border-ink"
            >
              <RollText text="@nexusstore.ph" />
            </a>
          </Reveal>
        </div>
        <Reveal delay={600}>
          <p className="mt-8 text-xs uppercase tracking-[0.25em] text-muted">
            Content &amp; creatives by Maison Recall
          </p>
        </Reveal>
      </div>
    </section>
  );
}