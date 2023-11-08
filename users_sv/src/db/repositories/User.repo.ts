import type {
    CreateUserRequestBody,
    UpdateUserRequestBody,
} from "../../schemas/user.schema";

import { DatabaseErrorType } from "../../errors/AppErrors";
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
    retrieveAllWithPagination: async function (
        skip: number = 0,
        take: number = 100
    ) {
        return await this.findAndCount({
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
    edit: async function (id: string, userData: UpdateUserRequestBody) {
        const user = await this.retrieveById(id);

        user.displayName = userData.displayName ?? user.displayName;
        user.gender = userData.gender ?? user.gender;
        user.address = userData.address ?? user.address;
        user.age = userData.age ?? user.age;

        await user.save();

        return user;
    },

    // ** Delete ** \\
    deleteById: async function (id: string) {
        const { affected: deletedRows } = await this.delete(id);

        return deletedRows || 0;
    },
});

export default UserRepository;
