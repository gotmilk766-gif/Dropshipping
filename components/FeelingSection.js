import Reveal from "./motion/Reveal";
import SplitHeading from "./motion/SplitHeading";

// mdx.so "Every Experience Begins With a Feeling" about section.
export default function FeelingSection() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-20 sm:py-28">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
        <div>
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
              About Nexus
            </p>
          </Reveal>
          <SplitHeading
            lines={["Every Product Begins", "With a Feeling"]}
            baseDelay={100}
            className="font-heading mt-4 text-3xl font-black leading-tight text-ink sm:text-5xl"
          />
        </div>
        <Reveal delay={250} as="div">
          <p className="max-w-xl text-base leading-8 text-muted sm:text-lg">
            We blend creativity, craft and a bit of Filipino ingenuity to make
            things people don&apos;t just buy — they feel. From an articulated
            dragon toy to an Excel template that saves a restaurant hours, every
            item is made with intention, printed to order, and quality-checked
            before it ships.
          </p>
        </Reveal>
      </div>
    </section>
  );
}