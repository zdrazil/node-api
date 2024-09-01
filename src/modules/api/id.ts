import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

export const createIdDtoSchema = (entityName: string) =>
  Type.Object({
    id: Type.String({
      description: `${entityName}'s id`,
      example: '2cdc8ab1-6d50-49cc-ba14-54e4ac7ec231',
    }),
  });

export const uuidSchema = Type.String({
  description: 'UUID',
  example: '2cdc8ab1-6d50-49cc - ba14 - 54e4ac7ec231',
  format: 'uuid',
});

export const isUuid = (value: string) => Value.Check(uuidSchema, value);
