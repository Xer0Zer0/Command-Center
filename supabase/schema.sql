create table if not exists public.command_logs (
    id uuid default gen_random_uuid() primary key,
    command text not null,
    status text default 'pending',
    metadata jsonb default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.command_logs enable row level security;

create policy "Allow public command logging" 
on public.command_logs 
for all 
using (true) 
with check (true);
