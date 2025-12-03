-- Create Dreams Table
create table dreams (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  content text not null,
  date timestamp with time zone not null,
  type text not null,
  sentiment float not null,
  clarity int not null,
  tags text[] default '{}',
  created_at timestamp with time zone default now()
);

-- Create Characters Table
create table characters (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  relationship text not null,
  description text not null,
  appearances int default 1,
  first_appearance timestamp with time zone not null,
  created_at timestamp with time zone default now()
);

-- Create Locations Table
create table locations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  description text not null,
  appearances int default 1,
  created_at timestamp with time zone default now()
);

-- Create Junction Tables for Many-to-Many relationships
create table dream_characters (
  dream_id uuid references dreams(id) on delete cascade,
  character_id uuid references characters(id) on delete cascade,
  primary key (dream_id, character_id)
);

create table dream_locations (
  dream_id uuid references dreams(id) on delete cascade,
  location_id uuid references locations(id) on delete cascade,
  primary key (dream_id, location_id)
);

-- Enable Row Level Security (RLS)
alter table dreams enable row level security;
alter table characters enable row level security;
alter table locations enable row level security;
alter table dream_characters enable row level security;
alter table dream_locations enable row level security;

-- Create Policies
-- Dreams
create policy "Users can view their own dreams" on dreams
  for select using (auth.uid() = user_id);

create policy "Users can insert their own dreams" on dreams
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own dreams" on dreams
  for update using (auth.uid() = user_id);

create policy "Users can delete their own dreams" on dreams
  for delete using (auth.uid() = user_id);

-- Characters
create policy "Users can view their own characters" on characters
  for select using (auth.uid() = user_id);

create policy "Users can insert their own characters" on characters
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own characters" on characters
  for update using (auth.uid() = user_id);

create policy "Users can delete their own characters" on characters
  for delete using (auth.uid() = user_id);

-- Locations
create policy "Users can view their own locations" on locations
  for select using (auth.uid() = user_id);

create policy "Users can insert their own locations" on locations
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own locations" on locations
  for update using (auth.uid() = user_id);

create policy "Users can delete their own locations" on locations
  for delete using (auth.uid() = user_id);

-- Junction Tables (Access depends on related items, but for simplicity we can check if the user owns the related items or just allow if they are authenticated and the IDs match items they own. 
-- A simpler approach for junction tables in this context is to allow all authenticated users to insert/select, 
-- but since we want strict isolation, we should check ownership of the parent items.
-- However, standard RLS on junction tables can be complex. 
-- Let's assume if you can see the dream, you can see its connections.)

create policy "Users can view dream_characters if they own the dream" on dream_characters
  for select using (
    exists (select 1 from dreams where id = dream_characters.dream_id and user_id = auth.uid())
  );

create policy "Users can insert dream_characters if they own the dream" on dream_characters
  for insert with check (
    exists (select 1 from dreams where id = dream_characters.dream_id and user_id = auth.uid())
  );
  
create policy "Users can delete dream_characters if they own the dream" on dream_characters
  for delete using (
    exists (select 1 from dreams where id = dream_characters.dream_id and user_id = auth.uid())
  );

create policy "Users can view dream_locations if they own the dream" on dream_locations
  for select using (
    exists (select 1 from dreams where id = dream_locations.dream_id and user_id = auth.uid())
  );

create policy "Users can insert dream_locations if they own the dream" on dream_locations
  for insert with check (
    exists (select 1 from dreams where id = dream_locations.dream_id and user_id = auth.uid())
  );

create policy "Users can delete dream_locations if they own the dream" on dream_locations
  for delete using (
    exists (select 1 from dreams where id = dream_locations.dream_id and user_id = auth.uid())
  );
