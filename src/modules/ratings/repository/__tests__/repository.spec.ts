import { createDb, startDbEnvironment } from '../../../testing/db';
import { StartedDockerComposeEnvironment } from 'testcontainers';
import { createRatingRepository, RatingRepository } from '../repository';

const cancellationToken = false;

describe('ratings repository', () => {
  const userId = '2ee75e90-f4c6-4de2-8580-300f76fff238';

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

      const result = await repository.getRatingByMovieId({
        cancellationToken,
        movieId,
      });

      expect(result).toEqual(4.5);
    });

    it('returns 0 if movie does not exist', async () => {
      const result = await repository.getRatingByMovieId({
        cancellationToken,
        movieId: '00000000-6a9b-4bbb-a339-e05aa0be5af3',
      });

      expect(result).toEqual(0);
    });
  });

  describe('getRatingByMovieAndUserId', () => {
    it('gets a rating by movie and user id', async () => {
      const movieId = '8f2cdb0e-6a9b-4bbb-a339-e05aa0be5af3';

      const result = await repository.getRatingByMovieAndUserId({
        cancellationToken,
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
        cancellationToken,
        movieId,
        rating,
        userId,
      });

      const movieResult = await repository.getRatingByMovieAndUserId({
        cancellationToken,
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

      await repository.deleteRating({ cancellationToken, movieId, userId });

      const movieResult = await repository.getRatingByMovieAndUserId({
        cancellationToken,
        movieId,
        userId,
      });

      expect(movieResult).toEqual(0);
    });

    it("deletes only users' rating", async () => {
      const movieId = '8f2cdb0e-6a9b-4bbb-a339-e05aa0be5af3';

      await repository.deleteRating({
        cancellationToken,
        movieId,
        userId: '2ee75e90-0000-4de2-8580-300f76fff238',
      });

      const movieResult = await repository.getRatingByMovieAndUserId({
        cancellationToken,
        movieId,
        userId,
      });

      expect(movieResult).toEqual(4);
    });
  });

  describe('getRatingsForUser', () => {
    it('gets ratings for user', async () => {
      const result = await repository.getRatingsForUser({
        cancellationToken,
        userId,
      });

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
        cancellationToken,
        userId: '2ee75e90-0000-4de2-8580-300f76fff238',
      });

      expect(result).toEqual([]);
    });
  });
});
