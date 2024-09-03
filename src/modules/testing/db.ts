import Helmet from '@fastify/helmet';
import Fastify, { FastifyInstance } from 'fastify';
import Cors from '@fastify/cors';
import { fileURLToPath } from 'node:url';
import AutoLoad from '@fastify/autoload';
import path, { dirname } from 'node:path';
import fastifyPostgres from '@fastify/postgres';
import { exec, execSync } from 'node:child_process';
import { createMovieRepository } from '../movies/repository';
import { createRatingRepository } from '../ratings/repository';
import { createMovieService } from '../movies/service';
import { createRatingService } from '../ratings/service';
import { createRatingController } from '../ratings/controller';
import { createMovieController } from '../movies/controller';
import { createIdentityController } from '../identity/controller';

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
  beforeAll(() => {
    prepareDB();
  });

  afterAll(() => {
    console.log('DELETE');
    deleteDb();
  });

  test('requests the "/" route', async () => {});
});

const __Myfilename = fileURLToPath(import.meta.url);
const __Mydirname = dirname(__Myfilename);

const dockerComposeBase = `docker-compose -f ${path.join(process.cwd(), 'docker-compose.test.yml')}`;

function prepareDB() {
  // run docker compose in node
  execSync(`${dockerComposeBase} up -d`);

  execSync('yarn run db:migrate', {
    env: { ...process.env, DBMATE_DATABASE_URL: dbUrl },
  });
  execSync('yarn run db:seed', {
    env: { ...process.env, DBMATE_DATABASE_URL: dbUrl },
  });
}

export async function startServer() {
  prepareDB();

  const fastify = Fastify({
    ajv: {
      customOptions: {
        keywords: ['example'],
      },
    },
  });

  await fastify.register(Cors, {
    origin: false,
  });

  await fastify.register(fastifyPostgres, {
    connectionString: dbUrl,
  });

  await fastify.register(AutoLoad, {
    dir: path.join(__Mydirname, 'server', 'plugins'),
    dirNameRoutePrefix: false,
  });

  await createRoutes(fastify);

  return fastify;
}

function deleteDb() {
  execSync(`${dockerComposeBase} stop`);
  execSync(`${dockerComposeBase} rm -f -v`);
}

export async function closeServer(fastify: FastifyInstance) {
  await fastify.close();
  deleteDb();
}
