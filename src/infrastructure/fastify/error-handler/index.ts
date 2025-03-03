import { PrismaClientInitializationError, PrismaClientKnownRequestError, PrismaClientRustPanicError, PrismaClientUnknownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { AppError } from '@shared/error/AppError';
import { logger } from '@shared/logger';
import { AxiosError } from 'axios';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { hasZodFastifySchemaValidationErrors, isResponseSerializationError, ZodFastifySchemaValidationError } from 'fastify-type-provider-zod';

const transformError = (error: FastifyError) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
        const validation = error.validation as ZodFastifySchemaValidationError[];
        return validation.map(
            (error, ind) =>
                `Error #${ind + 1}: Code: ${error.params.issue.code} ~ Name: ${
                    error.params.issue.path.join('.')
                } ~ Message: ${error.params.issue.message} `
        );
    }
    if (isResponseSerializationError(error)) {
        return error.cause.issues.map(
            (issue, ind) =>
                `Error #${ind + 1} Code: ${issue.code} ~ Name: ${issue.path.join('.')} ~ Message: ${
                    issue.message
                } `
        );
    }
    return error;
};


const errorHandlerPlugin = (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    logger.log.error(`${error.constructor.name}: ${transformError(error)}`);

    // zod schema validation
    if (hasZodFastifySchemaValidationErrors(error)) {
        return reply.code(400).send({
            statusCode: 400,
            error: 'Validation Error',
            message: 'Data Validation Error!',
            data: error.validation
        });
    }
    // zod response serialization
    if (isResponseSerializationError(error)) {
        return reply.code(400).send({
            statusCode: 400,
            error: 'Validation Error',
            message: 'Data Validation Error!',
            data: error.cause.issues
        });
    }
    // AppError
    else if (error instanceof AppError) {
        return reply.code(error.statusCode).send({
            statusCode: error.statusCode,
            error: error.error,
            message: error.message,
            data: error.data
        });
    }
    // Unauthorized Error
    else if (error.statusCode === 401) {
        return reply.unauthorized('Unauthorized!');
    }
    // axios
    else if (error instanceof AxiosError && error.isAxiosError) {
        return reply.code(error.response?.status || 500).send({
            statusCode: error.response?.status || 500,
            error: error.response?.statusText || 'Error!',
            message: 'Internal Server Error!',
            data: error.toJSON()
        });
    }
    // prisma
    /**
     * @see https://www.prisma.io/docs/orm/reference/error-reference
     */
    else if (error instanceof PrismaClientKnownRequestError) {
        if (['P2015', 'P2025'].includes(error.code)) {
            return reply.notFound(error.message);
        }
        return reply.internalServerError('Database Error!');
    } else if (
        error instanceof PrismaClientUnknownRequestError ||
        error instanceof PrismaClientRustPanicError ||
        error instanceof PrismaClientInitializationError ||
        error instanceof PrismaClientValidationError
    ) {
        return reply.internalServerError('Unknown Database Error!');
    }

    return reply.internalServerError('Something Went Wrong!');
}

export default errorHandlerPlugin;