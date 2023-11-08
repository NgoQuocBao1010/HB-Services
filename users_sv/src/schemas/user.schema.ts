import { TypeOf, z } from "zod";

export const authCredentialParamsSchema = {
    email: z
        .string()
        .email("invalid email format. Please enter a valid email address."),
    password: z.string().min(5, "must be at least 5 characters"),
};

export const createUserBodySchema = z.object({
    ...authCredentialParamsSchema,
    displayName: z.string().min(1).optional(),
});

export type CreateUserRequestBody = TypeOf<typeof createUserBodySchema>;
