-- ============================================================================
-- NEXUS STORE — Supabase schema
-- Run this ONCE in Supabase Dashboard → SQL Editor → New query.
-- Safe to re-run: uses IF NOT EXISTS everywhere.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,                    -- URL id, matches /product/[slug]
  name text not null,
  type text not null check (type in ('physical', 'digital', 'dropship')),
  category text not null,                       -- one of CATEGORIES ids in lib/products.js
  price numeric not null check (price >= 0),
  original_price numeric,
  stock integer not null default 0,
  sold integer not null default 0,
  rating numeric not null default 5 check (rating >= 0 and rating <= 5),
  flash_sale boolean not null default false,
  is_new boolean not null default false,
  spotlight boolean not null default false,
  description text,
  features jsonb not null default '[]'::jsonb,
  image_url text,
  file_url text,                                -- digital products: private storage path
  created_at timestamptz not null default now()
);

create index if not exists products_category_idx on products (category);
create index if not exists products_slug_idx on products (slug);

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique,
  customer jsonb not null,                      -- { name, email, phone, address }
  items jsonb not null,                         -- [{ productId, name, price, qty, type }]
  subtotal numeric not null default 0,
  total numeric not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'fulfilled', 'cancelled', 'refunded')),
  created_at timestamptz not null default now()
);

create index if not exists orders_status_idx on orders (status);
create index if not exists orders_created_idx on orders (created_at desc);

-- ---------------------------------------------------------------------------
-- Admins allowlist
-- Insert the email(s) that may manage the store. The RLS helper below only
-- grants write access to these emails — registering a random account does
-- NOT grant admin rights. Keep this in sync with your actual admin email(s).
-- ---------------------------------------------------------------------------
create table if not exists admins (
  email text primary key,
  added_at timestamptz not null default now()
);

-- 👇 CHANGE THIS to your real admin email, then run the SQL.
insert into admins (email) values ('admin@nexusstore.ph')
on conflict (email) do nothing;

create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- products:   anyone (even anonymous) can read — it's a public catalog.
--             Only allowlisted admins (see `admins` table) can write.
-- orders:     NO public access at all. Only the server (service role, used by
--             API routes/webhook) and allowlisted admins can read.
-- ---------------------------------------------------------------------------
alter table products enable row level security;
alter table orders enable row level security;

drop policy if exists "public read products" on products;
create policy "public read products"
  on products for select
  using (true);

drop policy if exists "admin insert products" on products;
create policy "admin insert products"
  on products for insert
  with check (is_admin());

drop policy if exists "admin update products" on products;
create policy "admin update products"
  on products for update
  using (is_admin());

drop policy if exists "admin delete products" on products;
create policy "admin delete products"
  on products for delete
  using (is_admin());

drop policy if exists "admin read orders" on orders;
create policy "admin read orders"
  on orders for select
  using (is_admin());

drop policy if exists "admin insert orders" on orders;
create policy "admin insert orders"
  on orders for insert
  with check (is_admin());

-- ---------------------------------------------------------------------------
-- Storage buckets
--   products      → public, product photos
--   digital-files → PRIVATE, the actual Excel templates (served via signed URLs)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('digital-files', 'digital-files', false)
on conflict (id) do nothing;

-- Public read for product images
drop policy if exists "public read product images" on storage.objects;
create policy "public read product images"
  on storage.objects for select
  using (bucket_id = 'products');

-- Allowlisted admin can upload product images
drop policy if exists "admin upload product images" on storage.objects;
create policy "admin upload product images"
  on storage.objects for insert
  with check (bucket_id = 'products' and is_admin());

-- Allowlisted admin can upload digital files
drop policy if exists "admin upload digital files" on storage.objects;
create policy "admin upload digital files"
  on storage.objects for insert
  with check (bucket_id = 'digital-files' and is_admin());
