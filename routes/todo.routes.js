import { Router } from "express";
const todoRouter = Router();
import {
  getTodosByUser,
  createTodo,
  updateTodo,
  setVisibilityHidden,
  toggleCompletionStatus,
  getPinnedTodos,
  togglePinStatus,
} from "../controllers/todos.controllers.js";
import verifyJWT from "../middlewares/auth.middlewares.js";
todoRouter.get("/get-todo", verifyJWT, getTodosByUser);
todoRouter.post("/create-todo", verifyJWT, createTodo);
todoRouter.put("/update-todo/:todoid", verifyJWT, updateTodo);
todoRouter.delete(
  "/set-visibility-hidden/:todoid",
  verifyJWT,
  setVisibilityHidden
);
todoRouter.put(
  "/toggle-completion-status/:todoid",
  verifyJWT,
  toggleCompletionStatus
);
todoRouter.get("/get-pinned-todos/", verifyJWT, getPinnedTodos);
todoRouter.put("/toggle-pin-status/:todoid", verifyJWT, togglePinStatus);

export default todoRouter;
