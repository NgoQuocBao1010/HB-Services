import express, { Router } from "express";

import usersController from "../controllers/users.controller";

const router = express.Router();

router.route("/").get(usersController.getAll).post(usersController.create);
router.route("/:id").get(usersController.getById);
router.route("/email/:email").get(usersController.getByEmail);

export default router as Router;
