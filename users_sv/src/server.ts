import bodyParser from "body-parser";
import cors from "cors";
import express, { Request, Response } from "express";

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        credentials: true,
        origin: "*",
    })
);

// ** Health Check Endpoint
app.get("/api/health-check", async (_: Request, res: Response) => {
    return res.status(200).json({
        name: "Node.js Express server",
        version: "v1.0.0",
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is live: http://localhost:${port}`);
});

export default app;
