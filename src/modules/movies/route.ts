import { FastifyRouteInstance } from '../../types';
import { createController } from './controller';
import { createRepository } from './repository';
import { createService } from './service';

export default async function createRoute(fastify: FastifyRouteInstance) {
  const repository = createRepository({ db: fastify.pg });
  const service = createService({ movieRepository: repository });

  await createController(fastify, { service });
}
