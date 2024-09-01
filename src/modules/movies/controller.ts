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
import { MovieService } from './service';
import {
  updateMovieRequestDtoSchema,
  updateMovieRequestToMovie,
} from './updateMovie/schema';
import { movieResponseDtoSchema, movieToGetMovieResponse } from './response';

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

      const response = movieToGetMovieResponse(movie);

      return res.status(201).send(response);
    },
    method: 'POST',
    onRequest: fastify.auth([fastify.verifyTrustedMember]),
    schema: {
      body: createMovieRequestDtoSchema,
      description: 'Create a movie',
      response: {
        200: movieResponseDtoSchema,
      },
      tags: ['movies'],
    },
    url: movieEndpoints.create,
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    handler: async (req, res) => {
      const { id } = req.params;
      const userId = req.user.userId;

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
        200: movieResponseDtoSchema,
      },
      tags: ['movies'],
    },
    url: movieEndpoints.get,
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    handler: async (req, res) => {
      const userId = req.user.userId;

      const movie = updateMovieRequestToMovie(req.body, req.params.id);

      const updatedMovie = await movieService.update(movie, { userId });

      if (!updatedMovie) {
        return res.status(404).send();
      }

      const response = movieToGetMovieResponse(movie);

      return res.send(response);
    },
    method: 'PUT',
    schema: {
      body: updateMovieRequestDtoSchema,
      description: 'Update a movie by ID',
      params: createIdDtoSchema('Movie'),
      response: {
        200: movieResponseDtoSchema,
      },
      tags: ['movies'],
    },
    url: movieEndpoints.update,
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    handler: async (req, res) => {
      const deleted = await movieService.deleteById({ id: req.params.id });

      if (!deleted) {
        return res.status(404).send();
      }

      return res.send();
    },
    method: 'DELETE',
    onRequest: fastify.auth([fastify.verifyAdmin]),
    schema: {
      body: updateMovieRequestDtoSchema,
      description: 'Delete a movie by ID',
      params: createIdDtoSchema('Movie'),
      tags: ['movies'],
    },
    url: movieEndpoints.delete,
  });
}
