import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

const logger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log' }),
        new winston.transports.Console()
    ]
});

export class AppError extends Error {
    constructor(public message: string, public statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    logger.error({
        message: err.message || 'Internal Server Error',
        statusCode: statusCode,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.originalUrl,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query
    });

    res.status(statusCode).json({
        message: statusCode === 500 ? 'Internal Server Error' : err.message,
        statusCode: statusCode,
    });
};