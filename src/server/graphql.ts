import path from 'node:path';
import AltairFastify from 'altair-fastify-plugin';
import { FastifyInstance } from 'fastify';
import { print } from 'graphql';
import { MovieService } from '../modules/movies/service';
import { createMovieResolvers } from '../modules/movies/graphql/resolvers';
import { codegenMercurius } from 'mercurius-codegen';
import { makeExecutableSchema } from '@graphql-tools/schema';
import mercurius from 'mercurius';
import { loadFiles } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { createRatingResolvers } from '../modules/ratings/graphql/resolvers';
import { connectionDirective } from 'relay-pagination-directive';
import { create } from 'node:domain';

const { connectionDirectiveTypeDefs, connectionDirectiveTransformer } =
  connectionDirective();

export async function createGraphQl({
  fastify,
  movieService,
}: {
  fastify: FastifyInstance;
  movieService: MovieService;
}) {
  const typesArray = await loadFiles(
    path.join(process.cwd(), 'src', '**/*.schema.graphql'),
  );

  // https://www.nearform.com/digital-community/an-npm-package-to-simplify-graphql-relay-style-pagination/
  const schema = makeExecutableSchema({
    typeDefs: [connectionDirectiveTypeDefs, typesArray],
    resolvers: {
      Query: {
        ...createMovieResolvers({ moviesService: movieService }).Query,
      },
    },
  });

  const connectionSchema = connectionDirectiveTransformer(schema);

  await fastify.register(mercurius, {
    schema: connectionSchema,
  });

  await fastify.register(AltairFastify, {
    baseURL: '/altair/',
    endpointURL: '/graphql',
    path: '/altair',
  });

  codegenMercurius(fastify, {
    targetPath: './src/graphql/generated.ts',
    // eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable
  }).catch(console.error);
}
