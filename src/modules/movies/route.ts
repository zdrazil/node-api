import { FastifyRouteInstance } from '../../types';
import { createMovieController } from './controller';
import { createMovieRepository } from './repository';
import { createMovieService } from './service';

export default async function createRoute(fastify: FastifyRouteInstance) {
  const repository = createMovieRepository({ db: fastify.pg });
  const service = createMovieService({ movieRepository: repository });

  await createMovieController(fastify, { movieService: service });
}
