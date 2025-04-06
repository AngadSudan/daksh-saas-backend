import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  resetPassword,
  updateUserProfile,
  getUserByEmail,
} from "../controllers/users.controllers.js";
import verifyJWT from "../middlewares/auth.middlewares.js";
const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile", verifyJWT, getUserProfile);
userRouter.put("/reset-password", verifyJWT, resetPassword);
userRouter.put("/update-profile", verifyJWT, updateUserProfile);
userRouter.post("/search-user", verifyJWT, getUserByEmail);
export default userRouter;
