create table if not exists public.orders (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  customer_name text not null,
  social_link text not null,
  packages text[] not null,
  package_count integer not null check (package_count > 0),
  total_cents integer not null check (total_cents > 0),
  currency text not null default 'usd',
  status text not null default 'checkout_started' check (
    status in (
      'checkout_started',
      'paid',
      'cancelled',
      'processing',
      'completed'
    )
  ),
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text
);

alter table public.orders enable row level security;

revoke all on public.orders from anon;
revoke all on public.orders from authenticated;
