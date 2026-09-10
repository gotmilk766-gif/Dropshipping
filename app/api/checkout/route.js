import { NextResponse } from "next/server";
import Stripe from "stripe";

// POST /api/checkout
// Demo mode (no STRIPE_SECRET_KEY): returns { demo: true, orderId } and the
// client records the order locally.
// Stripe mode (key configured): creates a real Checkout Session and returns
// its URL for redirect.
//
// NOTE: prices below come from the client request. Before going
// live, re-fetch each product's price from your database (Supabase) on the
// server and use those amounts instead, so prices can't be tampered with.
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
      line_items: items.map((item) => ({
        quantity: item.qty,
        price_data: {
          currency: "php",
          unit_amount: Math.round(Number(item.price) * 100),
          product_data: { name: item.name },
        },
      })),
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      customer_email: customer.email,
      metadata: {
        order_items: JSON.stringify(items.map((i) => i.productId)),
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