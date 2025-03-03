
import { FastifyPluginAsync } from 'fastify';

const root: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.get('/health', async function (request, reply) {
        reply.send('Hello World!');
    });
};

export default root;