import { Static, Type } from '@sinclair/typebox';
import { Movie } from '../models';

export const movieToGetMovieResponse = ({
  genres,
  id,
  title,
  yearOfRelease,
}: Movie): GetMovieResponseDto => ({ genres, id, title, yearOfRelease });

type GetMovieResponseDto = Static<typeof getMovieResponseDtoSchema>;

export const getMovieResponseDtoSchema = Type.Object({
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
  title: Type.String({
    description: 'Movie title',
    example: 'The Matrix',
    maxLength: 100,
    minLength: 1,
  }),
  yearOfRelease: Type.Number({
    description: 'Year of release',
    example: 1999,
    maximum: Number.MAX_SAFE_INTEGER,
    minimum: 1800,
  }),
});
