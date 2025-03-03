import { AppError } from "./AppError";

/**
 * Represents an error for when a requested resource is not found.
 * Extends the `AppError` class from `@compenly/fastify` package.
 * 
 * @class NotFoundError
 * @extends {AppError}
 * 
 * @param {string} [message='Resource not found'] - The error message to be displayed.
 * @param {any} [data] - Optional additional data related to the error.
 */
export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found', data?: any) {
        super(message, 404, data);
        this.name = 'NotFoundError';
        this.error = 'Not Found Error';
    }
}
