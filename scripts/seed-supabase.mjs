#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Seed the Supabase `products` table with the 12 demo products from
// lib/products.js, and optionally add your admin email to the `admins`
// allowlist.
//
// Usage (from the project root):
//   node scripts/seed-supabase.mjs
//   node scripts/seed-supabase.mjs --admin you@example.com
//
// Requires in .env.local (or the shell environment):
//   NEXT_PUBLIC_SUPABASE_URL        Project Settings → API → Project URL
//   SUPABASE_SERVICE_ROLE_KEY       Project Settings → API → service_role
//                                   (server-only secret — never NEXT_PUBLIC_)
//
// Idempotent: products are upserted on `slug`, so re-running refreshes
// prices/stock instead of duplicating rows.
// ---------------------------------------------------------------------------

import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { DEMO_PRODUCTS } from "../lib/products.js";

const args = process.argv.slice(2);
const adminFlagIdx = args.indexOf("--admin");
const ADMIN_EMAIL =
  adminFlagIdx !== -1 ? args[adminFlagIdx + 1]?.trim() : null;
if (args.includes("--admin") && !ADMIN_EMAIL) {
  console.error("✗ --admin was given without an email, e.g. --admin you@example.com");
  process.exit(1);
}

// --- env loading: process.env wins, then .env.local -----------------------
function loadEnvFile(file) {
  try {
    const raw = fs.readFileSync(file, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m || line.trim().startsWith("#")) continue;
      let v = m[2].trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      if (!(m[1] in process.env)) process.env[m[1]] = v;
    }
  } catch {
    // no .env.local — fine if vars are already in the environment
  }
}
loadEnvFile(path.join(process.cwd(), ".env.local"));

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    [
      "✗ Missing Supabase credentials. Set both in .env.local (project root):",
      "",
      "    NEXT_PUBLIC_SUPABASE_URL=...        # Dashboard → Project Settings → API",
      "    SUPABASE_SERVICE_ROLE_KEY=...       # same page — the secret service_role key",
      "",
      "  The service role key is required because RLS blocks anonymous inserts.",
      "  It never leaves the server and must not be committed or NEXT_PUBLIC_-prefixed.",
    ].join("\n")
  );
  process.exit(1);
}

// --- demo products → schema rows ------------------------------------------
function toRow(p) {
  return {
    slug: p.id,
    name: p.name,
    type: p.type,
    category: p.category,
    price: p.price,
    original_price: p.originalPrice ?? null,
    stock: p.stock ?? 0,
    sold: p.sold ?? 0,
    rating: p.rating ?? 5,
    flash_sale: Boolean(p.flashSale),
    is_new: Boolean(p.isNew),
    spotlight: Boolean(p.spotlight),
    description: p.description ?? null,
    features: p.features ?? [],
    image_url: null,
    file_url: null,
  };
}

const rows = DEMO_PRODUCTS.map(toRow);

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  console.log(
    `→ Seeding ${rows.length} products into ${
      SUPABASE_URL.replace(/^https?:\/\//, "").split(".")[0]
    } …\n`
  );

  // Sanity check: is the schema there?
  const { error: probeError } = await supabase
    .from("products")
    .select("slug")
    .limit(1);
  if (probeError) {
    console.error(
      [
        `✗ Cannot read the products table: ${probeError.message}`,
        "",
        "  Most likely supabase/schema.sql hasn't been run yet.",
        "  Run it first: Dashboard → SQL Editor → paste supabase/schema.sql → Run.",
      ].join("\n")
    );
    process.exit(1);
  }

  // Upsert on the unique `slug` column — safe to re-run any time.
  const { data, error } = await supabase
    .from("products")
    .upsert(rows, { onConflict: "slug" })
    .select("slug, name, type, price, stock");

  if (error) {
    console.error(`✗ Upsert failed: ${error.message}`);
    process.exit(1);
  }

  console.log(`✓ Seeded ${data.length} products:\n`);
  const width = Math.max(...data.map((r) => r.name.length));
  for (const r of data) {
    console.log(
      `   ${r.name.padEnd(width)}  ₱${String(r.price).padEnd(6)} ${r.type.padEnd(9)} stock:${r.stock}`
    );
  }

  if (ADMIN_EMAIL) {
    const { error: adminError } = await supabase
      .from("admins")
      .upsert({ email: ADMIN_EMAIL.toLowerCase() }, { onConflict: "email" });
    if (adminError) {
      console.error(`\n✗ Could not add admin: ${adminError.message}`);
    } else {
      console.log(`\n✓ Admin allowlist now includes ${ADMIN_EMAIL.toLowerCase()}`);
      console.log("  → sign in at /admin with that email + its Supabase password");
      console.log("    (Authentication → Users → Add user, if you haven't yet)");
    }
  }

  console.log("\nDone. The store now reads this catalog via /api/products.");
}

main().catch((err) => {
  console.error("✗ Unexpected failure:", err.message);
  process.exit(1);
});
