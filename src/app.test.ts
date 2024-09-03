import { FastifyInstance } from 'fastify';
import { closeServer, startServer } from './modules/testing/db';

describe('app', () => {
  let fastify: FastifyInstance;

  beforeAll(async () => {
    fastify = await startServer();
  });

  afterAll(async () => {
    await closeServer(fastify);
  });

  test('requests the "/" route', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/api/movies',
    });

    console.log('status code: ', response.statusCode);
    console.log('body: ', response.body);
    expect(response.statusCode).toBe(200);
  });
});
