import { NextFunction, Request, Response } from "express";

import type { CreateUserRequestBody } from "../../schemas/user.schema";
import type { PaginationRequestQuery } from "../../types";

import UserRepository from "../../db/repositories/User.repo";
import { validateRequestPayloadSchema } from "../../helpers/utils";
import { createUserBodySchema } from "../../schemas/user.schema";

export default {
    getAll: async (
        req: Request<{}, {}, {}, PaginationRequestQuery>,
        res: Response,
        next: NextFunction
    ) => {
        const page = Number(req.query.page || 1);
        const perPage = Number(req.query.perPage || 10);

        const skip = (page - 1) * perPage;

        try {
            const users = await UserRepository.retrieveAll(skip, perPage);

            return res.status(200).json({
                users,
            });
        } catch (error: any) {
            return next(error);
        }
    },
    getById: async (
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.params;
            const user = await UserRepository.retrieveById(id);

            return res.status(200).json({
                user,
            });
        } catch (error: any) {
            return next(error);
        }
    },
    getByEmail: async (
        req: Request<{ email: string }>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { email } = req.params;
            const user = await UserRepository.retrieveByEmail(email);

            return res.status(200).json({
                user,
            });
        } catch (error: any) {
            return next(error);
        }
    },
    create: async (
        req: Request<{}, {}, CreateUserRequestBody>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const payload = validateRequestPayloadSchema(
                createUserBodySchema,
                req.body
            );

            const user = await UserRepository.store(payload);

            return res.status(201).json({
                user,
            });
        } catch (error: any) {
            return next(error);
        }
    },
};
