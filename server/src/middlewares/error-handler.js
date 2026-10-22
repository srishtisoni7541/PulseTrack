
import { env } from "../config/env.js";

export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: {
      code: "ROUTE_NOT_FOUND",
      message: "The requested route was not found",
    },
  });
}

export const errorHandler = (error, req, res, next) => {
  const status =
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number" &&
    error.status >= 400 &&
    error.status < 500
      ? error.status
      : 500;

  const message =
    error instanceof Error ? error.message : "Unknown error";

  if (env.NODE_ENV !== "test") {
    console.error("Request failed", {
      status,
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
  }

  res.status(status).json({
    success: false,
    error: {
      code: status === 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR",
      message:
        status === 500
          ? "An unexpected error occurred"
          : message,
    },
  });
};