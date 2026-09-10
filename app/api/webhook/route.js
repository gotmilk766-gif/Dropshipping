import { NextResponse } from "next/server";
import Stripe from "stripe";

// POST /api/webhook — listens for Stripe events.
// In demo mode (no keys) it answers 503 so nothing breaks.
//
// Going live:
//  1. Set STRIPE_WEBHOOK_SECRET (from Stripe Dashboard → Webhooks, or the
//     `stripe listen --forward-to localhost:3000/api/webhook` CLI output).
//  2. Handle checkout.session.completed by inserting the order into
//     Supabase and emailing the receipt + download links (Resend).
export async function POST(request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook not configured (demo mode)." },
      { status: 503 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
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
    // TODO(production): write the order to Supabase, e.g.
    //   await supabase.from("orders").insert({
    //     stripe_session_id: session.id,
    //     customer_email: session.customer_email,
    //     amount_total: session.amount_total,
    //     status: "paid",
    //   });
    // then email the receipt + digital download links via Resend.
    console.log("Payment completed for session", session.id);
  }

  return NextResponse.json({ received: true });
}