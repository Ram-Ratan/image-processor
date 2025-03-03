import { FastifyInstance, FastifyError, FastifyReply, FastifyRequest } from 'fastify';


const errorHandlerPlugin = (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    console.error(error); 

    const statusCode = error.statusCode || 500;
    const response = {
        statusCode,
        error: error.name,
        message: error.message,
    };

    reply.status(statusCode).send(response);
}

export default errorHandlerPlugin;