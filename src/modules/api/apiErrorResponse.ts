import { Static, Type } from '@sinclair/typebox';

export const apiErrorResponseSchema = Type.Object(
  {
    correlationId: Type.Optional(Type.String({ example: 'YevPQs' })),
    error: Type.String({ example: 'Bad Request' }),
    message: Type.String({ example: 'Validation Error' }),
    statusCode: Type.Number({ example: 400 }),
    subErrors: Type.Optional(
      Type.String({
        description: 'Optional list of sub-errors',
        example: 'incorrect email',
      }),
    ),
  },
  { $id: 'ApiErrorResponse' },
);

export type ApiErrorResponse = Static<typeof apiErrorResponseSchema>;
