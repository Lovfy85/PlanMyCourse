const request = require("supertest");

// Mock MySQL connection BEFORE importing app
jest.mock("../config.js");
const connectMade = require("../config.js");

// Import the express app (NOT server.js)
const app = require("../app");

describe("CoursesAdded API Routes", () => {

    // ------------------ GET /coursesadded ------------------
    test("GET /coursesadded returns a list of added courses", async () => {
        connectMade.query.mockImplementation((query, callback) => {
            callback(null, [
                { id: 1, taken: 0, courseId: "CMPT140", title: "Intro", subject: "CMPT", number: 140 }
            ]);
        });

        const res = await request(app).get("/coursesadded");

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].courseId).toBe("CMPT140");
    });

    // ------------------ GET /coursesadded/:courseId ------------------
    test("GET /coursesadded/:courseId returns exists=true", async () => {
        connectMade.query.mockImplementation((query, params, callback) => {
            callback(null, [{ id: 1, courseId: "CMPT140", taken: 0 }]);
        });

        const res = await request(app).get("/coursesadded/CMPT140");

        expect(res.statusCode).toBe(200);
        expect(res.body.exists).toBe(true);
    });

    // ------------------ POST /coursesadded ------------------
    test("POST /coursesadded inserts a new course", async () => {
        // First call: checkQuery (course doesn't exist)
        connectMade.query
            .mockImplementationOnce((q, params, cb) => cb(null, []))
            // Second call: insertQuery
            .mockImplementationOnce((q, params, cb) => cb(null, { insertId: 123 }));

        const res = await request(app)
            .post("/coursesadded")
            .send({ courseId: "CMPT100", taken: false });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("Course added successfully");
    });

    // ------------------ POST duplicate ------------------
    test("POST /coursesadded returns error when duplicate courseId exists", async () => {
        connectMade.query.mockImplementation((q, params, cb) => {
            cb(null, [{ id: 1 }]); // simulate duplicate exists
        });

        const res = await request(app)
            .post("/coursesadded")
            .send({ courseId: "CMPT100", taken: false });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Course ID already exists");
    });

    // ------------------ PUT /coursesadded/:id ------------------
    test("PUT /coursesadded/:id updates taken value", async () => {
        connectMade.query.mockImplementation((q, params, cb) => {
            cb(null, { affectedRows: 1 });
        });

        const res = await request(app)
            .put("/coursesadded/1")
            .send({ taken: true });

        expect(res.statusCode).toBe(201);
        expect(res.body.id).toBe("1");
        expect(res.body.taken).toBe(true);
    });

    // ------------------ DELETE /coursesadded/:id ------------------
    test("DELETE /coursesadded/:id deletes the course", async () => {
        connectMade.query.mockImplementation((q, params, cb) => {
            cb(null, { affectedRows: 1 });
        });

        const res = await request(app).delete("/coursesadded/1");

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("The course that was added before is now deleted.");
    });

});