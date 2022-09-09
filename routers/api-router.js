const express = require("express");
const { deleteComment } = require("../controllers/comment-controllers");
const { getTopics } = require("../controllers/topic-controller");
const { getUsers } = require("../controllers/user-controllers");
const articlesRouter = require("./articles-router");

const apiRouter = express.Router();

apiRouter.get("/topics", getTopics);
apiRouter.get("/users", getUsers);
apiRouter.use("/articles", articlesRouter);
apiRouter.delete("/comments/:comment_id", deleteComment);
