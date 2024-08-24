import { asValue } from 'awilix';
import { FastifyBaseLogger } from 'fastify';

export interface Dependencies {
  logger: FastifyBaseLogger;
}

export function makeDependencies({ logger }: { logger: FastifyBaseLogger }) {
  return {
    logger: asValue(logger),
  };
}
