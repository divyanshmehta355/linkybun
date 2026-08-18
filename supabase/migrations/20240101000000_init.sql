create table public.profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  bio text,
  avatar_url text,
  is_pro boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.links (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) not null,
  title text not null,
  url text not null,
  position int not null,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.clicks (
  id uuid default gen_random_uuid() primary key,
  link_id uuid references public.links(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  referrer text
);

alter table public.profiles enable row level security;
alter table public.links enable row level security;
alter table public.clicks enable row level security;

-- Profiles policies
create policy "Profiles are publicly readable"
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

create policy "Users can delete own profile"
  on public.profiles for delete
  using ( auth.uid() = id );

-- Links policies
create policy "Links are publicly readable"
  on public.links for select
  using ( true );

create policy "Users can insert own links"
  on public.links for insert
  with check ( auth.uid() = profile_id );

create policy "Users can update own links"
  on public.links for update
  using ( auth.uid() = profile_id );

create policy "Users can delete own links"
  on public.links for delete
  using ( auth.uid() = profile_id );

-- Clicks policies
create policy "Anyone can insert clicks"
  on public.clicks for insert
  with check ( true );

create policy "Users can read clicks on their links"
  on public.clicks for select
  using ( exists (
    select 1 from public.links
    where public.links.id = public.clicks.link_id
    and public.links.profile_id = auth.uid()
  ) );
