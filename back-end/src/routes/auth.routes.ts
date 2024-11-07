import { Router } from "express";
import authControllerFactory from "@/controllers/factories/authControllerFactory";
import ensureAuthenticated from "@/middleware/ensureAuthenticated";

const authRouter = Router();
const authController = authControllerFactory();

authRouter.post("/login", (req, res) => authController.login(req, res));
authRouter.get("/logout", (req, res) => authController.logout(req, res));
authRouter.get("/profile", ensureAuthenticated, (req, res) =>
  authController.profile(req, res)
);
export default authRouter;
