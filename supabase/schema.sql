create table if not exists public.projects (
  id bigint primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.clients (
  id bigint primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.account_settings (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;
alter table public.clients enable row level security;
alter table public.account_settings enable row level security;

grant select, insert, update, delete on table public.projects to anon;
grant select, insert, update, delete on table public.clients to anon;
grant select, insert, update, delete on table public.account_settings to anon;

drop policy if exists "demo projects access" on public.projects;
drop policy if exists "demo clients access" on public.clients;
drop policy if exists "demo settings access" on public.account_settings;

create policy "demo projects access" on public.projects for all to anon using (true) with check (true);
create policy "demo clients access" on public.clients for all to anon using (true) with check (true);
create policy "demo settings access" on public.account_settings for all to anon using (true) with check (true);
