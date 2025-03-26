import express from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import mogoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import hpp from "hpp";
import TestingRouter from "./routes/ai.routes.js";
import { todoRouter, userRouter, communityRouter } from "./routes/index.js";
const app = express();
const port = process.env.PORT || 8000;
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 200,
  message: "Too many requests from this IP, please try again after 10 minutes",
});

//websecurity
app.use(helmet());
app.use(mogoSanitize());
app.use("/api", limiter);
app.use(hpp());

//express middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "device-remeber-token",
      "Access-Control-Allow-Origin",
      "Origin",
      "Accept",
    ],
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//error handling

const errorHandler = (error, req, res, next) => {
  console.error("Error:", error.message);
  console.error("Stack:", error.stack);

  // Handle specific error types
  if (error.name === "ValidationError") {
    return res.status(400).json({
      status: "error",
      message: "Validation Error",
      details: error.message,
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      status: "error",
      message: "Invalid ID format",
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      status: "error",
      message: "Duplicate key error",
    });
  }

  // Default error response
  res.status(error.status || 500).json({
    status: "error",
    message: error.message || "Internal Server Error",
    ...(ENV_VARS.NODE_ENV === "development" && { stack: error.stack }),
  });
};

app.use(errorHandler);

//routes
app.use("/api/v1/test/ai", TestingRouter);
app.use("/api/v1/todo", todoRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/community", communityRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Backend of the job portal application API ",
    version: "1.0.0",
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    FRONTEND_URL: process.env.FRONTEND_URL,
  });
});

app.get("/health", async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy!",
    timestamp: new Date(),
    environment: ENV_VARS.NODE_ENV,
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    dbStatus:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    FRONTEND_URL: ENV_VARS.FRONTEND_URL,
  });
});

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

app.listen(port, () => {
  console.log(
    `Server is running on port ${port} and the enviornment is ${process.env.NODE_ENV} mode`
  );
});

export { app as default };
