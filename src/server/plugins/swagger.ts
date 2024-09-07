import Swagger from '@fastify/swagger';
import SwaggerUI from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

async function swaggerGeneratorPlugin(fastify: FastifyInstance) {
  await fastify.register(Swagger, {
    openapi: {
      components: {
        securitySchemes: {
          BearerAuth: {
            bearerFormat: 'JWT',
            description:
              'RSA256 JWT signed by private key, with username in payload',
            scheme: 'bearer',
            type: 'http',
          },
        },
      },
      info: {
        description: 'The Swagger API documentation for the node-api project.',
        title: 'node-api',
        version: process.env.npm_package_version ?? '0.0.0',
      },
      openapi: '3.1.0',
    },
    swagger: {
      consumes: ['application/json'],
      info: {
        description: 'The Swagger API documentation for the node-api project.',
        title: 'node-api',
        version: '0.1.0',
      },
      produces: ['application/json'],
      schemes: ['http', 'https'],
    },
  });

  await fastify.register(SwaggerUI, {
    routePrefix: '/api-docs',
  });

  fastify.log.info(`Swagger documentation is available at /api-docs`);
}

export default fp(swaggerGeneratorPlugin, {
  name: 'swaggerGenerator',
});
