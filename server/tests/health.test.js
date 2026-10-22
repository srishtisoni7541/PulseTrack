
import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../src/constants/app";

describe("Health endpoints", () => {
  it("reports that the API process is alive", async () => {
    const response = await request(app).get("/api/health/live");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
      check: "liveness",
    });
  });

  it("returns 503 when the database is disconnected", async () => {
    const response = await request(app).get("/api/health/ready");

    expect(response.status).toBe(503);
    expect(response.body.status).toBe("not_ready");
  });

  it("returns a consistent 404 for unknown routes", async () => {
    const response = await request(app).get("/api/does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("ROUTE_NOT_FOUND");
  });
});
