const { app } = require("../app");
const request = require("supertest");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const { convertTimestampToDate } = require("../db/seeds/utils");
const sorted = require("jest-sorted");
const { getArticleById } = require("../controllers/article-controllers");

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
    const article_id = 1;
    return request(app)
      .get(`/api/articles/1`)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty("article");
        const article = res.body.article;
        expect(article.article_id).toBe(article_id);
        expect(article).toHaveProperty("author", "butter_bridge");
        expect(article).toHaveProperty(
          "title",
          "Living in the shadow of a great man"
        );
        expect(article).toHaveProperty(
          "body",
          "I find this existence challenging"
        );
        expect(article).toHaveProperty("topic", "mitch");
        expect(article).toHaveProperty(
          "created_at",
          "2020-07-09T20:11:00.000Z"
        );
        expect(parseInt(article.created_at) > 0).toBe(true);
        expect(article).toHaveProperty("votes", 100);
        expect(article).toHaveProperty("comment_count", "11");
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
          body: "Call me Mitchell. Some years ago???never mind how long precisely???having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people???s hats off???then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          created_at: "2020-10-16T05:03:00.000Z",
          comment_count: "0",
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
          comment_count: "11",
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
  test("400; returns a bad request message when aticle searched for with an invalid article_id e.g. string", () => {
    const newVote = 5;
    return request(app)
      .patch("/api/articles/blah")
      .send({ inc_votes: newVote })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
  test("404: returns a not found message when passed an article_id that is out of range of the database", () => {
    const newVote = 5;
    return request(app)
      .get(`/api/articles/100000`)
      .send({ inc_votes: newVote })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("article not found");
      });
  });
});
describe("GET /api/articles", () => {
  test("200: returns an articles object with an array of articles with correct keys", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(Array.isArray(articles)).toBe(true);
        articles.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("comment_count", expect.any(String));
          expect(parseInt(article.comment_count) >= 0).toBe(true);
          expect(parseInt(article.created_at) > 0).toBe(true);
        });
      });
  });
  test("200: defaults to returning article results sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: takes an optional topic query which returns article results only for that topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(1);
        expect(articles[0].topic).toBe("cats");
      });
  });
  test("200: takes an optional sort_by query that allows the user to sort results by a particular column, defaulting to descending", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("200: takes an optional order query allowng the user to set the sort_by order to ascending or descending", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("title");
      });
  });
  test("404: returns a not found message when user queries a non-existent topic", () => {
    return request(app)
      .get("/api/articles?topic=gah")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("topic not found");
      });
  });
  test("200: returns an empty array when passed a topic that exists but has no articles associated with it", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });
  test("400: returns a bad request message when user queries a non-existent column name", () => {
    return request(app)
      .get("/api/articles?sort_by=gah")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: returns a bad request message when user requests an invalid order", () => {
    return request(app)
      .get("/api/articles?order=blah")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("200: returns an array of comment objects associated with the relevant article, all containing correct keys and values", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBe(2);
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
        });
      });
  });
  test("200: returns an empty array for article_ids with no associated comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("400: returns a bad request message when passed an invalid article_id e.g. string", () => {
    return request(app)
      .get("/api/articles/blah/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("404:  returns an article not found message when passed an article_id that is out of range", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });
});
describe("POST/api/articles/:article_id/comments", () => {
  test("201: returns the created comment when passed a valid comment object", () => {
    const newComment = {
      username: "rogersop",
      body: "worlds most pointless comment",
    };
    return request(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(typeof body.comment).toBe("object");
        expect(body.comment).toHaveProperty(
          "body",
          "worlds most pointless comment"
        );
        expect(body.comment).toHaveProperty("author", "rogersop");
        expect(body.comment).toHaveProperty("votes", 0);
        expect(body.comment).toHaveProperty("article_id", 9);
        expect(body.comment).toHaveProperty("created_at");
        expect(body.comment).toHaveProperty("comment_id", 19);
      });
  });
  test("400: returns bad request when passed a blank object", () => {
    const newComment = {};
    return request(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: returns bad request when passed an object with missing keys", () => {
    const newComment = { username: "rogersop" };
    return request(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: returns bad request when passed an object with invalid keys e.g. null values", () => {
    const newComment = {
      username: "rogersop",
      body: null,
    };
    return request(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: returns bad request when passed an invalid article_id e.g. string", () => {
    const newComment = {
      username: "rogersop",
      body: "hiya",
    };
    return request(app)
      .post("/api/articles/blah/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("404: returns an article not found message when passed an out of range article_id", () => {
    const newComment = {
      username: "rogersop",
      body: "hiya",
    };
    return request(app)
      .post("/api/articles/1000/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });
  test("404: returns a user not found message when passed a non-existent username", () => {
    const newComment = {
      username: "bob",
      body: "hiya",
    };
    return request(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("user not found");
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("204: deletes the specified comment from the data and does not return any content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  test("404: invalid comment_id returns not found message", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body }) => expect(body.msg).toBe("comment not found"));
  });
  test("400: bad request message sent for invalid comment_id e.g. string", () => {
    return request(app)
      .delete("/api/comments/blah")
      .expect(400)
      .then(({ body }) => expect(body.msg).toBe("bad request"));
  });
});
describe("GET /api", () => {
  test("200: responds with the endpoints JSON explaining the functioning of the API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
      });
  });
});
describe("GET /api/users/username", () => {
  test("200: returns a user object for the correct user", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        expect(body.user).toHaveProperty("username", "butter_bridge");
        expect(body.user).toHaveProperty(
          "avatar_url",
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
        );
        expect(body.user).toHaveProperty("name", "jonny");
      });
  });
  test("404: returns a not found message when a non-existent user is searched for", () => {
    return request(app)
      .get("/api/users/bernard")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("user not found");
      });
  });
});
describe("PATCH api/comments/:comment_id", () => {
  test("200: responds with a comment object with updated vote count when vote is increased", () => {
    const newVote = 1;
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: newVote })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toHaveProperty("comment_id", 1);
        expect(body.comment).toHaveProperty("votes", 17);
        expect(body.comment).toHaveProperty(
          "body",
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
        );
        expect(body.comment).toHaveProperty("author", "butter_bridge");
        expect(body.comment).toHaveProperty("article_id", 9);
        expect(body.comment).toHaveProperty("created_at");
      });
  });
  test("200: responds with a comment object with updated vote count when vote is decreased", () => {
    const newVote = -1;
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: newVote })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toHaveProperty("comment_id", 1);
        expect(body.comment).toHaveProperty("votes", 15);
        expect(body.comment).toHaveProperty(
          "body",
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
        );
        expect(body.comment).toHaveProperty("author", "butter_bridge");
        expect(body.comment).toHaveProperty("article_id", 9);
        expect(body.comment).toHaveProperty("created_at");
      });
  });
  test("400: responds with a bad request message when passed an invalid comment id e.g. string ", () => {
    return request(app)
      .patch("/api/comments/blah")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: responds with a bad request message when passed an invalid vote object e.g. empty object ", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: responds with a bad request message when passed an invalid vote e.g. string ", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: "wooo" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("404: responds with a not found message when passed an out of range comment id ", () => {
    return request(app)
      .patch("/api/comments/3000")
      .send({ inc_votes: 5 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment not found");
      });
  });
});
describe("POST /api/articles", () => {
  test("201: accepts an article object and returns it with full properties", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "the best article yet",
      body: "this is the  greatest thing you have ever read.",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        expect(body.article).toHaveProperty("author", "butter_bridge");
        expect(body.article).toHaveProperty("title", "the best article yet");
        expect(body.article).toHaveProperty(
          "body",
          "this is the  greatest thing you have ever read."
        );
        expect(body.article).toHaveProperty("topic", "cats");
        expect(body.article).toHaveProperty("votes", 0);
        expect(body.article).toHaveProperty("article_id", 13);
        expect(body.article).toHaveProperty("created_at");
        expect(body.article).toHaveProperty("comment_count", "0");
      });
  });
  test("400: returns a bad request error when passed an incomplete object", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "the best article yet",
      body: "this is the  greatest thing you have ever read.",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: returns a bad request error when passed an object with incorrect keys", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "the best article yet",
      body: "this is the  greatest thing you have ever read.",
      hello: "what am I doing here?",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("404: returns a username not found message when passed an object with username not in users table", () => {
    const newArticle = {
      author: "mystery",
      title: "the best article yet",
      body: "this is the  greatest thing you have ever read.",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("user not found");
      });
  });
  test("404: returns a topic not found message when passed an object with topic not in topic table", () => {
    const newArticle = {
      author: "mystery",
      title: "the best article yet",
      body: "this is the  greatest thing you have ever read.",
      topic: "booooo",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("topic not found");
      });
  });
});
