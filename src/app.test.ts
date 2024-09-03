import Helmet from '@fastify/helmet';
import Fastify, { FastifyInstance } from 'fastify';
import { env } from './config/env';
import Cors from '@fastify/cors';
import { fileURLToPath } from 'node:url';
import AutoLoad from '@fastify/autoload';
import path, { dirname } from 'node:path';
import { createRatingController } from './modules/ratings/controller';
import { createMovieController } from './modules/movies/controller';
import {
  createIdentityController,
  tokenPath,
} from './modules/identity/controller';
import fastifyPostgres from '@fastify/postgres';
import { exec, execSync } from 'node:child_process';
import { createMovieRepository } from './modules/movies/repository';
import { createRatingRepository } from './modules/ratings/repository';
import { createMovieService } from './modules/movies/service';
import { createRatingService } from './modules/ratings/service';
import { closeServer, startServer } from './modules/testing/db';

async function createRoutes(fastify: FastifyInstance) {
  const movieRepository = createMovieRepository({ db: fastify.pg });
  const ratingRepository = createRatingRepository({ db: fastify.pg });
  const movieService = createMovieService({
    movieRepository,
    ratingRepository,
  });
  const ratingService = createRatingService({
    movieRepository,
    ratingRepository,
  });

  await createRatingController(fastify, { movieService, ratingService });
  await createMovieController(fastify, { movieService });
  await createIdentityController(fastify);
}

const POSTGRES_USER = 'admin';
const POSTGRES_URL = '127.0.0.1:5433';
const POSTGRES_DB = 'admin';
const POSTGRES_PASSWORD = 'test';

const dbUrl = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_URL}/${POSTGRES_DB}?sslmode=disable`;

describe('app', () => {
  let fastify: FastifyInstance;

  beforeAll(async () => {
    fastify = await startServer();
  });

  afterAll(async () => {
    await closeServer(fastify);
  });

  test('requests the "/" route', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/api/movies',
    });

    console.log('status code: ', response.statusCode);
    console.log('body: ', response.body);
    expect(response.statusCode).toBe(200);
  });
});
