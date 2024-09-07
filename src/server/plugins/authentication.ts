import fastifyJwt from '@fastify/jwt';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { env } from '../../config/env';

export type Authenticate = (
  request: FastifyRequest,
  reply: FastifyReply,
) => Promise<void>;

async function authenticationPlugin(fastify: FastifyInstance) {
  await fastify.register(fastifyJwt, {
    secret: env.tokenSecret,
  });

  fastify.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (err) {
        await reply.send(err);
      }
    },
  );
}

export default fp(authenticationPlugin, {
  name: 'authentication',
});
