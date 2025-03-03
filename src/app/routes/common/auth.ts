import { FastifyInstance, RouteShorthandOptions } from 'fastify';

export namespace AuthCommon {
    export const RouteOptions: (
        fastify: FastifyInstance
    ) => Pick<RouteShorthandOptions, 'onRequest' > = (fastify) => ({
        onRequest: [fastify.initializeRequestContext]
    });
}