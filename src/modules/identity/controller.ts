import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyRouteInstance } from '../../types';
import { apiBase } from '../api/endpoints';
import {
  createJwtTokenRequestDtoSchema,
  createJwtTokenResponseDtoSchema,
} from './schema';
import { createJwtToken } from './service';

export const tokenPath = apiBase + '/token';

export async function createIdentityController(fastify: FastifyRouteInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    handler: async (req, res) => {
      const token = await createJwtToken(fastify, req.body);
      await res.send({ token });
    },
    method: 'POST',
    schema: {
      body: createJwtTokenRequestDtoSchema,
      description: 'Create a JWT token',
      response: {
        200: createJwtTokenResponseDtoSchema,
      },
      tags: ['identity'],
    },
    url: tokenPath,
  });
}
