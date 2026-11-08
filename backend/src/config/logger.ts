import pino from 'pino';

const isDevelopment = process.env.NODE_ENV !== "production";

const logger = pino(
    isDevelopment
        ? {
            level: 'info',
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss', // timestamps
                    ignore: 'pid,hostname',
                }
            }
        }
        : {}
);

export default logger;