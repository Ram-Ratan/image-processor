import { AppError } from "./AppError";

/**
 * Represents an error for when the input data for a request is invalid.
 * Extends the `AppError` class.
 * 
 * @class ValidationError
 * @extends {AppError}
 * 
 * @param {string} [message='Invalid data input'] - The error message to be displayed.
 * @param {any} [data] - Optional additional data related to the error.
 */
export class ValidationError extends AppError {
    constructor(message: string = 'Invalid data input', data?: any) {
        super(message, 400, data);
        this.name = 'ValidationError';
        this.error = 'Validation Error';
    }
}