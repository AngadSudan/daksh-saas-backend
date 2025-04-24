import { Router } from "express";
import verfiyJWT from "../middlewares/auth.middlewares.js";
import {
  registerInteraction,
  getChapterInteraction,
  deleteInteraction,
  updateInteraction,
  getDoubts,
  submitQuiz,
  getAllQuiz,
  getQuiz,
  getAllOnlineQuiz,
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
interactionRouter.get("/get-quiz/:id", verfiyJWT, getQuiz);
interactionRouter.get("/get-all-quiz/:id", verfiyJWT, getAllQuiz);
interactionRouter.get("/get-all-online-quiz/:id", verfiyJWT, getAllOnlineQuiz);
interactionRouter.patch(
  "/update-interaction/:id",
  verfiyJWT,
  updateInteraction
);
interactionRouter.post("/submit-quiz/:id", verfiyJWT, submitQuiz);
export default interactionRouter;
