import { Router } from "express";

import AuthController from "../controllers/AuthController";

const authController = new AuthController();

const route = Router();

route.post("/");
route.post("/auth", authController.authentication);

export default route;
