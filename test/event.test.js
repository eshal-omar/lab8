const request = require("supertest");
const app = require("../server"); // Import Express app
let server;

beforeAll(() => {
  server = app.listen(4000); // Start test server on port 4000
});

afterAll((done) => {
  server.close(done); // Ensure Jest closes the server
});

describe("Event Planner API Tests", () => {
  let token = "";

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Test User", email: "test@example.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User registered successfully");
  });

  it("should log in the user and return a token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it("should create an event", async () => {
    const res = await request(app)
      .post("/api/events")
      .set("Authorization", token)
      .send({ name: "Meeting", description: "Project discussion", date: "2025-04-01", time: "10:00 AM" });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Meeting");
  });

  it("should get all events for the logged-in user", async () => {
    const res = await request(app)
      .get("/api/events")
      .set("Authorization", token);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
