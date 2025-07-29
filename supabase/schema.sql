create table users (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  password text not null unique
);

create table lessons (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  date timestamptz not null
);

create table lesson_completions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  lesson_id uuid references lessons(id),
  completed_at timestamptz default now(),
  unique (user_id, lesson_id)
);


-- -- Drop existing tables (in order of foreign key dependency)
-- drop table if exists lesson_completions;
-- drop table if exists lessons;
-- drop table if exists users;

-- -- Recreate the users table
-- create table users (
--   id uuid primary key default uuid_generate_v4(),
--   email text not null unique,
--   password text not null  -- Removed UNIQUE constraint for passwords
-- );

-- -- Recreate the lessons table
-- create table lessons (
--   id uuid primary key default uuid_generate_v4(),
--   title text not null,
--   date timestamptz not null
-- );

-- -- Recreate the lesson_completions table
-- create table lesson_completions (
--   id uuid primary key default uuid_generate_v4(),
--   user_id uuid not null references users(id),
--   lesson_id uuid not null references lessons(id),
--   completed boolean default false,
--   completed_at timestamptz default now(),
--   unique (user_id, lesson_id)
-- );
