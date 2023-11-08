import path from "path";
import "reflect-metadata";
import { DataSource } from "typeorm";
import Logger from "../libs/Logger";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "db.sqlite3",
    synchronize: true,
    logging: false,
    entities: [path.join(__dirname, "**", "*.entity.{ts,js}")],
    migrations: [],
    subscribers: [],
});

export const connectToDB = async () => {
    try {
        if (!AppDataSource.isInitialized) await AppDataSource.initialize();
        Logger.info("SQLite3 Database connected successfully");
    } catch (err: any) {
        Logger.error("Unable to connect to SQLite3");
        Logger.error(err);
    }
};
