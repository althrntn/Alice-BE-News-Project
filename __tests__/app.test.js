const { app } = require("../app");
const request = require("supertest");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const { convertTimestampToDate } = require("../db/seeds/utils");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
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
  test("404: returns a not found error if an incorrect path is entered", () => {
    return request(app)
      .get("/api/tpics")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("path not found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: returns an object with the specified article information as properties", () => {
    const article_id = 2;
    return request(app)
      .get(`/api/articles/2`)
      .expect(200)
      .then((res) => {
        expect(typeof res.body).toBe("object");
        expect(res.body.article_id).toBe(article_id);
        expect(res.body).toHaveProperty("author", "icellusedkars");
        expect(res.body).toHaveProperty("title", "Sony Vaio; or, The Laptop");
        expect(res.body).toHaveProperty(
          "body",
          "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me."
        );
        expect(res.body).toHaveProperty("topic", "mitch");
        expect(res.body).toHaveProperty(
          "created_at",
          "2020-10-16T05:03:00.000Z"
        );
        expect(parseInt(res.body.created_at) > 0).toBe(true);
        expect(res.body).toHaveProperty("votes", 0);
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

describe("GET /api/users", () => {
  test("200: returns an array of user objects, each with username, name and avatar_url properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty("users");
        const users = res.body.users;
        expect(users.length).toBe(4);
        expect(Array.isArray(users)).toBe(true);
        users.forEach((user) => {
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
        });
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("200: returns the correct article object with updated number of votes when initial vote count is zero", () => {
    const newVote = 2;
    return request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: newVote })
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("article");
        expect(body.article).toEqual({
          article_id: 2,
          votes: 2,
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          created_at: "2020-10-16T05:03:00.000Z",
        });
      });
  });
  test("200: returns the correct article object with an updated number of votes when the initial vote count is greater than zero", () => {
    const newVote = 2;
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: newVote })
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("article");
        expect(body.article).toEqual({
          article_id: 1,
          votes: 102,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
        });
      });
  });
  test("400: returns bad request message when request body is invalid e.g. an empty object", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: returns a bad request message when NewVotes value is invalid e.g. passed string, not number", () => {
    const newVote = "blah";
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: newVote })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});
