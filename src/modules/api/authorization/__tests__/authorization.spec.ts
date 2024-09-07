import Fastify, { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import authorization from '../../../../server/plugins/authorization';
import authentication from '../../../../server/plugins/authentication';
import { createJwtToken } from '../../../identity/service';

describe('authorization', () => {
  let fastify: FastifyInstance;

  beforeEach(async () => {
    fastify = Fastify({
      ajv: {
        customOptions: {
          keywords: ['example'],
        },
      },
    });

    await fastify.register(authentication);
    await fastify.register(authorization);
  });

  afterEach(async () => {
    await fastify.close();
  });

  it('lets you access public route', async () => {
    fastify.withTypeProvider<TypeBoxTypeProvider>().route({
      handler: async (req, res) => res.send(),
      method: 'GET',
      url: '/',
    });

    const response = await fastify.inject({ method: 'GET', url: '/' });

    expect(response.statusCode).toBe(200);
  });

  it('prevents you from accessing private route', async () => {
    fastify.withTypeProvider<TypeBoxTypeProvider>().route({
      handler: async (req, res) => res.send(),
      method: 'GET',
      onRequest: fastify.auth([fastify.verifyTrustedMember]),
      url: '/',
    });

    const response = await fastify.inject({ method: 'GET', url: '/' });

    expect(response.statusCode).toBe(401);
  });

  it('lets you access admin route with correct permissions', async () => {
    fastify.withTypeProvider<TypeBoxTypeProvider>().route({
      handler: async (_req, res) => res.send(),
      method: 'GET',
      onRequest: fastify.auth([fastify.verifyAdmin]),
      url: '/',
    });

    const token = await createJwtToken(fastify, {
      customClaims: { admin: true },
      email: '',
      userId: '',
    });

    const response = await fastify.inject({
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toBe(200);
  });

  it('prevents access without correct persmission', async () => {
    fastify.withTypeProvider<TypeBoxTypeProvider>().route({
      handler: async (_req, res) => res.send(),
      method: 'GET',
      onRequest: fastify.auth([fastify.verifyAdmin]),
      url: '/',
    });

    const response = await fastify.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toBe(401);
  });

  it('lets you access trusted member route with correct permissions', async () => {
    fastify.withTypeProvider<TypeBoxTypeProvider>().route({
      handler: async (_req, res) => res.send(),
      method: 'GET',
      onRequest: fastify.auth([fastify.verifyTrustedMember]),
      url: '/',
    });

    const token = await createJwtToken(fastify, {
      customClaims: { trustedMember: true },
      email: '',
      userId: '',
    });

    const response = await fastify.inject({
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toBe(200);
  });

  it('prevents access to trusted member route without correct permissions', async () => {
    fastify.withTypeProvider<TypeBoxTypeProvider>().route({
      handler: async (_req, res) => res.send(),
      method: 'GET',
      onRequest: fastify.auth([fastify.verifyTrustedMember]),
      url: '/',
    });

    const response = await fastify.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toBe(401);
  });

  it('trusted member cannot access admin route', async () => {
    fastify.withTypeProvider<TypeBoxTypeProvider>().route({
      handler: async (_req, res) => res.send(),
      method: 'GET',
      onRequest: fastify.auth([fastify.verifyAdmin]),
      url: '/',
    });

    const token = await createJwtToken(fastify, {
      customClaims: { trustedMember: true },
      email: '',
      userId: '',
    });

    const response = await fastify.inject({
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toBe(401);
  });
});
