export enum HttpStatusCode {
    OK = 200,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER = 500,
}

export enum DatabaseErrorType {
    UNIQUE = "unique",
    NOT_FOUND = "not found",
}

class DatabaseError extends Error {
    public readonly name: DatabaseErrorType;
    public detail?: string;

    constructor(name: DatabaseErrorType, message: string, detail?: string) {
        super(message);

        this.name = name;
        this.detail = detail;

        Error.captureStackTrace(this);
    }

    setDetail(detail: string) {
        this.detail = detail;

        return this;
    }
}

class BaseError extends Error {
    public readonly name: string;
    public readonly httpCode: HttpStatusCode;
    public readonly isOperational: boolean;

    constructor(
        name: string,
        httpCode: HttpStatusCode,
        isOperational: boolean,
        description: string
    ) {
        super(description);
        Object.setPrototypeOf(this, new.target.prototype);

        this.name = name;
        this.httpCode = httpCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this);
    }
}

class HTTP400Error extends BaseError {
    constructor(description = "bad request") {
        super("BAD REQUEST", HttpStatusCode.BAD_REQUEST, true, description);
    }
}

class HTTP404Error extends BaseError {
    constructor(description = "not found") {
        super("NOT FOUND", HttpStatusCode.NOT_FOUND, true, description);
    }
}

class HTTP500Error extends BaseError {
    constructor(description = "Something went wrong. Try again later.") {
        super(
            "INTERNAL SERVER",
            HttpStatusCode.INTERNAL_SERVER,
            false,
            description
        );
    }
}

export { BaseError, DatabaseError, HTTP400Error, HTTP404Error, HTTP500Error };
