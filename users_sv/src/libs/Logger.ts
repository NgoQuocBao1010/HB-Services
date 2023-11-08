import { Request } from "express";
import winston from "winston";

import env from "../constants/env";
import { BaseError } from "../errors/AppError";
import { stringifyError } from "../errors/errorHandler";

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const level = () => {
    const isDevelopment = env.SERVER_ENV !== "production";
    return isDevelopment ? "debug" : "warn";
};

const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "white",
};

winston.addColors(colors);

const format = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
        (info) => `[${info.timestamp} - ${info.level}]: ${info.message}`
    )
);

const transports = [
    new winston.transports.Console({
        format: winston.format.colorize({ all: true }),
    }),
    new winston.transports.File({
        filename: "./logs/errors.log",
        level: "error",
    }),
    new winston.transports.File({ filename: "./logs/server.log" }),
];

const logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
});

const Logger = {
    http: (message: string) => {
        logger.http(message);
    },
    error: (error: string | Error | BaseError) => {
        if (typeof error === "string") logger.error(error);
        else logger.error(stringifyError(error));
    },
    info: (message: string) => {
        logger.info(message);
    },
    warn: (message: string) => {
        logger.warn(message);
    },
    // Custom logging
    apiInfo: (req: Request, message: string) => {
        logger.info(`${req.method} ${req.originalUrl}: ${message}`);
    },
    apiError: (req: Request, error: Error | BaseError) => {
        let errorMessage: string = "";
        if (error instanceof BaseError) {
            errorMessage = `${error.name} - ${error.message}`;
        } else {
            errorMessage = stringifyError(error);
        }

        logger.error(`${req.method} ${req.originalUrl}: ${errorMessage}`);
    },
};

export default Logger;
