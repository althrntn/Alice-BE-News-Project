const express = require("express");
const {
  getArticleById,
  patchArticleVotes,
  getArticles,
  getCommentsForArticle,
  PostNewComment,
  postNewArticle,
} = require("../controllers/article-controllers");

const articlesRouter = express.Router();

articlesRouter.route("/").get(getArticles).post(postNewArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotes);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsForArticle)
  .post(PostNewComment);

module.exports = articlesRouter;
