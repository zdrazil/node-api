/*
 @name getRatingsByMovieId
 */
SELECT
    round(avg(r.rating))::int AS rating
FROM
    ratings r
WHERE
    movie_id = :movie_id;


/*
 @name getRatingsByMovieAndUserId
 */
SELECT
    round(avg(r.rating), 1),
(
        SELECT
            rating
        FROM
            ratings
        WHERE
            movie_id = :movie_id
            AND user_id = :user_id
        LIMIT 1)
FROM
    ratings r
WHERE
    movie_id = :movie_id;


/*
 @name rateMovie
 */
INSERT INTO ratings(movie_id, user_id, rating)
    VALUES (:movie_id, :user_id, :rating)
ON CONFLICT (movie_id, user_id)
    DO UPDATE SET
        rating = :rating;


/*
 @name deleteRatings
 */
DELETE FROM ratings
WHERE movie_id = :movie_id
    AND user_id = :user_id;


/*
 @name getRatingsForUser
 */
SELECT
    r.rating,
    r.movie_id,
    m.slug
FROM
    ratings r
    INNER JOIN movies m ON r.movie_id = m.id
WHERE
    user_id = :user_id;

