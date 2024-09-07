import Fastify, { FastifyInstance } from 'fastify';
import authenticationPlugin from '../../../server/plugins/authentication';
import { createIdentityController, tokenPath } from '../controller';
import { randomUUID } from 'crypto';

describe('identityController', () => {
  let fastify: FastifyInstance;

  beforeAll(async () => {
    fastify = Fastify({
      ajv: {
        customOptions: {
          keywords: ['example'],
        },
      },
    });
    await fastify.register(authenticationPlugin);
    await createIdentityController(fastify);
  });

  afterAll(async () => {
    await fastify.close();
  });

  describe('creates token', () => {
    it('creates a token', async () => {
      const userId = randomUUID();
      const email = 'mail@example.com';
      const response = await fastify.inject({
        method: 'POST',
        payload: {
          email,
          userId,
        },
        url: tokenPath,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const decoded = fastify.jwt.decode(response.json().token);

      const expected = {
        aud: 'https://movies.me.com',
        email: email,
        iss: 'https://id.me.com',
        sub: email,
        userId: userId,
      };

      expect(decoded).toMatchObject(expected);
    });
  });
});
