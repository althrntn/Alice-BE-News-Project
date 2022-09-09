const express = require("express");
const {
  getArticleById,
  patchArticleVotes,
  getArticles,
  getCommentsForArticle,
  PostNewComment,
} = require("./controllers/article-controllers");
const { deleteComment } = require("./controllers/comment-controllers");
const { getTopics } = require("./controllers/topic-controller");
const { getUsers } = require("./controllers/user-controllers");

const app = express();
app.use(express.json());

app.use("/api", express.static("endpoints.json"));
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/users", getUsers);
app.patch("/api/articles/:article_id", patchArticleVotes);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsForArticle);
app.post("/api/articles/:article_id/comments", PostNewComment);
app.delete("/api/comments/:comment_id", deleteComment);
app.get("*", function (req, res) {
  res.status(404).send({ msg: "path not found" });
});

app.use((err, req, res, next) => {
  const badReqCodes = ["22P02", "23502", "42703", "42601"];
  if (badReqCodes.includes(err.code)) {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  const notFoundCodes = ["23503"];
  if (notFoundCodes.includes(err.code)) {
    const errArray = err.detail.split(" ");
    const key = errArray[errArray.length - 1].slice(1, -3);
    res.status(404).send({ msg: `${key} not found` });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internal server error" });
});

module.exports = { app };
