-- Row Level Security policies (enable when Supabase auth is wired)
-- alter table users enable row level security;
-- alter table brain_dumps enable row level security;
-- alter table tasks enable row level security;
-- alter table daily_plans enable row level security;

-- create policy "Users can read own data" on users
--   for select using (auth.uid() = id);

-- create policy "Users can read own dumps" on brain_dumps
--   for select using (auth.uid() = user_id);

-- create policy "Users can insert own dumps" on brain_dumps
--   for insert with check (auth.uid() = user_id);
