import { FindOptionsWhere, In, IsNull, Not } from "typeorm";

import type { CreateUserRequestBody } from "../../schemas/user.schema";

import { DatabaseError, DatabaseErrorType } from "../../errors/AppErrors";
import { handleSqliteErrors } from "../../errors/errorHandler";
import { AppDataSource } from "../AppDataSource";
import { User } from "../entities/User.entity";

const UserRepository = AppDataSource.getRepository(User).extend({
    // ** Find/Retrieve ** \\
    retrieveAll: async function (skip: number = 0, take: number = 100) {
        return await this.find({
            skip,
            take,
            order: {
                createdAt: "DESC",
            },
        });
    },
    retrieveById: async function (id: string) {
        try {
            return await this.findOneByOrFail({ id });
        } catch (err: any) {
            const error = handleSqliteErrors(err);

            if (error.name === DatabaseErrorType.NOT_FOUND) {
                throw error.setDetail("User with the given Id cannot be found");
            }

            throw err;
        }
    },
    retrieveByEmail: async function (email: string) {
        try {
            return await this.findOneByOrFail({ email });
        } catch (err: any) {
            const error = handleSqliteErrors(err);

            if (error.name === DatabaseErrorType.NOT_FOUND) {
                throw error.setDetail(
                    "User with the given email cannot be found"
                );
            }

            throw err;
        }
    },

    // ** Create/Update ** \\
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

            throw err;
        }
    },
});

export default UserRepository;
