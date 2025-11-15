const request = require("supertest");
const express = require("express");
const authRoutes = require("../routes/auth");
const connectMade = require("../config.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("../config.js");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

describe("Auth API Routes", () => {

  // ------------------ SIGNUP ------------------
  test("POST /auth/signup - success", async () => {
    connectMade.query.mockImplementationOnce((query, params, callback) => callback(null, [])) // no existing user
                 .mockImplementationOnce((query, params, callback) => callback(null, { insertId: 1 })); // insert success
    bcrypt.hash.mockResolvedValue("hashedPassword");

    const res = await request(app)
      .post("/auth/signup")
      .send({ username: "newuser", password: "password123" });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User created successfully");
    expect(res.body.username).toBe("newuser");
  });

  test("POST /auth/signup - missing fields", async () => {
    const res = await request(app)
      .post("/auth/signup")
      .send({ username: "" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Username and password are required.");
  });

  test("POST /auth/signup - username exists", async () => {
    connectMade.query.mockImplementationOnce((query, params, callback) => callback(null, [{ userId: 1 }]));

    const res = await request(app)
      .post("/auth/signup")
      .send({ username: "existinguser", password: "password123" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Username already exists.");
  });

  test("POST /auth/signup - DB error", async () => {
    connectMade.query.mockImplementationOnce((query, params, callback) => callback(new Error("DB error")));

    const res = await request(app)
      .post("/auth/signup")
      .send({ username: "user", password: "pass" });

    expect(res.statusCode).toBe(500);
  });

  // ------------------ LOGIN ------------------
  test("POST /auth/login - success", async () => {
    const fakeUser = { userId: 1, username: "user1", password: "hashedPass" };
    connectMade.query.mockImplementationOnce((query, params, callback) => callback(null, [fakeUser]));
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("token123");

    const res = await request(app)
      .post("/auth/login")
      .send({ username: "user1", password: "password" });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Registered User is now logged in the website.");
    expect(res.body.tokenGiven).toBe("token123");
  });

  test("POST /auth/login - wrong password", async () => {
    const fakeUser = { userId: 1, username: "user1", password: "hashedPass" };
    connectMade.query.mockImplementationOnce((query, params, callback) => callback(null, [fakeUser]));
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app)
      .post("/auth/login")
      .send({ username: "user1", password: "wrongpass" });

    expect(res.statusCode).toBe(401);
  });

  test("POST /auth/login - user not found", async () => {
    connectMade.query.mockImplementationOnce((query, params, callback) => callback(null, []));

    const res = await request(app)
      .post("/auth/login")
      .send({ username: "nouser", password: "pass" });

    expect(res.statusCode).toBe(401);
  });

  test("POST /auth/login - DB error", async () => {
    connectMade.query.mockImplementationOnce((query, params, callback) => callback(new Error("DB error")));

    const res = await request(app)
      .post("/auth/login")
      .send({ username: "user", password: "pass" });

    expect(res.statusCode).toBe(500);
  });
});