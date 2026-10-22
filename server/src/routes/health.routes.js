
import { Router } from "express";
import { isMongoReady } from "../database/db.js";

const router = Router();

// Liveness check: server running hai ya nahi
router.get("/live", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PulseTrack API is running",
  });
});

// Readiness check: server requests handle karne ke liye ready hai ya nahi
router.get("/ready", (req, res) => {
  const databaseConnected = isMongoReady();

  res.status(databaseConnected ? 200 : 503).json({
    success: databaseConnected,
    message: databaseConnected
      ? "PulseTrack API is ready"
      : "Database connection is not ready",
    database: databaseConnected ? "connected" : "disconnected",
  });
});

export default router;
