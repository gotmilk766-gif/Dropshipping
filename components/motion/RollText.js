// mdx.so "LET'S TALK"-style button label: every character carries a
// hidden twin below it; on hover (`.roll-hover` on the parent) the top
// copy rolls up and the twin rolls into place.
//
// The duplicated characters are aria-hidden; an sr-only span carries the
// clean label so screen readers announce it once.
export default function RollText({ text }) {
  const chars = text.split("");
  return (
    <>
      <span aria-hidden className="roll">
        {chars.map((ch, i) => (
          <span key={i} className="roll-char">
            <span className="roll-top">{ch === " " ? "\u00A0" : ch}</span>
            <span
              className="roll-bot"
              style={{ transitionDelay: `${i * 22}ms` }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          </span>
        ))}
      </span>
      <span className="sr-only">{text}</span>
    </>
  );
}