import { Literal, Static, Type } from '@sinclair/typebox';

export type SortOrder = Static<typeof sortOrderSchema>;
export const sortOrderSchema = Type.Union([
  Literal('asc'),
  Literal('desc'),
  Literal('none'),
]);
