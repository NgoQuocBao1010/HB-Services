import { TypeOf, z } from "zod";

import { Gender } from "../db/entities/User.entity";

export const updatableUserInfo = {
    displayName: z.string().min(1).optional(),
    gender: z.nativeEnum(Gender).optional(),
    address: z.string().min(1).optional(),
    age: z.number().min(1).optional(),
};

export const createUserBodySchema = z.object({
    email: z
        .string()
        .email("invalid email format. Please enter a valid email address."),
    ...updatableUserInfo,
});

export const updateUserBodySchema = z.object({
    ...updatableUserInfo,
});

export type CreateUserRequestBody = TypeOf<typeof createUserBodySchema>;
export type UpdateUserRequestBody = TypeOf<typeof updateUserBodySchema>;
