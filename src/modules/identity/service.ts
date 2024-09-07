import { FastifyInstance } from 'fastify';
import { Claims, JwtPayload } from './schema';
import { randomUUID } from 'node:crypto';

const lifetime = '8h';

export const createJwtToken = async (
  fastify: FastifyInstance,
  {
    customClaims,
    email,
    userId,
  }: { customClaims?: Claims; email: string; userId: string },
) => {
  const payload: JwtPayload = {
    email,
    jti: randomUUID(),
    sub: email,
    userId,
    ...customClaims,
  };

  const token = fastify.jwt.sign(payload, {
    aud: 'https://movies.me.com',
    expiresIn: lifetime,
    iss: 'https://id.me.com',
    jti: payload.jti,
    sub: payload.sub,
  });

  return token;
};
