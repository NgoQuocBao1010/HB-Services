import { Column, Entity, Index } from "typeorm";

import BaseModel from "./BaseModel.entity";

export enum Gender {
    male = "male",
    female = "female",
    nonBinary = "nonBinary",
    nonDisclosure = "nonDisclosure",
}

@Entity("users")
export class User extends BaseModel {
    @Index("email_index")
    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: true })
    displayName?: string;

    @Column({ nullable: false, default: Gender.nonDisclosure })
    gender: string;

    @Column({ nullable: true })
    address?: string;

    @Column({ nullable: true })
    age?: number;
}
