import { clearTables, createDb, startDbEnvironment } from '../../../testing/db';
import { StartedDockerComposeEnvironment } from 'testcontainers';
import { createRatingRepository, RatingRepository } from '../repository';
import {
  createMovieRepository,
  MovieRepository,
} from '../../../movies/repository/repository';
import { Movie } from '../../../movies/models';
import { randomUUID } from 'crypto';

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

describe('ratings repository', () => {
  const userId = '2ee75e90-f4c6-4de2-8580-300f76fff238';

  let dbEnv: StartedDockerComposeEnvironment;
  let ratingRepository: RatingRepository;
  let movieRepository: MovieRepository;

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

  describe('getRatingByMovieId', () => {
    it('gets a rating by movie id', async () => {
      await prepareMovie(movie1);

      const result = await ratingRepository.getRatingByMovieId({
        cancellationToken,
        movieId: movie1.id,
      });

      expect(result).toEqual(4);
    });

    it('returns 0 if movie does not exist', async () => {
      const result = await ratingRepository.getRatingByMovieId({
        cancellationToken,
        movieId: movie1.id,
      });

      expect(result).toEqual(0);
    });
  });

  describe('getRatingByMovieAndUserId', () => {
    it('gets a rating by movie and user id', async () => {
      await movieRepository.create({
        cancellationToken,
        movie: movie1,
      });

      await movieRepository.create({
        cancellationToken,
        movie: movie2,
      });

      await ratingRepository.rateMovie({
        cancellationToken,
        movieId: movie1.id,
        rating: 5,
        userId,
      });

      const userId2 = randomUUID();
      await ratingRepository.rateMovie({
        cancellationToken,
        movieId: movie1.id,
        rating: 2,
        userId: userId2,
      });

      const result = await ratingRepository.getRatingByMovieAndUserId({
        cancellationToken,
        movieId: movie1.id,
        userId,
      });

      expect(result).toEqual(5);
    });
  });

  describe('rateMovie', () => {
    it('rates a movie', async () => {
      const rating = 5;

      await prepareMovie(movie1);

      const ratingResult = await ratingRepository.rateMovie({
        cancellationToken,
        movieId: movie1.id,
        rating,
        userId,
      });

      const movieResult = await ratingRepository.getRatingByMovieAndUserId({
        cancellationToken,
        movieId: movie1.id,
        userId,
      });

      expect(ratingResult).toEqual(true);
      expect(movieResult).toEqual(rating);
    });
  });

  describe('deleteRating', () => {
    it('deletes a rating', async () => {
      await prepareMovie(movie1);

      await ratingRepository.deleteRating({
        cancellationToken,
        movieId: movie1.id,
        userId,
      });

      const movieResult = await ratingRepository.getRatingByMovieAndUserId({
        cancellationToken,
        movieId: movie1.id,
        userId,
      });

      expect(movieResult).toEqual(0);
    });

    it("deletes only users' rating", async () => {
      await movieRepository.create({
        cancellationToken,
        movie: movie1,
      });

      await ratingRepository.rateMovie({
        cancellationToken,
        movieId: movie1.id,
        rating: 5,
        userId,
      });

      const userId2 = randomUUID();
      await ratingRepository.rateMovie({
        cancellationToken,
        movieId: movie1.id,
        rating: 2,
        userId: userId2,
      });

      await ratingRepository.deleteRating({
        cancellationToken,
        movieId: movie1.id,
        userId: userId,
      });

      const movieResult = await ratingRepository.getRatingByMovieAndUserId({
        cancellationToken,
        movieId: movie1.id,
        userId: userId2,
      });

      expect(movieResult).toEqual(2);
    });
  });

  describe('getRatingsForUser', () => {
    it('gets ratings for user', async () => {
      await movieRepository.create({
        cancellationToken,
        movie: movie1,
      });

      await ratingRepository.rateMovie({
        cancellationToken,
        movieId: movie1.id,
        rating: 5,
        userId,
      });

      const userId2 = randomUUID();
      await ratingRepository.rateMovie({
        cancellationToken,
        movieId: movie1.id,
        rating: 2,
        userId: userId2,
      });

      const result = await ratingRepository.getRatingsForUser({
        cancellationToken,
        userId,
      });

      expect(result.length).toEqual(1);

      expect(result[0]).toEqual({
        id: '8f2cdb0e-6a9b-4bbb-a339-e05aa0be5af3',
        movieId: '8f2cdb0e-6a9b-4bbb-a339-e05aa0be5af3',
        rating: 5,
        slug: 'movie-1',
      });
    });

    it('returns empty array if user has no ratings', async () => {
      await movieRepository.create({
        cancellationToken,
        movie: movie1,
      });

      const userId2 = randomUUID();
      await ratingRepository.rateMovie({
        cancellationToken,
        movieId: movie1.id,
        rating: 2,
        userId: userId2,
      });

      const result = await ratingRepository.getRatingsForUser({
        cancellationToken,
        userId: userId,
      });

      expect(result).toEqual([]);
    });
  });
});
