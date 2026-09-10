import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { DEMO_PRODUCTS } from "@/lib/products";

export const dynamic = "force-dynamic";

// GET /api/products
// Returns the live catalog. When Supabase env keys are configured, reads the
// `products` table (service role key on the server when available, so RLS
// hiccups can't blank the store). Otherwise falls back to the built-in demo
// catalog so the store always renders, keys or no keys.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Server-only read client. Prefers the service role key (bypasses RLS so a
// missing/late policy can never blank the catalog); falls back to the anon
// key when only the public pair is configured.
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

export async function GET() {
  const supabase = getReadClient();

  if (!supabase) {
    // Demo mode — no Supabase configured.
    return NextResponse.json({ source: "demo", products: DEMO_PRODUCTS });
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load products from Supabase:", error.message);
    // Degrade to demo catalog instead of showing an empty store.
    return NextResponse.json({ source: "demo", products: DEMO_PRODUCTS });
  }

  if (!data || data.length === 0) {
    // Table exists but is empty — show demo products as a placeholder.
    return NextResponse.json({ source: "demo", products: DEMO_PRODUCTS });
  }

  return NextResponse.json({ source: "supabase", products: data });
}
