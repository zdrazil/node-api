import path from 'node:path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import AutoLoad from '@fastify/autoload';
import Cors from '@fastify/cors';
import Helmet from '@fastify/helmet';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import UnderPressure from '@fastify/under-pressure';
import { FastifyInstance } from 'fastify';
import { env } from '../config/env';
import { createMovieRepository } from '../modules/movies/repository/repository';
import { createRatingRepository } from '../modules/ratings/repository/repository';
import { createMovieService } from '../modules/movies/service';
import { createRatingService } from '../modules/ratings/service';
import { createRatingController } from '../modules/ratings/controller';
import { createMovieController } from '../modules/movies/controller';
import { createIdentityController } from '../modules/identity/controller';
import pg from 'pg';

export async function createServer(fastify: FastifyInstance) {
  await fastify.register(Helmet, {
    contentSecurityPolicy: !env.isDevelopment,
    crossOriginEmbedderPolicy: !env.isDevelopment,
    global: true,
  });

  await fastify.register(Cors, {
    origin: false,
  });

  // Auto-load plugins
  await fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    dirNameRoutePrefix: false,
  });

  await createRoutes({ fastify });

  await fastify.register(UnderPressure);

  return fastify.withTypeProvider<TypeBoxTypeProvider>();
}

async function createRoutes({ fastify }: { fastify: FastifyInstance }) {
  const db = async () => new pg.Client({ connectionString: env.db.url });

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
