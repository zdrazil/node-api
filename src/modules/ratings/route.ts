import { FastifyRouteInstance } from '../../types';
import { createMovieRepository } from '../movies/repository';
import { createMovieService } from '../movies/service';
import { createRatingController } from './controller';
import { createRatingRepository } from './repository';
import { createRatingService } from './service';

export default async function createRoute(fastify: FastifyRouteInstance) {
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
}
