import { FastifyInstance } from 'fastify';
import { closeServer, startServer } from './modules/testing/db';
import { StartedDockerComposeEnvironment } from 'testcontainers';

describe('app', () => {
  let fastify: FastifyInstance;
  let db: StartedDockerComposeEnvironment;

  beforeAll(async () => {
    const server = await startServer();
    fastify = server.fastify;
    db = server.db;
  });

  afterAll(async () => {
    await closeServer(fastify, db);
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
