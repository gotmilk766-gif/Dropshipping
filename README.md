# Nexus Store

A Lazada-style marketplace for **3D prints**, **digital templates (KDS Excel)** and **dropship items** — built with Next.js (App Router) + Tailwind CSS.

The store ships in **demo mode**: it runs with **zero API keys**. Sample products, a browser-saved cart and a simulated checkout are all built in. Supabase (auth/database/storage) and Stripe (payments) integration is already wired up — add your keys and it switches on.

---

## Quick Start

```bash
npm install
npm run dev
```

Open **http://localhost:3000** — the store is fully browsable with demo data.

### Demo features you can try

| Feature | How |
| --- | --- |
| Browse products | Homepage grid, category filters, search bar |
| Flash sale countdown | "Nexus Deals" section (live timer) |
| Mixed cart | Add a 3D print + an Excel template + a dropship item |
| Checkout | Cart → Checkout → **Place Order** (no real payment) |
| Download a digital item | Success page → Download (placeholder file) |
| Order history | `/account` |
| Customer service | Floating support button + `/contact` (form + FAQ) |
| Admin panel | `/admin` → PIN: **`admin123`** → add a product → it appears on the homepage |

---

## Project Structure

```
app/
  page.js                 Homepage: hero, categories, flash sale, product grid
  product/[id]/page.js    Product detail (type-specific delivery info)
  search/page.js          Search + category filters
  cart/page.js            Cart with quantity controls
  checkout/page.js        Checkout form → demo order or Stripe redirect
  success/page.js         Confirmation + digital download buttons
  account/page.js         Order history (local browser)
  admin/page.js           Dashboard (stats, recent orders)
  admin/upload/page.js    Product upload form
  sellers/page.js         "Become a Seller" landing page
  contact/page.js         Customer service: contact form + FAQ
  terms|privacy|shipping|returns  Legal pages (required by Stripe)
  api/checkout/route.js   Checkout API (demo mode or Stripe session)
  api/webhook/route.js    Stripe webhook (order automation scaffold)
  not-found.js, loading.js
components/               Navbar, Footer, ProductCard, CartDrawer, CustomerServiceWidget, …
context/CartContext.js    Cart state, persisted to localStorage
lib/
  products.js             Demo catalog (12 products) + categories
  utils.js                ₱ formatting, type metadata, placeholder images
  supabaseClient.js       Env-guarded Supabase client
  useProducts.js          Client hook: demo products + admin-added ones
```

**Note:** product pages are client-rendered so admin-added demo products appear instantly. For production SEO, switch product fetching to a server-side Supabase query (below).

---

## Going Live (Supabase + Stripe)

### 1. Supabase (free)

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL Editor, create the tables:

```sql
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('physical', 'digital', 'dropship')),
  category text not null,
  price numeric not null,
  original_price numeric,
  stock integer not null default 0,
  sold integer not null default 0,
  rating numeric not null default 5,
  flash_sale boolean not null default false,
  description text,
  features jsonb default '[]'::jsonb,
  image_url text,
  file_url text,               -- digital products: private storage path
  created_at timestamptz not null default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text,
  customer jsonb not null,
  items jsonb not null,
  total numeric not null,
  status text not null default 'paid',
  created_at timestamptz not null default now()
);

-- RLS: anyone can read products; only authed admins write
alter table products enable row level security;
alter table orders enable row level security;
create policy "public read products" on products for select using (true);
create policy "admin insert products" on products for insert
  with check (auth.role() = 'authenticated');
create policy "admin read orders" on orders for select
  using (auth.role() = 'authenticated');
```

3. Enable **Authentication → Email** and add your admin user.
4. Create Storage buckets: `products` (public, product images) and `digital-files` (private, actual template files).
5. Copy `.env.example` → `.env.local` and add `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
6. Swap `useProducts()` (lib/useProducts.js) for a server-side Supabase query of the `products` table.

### 2. Stripe (free, per-sale fees only)

1. Create an account at [stripe.com](https://stripe.com) and grab API keys (test mode first).
2. Add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to `.env.local`.
3. The checkout page now redirects to real Stripe Checkout (₱, GCash/Maya/cards).
4. For order automation: `stripe listen --forward-to localhost:3000/api/webhook`, then set `STRIPE_WEBHOOK_SECRET` and implement the `checkout.session.completed` handler in `app/api/webhook/route.js` (insert order into Supabase + email receipt).

### 3. Email (Resend, free 3,000 emails/mo)

1. Add `RESEND_API_KEY` to `.env.local`.
2. In the webhook handler, send the receipt and digital download links.

---

## ▲ Deploying to Vercel (and fixing the 404)

The classic "deployed but 404" happens when the deployed project has no real `app/page.js` at its root, or the build failed and env vars are missing. Nexus Store is a complete app — follow this and it will render:

1. **Build locally first — this is the #1 404 prevention:**
   ```bash
   npm run build
   ```
   It must finish with `✓ Compiled successfully` / no red errors. (Demo mode needs **no env vars**, so a successful build here means a clean deploy.)

2. Push to GitHub:
   ```bash
   git add .
   git commit -m "Nexus Store — demo-ready marketplace"
   git branch -M main
   git remote add origin https://github.com/<you>/nexus-store.git
   git push -u origin main
   ```

3. At [vercel.com](https://vercel.com): **Add New → Project → Import** your repo. Framework preset **Next.js** is auto-detected. Click **Deploy**.

4. (Optional) Add env vars in **Project → Settings → Environment Variables** — copy from `.env.local` — then **Redeploy** from the Deployments tab.

5. Verify `https://your-project.vercel.app` loads the homepage.

**If it still 404s after deploying:**
- Open the deployment → **Build Logs** and look for red errors.
- Confirm `app/page.js` exists in your repo (it does — don't delete it).
- Add missing env vars and **Redeploy** (Deployments → ⋮ → Redeploy).
- Wait a minute — Vercel can briefly 404 while the new build propagates.

---

## Replacing Placeholders

- **Product images**: upload real photos to Supabase Storage (`products` bucket) and set `image_url` — or just edit the `placeholderImage()` helper in `lib/utils.js`.
- **Hero / spotlight art**: edit `components/HeroBand.js` (mdx.so-style serif hero) and `components/Spotlight.js` (NEW · JUST RELEASED blocks) — drop in Maison Recall creatives as `<img>`/background images.
- **Demo products**: edit `DEMO_PRODUCTS` in `lib/products.js`, or use the admin panel (`/admin`, PIN `admin123`).
- **Brand color**: change `--color-brand` in `app/globals.css`.

---

## Useful Commands

```bash
npm run dev      # local dev server
npm run build    # production build (run before deploying)
npm run start    # serve the production build
npm run lint     # eslint
```