import { Type } from '@sinclair/typebox';
import { FastifyRouteInstance } from '../types';
import { apiBase } from './api/endpoints';

export async function createHealthController(fastify: FastifyRouteInstance) {
  fastify.route({
    handler: async (req, res) => {
      return res.send({ status: 'ok' });
    },
    method: 'GET',
    schema: {
      description: 'Get health status',
      response: {
        200: Type.Object({
          status: Type.String({
            description: 'Health status',
            example: 'ok',
          }),
        }),
      },
      tags: ['health'],
    },
    url: apiBase + '/health',
  });
}
