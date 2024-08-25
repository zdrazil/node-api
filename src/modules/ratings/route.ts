import { FastifyRouteInstance } from '../../types';
import { createMovieController } from '../movies/controller';
import { createMovieRepository } from '../movies/repository';
import { createMovieService } from '../movies/service';

export default async function createRoute(fastify: FastifyRouteInstance) {
  const repository = createMovieRepository({ db: fastify.pg });
  const service = createMovieService({ movieRepository: repository });

  await createMovieController(fastify, { movieService: service });
}
