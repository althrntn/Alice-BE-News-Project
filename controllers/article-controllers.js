const {
  fetchArticleById,
  updateArticleVotes,
} = require("../models/article-models");

exports.getArticleById = (req, res, next) => {
  const article_id = req.params.article_id;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
};
exports.patchArticleVotes = (req, res, next) => {
  const article_id = req.params.article_id;
  let voteUpdate = req.body.inc_votes;
  fetchArticleById(article_id)
    .then((result) => {
      const currentVotes = result.votes;
      voteUpdate += currentVotes;
      const comment_count = result.comment_count;
      return updateArticleVotes(article_id, voteUpdate, comment_count);
    })
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch(next);
};
