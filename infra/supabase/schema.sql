create extension if not exists vector;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  timezone text default 'America/Chicago',
  preferred_tone text default 'neutral',
  created_at timestamptz default now()
);

create table if not exists brain_dumps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  raw_input text not null,
  input_mode text default 'text',
  energy_level text,
  available_minutes integer,
  processing_status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  source_brain_dump_id uuid references brain_dumps(id),
  title text not null,
  description text,
  status text default 'active',
  category text,
  urgency_score numeric default 0,
  impact_score numeric default 0,
  effort_score numeric default 0,
  priority_score numeric default 0,
  avoidance_count integer default 0,
  is_pinned boolean default false,
  first_step text,
  last_touched_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  embedding vector(1536)
);

create table if not exists daily_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  date date not null default current_date,
  reasoning_summary text,
  estimated_total_minutes integer,
  created_at timestamptz default now()
);

create table if not exists daily_plan_items (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid references daily_plans(id) on delete cascade,
  task_id uuid references tasks(id) on delete cascade,
  first_step text not null,
  position integer default 0,
  created_at timestamptz default now()
);

create table if not exists reflections (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references tasks(id) on delete cascade,
  sentiment text not null check (sentiment in ('easy', 'expected', 'grind')),
  created_at timestamptz default now()
);

create table if not exists task_events (
  id serial primary key,
  task_id uuid references tasks(id) on delete cascade,
  event_type varchar(50) not null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);
