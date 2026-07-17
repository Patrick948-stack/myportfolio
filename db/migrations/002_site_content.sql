create table if not exists site_content (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
