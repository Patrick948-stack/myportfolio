create extension if not exists pgcrypto;

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('native', 'link')),
  title text not null,
  slug text unique,
  excerpt text not null,
  content_html text,
  cover_image text,
  external_url text,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists articles_status_idx on articles (status, published_at desc);
