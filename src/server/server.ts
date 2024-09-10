import path from 'node:path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import AutoLoad from '@fastify/autoload';
import Cors from '@fastify/cors';
import Helmet from '@fastify/helmet';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import AltairFastify from 'altair-fastify-plugin';
import UnderPressure from '@fastify/under-pressure';
import { FastifyInstance } from 'fastify';
import { env } from '../config/env';
import { createMovieRepository } from '../modules/movies/repository/repository';
import { print } from 'graphql';
import { createRatingRepository } from '../modules/ratings/repository/repository';
import { createMovieService } from '../modules/movies/service';
import { createRatingService } from '../modules/ratings/service';
import { createRatingController } from '../modules/ratings/restApi/controller';
import { createMovieController } from '../modules/movies/restApi/controller';
import { createIdentityController } from '../modules/identity/controller';
import pg from 'pg';
import { createHealthController } from '../modules/health';
import { createMovieResolvers } from '../modules/movies/graphql/resolvers';
import { loadSchemaFiles, codegenMercurius } from 'mercurius-codegen';
import mercurius from 'mercurius';
import { buildSchema } from 'graphql';
import { loadFiles } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';

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
  await createHealthController(fastify);

  const typesArray = await loadFiles(
    path.join(process.cwd(), 'src', '**/*.schema.graphql'),
  );

  const schema = print(mergeTypeDefs(typesArray));

  const resolvers = createMovieResolvers({ moviesService: movieService });

  await fastify.register(mercurius, {
    resolvers,
    schema,
  });

  await fastify.register(AltairFastify, {
    baseURL: '/altair/',
    endpointURL: '/graphql',
    path: '/altair',
  });

  console.log(schema);
  codegenMercurius(fastify, {
    targetPath: './src/graphql/generated.ts',
    // eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable
  }).catch(console.error);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
