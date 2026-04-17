-- Run this in Supabase → SQL Editor

-- 1. Pro users table
create table if not exists pro_users (
  email text primary key,
  subscription_id text,
  active boolean default true,
  granted_at timestamptz default now()
);

-- 2. Daily usage tracking
create table if not exists daily_usage (
  email text,
  date date,
  uses integer default 0,
  primary key (email, date)
);

-- 3. Saved resets
create table if not exists resets (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  input text not null,
  output text not null,
  created_at timestamptz default now()
);

create index if not exists resets_email_idx on resets(email);

-- 4. Increment function (atomic counter)
create or replace function increment_daily_uses(p_email text, p_date date)
returns void language plpgsql as $$
begin
  insert into daily_usage (email, date, uses)
  values (p_email, p_date, 1)
  on conflict (email, date)
  do update set uses = daily_usage.uses + 1;
end;
$$;

-- 5. Row-level security (keep data private)
alter table pro_users  enable row level security;
alter table daily_usage enable row level security;
alter table resets      enable row level security;

-- Service role bypasses RLS (our server uses service key, so this is fine)
