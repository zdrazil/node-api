-- migrate:up
create table if not exists movies (
  id UUID primary key,
  slug TEXT not null,
  title TEXT not null,
  yearofrelease integer not null
);

create unique index if not exists idx_movies_slug on movies using btree (slug);

create table if not exists genres (
  movieId UUID references movies (Id),
  name TEXT not null
);

create table if not exists ratings (
  userid uuid,
  movieid uuid references movies (id),
  rating integer not null,
  primary key (userid, movieid)
);

-- migrate:down
