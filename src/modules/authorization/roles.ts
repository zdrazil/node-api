import { Static, Type } from '@sinclair/typebox';

const rolesSchema = Type.Union([
  Type.Literal('admin'),
  Type.Literal('trustedMember'),
]);

export type Role = Static<typeof rolesSchema>;
