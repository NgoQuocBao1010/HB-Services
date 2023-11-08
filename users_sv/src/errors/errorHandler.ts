import { EntityNotFoundError, QueryFailedError } from "typeorm";

import {
    BaseError,
    DatabaseError,
    DatabaseErrorType,
    HTTP400Error,
} from "./AppErrors";

/**
 * @description Returns a detailed formatted string representation of a BaseError object or a custom error object that extends BaseError.
 * @param err The BaseError object or a custom error object that extends BaseError.
 * @returns
 */
export const stringifyError = (err: BaseError | any) => {
    let message = `
  * Error Name (err.name): "${err.name}"
  * Error Message (err.message): "${err.message}"
  * Error Type (err.constructor.name): "${err.constructor.name}"
  * Error Code (err.code): "${err.code}"
  * Error HTTP Code (err.httpCode): ${err.httpCode}
  * Error Operational Status (err.isOperational): ${err.isOperational}\n`;

    // Include any additional error attributes
    for (const attr in err) {
        if (err.hasOwnProperty(attr) && typeof err[attr] !== "function") {
            message += `${attr}: ${err[attr]}\n`;
        }
    }

    // Include stack trace if available
    if (err.stack) {
        message += `Stack Trace:\n${err.stack}`;
    }

    return message;
};

export const handleSqliteErrors = (err: any) => {
    switch (err.code) {
        case "SQLITE_CONSTRAINT":
            return new DatabaseError(DatabaseErrorType.UNIQUE, err.message);
    }

    if (err instanceof EntityNotFoundError) {
        return new DatabaseError(DatabaseErrorType.NOT_FOUND, err.message);
    }

    throw new Error("Error while interact to Database");
};

export const dbErrorToHttpError = (err: any) => {
    if (err instanceof DatabaseError) {
        return new HTTP400Error(err.detail);
    }

    return err;
};
