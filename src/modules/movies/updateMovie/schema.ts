import { Static, Type } from '@sinclair/typebox';
import { Movie } from '../models';

export const updateMovieRequestToMovie = (
  { genres, title, year }: UpdateMovieRequestDto,
  id: string,
): Movie => {
  const sluggedTitle = title.toLowerCase().replace(/ /g, '-');

  return {
    genres,
    id,
    slug: sluggedTitle,
    title,
    yearOfRelease: year,
  };
};

type UpdateMovieRequestDto = Static<typeof updateMovieRequestDtoSchema>;

export const updateMovieRequestDtoSchema = Type.Object({
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
