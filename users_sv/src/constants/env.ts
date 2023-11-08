import dotenv from "dotenv";
import { cleanEnv, port, str, url } from "envalid";
import path from "path";

// Parsing the env file.
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Interface
export interface ENV {
    SERVER_ENV: string;
    SERVER_PORT: number;
}

const env: ENV = cleanEnv(process.env, {
    SERVER_ENV: str({ choices: ["dev", "test", "production", "staging"] }),
    SERVER_PORT: port({ default: 9000 }),
});

export default env;
