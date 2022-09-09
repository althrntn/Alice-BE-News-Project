const express = require("express");
const { deleteComment } = require("../controllers/comment-controllers");
const { getTopics } = require("../controllers/topic-controller");
const { getUsers, getUserById } = require("../controllers/user-controllers");
const articlesRouter = require("./articles-router");

const apiRouter = express.Router();

apiRouter.use("/", express.static("endpoints.json"));
apiRouter.get("/topics", getTopics);
apiRouter.get("/users", getUsers);
apiRouter.get("/users/:username", getUserById);
apiRouter.use("/articles", articlesRouter);
apiRouter.delete("/comments/:comment_id", deleteComment);

module.exports = apiRouter;
