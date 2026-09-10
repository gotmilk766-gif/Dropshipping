// mdx.so-style scrolling marquee band. Configurable: pass `reverse` to
// scroll right-to-left, `duration` (seconds) to control speed, `words`
// to change content, and `tone` for the band background. Pauses on hover.
const DEFAULT_WORDS = [
  "3D Prints",
  "Digital Templates",
  "Dropship",
  "Made to Order",
  "Free Shipping over ₱1,500",
];

export default function MarqueeBand({
  words = DEFAULT_WORDS,
  reverse = false,
  duration = 45,
  tone = "#0d141c",
  size = "text-xl sm:text-2xl",
  className = "",
}) {
  return (
    <section
      className={`border-y border-line py-5 ${className}`}
      style={{ backgroundColor: tone }}
    >
      <div
        className={`marquee overflow-hidden ${reverse ? "marquee--reverse" : ""}`}
        style={{ "--marquee-duration": `${duration}s` }}
      >
        <div className="marquee-track flex w-max items-center gap-10">
          {[...words, ...words].map((w, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap">
              <span
                className={`font-heading font-bold uppercase tracking-wide text-ink ${size}`}
              >
                {w}
              </span>
              <span
                aria-hidden
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}