import { PostgresDb } from '@fastify/postgres';
import { sql } from '../../tooling/sql';

export type RatingRepository = ReturnType<typeof createRatingRepository>;

export function createRatingRepository({ db }: { db: PostgresDb }) {
  async function getRatingByMovieId({
    movieId,
  }: {
    movieId: string;
  }): Promise<number> {
    const client = await db.connect();

    const rating = await client.query<{ rating: number }>(
      sql`
        SELECT
          round(avg(r.rating), 1) AS rating
        FROM
          ratings r
        WHERE
          movieid = $1
      `,
      [movieId],
    );

    client.release();

    return rating.rows[0]?.rating ?? 0;
  }

  async function getRatingByMovieAndUserId({
    movieId,
    userId,
  }: {
    movieId: string;
    userId: string;
  }): Promise<number> {
    const client = await db.connect();

    const rating = await client.query<{ rating: number }>(
      sql`
        SELECT
          round(avg(r.rating), 1),
          (
            SELECT
              rating
            FROM
              ratings
            WHERE
              movieid = $1
              AND userid = $2
            LIMIT
              1
          )
        FROM
          ratings r
        WHERE
          movieid = $1;
      `,
      [movieId, userId],
    );

    client.release();

    return rating.rows[0]?.rating ?? 0;
  }

  async function createRating({
    movieId,
    userId,
    rating,
  }: {
    movieId: string;
    userId: string;
    rating: number;
  }): Promise<boolean> {
    const client = await db.connect();

    const result = await client.query(
      sql`
        INSERT INTO
          ratings (movieid, userid, rating)
        VALUES
          ($1, $2, $3)
        ON CONFLICT (movieid, userid) DO
        UPDATE
        SET
          rating = $3
      `,
      [movieId, userId, rating],
    );

    client.release();

    return (result.rowCount ?? 0) > 0;
  }

  async function deleteRating({
    movieId,
    userId,
  }: {
    movieId: string;
    userId: string;
  }): Promise<boolean> {
    const client = await db.connect();

    const result = await client.query(
      sql`
        DELETE FROM ratings
        WHERE
          movieid = $1
          AND userid = $2
      `,
      [movieId, userId],
    );

    client.release();

    return (result.rowCount ?? 0) > 0;
  }

  async function getRatingsForUser({
    userId,
  }: {
    userId: string;
  }): Promise<Rating[]> {
    const client = await db.connect();

    const ratings = await client.query<Rating>(
      sql`
        SELECT
          r.rating,
          r.movieid,
          m.slug
        FROM
          ratings r
          INNER JOIN movies m ON r.movieid = m.id
        WHERE
          userid = $1
      `,
      [userId],
    );

    client.release();

    return ratings.rows;
  }

  return {
    getRatingByMovieId,
    getRatingByMovieAndUserId,
    createRating,
    deleteRating,
    getRatingsForUser,
  };
}
