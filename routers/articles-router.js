const express = require("express");
const {
  getArticleById,
  patchArticleVotes,
  getArticles,
  getCommentsForArticle,
  PostNewComment,
} = require("../controllers/article-controllers");

const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.patch("/:article_id", patchArticleVotes);
articlesRouter.get("/:article_id/comments", getCommentsForArticle);
articlesRouter.post(":article_id/comments", PostNewComment);

module.exports = articlesRouter;
