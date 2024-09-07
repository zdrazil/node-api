import { clearTables, createDb, startDbEnvironment } from '../../../testing/db';
import { StartedDockerComposeEnvironment } from 'testcontainers';
import { Movie } from '../../models';
import { createMovieRepository, MovieRepository } from '../repository';
import { randomUUID } from 'crypto';
import {
  createRatingRepository,
  RatingRepository,
} from '../../../ratings/repository/repository';

const cancellationToken = false;

const movie1: Movie = {
  genres: ['Action', 'Thriller'],
  id: '8f2cdb0e-6a9b-4bbb-a339-e05aa0be5af3',
  rating: 4,
  slug: 'movie-1',
  title: 'Movie 1',
  userRating: 4,
  yearOfRelease: 2019,
};

const movie2: Movie = {
  genres: ['Comedy'],
  id: 'f6b3b6e7-3d1e-4f4f-8b4f-2b3f6c4b6e9a',
  rating: 3,
  slug: 'movie-2',
  title: 'Movie 2',
  userRating: 3,
  yearOfRelease: 2020,
};

describe('movies repository', () => {
  const userId = '2ee75e90-f4c6-4de2-8580-300f76fff238';

  let dbEnv: StartedDockerComposeEnvironment;
  let movieRepository: MovieRepository;
  let ratingRepository: RatingRepository;

  beforeAll(async () => {
    dbEnv = await startDbEnvironment();
    movieRepository = createMovieRepository({ db: createDb });
    ratingRepository = createRatingRepository({ db: createDb });
  });

  afterEach(async () => {
    await clearTables();
  });

  afterAll(async () => {
    await dbEnv.down();
  });

  const prepareMovie = async (movie: Movie) => {
    const { genres, id, slug, title, userRating, yearOfRelease } = movie;
    await movieRepository.create({
      cancellationToken,
      movie: { genres, id, slug, title, yearOfRelease },
    });

    if (userRating != null) {
      await ratingRepository.rateMovie({
        cancellationToken,
        movieId: id,
        rating: userRating,
        userId,
      });
    }

    return movie;
  };

  describe('create', () => {
    it('creates a movie', async () => {
      const movie: Movie = {
        genres: ['genre'],
        id: randomUUID(),
        slug: 'slug',
        title: 'title',
        yearOfRelease: 2021,
      };

      await prepareMovie(movie);

      const result = await movieRepository.getById({
        cancellationToken,
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

  describe('getById', () => {
    it('gets a movie by id', async () => {
      const movie = await prepareMovie(movie1);
      const { id } = movie;

      const result = await movieRepository.getById({
        cancellationToken,
        id,
        userId,
      });

      expect(result).toEqual(movie);
    });

    it('gets a movie by id without userId', async () => {
      const movie = await prepareMovie(movie1);
      const { slug } = movie;

      const result = await movieRepository.getBySlug({
        cancellationToken,
        slug,
        userId: undefined,
      });

      expect(result).toEqual({ ...movie, userRating: null });
    });

    it('returns undefined if movie does not exist', async () => {
      const id = randomUUID();
      const userId = randomUUID();

      const result = await movieRepository.getById({
        cancellationToken,
        id,
        userId,
      });

      expect(result).toBeUndefined();
    });
  });

  describe('getBySlug', () => {
    it('gets a movie by slug', async () => {
      const movie = await prepareMovie(movie1);
      const { slug } = movie;

      const result = await movieRepository.getBySlug({
        cancellationToken,
        slug,
        userId,
      });

      expect(result).toEqual(movie);
    });

    it('gets a movie by slug without userId', async () => {
      const movie = await prepareMovie(movie1);
      const { slug } = movie;

      const result = await movieRepository.getBySlug({
        cancellationToken,
        slug,
        userId: undefined,
      });

      expect(result).toEqual({ ...movie, userRating: null });
    });
  });

  describe('update', () => {
    it('updates a movie', async () => {
      const movie = await prepareMovie(movie1);

      const updatedMovie = {
        genres: ['Sci-Fi'],
        id: movie.id,
        slug: 'new-movie',
        title: 'New Movie',
        yearOfRelease: 2021,
      };
      await movieRepository.update({
        cancellationToken,
        movie: updatedMovie,
      });

      const result = await movieRepository.getById({
        cancellationToken,
        id: movie1.id,
        userId,
      });

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
      const movie = await prepareMovie(movie1);
      const { id } = movie;

      await movieRepository.deleteById({ cancellationToken, id });

      const result = await movieRepository.getById({
        cancellationToken,
        id,
        userId,
      });

      expect(result).toBeUndefined();
    });
  });

  describe('existsById', () => {
    it('returns true if movie exists', async () => {
      const movie = await prepareMovie(movie1);
      const { id } = movie;

      const result = await movieRepository.existsById({
        cancellationToken,
        id,
      });

      expect(result).toBe(true);
    });

    it('returns false if movie does not exist', async () => {
      const id = randomUUID();

      const result = await movieRepository.existsById({
        cancellationToken,
        id,
      });

      expect(result).toBe(false);
    });
  });

  describe('getAll', () => {
    it('gets movies', async () => {
      const movie = await prepareMovie(movie1);

      const result = await movieRepository.getAll({
        cancellationToken,
        userId,
      });

      expect(result[0]).toEqual(movie);
    });

    it('filters movies by title', async () => {
      await prepareMovie(movie1);
      await prepareMovie(movie2);

      const result = await movieRepository.getAll({
        cancellationToken,
        title: movie1.title,
      });

      expect(result).toHaveLength(1);
      expect(result[0]?.title).toContain(movie1.title);
    });

    it('filters movies by year of release', async () => {
      await prepareMovie(movie1);
      await prepareMovie(movie2);

      const result = await movieRepository.getAll({
        cancellationToken,
        year: movie1.yearOfRelease,
      });

      expect(result).toHaveLength(1);
      expect(result[0]?.yearOfRelease).toEqual(movie1.yearOfRelease);
    });
  });

  describe('getAll - paging', () => {
    it('gets first page of movies', async () => {
      await prepareMovie(movie1);
      await prepareMovie(movie2);

      const result = await movieRepository.getAll({
        cancellationToken,
        page: 1,
        pageSize: 1,
      });

      expect(result).toHaveLength(1);
    });

    it('gets second page of movies', async () => {
      await prepareMovie(movie1);
      await prepareMovie(movie2);

      const result = await movieRepository.getAll({
        cancellationToken,
        page: 2,
        pageSize: 1,
      });

      expect(result).toHaveLength(1);
    });

    it('handles empty page', async () => {
      await prepareMovie(movie1);

      const result = await movieRepository.getAll({
        cancellationToken,
        page: 3,
        pageSize: 1,
      });

      expect(result).toHaveLength(0);
    });
  });

  describe('getAll - sorting', () => {
    it('sorts movies by title ascending', async () => {
      await prepareMovie(movie2);
      await prepareMovie(movie1);

      const result = await movieRepository.getAll({
        cancellationToken,
        page: 1,
        pageSize: 3,
        sortDirection: 'asc',
        sortField: 'title',
      });

      expect(result[0]?.title).toBe(movie1.title);
      expect(result[1]?.title).toBe(movie2.title);
    });
    it('sorts movies by title descending', async () => {
      await prepareMovie(movie1);
      await prepareMovie(movie2);

      const result = await movieRepository.getAll({
        cancellationToken,
        page: 1,
        pageSize: 2,
        sortDirection: 'desc',
        sortField: 'title',
      });

      expect(result[0]?.title).toBe(movie2.title);
      expect(result[1]?.title).toBe(movie1.title);
    });

    it('sorts movies by year ascending', async () => {
      await prepareMovie(movie2);
      await prepareMovie(movie1);

      const result = await movieRepository.getAll({
        cancellationToken,
        page: 1,
        pageSize: 2,
        sortDirection: 'asc',
        sortField: 'year',
      });

      expect(result[0]?.yearOfRelease).toBe(movie1.yearOfRelease);
      expect(result[1]?.yearOfRelease).toBe(movie2.yearOfRelease);
    });

    it('sorts movies by year descending', async () => {
      await prepareMovie(movie1);
      await prepareMovie(movie2);

      const result = await movieRepository.getAll({
        cancellationToken,
        page: 1,
        pageSize: 3,
        sortDirection: 'desc',
        sortField: 'year',
      });

      expect(result[0]?.yearOfRelease).toBe(movie2.yearOfRelease);
      expect(result[1]?.yearOfRelease).toBe(movie1.yearOfRelease);
    });
  });

  describe('getCount', () => {
    it('gets count of movies', async () => {
      await prepareMovie(movie1);
      await prepareMovie(movie2);

      const result = await movieRepository.getCount({ cancellationToken });

      expect(result).toBe(2);
    });

    it('gets count of movies by title', async () => {
      await prepareMovie(movie1);
      await prepareMovie(movie2);

      const result = await movieRepository.getCount({
        cancellationToken,
        title: movie1.title,
      });

      expect(result).toBe(1);
    });

    it('gets count of movies by year of release', async () => {
      await prepareMovie(movie1);
      await prepareMovie(movie2);

      const result = await movieRepository.getCount({
        cancellationToken,
        yearOfRelease: movie1.yearOfRelease,
      });

      expect(result).toBe(1);
    });

    it('gets count of movies by title and year of release', async () => {
      await prepareMovie(movie1);
      await prepareMovie(movie2);

      const result = await movieRepository.getCount({
        cancellationToken,
        title: movie1.title,
        yearOfRelease: movie1.yearOfRelease,
      });

      expect(result).toBe(1);
    });

    it('returns 0 if no movies exist', async () => {
      await prepareMovie(movie1);
      await prepareMovie(movie2);

      const result = await movieRepository.getCount({
        cancellationToken,
        title: 'Weird movie',
      });

      expect(result).toBe(0);
    });
  });
});
