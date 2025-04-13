import { Router } from "express";
import verfiyJWT from "../middlewares/auth.middlewares.js";
import {
  registerInteraction,
  getChapterInteraction,
  deleteInteraction,
  updateInteraction,
  getDoubts,
} from "../controllers/interaction.controllers.js";
const interactionRouter = Router();

interactionRouter.post("/create-interaction", verfiyJWT, registerInteraction);
interactionRouter.get("/get-doubts/:id", verfiyJWT, getDoubts);
interactionRouter.get(
  "/get-interactions/:id",
  verfiyJWT,
  getChapterInteraction
);
interactionRouter.delete(
  "/delete-interaction/:id",
  verfiyJWT,
  deleteInteraction
);
interactionRouter.patch(
  "/update-interaction/:id",
  verfiyJWT,
  updateInteraction
);

export default interactionRouter;
