import { FastifyRouteInstance } from '../../types';
import { createRatingRepository } from '../ratings/repository';
import { createRatingService } from '../ratings/service';
import { createMovieController } from './controller';
import { createMovieRepository } from './repository';
import { createMovieService } from './service';

export default async function createRoute(fastify: FastifyRouteInstance) {
  const movieRepository = createMovieRepository({ db: fastify.pg });
  const ratingRepository = createRatingRepository({ db: fastify.pg });

  const movieService = createMovieService({
    movieRepository,
    ratingRepository,
  });

  await createMovieController(fastify, { movieService });
}
