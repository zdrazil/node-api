import { Type } from '@sinclair/typebox';

export const createIdDtoSchema = (entityName: string) =>
  Type.Object({
    id: Type.String({
      description: `${entityName}'s id`,
      example: '2cdc8ab1-6d50-49cc-ba14-54e4ac7ec231',
    }),
  });
