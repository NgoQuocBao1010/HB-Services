import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import "reflect-metadata";

import env from "./constants/env";
import { connectToDB } from "./db/AppDataSource";
import { BaseError, HTTP404Error, HTTP500Error } from "./errors/AppErrors";
import { dbErrorToHttpError, handleSqliteErrors } from "./errors/errorHandler";
import Logger from "./libs/Logger";
import routersHandler from "./routers";
import morganMiddleware from "./routers/middlewares/morganLogger";

// ** Try connect to SQLite
connectToDB();

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

// ** Router handlers
routersHandler(app);

// ** Wrong path handler
app.all("*", (req, _, next) => {
    next(
        new HTTP404Error("The requested URL could not be found on this server.")
    );
});

// ** Global error handler
app.use(
    (err: BaseError | Error, req: Request, res: Response, _: NextFunction) => {
        const error = dbErrorToHttpError(err);

        const isCaughtError = error instanceof BaseError;

        const httpCode = isCaughtError ? error.httpCode : 500;
        let resError = isCaughtError ? error : new HTTP500Error();

        if (!isCaughtError) {
            if (error instanceof SyntaxError && "body" in error)
                resError = new HTTP404Error("Invalid JSON body");

            Logger.error(error);
        }

        Logger.apiError(req, resError);
        return res.status(httpCode).json({
            message: resError.message,
            error: resError,
        });
    }
);

const port = env.SERVER_PORT;
app.listen(port, () => {
    Logger.info(`Environment: ${env.SERVER_ENV}`);
    Logger.info(`Server is live: http://localhost:${port}`);
});

export default app;
