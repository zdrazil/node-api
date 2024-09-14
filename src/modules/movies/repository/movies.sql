/*
 @name createMovie
 */
INSERT INTO movies(id, slug, title, year_of_release)
    VALUES (:id, :slug, :title, :year_of_release);


/*
 @name createGenre
 */
INSERT INTO genres(movie_id, name)
    VALUES (:movie_id, :name);


/*
 @name getMovieById
 */
SELECT
    m.*,
    round(avg(r.rating), 1) AS rating,
    myr.rating AS user_rating
FROM
    movies m
    LEFT JOIN ratings r ON m.id = r.movie_id
    LEFT JOIN ratings myr ON m.id = myr.movie_id
        AND myr.user_id = :user_id
WHERE
    id = :id
GROUP BY
    id,
    user_rating;


/*
 @name getMovieGenres
 */
SELECT
    name
FROM
    genres
WHERE
    movie_id = :movie_id;


/*
 @name getMovieBySlug
 */
SELECT
    m.*,
    round(avg(r.rating), 1) AS rating,
    myr.rating AS user_rating
FROM
    movies m
    LEFT JOIN ratings r ON m.id = r.movie_id
    LEFT JOIN ratings myr ON m.id = myr.movie_id
        AND myr.user_id = :user_id
WHERE
    slug = :slug
GROUP BY
    id,
    user_rating;


/*
 @name deleteGenres
 */
DELETE FROM genres
WHERE movie_id = :movie_id;


/*
 @name updateMovie
 */
UPDATE
    movies
SET
    slug = :slug,
    title = :title,
    year_of_release = :year_of_release
WHERE
    id = :id;


/*
 @name deleteRatings
 */
DELETE FROM ratings
WHERE movie_id = :movie_id;


/*
 @name deleteMovie
 */
DELETE FROM movies
WHERE id = :id;


/*
 @name movieExists
 */
SELECT
    count(1)
FROM
    movies
WHERE
    id = :id;


/*
 @name getMovieCount
 */
SELECT
    count(id)
FROM
    movies
WHERE (:title::text IS NULL
    OR title LIKE ('%' || :title || '%'))
AND (:year_of_release::integer IS NULL
    OR year_of_release = :year_of_release);


/*
 @name getAllMovies
 */
SELECT
    m.*,
    string_agg(DISTINCT g.name, ',') AS genres,
    round(avg(r.rating), 1) AS rating,
    myr.rating AS user_rating
FROM
    movies m
    LEFT JOIN genres g ON m.id = g.movie_id
    LEFT JOIN ratings r ON m.id = r.movie_id
    LEFT JOIN ratings myr ON m.id = myr.movie_id
        AND myr.user_id = :user_id
WHERE (:title::text IS NULL
    OR m.title LIKE ('%' || :title || '%'))
AND (:year_of_release::int IS NULL
    OR m.year_of_release = :year_of_release)
GROUP BY
    id,
    user_rating,
    m.title,
    m.year_of_release
ORDER BY
    (
        CASE WHEN :sort_column = 'title'
            AND :sort_direction = 'asc' THEN
            m.title
        END) ASC,
(
        CASE WHEN :sort_column = 'title'
            AND :sort_direction = 'desc' THEN
            m.title
        END) DESC,
(
        CASE WHEN :sort_column = 'year'
            AND :sort_direction = 'asc' THEN
            m.year_of_release
        END) ASC,
(
        CASE WHEN :sort_column = 'year'
            AND :sort_direction = 'desc' THEN
            m.year_of_release
        END) DESC
LIMIT :page_size::int OFFSET :page_offset::int;


/*
 @name getAllMoviesWithCursor
 */
SELECT
    m.*,
    string_agg(DISTINCT g.name, ',') AS genres,
    round(avg(r.rating), 1) AS rating,
    myr.rating AS user_rating
FROM
    movies m
    LEFT JOIN genres g ON m.id = g.movie_id
    LEFT JOIN ratings r ON m.id = r.movie_id
    LEFT JOIN ratings myr ON m.id = myr.movie_id
        AND myr.user_id = :user_id
WHERE (:title::text IS NULL
    OR m.title LIKE ('%' || :title || '%'))
AND (:year_of_release::int IS NULL
    OR m.year_of_release = :year_of_release)
AND (:after::uuid IS NULL
    OR m.id > :after)
GROUP BY
    id,
    user_rating,
    m.title,
    m.year_of_release
ORDER BY
    (
        CASE WHEN :sort_column = 'title'
            AND :sort_direction = 'asc' THEN
            m.title
        END) ASC,
(
        CASE WHEN :sort_column = 'title'
            AND :sort_direction = 'desc' THEN
            m.title
        END) DESC,
(
        CASE WHEN :sort_column = 'year'
            AND :sort_direction = 'asc' THEN
            m.year_of_release
        END) ASC,
(
        CASE WHEN :sort_column = 'year'
            AND :sort_direction = 'desc' THEN
            m.year_of_release
        END) DESC,
    m.id ASC
LIMIT :first;


/*
 @name hasPreviousMoviePage
 */
SELECT
    m.*,
    string_agg(DISTINCT g.name, ',') AS genres,
    round(avg(r.rating), 1) AS rating,
    myr.rating AS user_rating
FROM
    movies m
    LEFT JOIN genres g ON m.id = g.movie_id
    LEFT JOIN ratings r ON m.id = r.movie_id
    LEFT JOIN ratings myr ON m.id = myr.movie_id
        AND myr.user_id = :user_id
WHERE (:title::text IS NULL
    OR m.title LIKE ('%' || :title || '%'))
AND (:year_of_release::int IS NULL
    OR m.year_of_release = :year_of_release)
AND (:before::uuid IS NULL
    OR m.id < :before)
GROUP BY
    id,
    user_rating,
    m.title,
    m.year_of_release
ORDER BY
    (
        CASE WHEN :sort_column = 'title'
            AND :sort_direction = 'asc' THEN
            m.title
        END) ASC,
(
        CASE WHEN :sort_column = 'title'
            AND :sort_direction = 'desc' THEN
            m.title
        END) DESC,
(
        CASE WHEN :sort_column = 'year'
            AND :sort_direction = 'asc' THEN
            m.year_of_release
        END) ASC,
(
        CASE WHEN :sort_column = 'year'
            AND :sort_direction = 'desc' THEN
            m.year_of_release
        END) DESC,
    m.id ASC
LIMIT 1;

