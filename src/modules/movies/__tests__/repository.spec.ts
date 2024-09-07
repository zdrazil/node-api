import { createDb, startDbEnvironment } from '../../testing/db';
import { StartedDockerComposeEnvironment } from 'testcontainers';
import { Movie } from '../models';
import {
  createMovieRepository,
  MovieRepository,
} from '../repository/repository';
import { randomUUID } from 'crypto';

describe('movies repository', () => {
  const userId = '2ee75e90-f4c6-4de2-8580-300f76fff238';

  const movie: Movie = {
    genres: ['Action', 'Thriller'],
    id: '8f2cdb0e-6a9b-4bbb-a339-e05aa0be5af3',
    rating: 4.5,
    slug: 'movie-1',
    title: 'Movie 1',
    userRating: 4,
    yearOfRelease: 2020,
  };

  let dbEnv: StartedDockerComposeEnvironment;
  let repository: MovieRepository;

  beforeEach(async () => {
    dbEnv = await startDbEnvironment();
    repository = createMovieRepository({ db: createDb });
  });

  afterEach(async () => {
    await dbEnv.down();
  });

  describe('getById', () => {
    it('gets a movie by id', async () => {
      const id = '8f2cdb0e-6a9b-4bbb-a339-e05aa0be5af3';

      const result = await repository.getById({ id, userId });

      const expected: Movie = {
        genres: ['Action', 'Thriller'],
        id: '8f2cdb0e-6a9b-4bbb-a339-e05aa0be5af3',
        rating: 4.5,
        slug: 'movie-1',
        title: 'Movie 1',
        userRating: 4,
        yearOfRelease: 2020,
      };
      expect(result).toEqual(expected);
    });

    it('returns undefined if movie does not exist', async () => {
      const id = randomUUID();
      const userId = randomUUID();

      const result = await repository.getById({ id, userId });

      expect(result).toBeUndefined();
    });
  });

  describe('create', () => {
    it('creates a movie', async () => {
      const movie: Movie = {
        genres: ['genre'],
        id: randomUUID(),
        slug: 'slug',
        title: 'title',
        yearOfRelease: 2021,
      };

      await repository.create(movie);
      const result = await repository.getById({
        id: movie.id,
        userId: randomUUID(),
      });

      expect(result).toEqual({
        ...movie,
        rating: undefined,
        userRating: null,
      });
    });
  });

  describe('getBySlug', () => {
    it('gets a movie by slug', async () => {
      const slug = 'movie-1';

      const result = await repository.getBySlug({ slug, userId });

      const expected: Movie = {
        genres: ['Action', 'Thriller'],
        id: '8f2cdb0e-6a9b-4bbb-a339-e05aa0be5af3',
        rating: 4.5,
        slug: 'movie-1',
        title: 'Movie 1',
        userRating: 4,
        yearOfRelease: 2020,
      };
      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('updates a movie', async () => {
      const updatedMovie = {
        genres: ['Sci-Fi'],
        id: movie.id,
        slug: 'new-movie',
        title: 'New Movie',
        yearOfRelease: 2021,
      };
      await repository.update({
        movie: updatedMovie,
      });

      const result = await repository.getById({ id: movie.id, userId });

      expect(result).toEqual({ ...movie, ...updatedMovie });
    });

    // it('returns null if movie does not exist', async () => {
    //   const result = await repository.update({
    //     movie: { ...movie, id: randomUUID() },
    //   });

    //   expect(result).toBeNull();
    // });
  });

  describe('deleteById', () => {
    it('deletes a movie', async () => {
      const id = movie.id;

      await repository.deleteById({ id });

      const result = await repository.getById({ id, userId });

      expect(result).toBeUndefined();
    });
  });

  describe('existsById', () => {
    it('returns true if movie exists', async () => {
      const id = '8f2cdb0e-6a9b-4bbb-a339-e05aa0be5af3';

      const result = await repository.existsById({ id });

      expect(result).toBe(true);
    });

    it('returns false if movie does not exist', async () => {
      const id = randomUUID();

      const result = await repository.existsById({ id });

      expect(result).toBe(false);
    });
  });

  describe('getAll', () => {
    it('gets movies', async () => {
      const result = await repository.getAll({});

      expect(result[0]).toEqual({
        genres: ['Action', 'Thriller'],
        id: '8f2cdb0e-6a9b-4bbb-a339-e05aa0be5af3',
        rating: 4.5,
        slug: 'movie-1',
        title: 'Movie 1',
        userRating: null,
        yearOfRelease: 2020,
      });
    });

    it('gets user rating', async () => {
      const result = await repository.getAll({ userId });

      expect(result[0]?.userRating).toEqual(4);
    });

    it('filters movies by title', async () => {
      const result = await repository.getAll({ title: 'Movie 1' });

      expect(result).toHaveLength(1);
      expect(result[0]?.title).toContain('Movie 1');
    });

    it('filters movies by year of release', async () => {
      const result = await repository.getAll({ year: 2020 });

      expect(result).toHaveLength(1);
      expect(result[0]?.yearOfRelease).toEqual(2020);
    });
  });

  describe('getAll - paging', () => {
    it('gets first page of movies', async () => {
      const result = await repository.getAll({ page: 1, pageSize: 2 });

      expect(result).toHaveLength(2);
    });

    it('gets second page of movies', async () => {
      const result = await repository.getAll({ page: 2, pageSize: 2 });

      expect(result).toHaveLength(1);
    });

    it('handles empty page', async () => {
      const result = await repository.getAll({ page: 3, pageSize: 2 });

      expect(result).toHaveLength(0);
    });
  });

  describe('getAll - sorting', () => {
    it('sorts movies by title ascending', async () => {
      const result = await repository.getAll({
        page: 1,
        pageSize: 3,
        sortDirection: 'asc',
        sortField: 'title',
      });

      console.log(result);

      expect(result[0]?.title).toBe('Movie 1');
      expect(result[1]?.title).toBe('Movie 2');
      expect(result[2]?.title).toBe('Movie 3');
    });
    it('sorts movies by title descending', async () => {
      const result = await repository.getAll({
        page: 1,
        pageSize: 3,
        sortDirection: 'desc',
        sortField: 'title',
      });

      expect(result[0]?.title).toBe('Movie 3');
      expect(result[1]?.title).toBe('Movie 2');
      expect(result[2]?.title).toBe('Movie 1');
    });

    it('sorts movies by year ascending', async () => {
      const result = await repository.getAll({
        page: 1,
        pageSize: 3,
        sortDirection: 'asc',
        sortField: 'year',
      });

      console.log(result);

      expect(result[0]?.yearOfRelease).toBe(2019);
      expect(result[1]?.yearOfRelease).toBe(2020);
      expect(result[2]?.yearOfRelease).toBe(2021);
    });

    it('sorts movies by year descending', async () => {
      const result = await repository.getAll({
        page: 1,
        pageSize: 3,
        sortDirection: 'desc',
        sortField: 'year',
      });

      expect(result[0]?.yearOfRelease).toBe(2021);
      expect(result[1]?.yearOfRelease).toBe(2020);
      expect(result[2]?.yearOfRelease).toBe(2019);
    });
  });

  describe('getCount', () => {
    it('gets count of movies', async () => {
      const result = await repository.getCount({});

      expect(result).toBe(3);
    });

    it('gets count of movies by title', async () => {
      const result = await repository.getCount({ title: 'Movie 1' });

      expect(result).toBe(1);
    });

    it('gets count of movies by year of release', async () => {
      const result = await repository.getCount({ yearOfRelease: 2020 });

      expect(result).toBe(1);
    });

    it('gets count of movies by title and year of release', async () => {
      const result = await repository.getCount({
        title: 'Movie 1',
        yearOfRelease: 2020,
      });

      expect(result).toBe(1);
    });

    it('returns 0 if no movies exist', async () => {
      const result = await repository.getCount({ title: 'Weird movie' });

      expect(result).toBe(0);
    });
  });
});
