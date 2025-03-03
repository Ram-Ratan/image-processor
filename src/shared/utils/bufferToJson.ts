import { parse } from "csv-parse";


/**
 * Converts a buffer containing CSV data to a JSON object.
 *
 * @param buffer - The buffer containing CSV data.
 * @returns A promise that resolves to a JSON object.
 */
export function bufferToJson(buffer: Buffer): Promise<any> {
    return new Promise((resolve, reject) => {
        parse(buffer, { columns: true, trim: true }, (err, records) => {
            if (err) {
                return reject(err);
            }
            resolve(records);
        });
    });
}
