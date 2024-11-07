import { Router } from "express";
import userControllerFactory from "@/controllers/factories/userControllerFactory";

const userRouter = Router();
const userController = userControllerFactory();

userRouter.post("/registry", (req, res) => userController.registry(req, res));

export default userRouter;
