import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import swaggerUiExpress from "swagger-ui-express";

import env from "./constants/env";
import { connectToDB } from "./db/AppDataSource";
import { BaseError, HTTP404Error, HTTP500Error } from "./errors/AppErrors";
import { dbErrorToHttpError } from "./errors/errorHandler";
import Logger from "./libs/Logger";
import getChannel from "./messages/RabbitMQ";
import routersHandler from "./routers";
import morganMiddleware from "./routers/middlewares/morganLogger";
import swaggerSchema from "./schemas/swagger.schema";

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

// ** Swagger
app.use(
    "/api/docs",
    swaggerUiExpress.serve,
    swaggerUiExpress.setup(swaggerSchema, {
        customSiteTitle: "Node.js Server",
    })
);

app.use(morganMiddleware);

// ** Health Check Endpoint
app.get("/api/health-check", async (_: Request, res: Response) => {
    return res.status(200).json({
        name: "User API server",
        version: "v1.0.0",
    });
});

//
app.get(
    "/api/rabbit-mq/test",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = {
                message: "Hello from user service" + Date.now(),
            };
            let dataFromMQ;

            const channel = getChannel();

            channel.sendToQueue("USERS", Buffer.from(JSON.stringify(data)));

            await channel.consume("USERS_2", (data) => {
                try {
                    console.log("Data from users 2");
                    channel.ack(data!);
                    dataFromMQ = JSON.parse(data?.content.toString() || "null");

                    console.log(res.getHeaders());
                    res.json({ data: dataFromMQ, code: 200 });
                    channel.close();
                } catch (error) {
                    next(error);
                }
            });
        } catch (error) {
            next(error);
        }
    }
);

// ** Router handlers
routersHandler(app);

// ** Wrong path handler
app.all("*", (_, __, next) => {
    next(
        new HTTP404Error("The requested URL could not be found on this server.")
    );
});

// ** Global error handler
app.use(
    (err: BaseError | Error, req: Request, res: Response, _: NextFunction) => {
        // Convert caught database error to HTTP error
        const error = dbErrorToHttpError(err);

        // Check if the error is a custom BaseError
        const isCaughtError = error instanceof BaseError;
        const httpCode = isCaughtError ? error.httpCode : 500;

        // Prepare the response error object, default to HTTP500Error if not caught error
        let resError = isCaughtError ? error : new HTTP500Error();

        if (!isCaughtError) {
            // Check if the error is a SyntaxError and contains a "body" property
            if (error instanceof SyntaxError && "body" in error)
                resError = new HTTP404Error("Invalid JSON body");

            // Log the uncaught error for further investigation
            Logger.error(error);
        }

        // Log the error for API analytics
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
