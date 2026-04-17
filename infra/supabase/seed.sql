-- Seed data for local development
insert into users (email, timezone) values
  ('dev@resetera.app', 'America/Chicago')
on conflict (email) do nothing;
