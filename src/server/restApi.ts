import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FastifyInstance } from 'fastify';
import { MovieService } from '../modules/movies/service';
import { RatingService } from '../modules/ratings/service';
import { createRatingController } from '../modules/ratings/restApi/controller';
import { createMovieController } from '../modules/movies/restApi/controller';
import { createIdentityController } from '../modules/identity/controller';
import { createHealthController } from '../modules/health';

export async function createRoutes({
  fastify,
  movieService,
  ratingService,
}: {
  fastify: FastifyInstance;
  movieService: MovieService;
  ratingService: RatingService;
}) {
  await createRatingController(fastify, { ratingService });
  await createMovieController(fastify, { movieService });
  await createIdentityController(fastify);
  await createHealthController(fastify);
}

const __filename = fileURLToPath(import.meta.url);
