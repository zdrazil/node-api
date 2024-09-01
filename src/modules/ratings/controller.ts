import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyRouteInstance } from '../../types';
import { createIdDtoSchema } from '../api/id';
import { MovieService } from '../movies/service';
import { RatingService } from './service';
import { ratingEndpoints } from './endpoints';
import { rateMovieRequestDtoSchema } from './rateMovie/schema';

interface Dependencies {
  movieService: MovieService;
  ratingService: RatingService;
}

export async function createRatingController(
  fastify: FastifyRouteInstance,
  { movieService, ratingService }: Dependencies,
) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    handler: async (req, res) => {
      const result = await ratingService.rateMovie({
        movieId: req.params.id,
        rating: req.body.rating,
        userId: '',
      });

      return result ? res.status(201).send() : res.status(404).send();
    },
    method: 'PUT',
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
}
