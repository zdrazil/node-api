import { createDb, startDbEnvironment } from '../../../testing/db';
import { StartedDockerComposeEnvironment } from 'testcontainers';
import { createRatingRepository, RatingRepository } from '../repository';
import { randomUUID } from 'crypto';
import { Movie } from '../../../movies/models';

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
});
