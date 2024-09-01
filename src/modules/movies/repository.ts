import { PostgresDb } from '@fastify/postgres';
import { Movie } from './models';
import { sql } from '../../tooling/sql';
import { SortOrder } from '../sortOrder';
import { SortField } from './getAllMovies/schema';

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

  async function getAll({
    page = 1,
    pageSize = 1,
    sortField,
    sortOrder,
    title,
    userId,
    year,
  }: {
    page?: number;
    pageSize?: number;
    sortField?: SortField;
    sortOrder?: SortOrder;
    title?: string;
    userId?: string;
    year?: number;
  }) {
    const client = await db.connect();

    const orderClause =
      sortField != null
        ? sql`
            ,
            m.${sortField}
            ORDER BY
              m.${sortField} ${sortOrder === 'asc' ? 'asc' : 'desc'}
          `
        : '';

    const pageOffset = (page - 1) * pageSize;

    const result = await client.query<{
      genres: string;
      id: string;
      rating: string;
      slug: string;
      title: string;
      userrating: string;
      yearofrelease: string;
    }>(
      sql`
        SELECT m.*,
              string_agg(DISTINCT g.name, ',') AS genres,
              round(avg(r.rating), 1) AS rating,
              myr.rating AS userrating
        FROM movies m
        LEFT JOIN genres g ON m.id = g.movieid
        LEFT JOIN ratings r ON m.id = r.movieid
        LEFT JOIN ratings myr ON m.id = myr.movieid
        AND myr.userid = $1
        WHERE ($title IS NULL
              OR m.title like ('%' || $2 || '%'))
          AND ($3 IS NULL
              OR m.yearofrelease = $3)
        GROUP BY id,
                userrating ${orderClause}
        LIMIT $4
        OFFSET $5
      `,
      [userId, title, year, pageSize, pageOffset, orderClause],
    );

    return result.rows.map(
      (row): Movie => ({
        genres: row.genres.split(','),
        id: row.id,
        rating: Number(row.rating),
        slug: row.slug,
        title: row.title,
        userRating: Number(row.userrating),
        yearOfRelease: Number(row.yearofrelease),
      }),
    );
  }

  async function getCount({
    title,
    yearOfRelease,
  }: {
    title?: string;
    yearOfRelease?: number;
  }): Promise<number> {
    const client = await db.connect();

    const result = await client.query<{ count: number }>(
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

    return result.rows[0]?.count ?? 0;
  }

  return {
    create,
    deleteById,
    existsById,
    getAll,
    getById,
    getBySlug,
    getCount,
    update,
  };
}
