import { Type } from '@sinclair/typebox';

export const pagedRequestDescription = {
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
};

export const PagedRequestSchema = Type.Object(pagedRequestDescription);
