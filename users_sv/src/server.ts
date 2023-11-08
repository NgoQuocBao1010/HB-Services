import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";

import env from "./constants/env";
import {
    APIError,
    BaseError,
    HTTP404Error,
    HTTP500Error,
} from "./errors/AppError";
import Logger from "./libs/Logger";
import morganMiddleware from "./middlewares/morganLogger";

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        credentials: true,
        origin: "*",
    })
);

app.use(morganMiddleware);

// ** Health Check Endpoint
app.get("/api/health-check", async (_: Request, res: Response) => {
    return res.status(200).json({
        name: "Node.js Express server",
        version: "v1.0.0",
    });
});

// ** Wrong path handler
app.get("/api/error", (req, _, next) => {
    next(new Error("My intentional error"));
});

// ** Wrong path handler
app.all("*", (req, _, next) => {
    next(
        new HTTP404Error("The requested URL could not be found on this server.")
    );
});

// ** Global error handler
app.use(
    (err: BaseError | Error, req: Request, res: Response, _: NextFunction) => {
        const isCaughtError = err instanceof BaseError;

        const httpCode = isCaughtError ? err.httpCode : 500;
        const resError = isCaughtError ? err : new HTTP500Error();

        if (!isCaughtError) {
            Logger.error(err);
        }

        Logger.apiError(req, resError);
        return res.status(httpCode).json({
            message: resError.message,
            error: resError,
            stack: env.SERVER_ENV !== "production" ? resError.stack : undefined,
        });
    }
);

const port = env.SERVER_PORT;
app.listen(port, () => {
    Logger.info(`Environment: ${env.SERVER_ENV}`);
    Logger.info(`Server is live: http://localhost:${port}`);
});

export default app;
