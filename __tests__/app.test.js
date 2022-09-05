const { app } = require("../app");
const request = require("supertest");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const { db } = require("../db/connection");

beforeEach(() => {
  return seed(testData);
});

describe("GET api/topics", () => {
  test("200: returns an array of topic objects containing slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        res.body.forEach((topic) => {
          expect(typeof topic).toBe("object");
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
  test("404: returns a not found error if an incorrect path is enterred", () => {
    return request(app)
      .get("/api/tpics")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("path not found");
      });
  });
});

describe.only("GET /api/articles/:article_id", () => {
  test("200: returns an object with the specified article information as properties", () => {
    const article_id = 2;
    return request(app)
      .get(`/api/articles/2`)
      .expect(200)
      .then((res) => {
        expect(typeof res.body).toBe("object");
        expect(res.body.article_id).toBe(article_id);
        expect(res.body).toHaveProperty("author", expect.any(String));
        expect(res.body).toHaveProperty("title", expect.any(String));
        expect(res.body).toHaveProperty("body", expect.any(String));
        expect(res.body).toHaveProperty("topic", expect.any(String));
        expect(res.body).toHaveProperty("created_at", expect.any(String));
        expect(parseInt(res.body.created_at) > 0).toBe(true);
        expect(res.body).toHaveProperty("votes", expect.any(Number));
      });
  });
  test("404: returns a not found message when passed an article id out of range of the data", () => {
    return request(app)
      .get(`/api/articles/100000`)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("article not found");
      });
  });
  test("400: returns a bad request message when passed an article_id that is invalid e.g. string", () => {
    return request(app)
      .get("/api/articles/blah")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
});
