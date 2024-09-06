import { sql } from '../../tooling/sql';
import { Client } from 'pg';

export type RatingRepository = ReturnType<typeof createRatingRepository>;

export function createRatingRepository({ db }: { db: Client }) {
  async function getRatingByMovieId({
    movieId,
  }: {
    movieId: string;
  }): Promise<number> {
    await db.connect();

    const rating = await db.query<{ rating: number }>(
      sql`
        SELECT
          round(avg(r.rating), 1) AS rating
        FROM
          ratings r
        WHERE
          movie_id = $1
      `,
      [movieId],
    );

    await db.end();

    return rating.rows[0]?.rating ?? 0;
  }

  async function getRatingByMovieAndUserId({
    movieId,
    userId,
  }: {
    movieId: string;
    userId: string;
  }): Promise<number> {
    await db.connect();

    const rating = await db.query<{ rating: number }>(
      sql`
        SELECT
          round(avg(r.rating), 1),
          (
            SELECT
              rating
            FROM
              ratings
            WHERE
              movie_id = $1
              AND user_id = $2
            LIMIT
              1
          )
        FROM
          ratings r
        WHERE
          movie_id = $1;
      `,
      [movieId, userId],
    );

    await db.end();

    return rating.rows[0]?.rating ?? 0;
  }

  async function rateMovie({
    movieId,
    rating,
    userId,
  }: {
    movieId: string;
    rating: number;
    userId: string;
  }): Promise<boolean> {
    await db.connect();

    const result = await db.query(
      sql`
        INSERT INTO
          ratings (movie_id, user_id, rating)
        VALUES
          ($1, $2, $3)
        ON CONFLICT (movie_id, user_id) DO
        UPDATE
        SET
          rating = $3
      `,
      [movieId, userId, rating],
    );

    await db.end();

    return (result.rowCount ?? 0) > 0;
  }

  async function deleteRating({
    movieId,
    userId,
  }: {
    movieId: string;
    userId: string;
  }): Promise<boolean> {
    await db.connect();

    const result = await db.query(
      sql`
        DELETE FROM ratings
        WHERE
          movie_id = $1
          AND user_id = $2
      `,
      [movieId, userId],
    );

    await db.end();

    return (result.rowCount ?? 0) > 0;
  }

  async function getRatingsForUser({
    userId,
  }: {
    userId: string;
  }): Promise<MovieRating[]> {
    await db.connect();

    const ratings = await db.query<MovieRating>(
      sql`
        SELECT
          r.rating,
          r.movie_id,
          m.slug
        FROM
          ratings r
          INNER JOIN movies m ON r.movie_id = m.id
        WHERE
          userid = $1
      `,
      [userId],
    );

    await db.end();

    return ratings.rows;
  }

  return {
    deleteRating,
    getRatingByMovieAndUserId,
    getRatingByMovieId,
    getRatingsForUser,
    rateMovie,
  };
}
