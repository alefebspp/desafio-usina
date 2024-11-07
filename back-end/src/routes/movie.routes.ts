import movieControllerFactory from "@/controllers/factories/movieControllerFactory";
import ensureAuthenticated from "@/middleware/ensureAuthenticated";
import { Router } from "express";

const movieRouter = Router();
const movieController = movieControllerFactory();
//movieRouter.use(ensureAuthenticated);
movieRouter.post("/", (req, res) => movieController.create(req, res));
movieRouter.get("/:movieId", (req, res) => movieController.find(req, res));
movieRouter.get("/", (req, res) => movieController.findAll(req, res));
movieRouter.patch("/:movieId", (req, res) => movieController.update(req, res));
movieRouter.delete("/:movieId", (req, res) => movieController.delete(req, res));

export default movieRouter;
