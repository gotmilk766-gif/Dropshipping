"use client";

import { useState } from "react";
import Link from "next/link";
import AdminGate from "@/components/AdminGate";
import { CATEGORIES, PRODUCT_TYPES, slugify } from "@/lib/products";
import { formatPrice, placeholderImage } from "@/lib/utils";

const inputCls =
  "w-full rounded-lg border border-line bg-background px-4 py-2.5 text-sm text-ink placeholder-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

function UploadForm() {
  const [form, setForm] = useState({
    name: "",
    type: "physical",
    category: "3d-prints",
    price: "",
    originalPrice: "",
    stock: "10",
    description: "",
  });
  const [done, setDone] = useState(null);
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  function publish(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.price) {
      setError("Name and price are required.");
      return;
    }
    setError("");
    const product = {
      id: `${slugify(form.name)}-${Date.now().toString(36)}`,
      name: form.name.trim(),
      type: form.type,
      category: form.category,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      stock: form.type === "digital" ? 9999 : Number(form.stock || 10),
      sold: 0,
      rating: 5,
      flashSale: false,
      description:
        form.description.trim() ||
        "Newly added product — update this description from the admin panel.",
      features: [],
    };
    const existing = JSON.parse(
      window.localStorage.getItem("nexus_demo_products") || "[]"
    );
    window.localStorage.setItem(
      "nexus_demo_products",
      JSON.stringify([product, ...existing])
    );
    setDone(product);
    setForm({
      name: "",
      type: "physical",
      category: "3d-prints",
      price: "",
      originalPrice: "",
      stock: "10",
      description: "",
    });
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 pb-16">
      <div className="mt-6 flex items-center justify-between">
        <h1 className="font-heading text-xl font-bold text-ink">Add Product</h1>
        <Link href="/admin" className="text-xs text-accent underline">
          ← Back to dashboard
        </Link>
      </div>

      <div className="mt-4 rounded-lg bg-amber-500/10 px-4 py-3 text-xs leading-5 text-amber-300">
        Demo mode: this product is saved to your browser and appears on the
        homepage immediately. With Supabase connected, this form uploads to
        your database + storage instead.
      </div>

      {done && (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <p className="text-sm font-bold text-emerald-400">
            &quot;{done.name}&quot; published!
          </p>
          <p className="mt-1 text-xs text-emerald-400">
            {formatPrice(done.price)} ·{" "}
            {done.type === "digital" ? "Instant download" : `Stock: ${done.stock}`}
          </p>
          <div className="mt-3 flex gap-3">
            <Link
              href={`/product/${done.id}`}
              className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-500"
            >
              View Product
            </Link>
            <Link
              href="/"
              className="rounded-full border border-emerald-500/40 px-4 py-2 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500/10"
            >
              See it on Homepage
            </Link>
          </div>
        </div>
      )}

      <form
        onSubmit={publish}
        className="mt-4 space-y-4 rounded-xl border border-line bg-[#16202b] p-6"
      >
        <label className="block text-xs font-medium text-muted">
          Product Name *
          <input
            className={`${inputCls} mt-1`}
            value={form.name}
            onChange={set("name")}
            placeholder="e.g. Custom Dragon Toy"
            required
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-xs font-medium text-muted">
            Product Type *
            <select
              className={`${inputCls} mt-1`}
              value={form.type}
              onChange={set("type")}
            >
              {PRODUCT_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-medium text-muted">
            Category *
            <select
              className={`${inputCls} mt-1`}
              value={form.category}
              onChange={set("category")}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-xs font-medium text-muted">
            Price (₱) *
            <input
              type="number"
              min="1"
              step="1"
              className={`${inputCls} mt-1`}
              value={form.price}
              onChange={set("price")}
              placeholder="500"
              required
            />
          </label>
          <label className="block text-xs font-medium text-muted">
            Original Price (₱)
            <input
              type="number"
              min="1"
              step="1"
              className={`${inputCls} mt-1`}
              value={form.originalPrice}
              onChange={set("originalPrice")}
              placeholder="650 (optional)"
            />
          </label>
          <label className="block text-xs font-medium text-muted">
            Stock
            <input
              type="number"
              min="1"
              className={`${inputCls} mt-1`}
              value={form.type === "digital" ? "9999" : form.stock}
              onChange={set("stock")}
              disabled={form.type === "digital"}
            />
          </label>
        </div>

        <label className="block text-xs font-medium text-muted">
          Description
          <textarea
            className={`${inputCls} mt-1 min-h-[100px]`}
            value={form.description}
            onChange={set("description")}
            placeholder="What is this product? Who is it for?"
          />
        </label>

        <div className="flex items-center gap-4 rounded-xl border border-dashed border-line bg-background p-4">
          <img
            src={placeholderImage({
              name: form.name || "Product",
              type: form.type,
              category: form.category,
            })}
            alt="Live preview"
            width={96}
            height={96}
            className="h-24 w-24 rounded-lg border border-line object-cover"
          />
          <p className="text-xs leading-5 text-muted">
            <b className="text-ink">Live preview</b> — demo products get an
            auto-generated placeholder image. Real product photos upload to
            Supabase Storage when it&apos;s connected.
          </p>
        </div>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-full bg-white py-3 text-sm font-bold text-[#101820] transition hover:bg-white/85"
        >
          Publish Product
        </button>
      </form>
    </main>
  );
}

export default function AdminUploadPage() {
  return (
    <AdminGate>
      <UploadForm />
    </AdminGate>
  );
}