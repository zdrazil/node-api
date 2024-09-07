import { Literal, Static, Type } from '@sinclair/typebox';

export type SortDirection = Static<typeof sortDirectionSchema>;
export const sortDirectionSchema = Type.Union([
  Literal('asc'),
  Literal('desc'),
  Literal('none'),
]);
