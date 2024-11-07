import { Router } from "express";
import ratingControllerFactory from "@/controllers/factories/ratingControllerFactory";
import ensureAuthenticated from "@/middleware/ensureAuthenticated";

const ratingRouter = Router();
const ratingController = ratingControllerFactory();

ratingRouter.use(ensureAuthenticated);
ratingRouter.post("/", (req, res) => ratingController.create(req, res));
ratingRouter.get("/:movieId", (req, res) => ratingController.findAll(req, res));
ratingRouter.put("/:ratingId", (req, res) => ratingController.update(req, res));
ratingRouter.delete("/:ratingId", (req, res) =>
  ratingController.delete(req, res)
);

export default ratingRouter;
