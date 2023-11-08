import type { Express } from "express";

import userRoute from "./routes/user.route";

export default (app: Express) => {
    app.use("/api/users", userRoute);
};
