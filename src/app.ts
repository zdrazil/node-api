import { randomUUID } from 'node:crypto';
import GracefulServer from '@gquittet/graceful-server';
import Fastify from 'fastify';
import { env } from './config/env';
import server from './server/server';

async function init() {
  const fastify = Fastify({
    ajv: {
      customOptions: {
        keywords: ['example'],
      },
    },
    genReqId: function (req) {
      // header best practice: don't use "x-" https://www.rfc-editor.org/info/rfc6648 and keep it lowercase
      const requestId = req.headers['request-id'];

      return typeof requestId === 'string' ? requestId : randomUUID();
    },
    ignoreDuplicateSlashes: true,
    logger: {
      level: env.log.level,
      redact: ['headers.authorization'],
    },
  });

  await server(fastify);

  // TODO: enable after adding db
  const gracefulServer = GracefulServer(fastify.server, {
    // closePromises: [closeDbConnection],
  });

  gracefulServer.on(GracefulServer.READY, () => {
    fastify.log.info('Server is ready');
  });

  gracefulServer.on(GracefulServer.SHUTTING_DOWN, () => {
    fastify.log.info('Server is shutting down');
  });

  gracefulServer.on(GracefulServer.SHUTDOWN, (error) => {
    if (error instanceof Error) {
      fastify.log.info('Server is down because of', error.message);
    }
  });

  try {
    await fastify.listen({ port: env.server.port });
    gracefulServer.setReady();
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

await init();
