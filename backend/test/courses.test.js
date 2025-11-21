const request = require("supertest");
const app = require("../app");
const connectMade = require("../config.js");

jest.mock("../config.js");

describe("Courses API", () => {

    // ------------------ GET /courses ------------------
    test("GET /courses returns all courses", async () => {
        connectMade.query.mockImplementation((sql, callback) => {
            callback(null, [
                { courseId: 740, class_name: "CMPT140" },
                { courseId: 741, class_name: "CMPT141" }
            ]);
        });

        const res = await request(app).get("/courses");

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
        expect(res.body[0].class_name).toBe("CMPT140");
    });


    // ------------------ GET /courses/search ------------------
    test("GET /courses/search returns results for term", async () => {
        connectMade.query.mockImplementation((query, params, callback) => {
            callback(null, [{ class_name: "CMPT140" }]);
        });

        const res = await request(app).get("/courses/search?term=CMPT");

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
    });

    test("GET /courses/search returns 400 if no term provided", async () => {
        const res = await request(app).get("/courses/search");
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Search term is required");
    });


    // ------------------ GET /courses/name/:name ------------------
    test("GET /courses/name/:name returns course", async () => {
        connectMade.query.mockImplementation((sql, params, callback) => {
            expect(params[0]).toBe("CMPT140"); // correct param passed
            callback(null, [{ class_name: "CMPT140" }]);
        });

        const res = await request(app).get("/courses/name/CMPT140");

        expect(res.status).toBe(200);
        expect(res.body[0].class_name).toBe("CMPT140");
    });


    // ------------------ GET /courses/id/:id ------------------
    test("GET /courses/id/:id returns course by ID", async () => {
        connectMade.query.mockImplementation((sql, params, callback) => {
            expect(params[0]).toBe("740");
            callback(null, [{ courseId: 740 }]);
        });

        const res = await request(app).get("/courses/id/740");

        expect(res.status).toBe(200);
        expect(res.body[0].courseId).toBe(740);
    });


    // ------------------ GET /courses/sort/alphabetical ------------------
    test("GET /courses/sort/alphabetical returns sorted courses", async () => {
        connectMade.query.mockImplementation((sql, callback) => {
            callback(null, [
                { class_name: "AAA100" },
                { class_name: "CMPT140" }
            ]);
        });

        const res = await request(app).get("/courses/sort/alphabetical");

        expect(res.status).toBe(200);
        expect(res.body[0].class_name).toBe("AAA100");
    });


    // ------------------ GET /courses/sort/number ------------------
    test("GET /courses/sort/number sorted by number", async () => {
        connectMade.query.mockImplementation((sql, callback) => {
            callback(null, [
                { number: 100 },
                { number: 214 }
            ]);
        });

        const res = await request(app).get("/courses/sort/number");

        expect(res.status).toBe(200);
        expect(res.body[0].number).toBe(100);
    });


    // ------------------ GET /courses/sort/addedtoplanner ------------------
    test("GET /courses/sort/addedtoplanner returns added first", async () => {
        connectMade.query.mockImplementation((sql, callback) => {
            callback(null, [
                { class_name: "CMPT214", added: 1 },
                { class_name: "CMPT145", added: 0 }
            ]);
        });

        const res = await request(app).get("/courses/sort/addedtoplanner");

        expect(res.status).toBe(200);
        expect(res.body[0].added).toBe(1);
        expect(res.body[1].added).toBe(0);
    });

});