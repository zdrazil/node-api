import { createDb, startDbEnvironment } from '../../testing/db';
import { StartedDockerComposeEnvironment } from 'testcontainers';
import { Movie } from '../models';
import { createMovieRepository, MovieRepository } from '../repository';
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

  beforeAll(async () => {
    dbEnv = await startDbEnvironment();
    repository = createMovieRepository({ db: createDb });
  });

  afterAll(async () => {
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
        rating: null,
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
    it('gets all movies', async () => {
      const result = await repository.getAll({ userId });

      expect(result).toEqual([
        {
          genres: ['Action', 'Thriller'],
          id: '8f2cdb0e-6a9b-4bbb-a339-e05aa0be5af3',
          rating: 4.5,
          slug: 'movie-1',
          title: 'Movie 1',
          userRating: 4,
          yearOfRelease: 2020,
        },
      ]);
    });

    it('returns empty array if no movies exist', async () => {
      const result = await repository.getAll({ userId: randomUUID() });

      expect(result).toEqual([]);
    });
  });
});
