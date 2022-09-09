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

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotes);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsForArticle)
  .post(PostNewComment);

module.exports = articlesRouter;
