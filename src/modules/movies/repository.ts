import { PostgresDb } from '@fastify/postgres';
import { Movie } from './models';
import { sql } from '../../tooling/sql';

export type MovieRepository = ReturnType<typeof createMovieRepository>;

export function createMovieRepository({ db }: { db: PostgresDb }) {
  async function create(movie: Movie): Promise<boolean> {
    const client = await db.connect();

    try {
      await client.query('BEGIN');
      const movieResult = await client.query(
        sql`
          INSERT INTO
            movies (id, slug, title, yearofrelease)
          VALUES
            ($1, $2, $3, $4)
        `,
        [movie.id, movie.slug, movie.title, movie.yearOfRelease],
      );

      if (movieResult.rowCount != null && movieResult.rowCount > 0) {
        for (const genre of movie.genres) {
          await client.query(
            sql`
              INSERT INTO
                genres (movieId, name)
              VALUES
                ($1, $2)
            `,
            [movie.id, genre],
          );
        }
      }

      await client.query('COMMIT');
      client.release();

      return movieResult.rowCount != null && movieResult.rowCount > 0;
    } catch (e) {
      await client.query('ROLLBACK');
      client.release();
      throw e;
    }
  }

  async function getById({
    id,
    userId,
  }: {
    id: string;
    userId: string;
  }): Promise<Movie | undefined> {
    const client = await db.connect();

    const movieResult = await client.query<
      Pick<
        Movie,
        'id' | 'title' | 'yearOfRelease' | 'slug' | 'rating' | 'userRating'
      >
    >(
      sql`
        SELECT
          m.*,
          round(avg(r.rating), 1) AS rating,
          myr.rating AS userrating
        FROM
          movies m
          LEFT JOIN ratings r ON m.id = r.movieid
          LEFT JOIN ratings myr ON m.id = myr.movieid
          AND myr.userid = $2
        WHERE
          id = $1
        GROUP BY
          id,
          userrating;
      `,
      [id, userId],
    );

    const movie = movieResult.rows[0];

    if (!movie) {
      client.release();

      return undefined;
    }

    const genresResult = await client.query<{ name: string }>(
      sql`
        SELECT
          name
        FROM
          genres
        WHERE
          movieId = $1
      `,
      [id],
    );

    const result = {
      ...movie,
      genres: genresResult.rows.map((row) => row.name),
    };

    return result;
  }

  async function getBySlug({
    slug,
    userId,
  }: {
    slug: string;
    userId?: string;
  }): Promise<Movie | undefined> {
    const client = await db.connect();

    const movieResult = await client.query<
      Pick<
        Movie,
        'id' | 'title' | 'yearOfRelease' | 'slug' | 'rating' | 'userRating'
      >
    >(
      sql`
        SELECT
          m.*,
          round(avg(r.rating), 1) AS rating,
          myr.rating AS userrating
        FROM
          movies m
          LEFT JOIN ratings r ON m.id = r.movieid
          LEFT JOIN ratings myr ON m.id = myr.movieid
          AND myr.userid = $2
        WHERE
          slug = $1
        GROUP BY
          id,
          userrating;
      `,
      [slug, userId],
    );

    const movie = movieResult.rows[0];

    if (!movie) {
      client.release();

      return undefined;
    }

    const genresResult = await client.query<{ name: string }>(
      sql`
        SELECT
          name
        FROM
          genres
        WHERE
          movieId = $1
      `,
      [movie.id],
    );

    client.release();

    const result = {
      ...movie,
      genres: genresResult.rows.map((row) => row.name),
    };

    return result;
  }

  async function update({ movie }: { movie: Movie }): Promise<boolean> {
    const client = await db.connect();

    try {
      await client.query('BEGIN');

      // Delete all genres for the movie
      await client.query(
        sql`
          DELETE FROM genres
          WHERE
            movieId = $1;
        `,
        [movie.id],
      );

      // Insert new genres
      for (const genre of movie.genres) {
        await client.query(
          sql`
            INSERT INTO
              genres (movieId, name)
            VALUES
              ($1, $2)
          `,
          [movie.id, genre],
        );
      }

      // Update the movie
      const result = await client.query(
        sql`
          UPDATE movies
          SET
            slug = $1,
            title = $2,
            yearofrelease = $3
          WHERE
            id = $4
        `,
        [movie.slug, movie.title, movie.yearOfRelease, movie.id],
      );

      await client.query('COMMIT');

      client.release();

      return result.rowCount != null && result.rowCount > 0;
    } catch (e) {
      await client.query('ROLLBACK');
      client.release();
      throw e;
    }
  }

  async function deleteById({ id }: { id: string }): Promise<boolean> {
    const client = await db.connect();

    try {
      await client.query('BEGIN');

      // Delete the genres
      await client.query(
        sql`
          DELETE FROM genres
          WHERE
            movieId = $1;
        `,
        [id],
      );

      // Delete ratings
      await client.query(
        sql`
          DELETE FROM ratings
          WHERE
            movieId = $1;
        `,
        [id],
      );

      // Delete the movie
      const result = await client.query(
        sql`
          DELETE FROM movies
          WHERE
            id = $1;
        `,
        [id],
      );

      await client.query('COMMIT');

      client.release();

      return result.rowCount != null && result.rowCount > 0;
    } catch (e) {
      await client.query('ROLLBACK');
      client.release();
      throw e;
    }
  }

  async function existsById({ id }: { id: string }): Promise<boolean> {
    const client = await db.connect();

    // Exists
    const result = await client.query(
      sql`
        SELECT
          count(1)
        FROM
          movies
        WHERE
          id = $1;
      `,
      [id],
    );

    client.release();

    return result.rowCount != null && result.rowCount > 0;
  }

  async function getCount({
    title,
    yearOfRelease,
  }: {
    title?: string;
    yearOfRelease?: number;
  }): Promise<number> {
    const client = await db.connect();

    const result = await client.query(
      sql`
        SELECT
          count(id)
        FROM
          movies
        WHERE
          (
            $1 IS NULL
            OR title LIKE ('%' || $1 || '%')
          )
          AND (
            $2 IS NULL
            OR yearofrelease = $2
          )
      `,
      [title, yearOfRelease],
    );

    client.release();

    return result.rows[0].count;
  }

  return {
    create,
    deleteById,
    existsById,
    getById,
    getBySlug,
    getCount,
    update,
  };
}
