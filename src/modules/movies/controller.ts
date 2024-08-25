import { randomUUID } from 'node:crypto';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Static, Type } from '@sinclair/typebox';
import { FastifyRouteInstance } from '../../types';
import { createIdDtoSchema } from '../api/id';
import { ConflictException } from '../exceptions/exceptions';
import { movieEndpoints } from './endpoints';
import { MovieAlreadyExistsError } from './errors';
import { Movie } from './models';
import { Service } from './service';

interface Dependencies {
  service: Service;
}

export async function createController(
  fastify: FastifyRouteInstance,
  { service }: Dependencies,
) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    // constraints: {
    //   version: '1',
    // },
    handler: async (req, res) => {
      const movie = mapToMovie(req.body);

      try {
        await service.createMovie(movie);
      } catch (error) {
        if (error instanceof ConflictException) {
          throw new MovieAlreadyExistsError(error);
        }
        throw error;
      }
      return res.status(201).send({ id: movie.id });
    },
    method: 'POST',
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
}

function mapToMovie({ genres, title, year }: CreateMovieRequestDto): Movie {
  const sluggedTitle = title.toLowerCase().replace(/ /g, '-');

  return {
    genres,
    id: randomUUID(),
    slug: sluggedTitle,
    title,
    yearOfRelease: year,
  };
}

type CreateMovieRequestDto = Static<typeof createMovieRequestDtoSchema>;

const createMovieRequestDtoSchema = Type.Object({
  genres: Type.Array(
    Type.String({
      description: 'Genres',
      example: 'Action',
      maxLength: 50,
      minLength: 1,
    }),
  ),
  title: Type.String({
    description: 'Movie title',
    example: 'The Matrix',
    maxLength: 100,
    minLength: 1,
  }),
  year: Type.Number({
    description: 'Year of release',
    example: 1999,
    maximum: Number.MAX_SAFE_INTEGER,
    minimum: 1800,
  }),
});
