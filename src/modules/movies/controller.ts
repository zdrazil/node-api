import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyRouteInstance } from '../../types';
import { createIdDtoSchema, isUuid } from '../api/id';
import { ConflictException } from '../exceptions/exceptions';
import {
  createMovieRequestDtoSchema,
  createMovieRequestToMovie,
} from './createMovie/schema';
import { movieEndpoints } from './endpoints';
import { MovieAlreadyExistsError } from './errors';
import {
  getMovieResponseDtoSchema,
  movieToGetMovieResponse,
} from './getMovie/schema';
import { MovieService } from './service';

interface Dependencies {
  movieService: MovieService;
}

export async function createMovieController(
  fastify: FastifyRouteInstance,
  { movieService }: Dependencies,
) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    // constraints: {
    //   version: '1',
    // },
    handler: async (req, res) => {
      const movie = createMovieRequestToMovie(req.body);

      try {
        await movieService.create(movie);
      } catch (error) {
        if (error instanceof ConflictException) {
          throw new MovieAlreadyExistsError(error);
        }
        throw error;
      }
      return res.status(201).send({ id: movie.id });
    },
    method: 'POST',
    onRequest: fastify.auth([fastify.verifyTrustedMember]),
    schema: {
      body: createMovieRequestDtoSchema,
      description: 'Create a movie',
      response: {
        200: createIdDtoSchema('Movie'),
      },
      tags: ['movies'],
    },
    url: movieEndpoints.create,
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    handler: async (req, res) => {
      const { id } = req.params;
      const userId = req.user.userId;
      // if id is guid use getById, if not try getBySlug

      const movie = isUuid(id)
        ? await movieService.getById({ id, userId })
        : await movieService.getBySlug({ slug: id, userId });

      if (!movie) {
        return res.status(404).send();
      }

      const response = movieToGetMovieResponse(movie);

      return res.send(response);
    },
    method: 'GET',
    schema: {
      description: 'Get a movie by ID',
      params: createIdDtoSchema('Movie'),
      response: {
        200: getMovieResponseDtoSchema,
      },
      tags: ['movies'],
    },
    url: movieEndpoints.get,
  });
}
