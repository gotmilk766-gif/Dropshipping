import Link from "next/link";
import { PackageIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center px-4 py-24 text-center">
      <div className="font-heading text-6xl font-black text-accent">404</div>
      <PackageIcon className="mt-2 h-12 w-12 text-muted" />
      <h1 className="font-heading mt-4 text-2xl font-bold text-ink">
        Page lost in the warehouse
      </h1>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get
        you back to the good stuff.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#101820] transition hover:bg-white/85"
      >
        Back to Home
      </Link>
    </main>
  );
}