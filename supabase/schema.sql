-- Run this once in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default '',
  price numeric(10,2) not null check (price >= 0),
  photo_url text default '',
  available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  customer_name text not null,
  phone text not null,
  pickup_date date not null,
  pickup_time text not null,
  subtotal numeric(10,2) not null default 0,
  booking_fee numeric(10,2) not null default 1,
  total numeric(10,2) not null default 0,
  payment_status text not null default 'pending',
  order_status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid references public.menu_items(id) on delete set null,
  name_snapshot text not null,
  price_snapshot numeric(10,2) not null,
  quantity integer not null check (quantity > 0)
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  provider text not null default 'toyyibpay',
  provider_reference text,
  amount numeric(10,2) not null,
  status text not null default 'pending',
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  subscribed_at timestamptz not null default now()
);

alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.testimonials enable row level security;
alter table public.newsletter_subscribers enable row level security;

create policy "public read available menu" on public.menu_items for select using (available = true);
create policy "authenticated manage menu" on public.menu_items for all to authenticated using (true) with check (true);
create policy "authenticated read orders" on public.orders for select to authenticated using (true);
create policy "authenticated update orders" on public.orders for update to authenticated using (true) with check (true);
create policy "authenticated read order items" on public.order_items for select to authenticated using (true);
create policy "authenticated read payments" on public.payments for select to authenticated using (true);
create policy "public read approved testimonials" on public.testimonials for select using (approved = true);
create policy "authenticated manage testimonials" on public.testimonials for all to authenticated using (true) with check (true);
create policy "public subscribe newsletter" on public.newsletter_subscribers for insert with check (true);
create policy "authenticated read newsletter" on public.newsletter_subscribers for select to authenticated using (true);
