import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// POST /api/webhook — listens for Stripe events.
// In demo mode (no keys) it answers 503 so nothing breaks.
//
// Live mode:
//  1. Set STRIPE_WEBHOOK_SECRET (from Stripe Dashboard → Webhooks, or the
//     `stripe listen --forward-to localhost:3000/api/webhook` CLI output).
//  2. On checkout.session.completed, insert the order into the Supabase
//     `orders` table via the service role key (bypasses RLS — required,
//     because webhooks arrive unauthenticated).
//
// Set SUPABASE_SERVICE_ROLE_KEY in .env.local (Dashboard → Project Settings
// → API). Never expose it to the browser — it's server-only.

export const dynamic = "force-dynamic";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function POST(request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook not configured (demo mode)." },
      { status: 503 }
    );
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    return NextResponse.json(
      { error: "Stripe secret key missing." },
      { status: 503 }
    );
  }

  const stripe = new Stripe(stripeSecret);
  const signature = request.headers.get("stripe-signature");

  let event;
  try {
    const raw = await request.text();
    event = stripe.webhooks.constructEvent(raw, signature, secret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err.message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const supabase = getServiceClient();

    if (!supabase) {
      console.error(
        "Payment completed but Supabase is not configured — order NOT saved:",
        session.id
      );
      // Return 200 so Stripe doesn't retry forever; the error is logged.
      return NextResponse.json({ received: true, saved: false });
    }

    // Parse what the checkout route stashed in session metadata — just
    // product ids + quantities, so it stays well under Stripe's 500-char
    // metadata limit. Product details (name/price/type) are re-resolved
    // from the database below.
    let requested = [];
    let customer = {};
    try {
      requested = JSON.parse(session.metadata?.order_items || "[]");
      customer = JSON.parse(session.metadata?.customer || "{}");
    } catch {
      requested = [];
      customer = {};
    }

    // Re-resolve product details from the `products` table.
    const { data: products } = await supabase
      .from("products")
      .select("id, slug, name, price, type");
    const byKey = new Map(
      (products || []).flatMap((p) => [[p.slug, p], [p.id, p]])
    );
    const items = requested
      .map((i) => {
        const p = byKey.get(i.productId);
        return p
          ? {
              productId: i.productId,
              name: p.name,
              price: Number(p.price),
              qty: Number(i.qty) || 1,
              type: p.type,
            }
          : null;
      })
      .filter(Boolean);

    const subtotal = items.reduce(
      (sum, i) => sum + i.price * i.qty,
      0
    );

    const { error } = await supabase.from("orders").insert({
      stripe_session_id: session.id,
      customer,
      items,
      subtotal,
      total: (session.amount_total ?? Math.round(subtotal * 100)) / 100,
      status: "paid",
    });

    if (error) {
      console.error("Failed to insert order into Supabase:", error.message);
      // 500 makes Stripe retry the delivery — orders aren't lost.
      return NextResponse.json(
        { error: "Could not save order." },
        { status: 500 }
      );
    }

    // TODO(email): send receipt + digital download links via Resend here.
    console.log("Order saved for session", session.id);
  }

  return NextResponse.json({ received: true, saved: true });
}
