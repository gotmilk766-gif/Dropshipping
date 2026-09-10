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
| Admin panel | `/admin` → demo PIN **`admin123`** (or Supabase email login once connected) → add a product → it appears on the homepage |

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
2. In **SQL Editor → New query**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql) and run it. It creates the `products` and `orders` tables, all RLS policies, and both storage buckets (`products` public, `digital-files` private). Safe to re-run.
3. Copy `.env.example` → `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Dashboard → Project Settings → API)
   - `SUPABASE_SERVICE_ROLE_KEY` (same page — **server-only**, never expose to the browser)
4. Enable **Authentication → Email** (leave "Confirm email" on) and create your admin user under **Authentication → Users → Add user**.
5. **Lock down who counts as an admin:** the schema's `admins` table is an allowlist — RLS grants write access only to emails in it. Edit the `insert into admins (email) values ('admin@nexusstore.ph')` line in `supabase/schema.sql` to your real email **before running it**, or add rows later from the Table Editor. Anyone who registers but isn't in the allowlist can read the catalog but can never publish products or view orders.

**Admin login:** with keys configured, `/admin` shows a real email/password sign-in (Supabase Auth sessions). The demo PIN is used only when Supabase is not configured. Signed-in admins publish products straight into the `products` table and see live Stripe orders on the dashboard.

That's it — no code changes needed. The data layer switches on automatically:

| What | Where | Behavior without keys | With keys |
| --- | --- | --- | --- |
| Catalog | `GET /api/products` | demo catalog | reads `products` table |
| Checkout prices | `app/api/checkout` | demo catalog (still server-resolved) | reads `products` table — client-sent prices are **always ignored** |
| Order records | `app/api/webhook` | not configured | inserts into `orders` on `checkout.session.completed` |

If a Supabase read ever fails (e.g. schema not run yet), the API routes degrade to the demo catalog instead of showing an empty store.

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