import Fastify, { FastifyInstance } from 'fastify';
import Cors from '@fastify/cors';
import AutoLoad from '@fastify/autoload';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { createMovieRepository } from '../movies/repository/repository';
import { createRatingRepository } from '../ratings/repository/repository';
import { createMovieService } from '../movies/service';
import { createRatingService } from '../ratings/service';
import { createRatingController } from '../ratings/controller';
import { createMovieController } from '../movies/controller';
import { createIdentityController } from '../identity/controller';
import {
  DockerComposeEnvironment,
  StartedDockerComposeEnvironment,
} from 'testcontainers';
import pg from 'pg';

async function createRoutes({ fastify }: { fastify: FastifyInstance }) {
  const db = async () => new pg.Client({ connectionString: dbUrl });

  const movieRepository = createMovieRepository({ db });
  const ratingRepository = createRatingRepository({ db });
  const movieService = createMovieService({
    movieRepository,
    ratingRepository,
  });
  const ratingService = createRatingService({
    movieRepository,
    ratingRepository,
  });

  await createRatingController(fastify, { ratingService });
  await createMovieController(fastify, { movieService });
  await createIdentityController(fastify);
}

const POSTGRES_USER = 'admin';
const POSTGRES_URL = '127.0.0.1:5433';
const POSTGRES_DB = 'admin';
const POSTGRES_PASSWORD = 'test';

const dbUrl = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_URL}/${POSTGRES_DB}?sslmode=disable`;

const composeFilePath = process.cwd();
const composeFile = 'docker-compose.test.yml';
const dbEnvironment = new DockerComposeEnvironment(
  composeFilePath,
  composeFile,
);

export async function startDbEnvironment() {
  const db = await dbEnvironment.up();

  execSync('yarn run db:migrate', {
    env: { ...process.env, DBMATE_DATABASE_URL: dbUrl },
  });

  // execSync('yarn run db:seed', {
  //   env: { ...process.env, DBMATE_DATABASE_URL: dbUrl },
  // });

  return db;
}

export const createDb = async () => new pg.Client({ connectionString: dbUrl });

export async function clearTables() {
  const client = await createDb();
  await client.connect();

  await client.query('TRUNCATE TABLE movies CASCADE');
  await client.query('TRUNCATE TABLE ratings CASCADE');
  await client.query('TRUNCATE TABLE genres CASCADE');

  await client.end();
}

export async function startServer() {
  const dbEnvironment = await startDbEnvironment();

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

  await fastify.register(AutoLoad, {
    dir: path.join(process.cwd(), 'src', 'server', 'plugins'),
    dirNameRoutePrefix: false,
  });

  await createRoutes({ fastify });

  return { dbEnvironment, fastify };
}

export async function closeServer(
  fastify: FastifyInstance,
  db: StartedDockerComposeEnvironment,
) {
  await fastify.close();
  await db.down();
}
