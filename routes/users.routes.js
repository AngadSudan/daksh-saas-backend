import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  resetPassword,
  updateUserProfile,
} from "../controllers/users.controllers.js";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile/:userid", getUserProfile);
userRouter.put("/reset-password/:userid", resetPassword);
userRouter.put("/update-profile/:userid", updateUserProfile);

export default userRouter;
