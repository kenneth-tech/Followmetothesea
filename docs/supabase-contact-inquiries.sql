create table if not exists public.contact_inquiries (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null,
  country text not null,
  phone text not null,
  email text not null,
  message text not null,
  status text not null default 'new' check (
    status in (
      'new',
      'processing',
      'responded',
      'closed'
    )
  )
);

alter table public.contact_inquiries enable row level security;

revoke all on public.contact_inquiries from anon;
revoke all on public.contact_inquiries from authenticated;
