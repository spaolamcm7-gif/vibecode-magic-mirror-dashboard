-- Run this in Supabase SQL Editor or via supabase db push

create extension if not exists "pgcrypto";

create type public.task_section as enum ('today', 'later');

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  completed boolean not null default false,
  section public.task_section not null default 'today',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tasks_user_section_idx on public.tasks (user_id, section);
create index tasks_user_sort_idx on public.tasks (user_id, section, sort_order);

alter table public.tasks enable row level security;

create policy "Users select own tasks"
  on public.tasks for select
  using (auth.uid() = user_id);

create policy "Users insert own tasks"
  on public.tasks for insert
  with check (auth.uid() = user_id);

create policy "Users update own tasks"
  on public.tasks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users delete own tasks"
  on public.tasks for delete
  using (auth.uid() = user_id);
