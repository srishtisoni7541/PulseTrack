
import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";

import { env } from "../config/env.js";
import healthRoutes from "../routes/health.routes.js";

import {
  notFoundHandler,
  errorHandler,
} from "../middlewares/error-handler.js";
import authRoutes from "../routes/auth.routes.js";

const app = express();

app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(pinoHttp());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to PulseTrack API",
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/auth",authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
