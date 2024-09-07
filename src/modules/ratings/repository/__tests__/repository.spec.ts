import { createDb, startDbEnvironment } from '../../../testing/db';
import { StartedDockerComposeEnvironment } from 'testcontainers';
import { createRatingRepository, RatingRepository } from '../repository';
import { Movie } from '../../../movies/models';
import { randomUUID } from 'crypto';

describe('ratings repository', () => {
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
  let repository: RatingRepository;

  beforeEach(async () => {
    dbEnv = await startDbEnvironment();
    repository = createRatingRepository({ db: createDb });
  });

  afterEach(async () => {
    await dbEnv.down();
  });

  describe('getRatingByMovieId', () => {
    it('gets a rating by movie id', async () => {
      const movieId = '8f2cdb0e-6a9b-4bbb-a339-e05aa0be5af3';

      const result = await repository.getRatingByMovieId({ movieId });

      expect(result).toEqual(4.5);
    });

    it('returns 0 if movie does not exist', async () => {
      const result = await repository.getRatingByMovieId({
        movieId: '00000000-6a9b-4bbb-a339-e05aa0be5af3',
      });

      expect(result).toEqual(0);
    });
  });

  describe('getRatingByMovieAndUserId', () => {
    it('gets a rating by movie and user id', async () => {
      const movieId = '8f2cdb0e-6a9b-4bbb-a339-e05aa0be5af3';

      const result = await repository.getRatingByMovieAndUserId({
        movieId,
        userId,
      });

      expect(result).toEqual(4);
    });
  });

  describe('rateMovie', () => {
    it('rates a movie', async () => {
      const movieId = '8f2cdb0e-6a9b-4bbb-a339-e05aa0be5af3';
      const rating = 5;

      const ratingResult = await repository.rateMovie({
        movieId,
        rating,
        userId,
      });

      const movieResult = await repository.getRatingByMovieAndUserId({
        movieId,
        userId,
      });

      expect(ratingResult).toEqual(true);
      expect(movieResult).toEqual(rating);
    });
  });

  describe('deleteRating', () => {
    it('deletes a rating', async () => {
      const movieId = '8f2cdb0e-6a9b-4bbb-a339-e05aa0be5af3';

      await repository.deleteRating({ movieId, userId });

      const movieResult = await repository.getRatingByMovieAndUserId({
        movieId,
        userId,
      });

      expect(movieResult).toEqual(0);
    });

    it("deletes only users' rating", async () => {
      const movieId = '8f2cdb0e-6a9b-4bbb-a339-e05aa0be5af3';

      await repository.deleteRating({
        movieId,
        userId: '2ee75e90-0000-4de2-8580-300f76fff238',
      });

      const movieResult = await repository.getRatingByMovieAndUserId({
        movieId,
        userId,
      });

      expect(movieResult).toEqual(4);
    });
  });

  describe('getRatingsForUser', () => {
    it('gets ratings for user', async () => {
      const result = await repository.getRatingsForUser({ userId });

      expect(result.length).toEqual(2);

      expect(result[0]).toEqual([
        {
          id: '8f2cdb0e-6a9b-4bbb-a339-e05aa0be5af3',
          movieId: '8f2cdb0e-6a9b-4bbb-a339-e05aa0be5af3',
          rating: 4,
          slug: 'movie-1',
        },
      ]);
    });

    it('returns empty array if user has no ratings', async () => {
      const result = await repository.getRatingsForUser({
        userId: '2ee75e90-0000-4de2-8580-300f76fff238',
      });

      expect(result).toEqual([]);
    });
  });
});
