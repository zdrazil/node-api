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
