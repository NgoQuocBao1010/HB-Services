import express, { Router } from "express";

import usersController from "../controllers/users.controller";

const router = express.Router();

router.route("/").get(usersController.getAll).post(usersController.create);

export default router as Router;
