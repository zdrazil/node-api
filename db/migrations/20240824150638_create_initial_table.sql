-- migrate:up
CREATE TABLE IF NOT EXISTS movies (id UUID PRIMARY KEY, slug TEXT NOT NULL, title TEXT NOT NULL, year_of_release INTEGER NOT NULL);

CREATE UNIQUE index if NOT EXISTS idx_movies_slug ON movies USING btree (slug);

CREATE TABLE IF NOT EXISTS genres (movie_id UUID REFERENCES movies (Id), name TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS ratings (user_id UUID, movie_id UUID REFERENCES movies (id), rating INTEGER NOT NULL, PRIMARY KEY (user_id, movie_id));

-- migrate:down
