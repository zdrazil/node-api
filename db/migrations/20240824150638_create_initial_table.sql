-- migrate:up
CREATE TABLE IF NOT EXISTS movies(
    id uuid PRIMARY KEY,
    slug text NOT NULL,
    title text NOT NULL,
    year_of_release integer NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_movies_slug ON movies USING btree(slug);

CREATE TABLE IF NOT EXISTS genres(
    movie_id uuid REFERENCES movies(Id),
    name text NOT NULL
);

CREATE TABLE IF NOT EXISTS ratings(
    user_id uuid,
    movie_id uuid REFERENCES movies(id),
    rating integer NOT NULL,
    PRIMARY KEY (user_id, movie_id)
);

-- migrate:down
