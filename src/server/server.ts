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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function createServer(fastify: FastifyInstance) {
  await fastify.register(Helmet, {
    contentSecurityPolicy: !env.isDevelopment,
    crossOriginEmbedderPolicy: !env.isDevelopment,
    global: true,
  });

  await fastify.register(Cors, {
    origin: false,
  });

  await fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    dirNameRoutePrefix: false,
  });

  // Auto-load routes
  await fastify.register(AutoLoad, {
    dir: path.join(__dirname, '../modules'),
    dirNameRoutePrefix: false,
    matchFilter: (path) =>
      ['.route.ts', '.resolver.ts', 'controller.ts'].some((e) =>
        path.endsWith(e),
      ),
    options: {
      autoPrefix: 'api',
    },
  });

  await fastify.register(UnderPressure);

  return fastify.withTypeProvider<TypeBoxTypeProvider>();
}
