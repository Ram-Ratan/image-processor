import { LoggerOptions, pino } from 'pino';
import { appEnv } from '@shared/constants/env';

const envToLogger: {
    [key in 'development' | 'staging' | 'production']: LoggerOptions;
} = {
    development: {
        transport: {
            targets: [
                {
                    target: 'pino-pretty',
                    options: {
                        translateTime: 'HH:MM:ss Z',
                        ignore: 'pid,hostname',
                        colorize: true
                    },
                    level: 'trace'
                }
            ]
        }
    },
    staging: {
        transport: {
            targets: [
                {
                    target: 'pino/file',
                    options: { destination: './logfile' },
                    level: 'debug'
                }
            ]
        }
    },
    production: {
        transport: {
            targets: [
                {
                    target: 'pino/file',
                    options: { destination: './logfile' },
                    level: 'info'
                }
            ]
        }
    }
};

const pinoLogger = pino({
    ...envToLogger[appEnv.APP_ENV]
});

export const logger = { log: pinoLogger };
