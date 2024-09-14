import { Movie } from '../models';
import { SortDirection } from '../../api/sortDirection';
import { SortField } from '../restApi/getAllMovies/schema';
import { Client } from 'pg';
import { objectToCamel } from 'ts-case-convert';
import {
  createGenre,
  createMovie,
  deleteGenres,
  deleteMovie,
  deleteRatings,
  getAllMovies,
  getAllMoviesWithCursor,
  getMovieById,
  getMovieBySlug,
  getMovieCount,
  getMovieGenres,
  hasPreviousMoviePage,
  movieExists,
  updateMovie,
} from './movies.queries';

const stringToNumber = (str?: string | null) =>
  str != null ? Number(str) : undefined;

export type MovieRepository = ReturnType<typeof createMovieRepository>;

export function createMovieRepository({ db }: { db: () => Promise<Client> }) {
  async function create({
    movie,
  }: {
    cancellationToken: boolean;
    movie: Pick<Movie, 'id' | 'slug' | 'title' | 'yearOfRelease' | 'genres'>;
  }): Promise<boolean> {
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
    cancellationToken: boolean;
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
    cancellationToken: boolean;
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
    cancellationToken: boolean;
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

  async function deleteById({
    id,
  }: {
    cancellationToken: boolean;
    id: string;
  }): Promise<boolean> {
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

  async function existsById({
    id,
  }: {
    cancellationToken: boolean;
    id: string;
  }): Promise<boolean> {
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
    cancellationToken: boolean;
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
        userRating: movie.user_rating,
      }),
    );
  }

  async function getCount({
    title,
    yearOfRelease,
  }: {
    cancellationToken: boolean;
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

  async function getAllWithCursor({
    after,
    first = 0,
    sortDirection: sortDirection,
    sortField,
    title,
    userId,
    year,
  }: {
    after?: string | null;
    cancellationToken: boolean;
    first: number | null;
    sortDirection?: SortDirection | null;
    sortField?: SortField | null;
    title?: string | null;
    userId?: string | null;
    year?: number | null;
  }) {
    const client = await db();
    await client.connect();

    const firstPlusOne = first + 1;

    const result = await getAllMoviesWithCursor.run(
      {
        after,
        first: firstPlusOne,
        sort_column: sortField,
        sort_direction: sortDirection,
        title,
        user_id: userId,
        year_of_release: year,
      },
      client,
    );

    const firstMovie = result[0];
    const lastMovie = result[result.length - 1];
    const hasPreviousPage =
      firstMovie != null
        ? (
            await hasPreviousMoviePage.run(
              {
                before: firstMovie.id,
                sort_column: sortField,
                sort_direction: sortDirection,
                title,
                user_id: userId,
                year_of_release: year,
              },
              client,
            )
          ).length > 0
        : (
            await getMovieCount.run(
              {
                title,
                year_of_release: year,
              },
              client,
            )
          ).length > 0;

    await client.end();

    const requestedMovies = result.slice(0, first);
    const lasRequestedMovie = requestedMovies[requestedMovies.length - 1];

    const hasNextPage = result.length > first;

    const nodes = result.map(
      (movie): Movie => ({
        ...objectToCamel(movie),
        genres: movie.genres?.split(',') ?? [],
        rating: stringToNumber(movie.rating),
        userRating: movie.user_rating,
      }),
    );

    const edges = nodes.map((node) => ({
      cursor: node.id,
      node,
    }));

    const pageInfo = {
      endCursor: lasRequestedMovie?.id !== after ? lasRequestedMovie?.id : null,
      hasNextPage,
      hasPreviousPage,
      startCursor: firstMovie?.id,
    };

    return {
      edges,
      pageInfo,
    };
  }

  return {
    create,
    deleteById,
    existsById,
    getAll,
    getAllWithCursor,
    getById,
    getBySlug,
    getCount,
    update,
  };
}
