import Link from "next/link";
import { BagIcon, ChartIcon, UsersIcon, ZapIcon } from "@/components/icons";

export default function SellersPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16">
      <div className="mt-8 rounded-2xl border border-line bg-[#16202b] p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
          <UsersIcon className="h-8 w-8 text-accent" />
        </div>
        <h1 className="font-heading mt-4 text-2xl font-black text-ink">
          Become a Seller on Nexus Store
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">
          Sell your 3D prints, digital templates or dropship products to a
          growing Philippine audience. List for <b className="text-ink">8% commission</b> — no
          monthly fees, no lock-in.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: BagIcon,
            title: "List Free",
            text: "Zero listing fees. You only pay 8% when an order sells.",
          },
          {
            icon: ZapIcon,
            title: "Instant for Digital",
            text: "Upload once — customers get downloads automatically.",
          },
          {
            icon: ChartIcon,
            title: "Grow With Us",
            text: "Flash sales, marketing and Maison Recall content included.",
          },
        ].map((f) => {
          const FeatureIcon = f.icon;
          return (
          <div key={f.title} className="rounded-xl border border-line bg-[#16202b] p-5">
            <FeatureIcon className="h-7 w-7 text-accent" />
            <h3 className="font-heading mt-2 text-sm font-bold text-ink">{f.title}</h3>
            <p className="mt-1 text-xs leading-5 text-muted">{f.text}</p>
          </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-[#16202b] p-8">
        <h2 className="font-heading text-lg font-bold text-ink">Get in Touch</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Vendor onboarding is opening soon. Send us a message and we&apos;ll
          reply within 48 hours.
        </p>
        <a
          href="mailto:sellers@nexusstore.ph?subject=Become%20a%20Seller%20on%20Nexus%20Store"
          className="mt-4 inline-block rounded-full bg-white px-6 py-3 text-sm font-bold text-[#101820] transition hover:bg-white/85"
        >
          sellers@nexusstore.ph
        </a>
        <p className="mt-4 text-xs text-muted">
          Prefer chat? Message us on Facebook or TikTok — links in the footer.
        </p>
      </div>

      <p className="mt-6 text-center">
        <Link href="/" className="text-xs text-accent underline">
          ← Back to store
        </Link>
      </p>
    </main>
  );
}