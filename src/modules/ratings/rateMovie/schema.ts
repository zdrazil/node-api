import { Static, Type } from '@sinclair/typebox';

export type RateMovieRequestDto = Static<typeof rateMovieRequestDtoSchema>;

export const rateMovieRequestDtoSchema = Type.Object({
  rating: Type.Number({
    description: 'Rating',
    example: 5,
    maximum: 5,
    minimum: 1,
  }),
});

export const movieRatingResponseDtoSchema = Type.Array(
  Type.Object({
    id: Type.String({
      description: 'Rating id',
      example: '2cdc8ab1-6d50-49cc-ba14-54e4ac7ec231',
    }),
    movieId: Type.String({
      description: 'Movie id',
      example: '2cdc8ab1-6d50-49cc-ba14-54e4ac7ec231',
    }),
    rating: Type.Number({
      description: 'Rating',
      example: 5,
      maximum: 5,
      minimum: 1,
    }),
    slug: Type.String({
      description: 'Slug',
      example: 'the-matrix',
    }),
  }),
);
