import { MovieDb, Movie } from './models';
import { sql } from '../../tooling/sql';
import { SortOrder } from '../sortOrder';
import { SortField } from './getAllMovies/schema';
import { Client } from 'pg';
import { objectToCamel } from 'ts-case-convert';
import {
  createGenre,
  createMovie,
  deleteGenres,
  deleteMovie,
  deleteRatings,
  getMovieById,
  getMovieBySlug,
  getMovieCount,
  getMovieGenres,
  movieExists,
  updateMovie,
} from './repository/movies.queries';

const stringToNumber = (str?: string | null) =>
  str != null ? Number(str) : undefined;

export type MovieRepository = ReturnType<typeof createMovieRepository>;

export function createMovieRepository({ db }: { db: () => Promise<Client> }) {
  async function create(movie: Movie): Promise<boolean> {
    const client = await db();
    await client.connect();

    try {
      await client.query('BEGIN');

      await createMovie.run(
        {
          id: movie.id,
          slug: movie.slug,
          title: movie.title,
          year_of_release: movie.yearOfRelease,
        },
        client,
      );

      for (const genre of movie.genres) {
        await createGenre.run({ movie_id: movie.id, name: genre }, client);
      }

      await client.query('COMMIT');
      await client.end();

      return true;
    } catch (e) {
      await client.query('ROLLBACK');
      await client.end();
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
    const client = await db();
    await client.connect();

    const movieResult = await getMovieById.run({ id, user_id: userId }, client);

    const movie = movieResult[0];

    if (!movie) {
      await client.end();

      return undefined;
    }

    const genresResult = await getMovieGenres.run(
      { movie_id: movie.id },
      client,
    );

    await client.end();

    const result: Movie = {
      genres: genresResult.map((row) => row.name),
      ...objectToCamel(movie),
      rating: stringToNumber(movie.rating),
      userRating: movie.user_rating,
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
    const client = await db();
    await client.connect();

    const movieResult = await getMovieBySlug.run(
      { slug, user_id: userId },
      client,
    );

    const movie = movieResult[0];

    if (!movie) {
      await client.end();

      return undefined;
    }

    const genresResult = await getMovieGenres.run(
      { movie_id: movie.id },
      client,
    );

    await client.end();

    const result: Movie = {
      ...objectToCamel(movie),
      genres: genresResult.map((row) => row.name),
      rating: stringToNumber(movie.rating),
      userRating: movie.user_rating,
    };

    return result;
  }

  async function update({
    movie,
  }: {
    movie: Pick<Movie, 'genres' | 'id' | 'title' | 'yearOfRelease' | 'slug'>;
  }): Promise<boolean> {
    const client = await db();
    await client.connect();

    try {
      await client.query('BEGIN');

      await deleteGenres.run({ movie_id: movie.id }, client);

      for (const genre of movie.genres) {
        await createGenre.run({ movie_id: movie.id, name: genre }, client);
      }

      await updateMovie.run(
        {
          id: movie.id,
          slug: movie.slug,
          title: movie.title,
          year_of_release: movie.yearOfRelease,
        },
        client,
      );

      await client.query('COMMIT');

      await client.end();

      return true;
    } catch (e) {
      await client.query('ROLLBACK');
      await client.end();
      throw e;
    }
  }

  async function deleteById({ id }: { id: string }): Promise<boolean> {
    const client = await db();
    await client.connect();

    try {
      await client.query('BEGIN');

      await deleteGenres.run({ movie_id: id }, client);
      await deleteRatings.run({ movie_id: id }, client);
      await deleteMovie.run({ id }, client);

      await client.query('COMMIT');

      await client.end();

      return true;
    } catch (e) {
      await client.query('ROLLBACK');
      await client.end();
      throw e;
    }
  }

  async function existsById({ id }: { id: string }): Promise<boolean> {
    const client = await db();
    await client.connect();

    const result = await movieExists.run({ id }, client);
    await client.end();

    const count = result[0]?.count;

    return count == null ? false : Number(count) > 0;
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
    const client = await db();
    await client.connect();

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

    const result = await client.query<MovieDb>(
      sql`
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
          AND myr.user_id = $1
        WHERE
          (
            $2::TEXT IS NULL
            OR m.title LIKE ('%' || $2 || '%')
          )
          AND (
            $3::INT IS NULL
            OR m.year_of_release = $3
          )
        GROUP BY
          id,
          user_rating ${orderClause}
        LIMIT
          $4::INT
        OFFSET
          $5::INT
      `,
      [userId, title, year, pageSize, pageOffset],
    );

    return result.rows.map(
      (row): Movie => ({
        genres: row.genres.split(','),
        id: row.id,
        rating: stringToNumber(row.rating),
        slug: row.slug,
        title: row.title,
        userRating: stringToNumber(row.user_rating),
        yearOfRelease: Number(row.year_of_release),
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
    const client = await db();
    await client.connect();

    const result = await getMovieCount.run(
      {
        title,
        year_of_release: yearOfRelease,
      },
      client,
    );

    await client.end();

    return stringToNumber(result[0]?.count) ?? 0;
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
