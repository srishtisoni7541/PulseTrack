
import app from "./app.js";
import { env } from "../config/env.js";
import { connectMongo, disconnectMongo } from "../database/db.js";

async function startServer() {
  await connectMongo();

  const server = app.listen(env.PORT, "0.0.0.0", () => {
    console.info(`PulseTrack API listening on port ${env.PORT}`);
  });

  let shuttingDown = false;

  const shutdown = (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;

    console.info(`Received ${signal}; shutting down gracefully`);

    server.close(async (error) => {
      try {
        await disconnectMongo();

        if (error) {
          console.error("HTTP server shutdown failed");
          process.exitCode = 1;
        }
      } catch (dbError) {
        console.error("Database disconnect failed");
        process.exitCode = 1;
      }
    });
  };

  process.once("SIGTERM", () => shutdown("SIGTERM"));
  process.once("SIGINT", () => shutdown("SIGINT"));
}

startServer().catch((error) => {
  console.error("PulseTrack startup failed", {
    errorName: error instanceof Error ? error.name : "UnknownError",
  });

  process.exitCode = 1;
});
