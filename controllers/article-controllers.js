const {
  fetchArticleById,
  updateArticleVotes,
} = require("../models/article-models");

exports.getArticleById = (req, res, next) => {
  const article_id = req.params.article_id;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send(article);
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
      return updateArticleVotes(article_id, voteUpdate);
    })
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch(next);
};
