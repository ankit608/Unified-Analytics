const request = require("supertest");
const express = require("express");
const eventsRouter = require("../Routes/analytics"); // Use require, assuming your events.js exports with module.exports or use .default for ES modules

const app = express();
app.use(express.json());
app.use("/api/events", eventsRouter);

describe("Events API", () => {
  let createdEventId;

  test("POST /api/analytics - create event", async () => {
    const newEvent = {
      event: "login_form_cta_click",
      url: "https://example.com",
      referrer: "https://google.com",
      device: "mobile",
      ip_address: "127.0.0.1",
      metadata: { browser: "Chrome", os: "Windows" },
      user_id: "user123"
    };

    const response = await request(app).post("/api/analytics/collect").send(newEvent);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.event).toBe(newEvent.event);
    createdEventId = response.body.id;
  });

  test("GET /api/events - get all events", async () => {
    const response = await request(app).get("/api/events");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /api/events/:id - get event by id", async () => {
    const response = await request(app).get(`/api/events/${createdEventId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id", createdEventId);
  });

  test("PUT /api/events/:id - update event", async () => {
    const updatedData = { event: "logout_click" };
    const response = await request(app)
      .put(`/api/events/${createdEventId}`)
      .send(updatedData);
    expect(response.statusCode).toBe(200);
    expect(response.body.event).toBe(updatedData.event);
  });

  test("DELETE /api/events/:id - delete event", async () => {
    const response = await request(app).delete(`/api/events/${createdEventId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
  });
});
