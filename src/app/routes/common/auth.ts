import { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { z } from 'zod';

export namespace AuthCommon {
    export const RouteOptions: (
        fastify: FastifyInstance
    ) => Pick<RouteShorthandOptions, 'onRequest' > = (fastify) => ({
        onRequest: [fastify.initializeRequestContext]
    });
}