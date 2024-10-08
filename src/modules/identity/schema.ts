import { Type, Static } from '@sinclair/typebox';

const claimsSchema = Type.Object({
  admin: Type.Optional(Type.Boolean()),
  trustedMember: Type.Optional(Type.Boolean()),
});

export type Claims = Static<typeof claimsSchema>;

export const createJwtTokenRequestDtoSchema = Type.Object({
  customClaims: Type.Optional(claimsSchema),
  email: Type.String({
    description: 'User email',
    example: 'mail@example.com',
    maxLength: 255,
    minLength: 1,
  }),
  userId: Type.String({
    description: 'ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  }),
});

export type CreateJwtTokenRequestDto = Static<
  typeof createJwtTokenRequestDtoSchema
>;

export interface JwtPayload {
  admin?: boolean;
  customClaims?: boolean;
  email: string;
  jti: string;
  sub: string;
  trustedMember?: boolean;
  userId: string;
}

export const createJwtTokenResponseDtoSchema = Type.Object({
  token: Type.String({
    description: 'JWT token',
    example: 'eyJhbGciOiJIUz',
  }),
});
