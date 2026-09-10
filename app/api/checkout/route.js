import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { DEMO_PRODUCTS } from "@/lib/products";

// POST /api/checkout
// Demo mode (no STRIPE_SECRET_KEY): returns { demo: true, orderId } and the
// client records the order locally.
// Stripe mode (key configured): creates a real Checkout Session and returns
// its URL for redirect.
//
// SECURITY: line-item prices are ALWAYS resolved server-side. When Supabase
// is configured, prices come from the `products` table; otherwise from the
// built-in demo catalog. Client-sent prices are ignored, so totals can't be
// tampered with from the browser.

export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

function getReadClient() {
  if (!SUPABASE_URL) return null;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const key = serviceKey || anonKey;
  if (!key) return null;
  return createClient(SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Resolve authoritative prices for the requested items.
// Accepts items keyed by slug (demo ids / product pages) or uuid.
async function resolvePrices(items) {
  const supabase = getReadClient();

  if (supabase) {
    const { data, error } = await supabase.from("products").select("id, slug, name, price, type");
    if (!error && data && data.length) {
      const byKey = new Map();
      for (const p of data) {
        byKey.set(p.slug, p);
        byKey.set(p.id, p);
      }
      const resolved = [];
      for (const item of items) {
        const p = byKey.get(item.productId);
        if (!p) return null; // unknown product — reject the whole order
        resolved.push({ ...item, name: p.name, price: Number(p.price), type: p.type });
      }
      return resolved;
    }
    // Fall through to demo pricing if the read failed (e.g. schema not run yet).
  }

  const byKey = new Map(DEMO_PRODUCTS.flatMap((p) => [[p.id, p], [p.slug, p]]));
  const resolved = [];
  for (const item of items) {
    const p = byKey.get(item.productId);
    if (!p) return null;
    resolved.push({ ...item, name: p.name, price: p.price, type: p.type });
  }
  return resolved;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { items = [], customer = {} } = body;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }
  if (!customer.email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  // Sanitize quantities and resolve authoritative prices server-side.
  const cleanItems = items.map((i) => ({
    productId: String(i.productId || ""),
    qty: Math.max(1, Math.min(99, Math.floor(Number(i.qty) || 1))),
  }));
  const priced = await resolvePrices(cleanItems);
  if (!priced) {
    return NextResponse.json(
      { error: "One or more items in your cart are no longer available." },
      { status: 400 }
    );
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    // Demo mode — no Stripe configured.
    return NextResponse.json({
      demo: true,
      orderId: crypto.randomUUID(),
    });
  }

  try {
    const stripe = new Stripe(secret);
    const origin = request.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: priced.map((item) => ({
        quantity: item.qty,
        price_data: {
          currency: "php",
          unit_amount: Math.round(item.price * 100),
          product_data: { name: item.name },
        },
      })),
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      customer_email: customer.email,
      metadata: {
        order_items: JSON.stringify(
          priced.map((i) => ({ productId: i.productId, qty: i.qty }))
        ),
        customer: JSON.stringify({
          name: customer.name || "",
          email: customer.email,
          phone: customer.phone || "",
          address: customer.address || "",
        }),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout failed:", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 }
    );
  }
}
