import { PostgresDb } from '@fastify/postgres';
import { Movie } from './models';
import { sql } from '../../tooling/sql';

export type MovieRepository = ReturnType<typeof createMovieRepository>;

export function createMovieRepository({ db }: { db: PostgresDb }) {
  async function create(movie: Movie): Promise<boolean> {
    const transactionResult = await db.transact(async (client) => {
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
        movie.genres.forEach(async (genre) => {
          await client.query(
            sql`
              INSERT INTO
                genres (movieId, name)
              VALUES
                ($1, $2)
            `,
            [movie.id, genre],
          );
        });
      }

      return movieResult.rowCount != null && movieResult.rowCount > 0;
    });

    return transactionResult;
  }

  async function getById({
    id,
    userId,
  }: {
    id: string;
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
          ROUND(AVG(r.rating), 1) AS rating,
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
          ROUND(AVG(r.rating), 1) AS rating,
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

    const result = {
      ...movie,
      genres: genresResult.rows.map((row) => row.name),
    };

    return result;
  }

  async function update({
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
          ROUND(AVG(r.rating), 1) AS rating,
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

    const result = {
      ...movie,
      genres: genresResult.rows.map((row) => row.name),
    };

    return result;
  }

  return { create, getById, getBySlug };
}
