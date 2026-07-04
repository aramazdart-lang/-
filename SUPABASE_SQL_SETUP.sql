-- Aramazd Art V2 — Supabase setup
-- Run this once in Supabase SQL Editor before testing the final site.

create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  created_at timestamptz default now(),
  full_name text,
  phone text,
  city text,
  address text,
  postal_code text,
  role text default 'customer'
);

create table if not exists orders (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  user_id uuid references auth.users on delete set null,
  product text,
  status text default 'Նոր պատվեր',
  customer_name text,
  phone text,
  price integer,
  deposit_amount integer default 0,
  paid_amount integer default 0,
  payment_status text default 'unpaid',
  tracking_number text,
  admin_note text,
  pdf_url text,
  video_url text,
  details jsonb
);

alter table orders add column if not exists user_id uuid references auth.users on delete set null;
alter table orders add column if not exists deposit_amount integer default 0;
alter table orders add column if not exists paid_amount integer default 0;
alter table orders add column if not exists payment_status text default 'unpaid';
alter table orders add column if not exists tracking_number text;
alter table orders add column if not exists admin_note text;
alter table orders add column if not exists pdf_url text;
alter table orders add column if not exists video_url text;

alter table profiles add column if not exists role text default 'customer';
alter table profiles add column if not exists postal_code text;

create table if not exists contacts (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  name text,
  phone text,
  email text,
  message text
);

-- For testing without complex policies. Later we can enable strict RLS.
alter table profiles disable row level security;
alter table orders disable row level security;
alter table contacts disable row level security;

-- After you register your own account, run this with your real email:
-- update profiles set role = 'admin' where id = (select id from auth.users where email = 'YOUR_EMAIL_HERE');


-- Final workflow additions
alter table orders add column if not exists remaining_amount integer default 0;
alter table orders add column if not exists final_payment_status text default 'Չվճարված';
alter table orders add column if not exists receipt_url text;
alter table orders add column if not exists final_receipt_url text;
alter table orders add column if not exists order_photos jsonb default '[]'::jsonb;
alter table orders add column if not exists recipient_name text;
alter table orders add column if not exists delivery_phone text;
alter table orders add column if not exists delivery_city text;
alter table orders add column if not exists delivery_address text;
alter table orders add column if not exists postal_code text;
alter table orders add column if not exists delivery_note text;
alter table orders add column if not exists delivery_company text;
alter table orders add column if not exists tracking_code text;
alter table orders add column if not exists preview_url text;
alter table orders add column if not exists nfc_url text;

alter table contacts add column if not exists subject text;
alter table contacts add column if not exists status text default 'Չկարդացված';

insert into storage.buckets (id, name, public) values ('order-photos','order-photos',true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('receipts','receipts',true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('pdfs','pdfs',true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('previews','previews',true) on conflict (id) do nothing;

alter table orders disable row level security;
alter table contacts disable row level security;
