import fastifyJwt from '@fastify/jwt';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

// TODO: Store and load this securely
const tokenSecret = 'ForTheLoveOfGodStoreAndLoadThisSecurely';

export type Authenticate = (
  request: FastifyRequest,
  reply: FastifyReply,
) => Promise<void>;

async function authenticationPlugin(fastify: FastifyInstance) {
  await fastify.register(fastifyJwt, {
    secret: tokenSecret,
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
