import { z } from 'zod';

import { config } from 'dotenv';
config();

export const appEnv = z
    .object({
        APP_NAME: z.string(),
        APP_PORT: z.string().transform((x) => parseInt(x)),
        APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
        APP_HOST: z.string(),
        DATABASE_URL: z.string().url().optional(),
        //REDIS
        REDIS_HOST: z.string(),
        REDIS_PORT: z.string().transform((x) => parseInt(x)),
        REDIS_USER: z.string().optional(),
        REDIS_PASSWORD: z.string().optional(),
        // AWS
        AWS_REGION: z.string(),
        AWS_ACCESS_KEY_ID: z.string(),
        AWS_SECRET_ACCESS_KEY: z.string(),
        AWS_S3_BUCKET_NAME: z.string(),
    })
    .parse(process.env);
