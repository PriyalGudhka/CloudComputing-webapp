import winston from 'winston';

export const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),

    transports: [new winston.transports.File({
        filename: '/var/log/myapp.log',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        )
    }), new winston.transports.Console()],
});
