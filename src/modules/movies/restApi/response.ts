import { Static, Type } from '@sinclair/typebox';
import { Movie } from '../models';

export const movieToMovieResponse = ({
  genres,
  id,
  rating,
  title,
  userRating,
  yearOfRelease,
}: Movie): MovieResponseDto => ({
  genres,
  id,
  rating,
  title,
  userRating,
  yearOfRelease,
});

export type MovieResponseDto = Static<typeof movieResponseDtoSchema>;

export const movieResponseDtoSchema = Type.Object({
  genres: Type.Array(
    Type.String({
      description: 'Genres',
      example: 'Action',
      maxLength: 50,
      minLength: 1,
    }),
  ),
  id: Type.String({
    description: 'Movie ID',
    example: '2cdc8ab1-6d50-49cc-ba14-54e4ac7ec231',
  }),
  rating: Type.Optional(
    Type.Number({
      description: 'Rating',
      example: 4.5,
      maximum: 5,
      minimum: 0,
    }),
  ),
  title: Type.String({
    description: 'Movie title',
    example: 'The Matrix',
    maxLength: 100,
    minLength: 1,
  }),
  userRating: Type.Optional(
    Type.Union([
      Type.Null(),
      Type.Number({
        description: 'User rating',
        example: 4.5,
        maximum: 5,
        minimum: 0,
      }),
    ]),
  ),
  yearOfRelease: Type.Number({
    description: 'Year of release',
    example: 1999,
    maximum: Number.MAX_SAFE_INTEGER,
    minimum: 1800,
  }),
});
