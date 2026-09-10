"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChatIcon,
  CheckIcon,
  HeadsetIcon,
  MailIcon,
  QuestionIcon,
  RefreshIcon,
  TruckIcon,
} from "@/components/icons";

const inputCls =
  "w-full rounded-[1rem] border border-line bg-background px-4 py-2.5 text-sm text-ink placeholder-muted focus:border-accent focus:outline-none";

const FAQS = [
  {
    q: "Where is my order?",
    a: "Physical and dropship items show their timeline on the product page: in-house 3D prints ship within 3 business days, dropship items take 7–14 business days. Once shipped, tracking details are emailed to you. You can also check your order history at /account on the same device.",
  },
  {
    q: "How do digital downloads work?",
    a: "Digital products (KDS Excel templates) unlock instantly after payment. The success page shows a Download button, and the same link is emailed to the address on your order. Links stay valid for re-downloading your purchases.",
  },
  {
    q: "Can I change or cancel my order?",
    a: "Contact us within 24 hours of ordering and we'll do our best to update or cancel before it ships. For digital products, once the download link has been accessed the order is considered delivered.",
  },
  {
    q: "How do returns and refunds work?",
    a: "3D prints can be returned within 7 days if damaged or defective — message us with a photo and we'll replace or refund. Dropship items follow the supplier's policy. Digital products are non-refundable once downloaded, unless the file itself is broken.",
  },
  {
    q: "Why does my dropship item take 7+ days?",
    a: "Dropship items ship directly from our supplier's warehouse, not from us. We show the \u201CShips in 7+ Days\u201D badge on those products so you know before you buy.",
  },
  {
    q: "How do I become a seller?",
    a: "Vendor onboarding is opening soon. Head to /sellers and drop us a message — listing is free and you only pay an 8% commission when an order sells.",
  },
];

function FaqItem({ q, a }) {
  return (
    <details className="group rounded-[1.2rem] border border-line bg-[#16202b] px-5 py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-ink [&::-webkit-details-marker]:hidden">
        {q}
        <span className="text-lg leading-none text-muted transition group-open:rotate-45">
          +
        </span>
      </summary>
      <p className="mt-2 text-sm leading-6 text-muted">{a}</p>
    </details>
  );
}

function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    order: "",
    topic: "Order status",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in your name, email and message.");
      return;
    }
    setError("");
    // Demo mode: store locally. Wire to Resend / Supabase when going live.
    const existing = JSON.parse(
      window.localStorage.getItem("nexus_messages") || "[]"
    );
    window.localStorage.setItem(
      "nexus_messages",
      JSON.stringify([
        { ...form, createdAt: new Date().toISOString() },
        ...existing,
      ])
    );
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-[1.5rem] border border-line bg-[#16202b] p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
          <CheckIcon className="h-7 w-7 text-emerald-400" />
        </div>
        <h2 className="font-heading mt-4 text-xl font-bold">
          Message received!
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
          Thanks, {form.name.split(" ")[0]}. We reply within 24 hours at{" "}
          <b className="text-ink">{form.email}</b> (demo — email delivery goes
          live with Resend). Need help now? Check the FAQ below.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-5 rounded-full border border-line px-5 py-2.5 text-sm font-bold text-ink transition hover:border-ink"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-[1.5rem] border border-line bg-[#16202b] p-6 sm:p-8"
    >
      <h2 className="font-heading text-lg font-bold">Send us a message</h2>
      <p className="mt-1 text-sm text-muted">
        We reply within 24 hours, Monday to Saturday.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-medium text-muted">
          Your Name *
          <input
            className={`${inputCls} mt-1`}
            value={form.name}
            onChange={set("name")}
            placeholder="Juan Dela Cruz"
            required
          />
        </label>
        <label className="block text-xs font-medium text-muted">
          Email *
          <input
            type="email"
            className={`${inputCls} mt-1`}
            value={form.email}
            onChange={set("email")}
            placeholder="you@email.com"
            required
          />
        </label>
        <label className="block text-xs font-medium text-muted">
          Order Number (optional)
          <input
            className={`${inputCls} mt-1`}
            value={form.order}
            onChange={set("order")}
            placeholder="e.g. 1022AF19"
          />
        </label>
        <label className="block text-xs font-medium text-muted">
          Topic *
          <select
            className={`${inputCls} mt-1`}
            value={form.topic}
            onChange={set("topic")}
          >
            {[
              "Order status",
              "Digital download",
              "Shipping & delivery",
              "Returns & refunds",
              "Dropship item",
              "Become a seller",
              "Something else",
            ].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 block text-xs font-medium text-muted">
        Message *
        <textarea
          rows={4}
          className={`${inputCls} mt-1 resize-none`}
          value={form.message}
          onChange={set("message")}
          placeholder="Tell us what happened — include your order number if you have one."
          required
        />
      </label>

      {error && (
        <p className="mt-3 rounded-[1rem] bg-red-500/10 px-4 py-2.5 text-xs text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="mt-5 rounded-full bg-white px-8 py-3 text-sm font-bold text-[#101820] transition hover:bg-white/85"
      >
        Send Message
      </button>
      <p className="mt-3 text-[11px] text-muted">
        Demo mode — messages are saved on this device. Connect Resend to
        deliver them by email when going live.
      </p>
    </form>
  );
}

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 pb-16">
      <div className="mt-10 text-center">
        <h1 className="font-heading text-3xl font-black sm:text-4xl">
          Customer Service
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">
          Questions about an order, a download or shipping? We&apos;re here
          every day — average reply time under 24 hours.
        </p>
      </div>

      {/* Contact methods */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[1.5rem] border border-line bg-[#16202b] p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
            <MailIcon className="h-6 w-6 text-accent" />
          </div>
          <h3 className="font-heading mt-3 text-sm font-bold">Email Us</h3>
          <a
            href="mailto:hello@nexusstore.ph"
            className="mt-1 block text-sm text-accent hover:underline"
          >
            hello@nexusstore.ph
          </a>
          <p className="mt-1 text-xs text-muted">Replies within 24 hours</p>
        </div>
        <div className="rounded-[1.5rem] border border-line bg-[#16202b] p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
            <ChatIcon className="h-6 w-6 text-accent" />
          </div>
          <h3 className="font-heading mt-3 text-sm font-bold">Chat With Us</h3>
          <a
            href="#"
            className="mt-1 block text-sm text-accent hover:underline"
          >
            Facebook Messenger
          </a>
          <p className="mt-1 text-xs text-muted">Mon–Sat, 9am–6pm</p>
        </div>
        <div className="rounded-[1.5rem] border border-line bg-[#16202b] p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
            <TruckIcon className="h-6 w-6 text-accent" />
          </div>
          <h3 className="font-heading mt-3 text-sm font-bold">Track an Order</h3>
          <Link
            href="/account"
            className="mt-1 block text-sm text-accent hover:underline"
          >
            View my orders
          </Link>
          <p className="mt-1 text-xs text-muted">Shipping timelines</p>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <ContactForm />

        <div>
          <h2 className="font-heading text-lg font-bold">
            Quick answers while you wait
          </h2>
          <div className="mt-4 space-y-3">
            <Link
              href="/shipping"
              className="flex items-center gap-3 rounded-[1.2rem] border border-line bg-[#16202b] px-5 py-4 text-sm font-semibold text-ink transition hover:border-accent/50"
            >
              <TruckIcon className="h-5 w-5 shrink-0 text-muted" />
              How fast is shipping?
            </Link>
            <Link
              href="/returns"
              className="flex items-center gap-3 rounded-[1.2rem] border border-line bg-[#16202b] px-5 py-4 text-sm font-semibold text-ink transition hover:border-accent/50"
            >
              <RefreshIcon className="h-5 w-5 shrink-0 text-muted" />
              What is the return policy?
            </Link>
            <Link
              href="/sellers"
              className="flex items-center gap-3 rounded-[1.2rem] border border-line bg-[#16202b] px-5 py-4 text-sm font-semibold text-ink transition hover:border-accent/50"
            >
              <HeadsetIcon className="h-5 w-5 shrink-0 text-muted" />
              I want to sell on Nexus
            </Link>
          </div>

          <div className="mt-4 rounded-[1.2rem] border border-line bg-[#0d141c] p-5">
            <p className="flex items-center gap-2 text-sm font-bold text-ink">
              <QuestionIcon className="h-4 w-4 text-accent" />
              Still stuck?
            </p>
            <p className="mt-1 text-xs leading-5 text-muted">
              The floating support button is on every page — tap it anytime and
              we&apos;ll point you to the right person.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <section id="faq" className="mx-auto mt-14 max-w-3xl scroll-mt-24">
        <h2 className="font-heading text-center text-2xl font-black">
          Frequently Asked Questions
        </h2>
        <div className="mt-5 space-y-3">
          {FAQS.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>
    </main>
  );
}