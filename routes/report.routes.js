import { Router } from "express";
import {
  getUserReport,
  getAllUserReport,
} from "../controllers/report.controllers.js";
import verfiyJWT from "../middlewares/auth.middlewares.js";
const reportRouter = Router();

reportRouter.use(verfiyJWT);
reportRouter.get("/user/:id", getUserReport);
reportRouter.get("/all-users/:id", getAllUserReport);

export default reportRouter;
