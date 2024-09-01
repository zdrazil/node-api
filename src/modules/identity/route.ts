import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyRouteInstance } from '../../types';
import { createIdDtoSchema } from '../api/id';
import { ConflictException } from '../exceptions/exceptions';
import { apiBase } from '../api/endpoints';
import { createJwtTokenRequestDtoSchema, JwtPayload } from './schema';
import { randomUUID } from 'crypto';

const path = '/token';
const lifetime = '8h';

export async function createIdentityRoutes(fastify: FastifyRouteInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    handler: async (req, res) => {
      const { customClaims, email, userId } = req.body;

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

      await res.send({ token });
    },
    method: 'POST',
    schema: {
      body: createJwtTokenRequestDtoSchema,
      description: '',
      tags: ['identity'],
    },
    url: apiBase + path,
  });
}
