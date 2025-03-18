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

todoRouter.get("/get-todo/:user", getTodosByUser);
todoRouter.post("/create-todo/:user", createTodo);
todoRouter.put("/update-todo/:todoid", updateTodo);
todoRouter.put("/set-visibility-hidden/:todoid", setVisibilityHidden);
todoRouter.put("/toggle-completion-status/:todoid", toggleCompletionStatus);
todoRouter.get("/get-pinned-todos/:user", getPinnedTodos);
todoRouter.put("/toggle-pin-status/:todoid", togglePinStatus);

export default todoRouter;
