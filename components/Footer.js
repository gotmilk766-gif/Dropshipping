import Link from "next/link";
import { CATEGORIES } from "@/lib/products";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-[#0d141c] text-muted">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="font-heading text-lg font-black text-ink">
            NEXUS<span className="text-accent">.</span>
          </div>
          <p className="mt-3 text-sm leading-6">
            3D prints, digital templates &amp; dropship finds — one
            marketplace for everything. Made to order in the Philippines.
          </p>
          <p className="mt-3 text-xs">Content &amp; creatives by Maison Recall</p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-ink">
            Shop
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/search" className="transition hover:text-ink">
                Shop All
              </Link>
            </li>
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/search?category=${c.id}`}
                  className="transition hover:text-ink"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-ink">
            Customer Care
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/contact" className="transition hover:text-ink">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="transition hover:text-ink">
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link href="/returns" className="transition hover:text-ink">
                Returns &amp; Refunds
              </Link>
            </li>
            <li>
              <Link href="/terms" className="transition hover:text-ink">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="transition hover:text-ink">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/sellers" className="transition hover:text-ink">
                Become a Seller
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-ink">
            Get in Touch
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href="mailto:hello@nexusstore.ph"
                className="transition hover:text-ink"
              >
                hello@nexusstore.ph
              </a>
            </li>
            <li className="flex gap-4">
              <a href="#" aria-label="TikTok" className="transition hover:text-ink">
                TikTok
              </a>
              <a href="#" aria-label="Facebook" className="transition hover:text-ink">
                Facebook
              </a>
              <a href="#" aria-label="Instagram" className="transition hover:text-ink">
                Instagram
              </a>
              <a href="#" aria-label="YouTube" className="transition hover:text-ink">
                YouTube
              </a>
            </li>
          </ul>
          <p className="mt-4 text-xs">
            Payments: GCash · Maya · Credit/Debit (via Stripe)
          </p>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs">
          <span>© {new Date().getFullYear()} Nexus Store</span>
          <span>Demo store — placeholders everywhere; swap in real products anytime.</span>
        </div>
      </div>
    </footer>
  );
}