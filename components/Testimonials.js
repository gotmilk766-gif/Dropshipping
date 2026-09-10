import Reveal from "./motion/Reveal";
import SplitHeading from "./motion/SplitHeading";

// mdx.so-style customer reviews band: a pause-on-hover marquee of
// five-star quotes, with the list duplicated for a seamless loop.
const REVIEWS = [
  {
    text: "The dragon toy is amazing quality — my kid hasn't put it down since it arrived!",
    name: "Andrea S.",
  },
  {
    text: "The KDS template saved our restaurant hours of paperwork. Instant download too!",
    name: "Gregory W.",
  },
  {
    text: "HUGE hit as our White Elephant gift! Everyone LOVES how well the print quality is.",
    name: "Megan P.",
  },
  {
    text: "Ordered Monday, delivered Wednesday. 3D print quality is brilliant.",
    name: "Jeff M.",
  },
  {
    text: "I bought this for my husband and he said it was the best gift I've ever gotten him.",
    name: "Andrea S.",
  },
  {
    text: "The Excel template paid for itself on the first invoice. Brilliant work!",
    name: "Thomas H.",
  },
  {
    text: "Works exactly as described. Satisfying every time. 10/10.",
    name: "Ian G.",
  },
  {
    text: "Definitely the talk of the party when they see it.",
    name: "Michael G.",
  },
];

function ReviewCard({ review }) {
  return (
    <div className="mx-2 w-[320px] shrink-0 rounded-[1.5rem] border border-line bg-[#16202b] p-6 sm:w-[360px]">
      <div className="text-sm tracking-wide text-amber-400" aria-label="5 star rating">
        ★★★★★
      </div>
      <p className="mt-3 text-sm leading-6 text-ink">“{review.text}”</p>
      <p className="mt-3 text-xs text-muted">— {review.name}</p>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-20">
      <Reveal>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.35em] text-accent">
          Reviews
        </p>
      </Reveal>
      <SplitHeading
        lines={["What customers are saying"]}
        baseDelay={100}
        className="font-heading mt-3 text-center text-2xl font-black text-ink sm:text-3xl"
      />
      {/* Review cards scroll slower than the word bands and pause on
          hover (the .marquee CSS rule handles play-state). */}
      <div
        className="marquee mt-8 overflow-hidden"
        style={{ "--marquee-duration": "70s" }}
      >
        <div className="marquee-track flex w-max items-center">
          {[...REVIEWS, ...REVIEWS].map((r, i) => (
            <ReviewCard key={i} review={r} />
          ))}
        </div>
      </div>
    </section>
  );
}