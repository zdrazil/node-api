import { Static, Type } from '@sinclair/typebox';
import { pagedRequestDescription } from '../../../api/paging';
import { sortDirectionSchema } from '../../../api/sortDirection';
import { movieResponseDtoSchema } from '../response';
import { StringEnum } from '../../../../types';

const sortFieldSchema = StringEnum(['title', 'year']);

export type SortField = Static<typeof sortFieldSchema>;

export const getAllMoviesRequestDtoSchema = Type.Object({
  ...pagedRequestDescription,
  order: Type.Optional(sortDirectionSchema),
  sortBy: Type.Optional(sortFieldSchema),
  title: Type.Optional(
    Type.String({
      description: 'Movie title',
      example: 'The Matrix',
      maxLength: 100,
      minLength: 1,
    }),
  ),
  year: Type.Optional(
    Type.Number({
      description: 'Year of release',
      example: 1999,
      maximum: Number.MAX_SAFE_INTEGER,
      minimum: 1800,
    }),
  ),
});

export type GetAllMoviesResponseDto = Static<
  typeof getAllMoviesResponseDtoSchema
>;

export const getAllMoviesResponseDtoSchema = Type.Object({
  items: Type.Array(movieResponseDtoSchema),
  page: Type.Number({
    description: 'Page number',
    example: 1,
    maximum: Number.MAX_SAFE_INTEGER,
    minimum: 1,
  }),
  perPage: Type.Number({
    description: 'Items per page',
    example: 10,
    maximum: 100,
    minimum: 1,
  }),
  total: Type.Number({
    description: 'Total number of items',
    example: 100,
    maximum: Number.MAX_SAFE_INTEGER,
    minimum: 0,
  }),
});
