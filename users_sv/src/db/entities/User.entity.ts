import * as bcrypt from "bcryptjs";
import { BeforeInsert, Column, Entity, Index } from "typeorm";

import BaseModel from "./BaseModel.entity";

@Entity("users")
export class User extends BaseModel {
    @Index("email_index")
    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: true })
    displayName: string;

    toJSON() {
        return {
            ...this,
            password: undefined,
        };
    }

    /**
     * @description Hashes the password before inserting the entity into the database.
     * This function is automatically called before insertion.
     * @returns A promise that resolves once the password is hashed.
     */
    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 12);
    }

    /**
     * @description Compares a provided password with a hashed password using bcrypt.
     * @param providedPassword - The plain text password provided by the user.
     * @param hashedPassword - The hashed password retrieved from the database.
     * @returns A Promise that resolves to true if the passwords match, or false otherwise.
     */
    static async comparePasswords(
        providedPassword: string,
        hashedPassword: string
    ): Promise<boolean> {
        return await bcrypt.compare(providedPassword, hashedPassword);
    }
}
