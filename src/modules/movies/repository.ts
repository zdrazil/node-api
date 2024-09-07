import { MovieDb, Movie } from './models';
import { sql } from '../../tooling/sql';
import { SortDirection } from '../sortDirection';
import { SortField } from './getAllMovies/schema';
import { Client } from 'pg';
import { objectToCamel } from 'ts-case-convert';
import {
  createGenre,
  createMovie,
  deleteGenres,
  deleteMovie,
  deleteRatings,
  getAllMovies,
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
    sortDirection: sortDirection,
    sortField,
    title,
    userId,
    year,
  }: {
    page?: number;
    pageSize?: number;
    sortDirection?: SortDirection;
    sortField?: SortField;
    title?: string;
    userId?: string;
    year?: number;
  }) {
    const client = await db();
    await client.connect();

    const pageOffset = (page - 1) * pageSize;

    const result = await getAllMovies.run(
      {
        page_offset: pageOffset,
        page_size: pageSize,
        sort_column: sortField,
        sort_direction: sortDirection,
        title,
        user_id: userId,
        year_of_release: year,
      },
      client,
    );

    await client.end();

    return result.map(
      (movie): Movie => ({
        ...objectToCamel(movie),
        genres: movie.genres?.split(',') ?? [],
        rating: stringToNumber(movie.rating),
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
