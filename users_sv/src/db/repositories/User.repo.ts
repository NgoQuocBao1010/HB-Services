import { FindOptionsWhere, In, IsNull, Not } from "typeorm";

import type { CreateUserRequestBody } from "../../schemas/user.schema";

import { DatabaseError, DatabaseErrorType } from "../../errors/AppErrors";
import { handleSqliteErrors } from "../../errors/errorHandler";
import { AppDataSource } from "../AppDataSource";
import { User } from "../entities/User.entity";

const UserRepository = AppDataSource.getRepository(User).extend({
    findAll: async function (skip: number = 0, take: number = 100) {
        return await this.find({
            skip,
            take,
            order: {
                createdAt: "DESC",
            },
        });
    },
    store: async function (userData: CreateUserRequestBody) {
        try {
            const user = this.create({
                ...userData,
            });

            await this.insert([user]);

            return user;
        } catch (err: any) {
            const error = handleSqliteErrors(err);

            if (error.name === DatabaseErrorType.UNIQUE) {
                throw error.setDetail("Invalid email");
            }
        }
    },
});

export default UserRepository;
