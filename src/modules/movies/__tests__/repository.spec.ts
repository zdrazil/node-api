import { createDb, startDbEnvironment } from '../../testing/db';
import { StartedDockerComposeEnvironment } from 'testcontainers';
import { Movie } from '../models';
import fastifyPostgres from '@fastify/postgres';
import { createMovieRepository, MovieRepository } from '../repository';
import { randomUUID } from 'crypto';

describe('movies repository - create', () => {
  let dbEnv: StartedDockerComposeEnvironment;
  let repository: MovieRepository;

  beforeAll(async () => {
    dbEnv = await startDbEnvironment();
    repository = createMovieRepository({ db: createDb });
  });

  afterAll(async () => {
    await dbEnv.down();
  });

  it('gets a movie by id', async () => {
    const id = '8f2cdb0e-6a9b-4bbb-a339-e05aa0be5af3';
    const userId = '2ee75e90-f4c6-4de2-8580-300f76fff238';

    const result = await repository.getById({ id, userId });

    const expected = {
      genres: ['Action', 'Thriller'],
      id: '8f2cdb0e-6a9b-4bbb-a339-e05aa0be5af3',
      rating: '4.5',
      slug: 'movie-1',
      title: 'Movie 1',
      userrating: 4,
      yearofrelease: 2020,
    };
    expect(result).toEqual(expected);
  });

  it('returns undefined if movie does not exist', async () => {
    const id = randomUUID();
    const userId = randomUUID();

    const result = await repository.getById({ id, userId });

    expect(result).toBeUndefined();
  });

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
      movie,
      userrating: null,
      yearofrelease: 2021,
    });
  });
});
