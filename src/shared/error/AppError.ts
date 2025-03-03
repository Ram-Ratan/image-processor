/**
 * Represents an application-specific error.
 * 
 * This class extends the built-in Error class to provide a structured 
 * way to handle errors in applications. It includes properties for 
 * status code, error type, and optional additional data for context.
 */
export class AppError extends Error {
    /**
     * The HTTP status code associated with the error.
     */
    statusCode: number;

    /**
     * A short string describing the type/category of error.
     */
    error: string;

    /**
     * Optional additional data related to the error.
     * This can be used to provide more context about the error in complex scenarios/business logic.
     */
    data?: any;  

    /**
     * Creates an instance of the AppError class.
     * 
     * @param message - A descriptive message for the error.
     * @param statusCode - The HTTP status code associated with the error (default is 500).
     * @param error - A short string describing the type of error (default is 'Internal Server Error').
     * @param data - Optional additional data related to the error.
     */
    constructor(message: string, statusCode: number = 500, error: string = 'Internal Server Error', data?: any) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        this.error = error;
        this.data = data;
    }
}
