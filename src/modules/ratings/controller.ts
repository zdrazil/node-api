import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyRouteInstance } from '../../types';
import { createIdDtoSchema } from '../api/id';
import { MovieService } from '../movies/service';
import { RatingService } from './service';
import { ratingEndpoints } from './endpoints';
import {
  movieRatingResponseDtoSchema,
  rateMovieRequestDtoSchema,
} from './rateMovie/schema';

interface Dependencies {
  ratingService: RatingService;
}

export async function createRatingController(
  fastify: FastifyRouteInstance,
  { ratingService }: Dependencies,
) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    handler: async (req, res) => {
      const userId = req.user.userId;

      const result = await ratingService.rateMovie({
        movieId: req.params.id,
        rating: req.body.rating,
        userId,
      });

      return result ? res.status(201).send() : res.status(404).send();
    },
    method: 'PUT',
    onRequest: fastify.auth([fastify.verifyTrustedMember]),
    schema: {
      body: rateMovieRequestDtoSchema,
      description: 'Rate a movie',
      params: createIdDtoSchema('Movie'),
      response: {
        200: createIdDtoSchema('Rating'),
      },
      tags: ['ratings'],
    },
    url: ratingEndpoints.create,
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    handler: async (req, res) => {
      const userId = req.user.userId;

      const result = await ratingService.deleteRating({
        movieId: req.params.id,
        userId,
      });

      return result ? res.status(204).send() : res.status(404).send();
    },
    method: 'DELETE',
    onRequest: fastify.auth([fastify.verifyTrustedMember]),
    schema: {
      description: 'Delete a movie rating',
      params: createIdDtoSchema('Movie'),
      response: {
        200: createIdDtoSchema('Rating'),
      },
      tags: ['ratings'],
    },
    url: ratingEndpoints.delete,
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    handler: async (req, res) => {
      const userId = req.user.userId;

      const result = await ratingService.getRatingsForUser({
        userId,
      });

      return res.send(result);
    },
    method: 'GET',
    onRequest: fastify.auth([fastify.verifyTrustedMember]),
    schema: {
      description: 'Delete a movie rating',
      params: createIdDtoSchema('Movie'),
      response: {
        200: movieRatingResponseDtoSchema,
      },
      tags: ['ratings'],
    },
    url: ratingEndpoints.getUserRatings,
  });
}
