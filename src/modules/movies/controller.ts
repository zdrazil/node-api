import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyRouteInstance } from '../../types';
import { createIdDtoSchema, isUuid } from '../api/id';
import { ConflictException } from '../api/exceptions';
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
import { movieResponseDtoSchema, movieToMovieResponse } from './response';
import {
  getAllMoviesRequestDtoSchema,
  GetAllMoviesResponseDto,
  getAllMoviesResponseDtoSchema,
} from './getAllMovies/schema';
import { randomUUID } from 'crypto';

interface Dependencies {
  movieService: MovieService;
}

export async function createMovieController(
  fastify: FastifyRouteInstance,
  { movieService }: Dependencies,
) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    handler: async (req, res) => {
      const movie = createMovieRequestToMovie(req.body);
      const cancellationToken = req.raw.aborted;

      try {
        await movieService.create({ cancellationToken, movie });
      } catch (error) {
        if (error instanceof ConflictException) {
          throw new MovieAlreadyExistsError(error);
        }
        throw error;
      }

      const response = movieToMovieResponse(movie);

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
      security: [{ BearerAuth: [] }],
      tags: ['movies'],
    },
    url: movieEndpoints.create,
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    handler: async (req, res) => {
      const { id } = req.params;
      const userId = req.user.userId;
      const cancellationToken = req.raw.aborted;

      const movie = isUuid(id)
        ? await movieService.getById({ cancellationToken, id, userId })
        : await movieService.getBySlug({ cancellationToken, slug: id, userId });

      if (!movie) {
        return res.status(404).send();
      }

      const response = movieToMovieResponse(movie);

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
      const { order, page, perPage, sortBy, title, year } = req.query;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const userId = req.user?.userId;
      const cancellationToken = req.raw.aborted;

      const movies = await movieService.getAll({
        cancellationToken,
        page,
        pageSize: perPage,
        sortDirection: order,
        sortField: sortBy,
        title: title,
        userId,
        year: year,
      });

      const movieCount = await movieService.getCount({
        cancellationToken,
        title,
        yearOfRelease: year,
      });

      const response: GetAllMoviesResponseDto = {
        items: movies.map(movieToMovieResponse),
        page,
        perPage,
        total: movieCount,
      };

      return res.send(response);
    },
    method: 'GET',
    schema: {
      description: 'Get all movies',
      querystring: getAllMoviesRequestDtoSchema,
      response: {
        200: getAllMoviesResponseDtoSchema,
      },
      tags: ['movies'],
    },
    url: movieEndpoints.getAll,
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    handler: async (req, res) => {
      const userId = req.user.userId;
      const cancellationToken = req.raw.aborted;

      const movie = updateMovieRequestToMovie(req.body, req.params.id);

      const updatedMovie = await movieService.update(movie, {
        cancellationToken,
        userId,
      });

      if (!updatedMovie) {
        return res.status(404).send();
      }

      const response = movieToMovieResponse(updatedMovie);

      return res.send(response);
    },
    method: 'PUT',
    onRequest: fastify.auth([fastify.verifyTrustedMember]),
    schema: {
      body: updateMovieRequestDtoSchema,
      description: 'Update a movie by ID',
      params: createIdDtoSchema('Movie'),
      response: {
        200: movieResponseDtoSchema,
      },
      security: [{ BearerAuth: [] }],
      tags: ['movies'],
    },
    url: movieEndpoints.update,
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    handler: async (req, res) => {
      const cancellationToken = req.raw.aborted;

      const deleted = await movieService.deleteById({
        cancellationToken,
        id: req.params.id,
      });

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
      security: [{ BearerAuth: [] }],
      tags: ['movies'],
    },
    url: movieEndpoints.delete,
  });
}
